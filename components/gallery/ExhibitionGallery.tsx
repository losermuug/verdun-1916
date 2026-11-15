"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CloseIcon,
} from "./Icons";
import {
  ARCHIVAL_ASSETS,
  CITATION_REFERENCES,
  EXHIBITION_META,
  EXHIBITION_PANELS,
} from "@/data/verdun";
import { VerdunAmbientPlayer } from "@/lib/ambientMusic";
import { AmbientMusicControl } from "./AmbientMusicControl";
import { PanelRoomStage, StatisticsRoomStage } from "./GalleryRoomView";
import { SlideMapStage } from "./SlideMapStage";

interface RoomMeta {
  index: number;
  shortLabel: string;
  title: string;
}

const ROOMS: RoomMeta[] = [
  { index: 0, shortLabel: "Үүд", title: "Үзэсгэлэнгийн нээлт" },
  { index: 1, shortLabel: "I", title: "Стратегийн зангилаа" },
  { index: 2, shortLabel: "II", title: "300 хоногийн там" },
  { index: 3, shortLabel: "III", title: "Сүйрсэн нутаг ба иргэд" },
  { index: 4, shortLabel: "IV", title: "Дурсамжийн сүмүүд" },
  { index: 5, shortLabel: "V", title: "Энхийн сургамж" },
  { index: 6, shortLabel: "Зураг", title: "14 GPS цэгийн газрын зураг" },
  { index: 7, shortLabel: "Тоо", title: "Тоон харьцуулалт" },
];

const ROOM_MOOD_GLOW: Record<number, string> = {
  0: "bg-brass/[0.08]",
  1: "bg-brass/[0.07]",
  2: "bg-crimson/[0.09]",
  3: "bg-crimson/[0.10]",
  4: "bg-brass/[0.07]",
  5: "bg-sage/[0.09]",
  6: "bg-brass/[0.06]",
  7: "bg-brass/[0.06]",
};

const COVER_ARCS = [
  {
    period: "1916.02.21",
    label: "Бөмбөрийн гал",
    detail: "07:15 цагт ~1,200 их буугаар эхэлж, Дуомоны бэхлэлт 2/25-нд унав.",
  },
  {
    period: "1916.06–07",
    label: "Оргил хямрал",
    detail: "Во бэхлэлтийн 6 хоногийн бүслэлт, Флери 16 удаа шилжиж, 100,000 хийн сум харвав.",
  },
  {
    period: "1916.12.18",
    label: "302 дахь хоног",
    detail: "Дуомон, Во эргэн ирсэн ч хоёр талаас 700,000+ хүн хохирч, 9 тосгон арчигдав.",
  },
];

