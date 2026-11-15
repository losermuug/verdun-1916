"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArchivalAsset, ExhibitionPanel } from "@/types/exhibition";
import {
  COMPARATIVE_STATISTICS,
  DESTROYED_VILLAGES,
  EXHIBITION_META,
  VERDUN_TIMELINE_EVENTS,
} from "@/data/verdun";
import { LightboxModal } from "./LightboxModal";

interface PanelRoomStageProps {
  panel: ExhibitionPanel;
  assets: ArchivalAsset[];
  onOpenDetail: () => void;
}

const MEMORIAL_HIGHLIGHTS = [
  {
    id: "ossuary",
    name: "Дуомоны Бунхан",
    year: "1932 · ЮНЕСКО 2023",
    metric: "130,000 үл танигдах цэрэг · 16,142 булш",
    note: "46 м цамхаг, 137 м хонгил. Мекка руу чиглүүлсэн 592 лал болон 1938 оны еврей цэргүүдийн дурсгал оршдог.",
    hasMythToggle: false,
  },
  {
    id: "memorial",
    name: "Вердуны Мемориал",
    year: "1967 / 2016",
    metric: "1,500 м² талбай · 2,000+ үзмэр",
    note: "Сүйрсэн Флери тосгоны өртөөн дээр байрладаг бөгөөд дайныг Франц, Германы хоёр талын нүдээр өгүүлдэг.",
    hasMythToggle: false,
  },
  {
    id: "bayonet",
    name: "Жадын шуудуу",
    year: "1920.12.08 · ЮНЕСКО 2023",
    metric: "Анхны байнгын хөшөө · 21 цогцос олдсон",
    note: "1916.06.11–12-ны бөмбөгдөлтийн түүхэн цэг. Доороос «Домог vs Баримт» товчийг дарж харна уу.",
    hasMythToggle: true,
  },
  {
    id: "citadel",
    name: "Газар доорх цайз",
    year: "1920.11.10",
    metric: "«Үл танигдах цэрэг» · 7 нөхөр Фобур Павед",
    note: "1920 онд эндээс Францын «Үл танигдах цэрэг»-ийг сонгосон бөгөөд өдгөө 7–10 °C хонгилоор цахилгаан тэргэнцрээр аялдаг.",
    hasMythToggle: false,
  },
];

const PEACE_LESSONS = [
  {
    num: "01",
    title: "Элэгдлийн дайнд ялагч үгүй",
    fact: "700,000+ хүний хохирол амссан ч фронт анхны шугамдаа буцсан.",
  },
  {
    num: "02",
    title: "Эн тэнцүү ой санамж өшөөг анагаана",
    fact: "Дуомоны бунхан ба 2016 оны Мемориалд хоёр талын цэргийг зэрэг хүндэтгэдэг.",
  },
  {
    num: "03",
    title: "Байгаль орчны шарх зуун дамжина",
    fact: "«Улаан бүс»-ийн хүнцэл ба дэлбэрээгүй сум 300–700 жил хадгалагдана.",
  },
];