export function ExhibitionGallery() {
  const [roomIndex, setRoomIndex] = useState(0);
  const [coverArcIdx, setCoverArcIdx] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Ambient memorial music state
  const playerRef = useRef<VerdunAmbientPlayer | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.35);

  useEffect(() => {
    const player = new VerdunAmbientPlayer();
    playerRef.current = player;
    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, []);

  const toggleMusic = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;
    if (player.isPlaying()) {
      player.stop();
      setMusicPlaying(false);
    } else {
      await player.start();
      setMusicPlaying(true);
    }
  }, []);

  const startMusicIfIdle = useCallback(async () => {
    const player = playerRef.current;
    if (!player || player.isPlaying()) return;
    await player.start();
    setMusicPlaying(true);
  }, []);

  const handleVolumeChange = useCallback((nextVal: number) => {
    setMusicVolume(nextVal);
    playerRef.current?.setVolume(nextVal);
  }, []);

  const goToRoom = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(ROOMS.length - 1, idx));
    setRoomIndex(clamped);
    setDetailModalOpen(false);
  }, []);

  // Keyboard ArrowLeft / ArrowRight presentation navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (detailModalOpen || sourcesOpen) {
        if (e.key === "Escape") {
          setDetailModalOpen(false);
          setSourcesOpen(false);
        }
        return;
      }
      if (e.key === "ArrowRight") {
        setRoomIndex((prev) => Math.min(ROOMS.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setRoomIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key.toLowerCase() === "m") {
        void toggleMusic();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailModalOpen, sourcesOpen, toggleMusic]);

  const activePanel =
    roomIndex >= 1 && roomIndex <= 5 ? EXHIBITION_PANELS[roomIndex - 1] : null;

  return (
    <div className="museum-grid-bg flex min-h-screen flex-col justify-between bg-background text-foreground">
      {/* Room-specific ambient museum spotlight */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-1/2 top-0 h-[440px] w-[820px] -translate-x-1/2 rounded-full blur-[130px] transition-colors duration-700 ${
          ROOM_MOOD_GLOW[roomIndex] ?? "bg-brass/[0.06]"
        }`}
      />

      {/* Minimal Top Museum Bar */}
      <header className="relative z-20 border-b border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => goToRoom(0)}
            className="flex min-w-0 items-center gap-2 text-left"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-brass/50 bg-brass/10 font-display text-xs font-bold text-brass">
              1916
            </span>
            <span className="truncate font-display text-sm font-semibold tracking-wide text-foreground sm:text-lg">
              {EXHIBITION_META.primaryTitle}
            </span>
          </button>

          {/* Minimal Room Dots / Step Rail */}
          <nav
            aria-label="Танхимын шилжилт"
            className="hidden items-center gap-1 lg:flex"
          >
            {ROOMS.map((r) => {
              const active = r.index === roomIndex;
              return (
                <button
                  key={r.index}
                  type="button"
                  onClick={() => goToRoom(r.index)}
                  title={r.title}
                  className={`whitespace-nowrap rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                    active
                      ? "bg-brass text-background font-semibold"
                      : "text-muted hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {r.shortLabel}
                </button>
              );
            })}
          </nav>

          {/* Right: Music + Sources */}
          <div className="flex shrink-0 items-center gap-2">
            <AmbientMusicControl
              isPlaying={musicPlaying}
              volume={musicVolume}
              onTogglePlay={toggleMusic}
              onVolumeChange={handleVolumeChange}
            />
            <button
              type="button"
              onClick={() => setSourcesOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-surface/85 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-brass/40 hover:text-foreground"
            >
              <BookOpenIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Эх сурвалж</span>
            </button>
          </div>
        </div>

        {/* Mobile room pills */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-white/5 px-4 py-1.5 lg:hidden">
          {ROOMS.map((r) => (
            <button
              key={r.index}
              type="button"
              onClick={() => goToRoom(r.index)}
              className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                r.index === roomIndex
                  ? "bg-brass text-background font-semibold"
                  : "text-muted"
              }`}
            >
              {r.shortLabel}
            </button>
          ))}
        </div>
      </header>

      {/* Main Single-Exhibit Presentation Stage */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-6 sm:px-6 lg:px-8">
        {roomIndex === 0 && (
          <div key="room-0" className="room-enter mx-auto max-w-4xl py-6 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-brass">
              1916 оны 2 дугаар сарын 21 – 12 дугаар сарын 18 · Дэлхийн I дайн
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
              {EXHIBITION_META.primaryTitle}
            </h1>
            <p className="mt-3 font-display text-2xl italic text-brass/90">
              {EXHIBITION_META.subtitleVariants[0]}
            </p>

            {/* Interactive 302-day arc preview */}
            <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-white/10 bg-surface/65 p-4 text-left">
              <div className="grid grid-cols-3 gap-2">
                {COVER_ARCS.map((arc, idx) => (
                  <button
                    key={arc.period}
                    type="button"
                    onClick={() => setCoverArcIdx(idx)}
                    className={`rounded-lg border p-2.5 text-left transition-colors ${
                      idx === coverArcIdx
                        ? "border-brass bg-brass/15"
                        : "border-white/10 bg-black/25 hover:border-white/25"
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-brass">{arc.period}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-foreground">
                      {arc.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 border-l-2 border-brass/60 pl-3 text-xs text-muted">
                {COVER_ARCS[coverArcIdx].detail}
              </p>
            </div>

            <div className="mx-auto mt-7 grid max-w-2xl grid-cols-3 gap-4 border-y border-white/10 py-5">
              <div>
                <span className="block font-display text-3xl font-semibold text-brass sm:text-4xl">
                  302
                </span>
                <span className="mt-1 block font-mono text-[11px] text-muted">
                  Хоног («300 өдөр, 300 шөнө»)
                </span>
              </div>
              <div>
                <span className="block font-display text-3xl font-semibold text-foreground sm:text-4xl">
                  700,000+
                </span>
                <span className="mt-1 block font-mono text-[11px] text-muted">
                  Нийт хохирол (1916)
                </span>
              </div>
              <div>
                <span className="block font-display text-3xl font-semibold text-crimson sm:text-4xl">
                  9 тосгон
                </span>
                <span className="mt-1 block font-mono text-[11px] text-muted">
                  Газрын хөрснөөс арчигдсан
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  void startMusicIfIdle();
                  goToRoom(1);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-brass px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-transform hover:scale-[1.02]"
              >
                <span>Үзэсгэлэнд нэвтрэх</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 font-mono text-[11px] text-muted">
              Нэвтрэхэд намуухан дурсгалын ая эхэлнэ · ← / → шилжих · M ая
            </p>
          </div>
        )}

        {activePanel && (
          <div key={activePanel.id} className="room-enter w-full">
            <PanelRoomStage
              panel={activePanel}
              assets={ARCHIVAL_ASSETS.filter((a) =>
                a.panelIds.includes(activePanel.id)
              )}
              onOpenDetail={() => setDetailModalOpen(true)}
            />
          </div>
        )}

        {roomIndex === 6 && (
          <div key="room-6" className="room-enter w-full">
            <div className="mb-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
                Байр зүйн танхим · 14 баталгаат цэг
              </span>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">
                Вердуны тулалдааны талбарын газрын зураг
              </h2>
            </div>
            <SlideMapStage />
          </div>
        )}

        {roomIndex === 7 && (
          <div key="room-7" className="room-enter w-full">
            <div className="mb-5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
                Эрдэм шинжилгээний дүгнэлт
              </span>
              <h2 className="mt-1 font-display text-3xl font-semibold text-foreground">
                Музейн албан ёсны тоо ба түүхчдийн тооцооны харьцуулалт
              </h2>
            </div>
            <StatisticsRoomStage />
          </div>
        )}
      </main>

      {/* Bottom Gallery Navigation Footer */}
      <footer className="relative z-20 border-t border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            disabled={roomIndex === 0}
            onClick={() => goToRoom(roomIndex - 1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-brass hover:text-brass disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Өмнөх</span>
          </button>

          <div className="text-center font-mono text-xs text-muted">
            <span className="text-brass">
              {String(roomIndex + 1).padStart(2, "0")} / {String(ROOMS.length).padStart(2, "0")}
            </span>
            <span className="mx-2 text-white/25">·</span>
            <span className="hidden text-foreground/90 sm:inline">
              {ROOMS[roomIndex].title}
            </span>
          </div>

          <button
            type="button"
            disabled={roomIndex === ROOMS.length - 1}
            onClick={() => {
              if (roomIndex === 0) void startMusicIfIdle();
              goToRoom(roomIndex + 1);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-brass px-4 py-2 font-mono text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span>Дараагийн үзвэр</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>

      {/* Optional Deep Scholarly Modal (Hidden by default so stage stays uncluttered) */}
      {detailModalOpen && activePanel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePanel.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-brass/35 bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-xs text-brass">
                  Самбар {activePanel.romanNumeral} · Дэлгэрэнгүй түүхэн судалгаа
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {activePanel.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded p-1 text-muted hover:text-foreground"
                aria-label="Хаах"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {activePanel.historicalSections.map((sec) => (
                <div key={sec.heading}>
                  <h4 className="font-display text-xl font-semibold text-brass">
                    {sec.heading}
                  </h4>
                  <div className="mt-2 space-y-2.5 text-sm leading-relaxed text-foreground/85">
                    {sec.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Optional Sources / Citations Modal */}
      {sourcesOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ном зүй ба эх сурвалж"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSourcesOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/15 bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Ашигласан эх сурвалжууд ({CITATION_REFERENCES.length})
              </h3>
              <button
                type="button"
                onClick={() => setSourcesOpen(false)}
                className="rounded p-1 text-muted hover:text-foreground"
                aria-label="Хаах"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <ol className="mt-4 space-y-2 text-xs">
              {CITATION_REFERENCES.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 border-b border-white/5 pb-2"
                >
                  <span className="text-foreground/90">
                    <span className="mr-2 font-mono text-brass">[{c.id}]</span>
                    {c.title}
                  </span>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 font-mono text-brass hover:underline"
                    >
                      Нээх ↗
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