export function PanelRoomStage({
  panel,
  assets,
  onOpenDetail,
}: PanelRoomStageProps) {
  const embeddableAssets = assets.filter((a) => a.embedAllowed && a.localSrc);
  const externalAssets = assets.filter((a) => !a.embedAllowed || !a.localSrc);

  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);
  const [zoomAsset, setZoomAsset] = useState<ArchivalAsset | null>(null);

  // Panel 1 interactive state
  const [p1Mode, setP1Mode] = useState<"voie-peak" | "voie-avg" | "citadel">("voie-peak");

  // Panel 2 interactive state
  const [timelineIdx, setTimelineIdx] = useState(0);

  // Panel 3 interactive state
  const [villageFilter, setVillageFilter] = useState<"all" | "uninhabited">("all");
  const [selectedVillageId, setSelectedVillageId] = useState<string>(DESTROYED_VILLAGES[0].id);
  const [soilLayer, setSoilLayer] = useState<"uxo" | "arsenic" | "recovery">("arsenic");

  // Panel 4 interactive state
  const [memorialIdx, setMemorialIdx] = useState(0);
  const [bayonetView, setBayonetView] = useState<"legend" | "excavation">("excavation");

  // Panel 5 interactive state
  const [eraFocus, setEraFocus] = useState<"compare" | "1984" | "2016">("compare");
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  const activeAsset = embeddableAssets[selectedAssetIdx] ?? embeddableAssets[0];
  const activeEvent = VERDUN_TIMELINE_EVENTS[timelineIdx] ?? VERDUN_TIMELINE_EVENTS[0];

  const visibleVillages =
    villageFilter === "all"
      ? DESTROYED_VILLAGES
      : DESTROYED_VILLAGES.filter((v) => v.statusType === "uninhabited");

  const inspectedVillage =
    DESTROYED_VILLAGES.find((v) => v.id === selectedVillageId) ?? DESTROYED_VILLAGES[0];

  const activeMemorial = MEMORIAL_HIGHLIGHTS[memorialIdx] ?? MEMORIAL_HIGHLIGHTS[0];

  return (
    <>
      <div className="grid gap-7 lg:grid-cols-12 lg:items-center">
        {/* LEFT: Museum Display Case */}
        <div className="space-y-4 lg:col-span-7">
          {activeAsset && activeAsset.localSrc && (
            <div className="group relative overflow-hidden rounded-xl border border-brass/25 bg-black/75 shadow-2xl">
              {/* Subtle brass museum corner ticks */}
              <span className="pointer-events-none absolute left-2 top-2 z-10 h-3 w-3 border-l border-t border-brass/60" />
              <span className="pointer-events-none absolute right-2 top-2 z-10 h-3 w-3 border-r border-t border-brass/60" />

              <button
                type="button"
                onClick={() => setZoomAsset(activeAsset)}
                className="relative block aspect-[16/10] w-full bg-black text-left focus:outline-none"
                aria-label={`${activeAsset.title} зургийг томруулах`}
              >
                <Image
                  src={activeAsset.localSrc}
                  alt={activeAsset.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                  priority
                />
                <span className="absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/75 px-3 py-1 font-mono text-[10px] text-foreground/90 opacity-85 transition-opacity group-hover:border-brass group-hover:opacity-100">
                  Томруулж харах ⤢
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-surface/95 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-medium text-foreground">
                    {activeAsset.title}
                  </p>
                  <p className="font-mono text-[11px] text-muted">
                    {activeAsset.year} · {activeAsset.license}
                  </p>
                </div>

                {embeddableAssets.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {embeddableAssets.map((a, idx) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSelectedAssetIdx(idx)}
                        className={`h-7 min-w-[28px] rounded border px-2 font-mono text-[11px] transition-colors ${
                          idx === selectedAssetIdx
                            ? "border-brass bg-brass text-background font-semibold"
                            : "border-white/15 bg-black/30 text-muted hover:text-foreground"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PANEL 1 INTERACTIVE KIOSK: Convoy Flow Simulator + Citadel X-Ray */}
          {panel.id === "panel-1" && (
            <div className="rounded-xl border border-brass/30 bg-surface/85 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-brass">
                  Интерактив үзүүлэн · Хангамжийн шугам
                </span>
                <div className="inline-flex rounded-full border border-white/15 bg-black/35 p-0.5 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setP1Mode("voie-peak")}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      p1Mode === "voie-peak" ? "bg-brass text-background font-semibold" : "text-muted"
                    }`}
                  >
                    Оргил (5 сек)
                  </button>
                  <button
                    type="button"
                    onClick={() => setP1Mode("voie-avg")}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      p1Mode === "voie-avg" ? "bg-brass text-background font-semibold" : "text-muted"
                    }`}
                  >
                    Дундаж (14 сек)
                  </button>
                  <button
                    type="button"
                    onClick={() => setP1Mode("citadel")}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      p1Mode === "citadel" ? "bg-brass text-background font-semibold" : "text-muted"
                    }`}
                  >
                    Газар доорх цайз
                  </button>
                </div>
              </div>

              {p1Mode !== "citadel" ? (
                <div className="mt-3 space-y-2.5">
                  {/* Animated Supply Convoy Track */}
                  <div className="relative h-7 overflow-hidden rounded-full border border-white/10 bg-black/50 px-3 flex items-center justify-between font-mono text-[10px] text-muted">
                    <span className="z-10 bg-black/70 px-1.5 text-brass">Бар-ле-Дюк</span>
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      {(p1Mode === "voie-peak" ? [0, 1, 2, 3, 4, 5] : [0, 1, 2]).map((n) => (
                        <span
                          key={n}
                          className="convoy-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brass shadow-[0_0_8px_#c59b5f]"
                          style={{
                            animationDuration: p1Mode === "voie-peak" ? "3.2s" : "6.4s",
                            animationDelay: `${n * (p1Mode === "voie-peak" ? 0.52 : 2.1)}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="z-10 bg-black/70 px-1.5 text-foreground">Вердун (57.2 км)</span>
                  </div>
                  <p className="text-xs text-foreground/90">
                    {p1Mode === "voie-peak"
                      ? "Оргил үед 5 секунд тутамд 1 машин (~720 машин/цаг) — 300 хоногт 4 сая цэрэг, 2 сая тонн хангамж, 700,000+ тн шохойн чулуу."
                      : "Дунджаар 14 секунд тутамд 1 машин (~257 машин/цаг) — Фургон 25 км/ц, ачааны машин 15 км/ц, их бууны зүтгүүр 4–8 км/ц."}
                  </p>
                </div>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-3 font-mono text-xs">
                  <div className="rounded border border-white/10 bg-black/35 p-2.5">
                    <span className="block text-[10px] text-muted">Хамгаалалт</span>
                    <span className="text-brass">16 м хадан доор</span>
                  </div>
                  <div className="rounded border border-white/10 bg-black/35 p-2.5">
                    <span className="block text-[10px] text-muted">Багтаамж</span>
                    <span className="text-foreground">6,000 цэрэг, ажилтан</span>
                  </div>
                  <div className="rounded border border-white/10 bg-black/35 p-2.5">
                    <span className="block text-[10px] text-muted">Өдрийн хүчин чадал</span>
                    <span className="text-foreground">28,000 талх · эмнэлэг</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANEL 2 INTERACTIVE KIOSK: 302-Day Scrubber + Artillery Intensity */}
          {panel.id === "panel-2" && (
            <div className="rounded-xl border border-brass/30 bg-surface/85 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-brass">
                  1916 оны 302 хоногийн цагийн хэлхээс ({timelineIdx + 1}/8)
                </span>
                <span className="font-mono text-[11px] text-crimson">
                  92–138 сум / минут · 70–95% их бууны хохирол
                </span>
              </div>

              {/* Progress Track */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-brass transition-all duration-300"
                  style={{
                    width: `${((timelineIdx + 1) / VERDUN_TIMELINE_EVENTS.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {VERDUN_TIMELINE_EVENTS.map((evt, idx) => (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => setTimelineIdx(idx)}
                    className={`rounded border px-2 py-1 font-mono text-[10px] transition-colors ${
                      idx === timelineIdx
                        ? "border-brass bg-brass text-background font-semibold"
                        : "border-white/10 bg-black/25 text-muted hover:text-foreground"
                    }`}
                  >
                    {evt.dateRange}
                  </button>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="font-display text-lg font-semibold text-brass">
                  {activeEvent.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {activeEvent.significance}
                </p>
              </div>
            </div>
          )}

          {/* PANEL 3 INTERACTIVE KIOSK: Clickable 9 Villages + Soil Core Inspector */}
          {panel.id === "panel-3" && (
            <div className="space-y-3 rounded-xl border border-crimson/35 bg-surface/85 p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-crimson">
                    Дарж шалгана уу · Сүйрсэн 9 тосгон (Villages détruits)
                  </span>
                </div>
                <div className="inline-flex rounded-full border border-white/15 bg-black/30 p-0.5 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setVillageFilter("all")}
                    className={`rounded-full px-2.5 py-0.5 ${
                      villageFilter === "all" ? "bg-brass text-background font-semibold" : "text-muted"
                    }`}
                  >
                    Бүгд (9)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVillageFilter("uninhabited")}
                    className={`rounded-full px-2.5 py-0.5 ${
                      villageFilter === "uninhabited"
                        ? "bg-crimson text-white font-semibold"
                        : "text-muted"
                    }`}
                  >
                    Эзгүй (6)
                  </button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {visibleVillages.map((v) => {
                  const active = v.id === inspectedVillage.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVillageId(v.id)}
                      className={`rounded-lg border p-2.5 text-left transition-colors ${
                        active
                          ? "border-brass bg-brass/15"
                          : "border-white/10 bg-black/30 hover:border-white/25"
                      }`}
                    >
                      <p className="truncate text-xs font-semibold text-foreground">
                        {v.nameMn}
                      </p>
                      <p
                        className={`mt-1 font-mono text-[10px] ${
                          v.statusType === "uninhabited"
                            ? "text-crimson"
                            : v.statusType === "partially_rebuilt"
                              ? "text-brass"
                              : "text-sage"
                        }`}
                      >
                        {v.currentStatus.split(";")[0]}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Village Inspector */}
              <div className="rounded-lg border border-white/10 bg-black/35 p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-base font-semibold text-foreground">
                    {inspectedVillage.nameMn} ({inspectedVillage.nameFr})
                  </span>
                  <span className="font-mono text-[11px] text-brass">
                    1911 оны хүн ам:{" "}
                    {inspectedVillage.population1911 ?? "Бүртгэл алдагдсан"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  Эзлэгдсэн хугацаа: {inspectedVillage.occupiedRange}
                </p>
              </div>

              {/* Zone Rouge Soil Layer Inspector */}
              <div className="rounded-lg border border-crimson/25 bg-black/25 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-crimson">
                    Улаан бүс (Zone Rouge) · Хөрсний сорьц
                  </span>
                  <div className="flex gap-1 font-mono text-[10px]">
                    {(
                      [
                        { id: "arsenic", label: "Place à Gaz" },
                        { id: "uxo", label: "0–15 см сум" },
                        { id: "recovery", label: "Сэргэлт" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSoilLayer(tab.id)}
                        className={`rounded border px-2 py-0.5 ${
                          soilLayer === tab.id
                            ? "border-crimson bg-crimson/20 text-red-200"
                            : "border-white/10 text-muted"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-foreground/90">
                  {soilLayer === "arsenic" &&
                    "1920-иод онд химийн сум шатааж устгасан Place à Gaz-д хүнцлийн агууламж 176 г/кг (~18%) хүрч ургамал ургах чадваргүй болсон (2007 оны судалгаа)."}
                  {soilLayer === "uxo" &&
                    "2005–2006 оны туршилтаар хамгийн их бөмбөгдөгдсөн хэсгийн дээд 15 см хөрсөнд 1 га тутамд 300 хүртэлх дэлбэрээгүй сум илэрсэн."}
                  {soilLayer === "recovery" &&
                    "1,200 км² Улаан бүсийг 1919 онд хуулиар хаасан; 2016 онд зарим хөвд сэргэж эхэлсэн ч бүрэн цэвэршихэд 300–700 жил шаардана гэж таамагладаг."}
                </p>
              </div>
            </div>
          )}

          {/* PANEL 4 INTERACTIVE KIOSK: Memorial Switcher + Legend vs Fact */}
          {panel.id === "panel-4" && (
            <div className="rounded-xl border border-brass/30 bg-surface/85 p-4">
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {MEMORIAL_HIGHLIGHTS.map((m, idx) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMemorialIdx(idx)}
                    className={`rounded border p-2 text-left font-mono text-[10px] transition-colors ${
                      idx === memorialIdx
                        ? "border-brass bg-brass/15 text-brass"
                        : "border-white/10 bg-black/25 text-muted hover:text-foreground"
                    }`}
                  >
                    <span className="block text-[9px] text-muted">{m.year}</span>
                    {m.name}
                  </button>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="font-mono text-xs text-brass">{activeMemorial.metric}</p>

                {activeMemorial.hasMythToggle ? (
                  <div className="mt-2">
                    <div className="inline-flex rounded-full border border-white/15 bg-black/40 p-0.5 font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() => setBayonetView("legend")}
                        className={`rounded-full px-2.5 py-0.5 ${
                          bayonetView === "legend" ? "bg-brass text-background font-semibold" : "text-muted"
                        }`}
                      >
                        Ардын домог
                      </button>
                      <button
                        type="button"
                        onClick={() => setBayonetView("excavation")}
                        className={`rounded-full px-2.5 py-0.5 ${
                          bayonetView === "excavation" ? "bg-brass text-background font-semibold" : "text-muted"
                        }`}
                      >
                        Малтлагын баримт
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/90">
                      {bayonetView === "legend"
                        ? "Домог: 137-р хорооны цэргүүд буундаа жад бэхэлсэн чигтээ зогсоогоороо амьдаараа булагдаж, жадны үзүүрүүд газраас цухуйж үлдсэн гэдэг."
                        : "Малтлагын баримт: 21 цогцос олдсоны 14-ийг таньж Флерид шилжүүлэн, 7 үл танигдах цэргийг үлдээсэн; Германы цэргүүд оршуулаад винтов хатгасан байх магадлалтай."}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {activeMemorial.note}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PANEL 5 INTERACTIVE KIOSK: 1984 vs 2016 Mirror + Clickable 3 Lessons */}
          {panel.id === "panel-5" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-sage">
                  Түүхэн толь · Эвлэрлийн уулзалтууд
                </span>
                <div className="inline-flex rounded-full border border-white/15 bg-surface p-0.5 font-mono text-[11px]">
                  {(
                    [
                      { id: "compare", label: "Хоёуланг нь" },
                      { id: "1984", label: "1984" },
                      { id: "2016", label: "2016" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEraFocus(tab.id)}
                      className={`rounded-full px-2.5 py-0.5 ${
                        eraFocus === tab.id ? "bg-sage text-background font-semibold" : "text-muted"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`grid gap-4 ${
                  eraFocus === "compare" ? "sm:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {(eraFocus === "compare" || eraFocus === "1984") && (
                  <div className="rounded-xl border border-brass/30 bg-surface/85 p-5">
                    <span className="font-mono text-[11px] text-brass">
                      1984.09.22 · 70 жилийн ой
                    </span>
                    <h4 className="mt-1.5 font-display text-2xl font-semibold text-foreground">
                      Франсуа Миттеран ба Гельмут Коль
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      Дуомоны бунхны өмнө 4,000+ хүний өмнө хүйтэн бороонд шүхэргүй, гар
                      гараасаа хөтлөлцөн зогсож, 1988 онд Карл Великийн шагнал хүртжээ.
                    </p>
                  </div>
                )}
                {(eraFocus === "compare" || eraFocus === "2016") && (
                  <div className="rounded-xl border border-sage/35 bg-surface/85 p-5">
                    <span className="font-mono text-[11px] text-sage">
                      2016.05.29 · 100 жилийн ой
                    </span>
                    <h4 className="mt-1.5 font-display text-2xl font-semibold text-foreground">
                      Франсуа Олланд ба Ангела Меркель
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      Хоёр орны 3,500 орчим залуустай цугларч шинэчлэгдсэн Мемориалыг
                      нээж, «нийтлэг гэр болох Европ»-оо хамгаалахыг уриалав.
                    </p>
                  </div>
                )}
              </div>

              {/* Clickable 3 Peace Lessons */}
              <div className="rounded-xl border border-white/12 bg-black/35 p-4">
                <div className="grid grid-cols-3 gap-2">
                  {PEACE_LESSONS.map((lesson, idx) => (
                    <button
                      key={lesson.num}
                      type="button"
                      onClick={() => setActiveLessonIdx(idx)}
                      className={`rounded-lg border p-2.5 text-left transition-colors ${
                        idx === activeLessonIdx
                          ? "border-sage bg-sage/15 text-foreground"
                          : "border-white/10 bg-surface/60 text-muted hover:text-foreground"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-sage">
                        Сургамж {lesson.num}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium leading-snug">
                        {lesson.title}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 border-l-2 border-sage pl-3 text-xs text-foreground/90">
                  {PEACE_LESSONS[activeLessonIdx].fact}
                </p>
              </div>

              {externalAssets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {externalAssets.map((a) => (
                    <a
                      key={a.id}
                      href={a.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/15 bg-surface/80 px-3 py-1 font-mono text-[11px] text-brass hover:border-brass"
                    >
                      {a.year} архив ({a.sourceName.split("·")[0].trim()}) ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Clean Museum Wall Placard */}
        <div className="flex flex-col justify-between rounded-xl border border-white/12 bg-surface/80 p-6 sm:p-8 lg:col-span-5">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
              Самбар {panel.romanNumeral} · {panel.navLabel}
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {panel.title}
            </h2>

            <p className="mt-5 text-[15px] leading-[1.8] text-foreground/90">
              {panel.shortSummary}
            </p>

            {panel.quotes[0] && (
              <blockquote className="mt-6 border-l-2 border-brass/70 pl-4">
                <p className="font-display text-xl italic leading-snug text-foreground">
                  «{panel.quotes[0].quote}»
                </p>
                <footer className="mt-1.5 font-mono text-[11px] text-muted">
                  — {panel.quotes[0].author} ({panel.quotes[0].date})
                </footer>
              </blockquote>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <span className="font-mono text-[11px] text-muted">{panel.pdfTopic}</span>
            <button
              type="button"
              onClick={onOpenDetail}
              className="rounded-full border border-brass/40 bg-brass/10 px-3.5 py-1.5 font-mono text-[11px] text-brass transition-colors hover:bg-brass hover:text-background"
            >
              Түүхэн баримт & Эх сурвалж ↗
            </button>
          </div>
        </div>
      </div>

      <LightboxModal asset={zoomAsset} onClose={() => setZoomAsset(null)} />
    </>
  );
}

export function StatisticsRoomStage() {
  const [lens, setLens] = useState<"both" | "museum" | "historians">("both");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted">
          Харах өнцгийг сонгоно уу:
        </span>
        <div className="inline-flex rounded-full border border-white/15 bg-surface p-0.5 font-mono text-xs">
          {(
            [
              { id: "both", label: "Харьцуулах" },
              { id: "museum", label: "Музейн тоо" },
              { id: "historians", label: "Түүхчдийн тооцоо" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLens(tab.id)}
              className={`rounded-full px-3 py-1 transition-colors ${
                lens === tab.id ? "bg-brass text-background font-semibold" : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="overflow-x-auto rounded-xl border border-white/12 bg-surface/85 lg:col-span-8">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-black/45 font-mono text-[11px] uppercase tracking-wider text-brass">
              <tr>
                <th className="px-4 py-3">Үзүүлэлт</th>
                {(lens === "both" || lens === "museum") && (
                  <th className="px-4 py-3">Музей, дурсгалын газрын тоо</th>
                )}
                {(lens === "both" || lens === "historians") && (
                  <th className="px-4 py-3">Энциклопеди ба түүхчдийн тооцоо</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {COMPARATIVE_STATISTICS.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3.5 font-display text-lg font-semibold text-foreground">
                    {row.metric}
                  </td>
                  {(lens === "both" || lens === "museum") && (
                    <td className="px-4 py-3.5 text-xs leading-relaxed text-foreground/90">
                      {row.museumFigure}
                    </td>
                  )}
                  {(lens === "both" || lens === "historians") && (
                    <td className="px-4 py-3.5 text-xs leading-relaxed text-brass/95">
                      {row.historianFigure}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:col-span-4">
          {EXHIBITION_META.historiographicalNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-white/10 bg-surface/75 p-4"
            >
              <h4 className="font-display text-lg font-semibold text-brass">
                {note.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{note.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
