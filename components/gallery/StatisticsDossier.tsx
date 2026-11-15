"use client";

import {
  Bomb,
  Calendar,
  Flame,
  HeartCrack,
  Layers,
  MapPin,
  Truck,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface KeyStatistic {
  id: string;
  category: "human" | "artillery" | "logistics";
  categoryLabel: string;
  value: string;
  title: string;
  description: string;
  contextNote?: string;
}

export const VERDUN_KEY_STATISTICS: KeyStatistic[] = [
  // --- ХҮНИЙ АМЬ НАС & ЦЭРЭГ ---
  {
    id: "total-casualties",
    category: "human",
    categoryLabel: "Хүний хохирол",
    value: "700,000+",
    title: "Нийт хүний хохирол",
    description:
      "Хоёр талаас амь үрэгдсэн, шархадсан ба сураггүй болсон цэргүүдийн нийт тоо (Франц 378,000, Герман 337,000).",
    contextNote: "302 өдрийн турш хоног тутамд дунджаар 2,300 гаруй хүн хохирч байв.",
  },
  {
    id: "deaths-both-sides",
    category: "human",
    categoryLabel: "Хүний хохирол",
    value: "305,000+",
    title: "Амь үрэгдэгсэд (Хоёр тал)",
    description:
      "Францын 162,440 цэрэг, Германы 143,000 дайчин Вердуны хөрсөнд үүрд амиа алджээ.",
    contextNote: "Өдөрт дунджаар 1,000 гаруй залуу амь насаа алдаж байсан гэсэн үг юм.",
  },
  {
    id: "unknown-soldiers",
    category: "human",
    categoryLabel: "Хүний хохирол",
    value: "130,000",
    title: "Үл мэдэгдэх дайчдын шарил",
    description:
      "Дуомоны бунханд нэр усыг нь тогтоох ямар ч боломжгүй болсон франц, герман дайчдын хамтын шарил.",
    contextNote: "Бунхны хонгилын жижиг цонхоор өнөөдөр ч хоёр талын цэргүүдийн ясыг харж болно.",
  },
  {
    id: "identified-graves",
    category: "human",
    categoryLabel: "Хүний хохирол",
    value: "16,142",
    title: "Нэртэй цэргийн булш",
    description:
      "Дуомоны бунхны өмнөх үндэсний оршуулгын газарт нойрсож буй Францын цэргүүдийн цагаан загалмай ба исламын 592 хавирган саран хавтан.",
    contextNote: "2023 онд ЮНЕСКО-гийн Дэлхийн өвд бүртгэгдсэн түүхэн дурсгал.",
  },
  {
    id: "total-divisions",
    category: "human",
    categoryLabel: "Цэрэг, хүч",
    value: "3.5 сая (125 дивиз)",
    title: "Нийт оролцсон цэргийн бие бүрэлдэхүүн",
    description:
      "Францын нийт армийн 75 хувь (75 дивиз) болон Германы ~50 дивиз Вердуны галд татагдан тулалдсан.",
    contextNote: "Францын арми цэргүүдээ 15 хоног тутамд ээлжлэн сольж амраах 'Нориа' системээр байлдсан.",
  },

  // --- ИХ БУУ, ЗЭВСЭГ & СҮЙРЭЛ ---
  {
    id: "artillery-shells-total",
    category: "artillery",
    categoryLabel: "Их бууны гал",
    value: "40–60 сая сум",
    title: "Нийт харвасан их бууны сум",
    description:
      "302 хоногийн турш хоёр талаас нийт 40-өөс 60 сая их бууны сумаар галласан нь хүн төрөлхтний түүхэн дэх хамгийн их нягтрал юм.",
    contextNote: "Секунд тутамд дунджаар 2 их бууны сум дэлбэрч байсан тооцоо.",
  },
  {
    id: "first-eight-hours",
    category: "artillery",
    categoryLabel: "Их бууны гал",
    value: "1 сая сум",
    title: "Эхний 8 цагт буусан сум",
    description:
      "1916 оны 2-р сарын 21-ний өглөө Германы 1,200 их буу нэгэн зэрэг гал нээж, ердөө 8 цагт 1 сая сумаар шуурган гал буулгасан.",
    contextNote: "Ой мод, бэхлэлтүүдийг хэдхэн цагийн дотор газрын хөрстэй тэгшилжээ.",
  },
  {
    id: "german-shells",
    category: "artillery",
    categoryLabel: "Их бууны гал",
    value: "23 сая сум",
    title: "Германы армийн нийт сум",
    description:
      "Германы их бууны ангиуд дангаараа 23 сая гаруй сум Вердуны чиглэлд харважээ.",
    contextNote: "Төмөр замын 400 мм болон 420 мм-ийн аварга том 'Бүдүүн Берта' их буунууд ашиглагдсан.",
  },
  {
    id: "hill-304-lowered",
    category: "artillery",
    categoryLabel: "Сүйрэл",
    value: "10 метр намссан",
    title: "304-р өндөрлөгийн оргил",
    description:
      "Их бууны сая сая суманд уулын хөрс хууларч, 304 метр өндөр шовх оргил тулааны дараа 294 метр болтлоо бүтэн 10 метрээр намссан.",
    contextNote: "Байгалийн уул толгод их бууны галд өндрөө алдсан түүхэн ховор тохиолдол.",
  },
  {
    id: "destroyed-villages-count",
    category: "artillery",
    categoryLabel: "Сүйрэл",
    value: "9 тосгон бүрэн устсан",
    title: "Газрын хөрснөөс арчигдсан суурингууд",
    description:
      "Флери, Во, Дуомон зэрэг 9 тосгон их буунд газрын хөрстэй тэгширч, өнөөг хүртэл 0 хүн амтай хэвээр байна.",
    contextNote: "Түүхэнд анх удаа эдгээр 9 тосгонд 'Францын төлөө үрэгдсэн' одон олгож, мэр захирагчтай үлдээсэн.",
  },
  {
    id: "zone-rouge-area",
    category: "artillery",
    categoryLabel: "Сүйрэл",
    value: "1,200 км²",
    title: "«Улаан бүс» (Zone Rouge)",
    description:
      "Хөрс нь хорт хий, химийн бодис, тэсрээгүй бөмбөгөөр хордсон тул 300–700 жил хүн амьдрахыг хориглосон газар.",
    contextNote: "Хөрсний га татамд дунджаар 300 гаруй тэсрээгүй их бууны сум агуулагдаж байна.",
  },
  {
    id: "city-buildings-destroyed",
    category: "artillery",
    categoryLabel: "Сүйрэл",
    value: "2,305 барилга",
    title: "Вердун хотын сүйдсэн байшин",
    description:
      "Вердун хотын доторх орон сууц, сургууль, сүмийн 2,305 барилга их бууны галд бүрэн сүйджээ.",
    contextNote: "Вердун хот баатарлаг хамгаалалтынхаа төлөө Францын төрийн 26 одон медалиар шагнагдсан.",
  },

  // --- ЛОЖИСТИК & АРИУН ЗАМ ---
  {
    id: "cadence-speed",
    category: "logistics",
    categoryLabel: "Ложистик",
    value: "14 секунд тутамд 1 машин",
    title: "«Ариун зам»-ын хөдөлгөөний эрчим",
    description:
      "Бар-ле-Дюк хотоос Вердун хүртэлх 57.2 км шороон замаар хоногт 6,000 гаруй ачааны машин тасралтгүй урссан.",
    contextNote: "Оргил үедээ 5 секунд тутамд нэг машин зөрж байсан дэлхийн цэргийн анхны моторжсон артери.",
  },
  {
    id: "total-cargo-transported",
    category: "logistics",
    categoryLabel: "Ложистик",
    value: "2 сая тонн ачаа",
    title: "Ариун замаар зөөсөн нийт ачаа",
    description:
      "Төмөр зам тасарсан үед Вердуны фронтыг сум, зэвсэг, хүнс, эм бэлдмэлээр тасралтгүй хангасан нийт ачааны жин.",
    contextNote: "Berliet CBA, Renault маркийн 3,500 гаруй тусгай тээврийн хэрэгсэл өдөр шөнөгүй зүтгэсэн.",
  },
  {
    id: "gravel-stone-road",
    category: "logistics",
    categoryLabel: "Ложистик",
    value: "700,000 тонн чулуу",
    title: "Зам засварт дэвссэн шохойн чулуу",
    description:
      "Цувааг гацаахгүйн тулд цэргүүд 57 км зам дагуу өдөр шөнөгүй чулуу дэвсэн тэгшилж байв.",
    contextNote: "Машин эвдэрвэл засах гэж зогсолгүй, шууд замын хажуугийн жалга руу түлхэн замаа чөлөөлдөг хатуу дүрэм үйлчилж байв.",
  },
  {
    id: "citadelle-underground",
    category: "logistics",
    categoryLabel: "Ложистик",
    value: "6,000 цэрэг / 16м хадан дор",
    title: "Газар доорх цайз (Citadelle souterraine)",
    description:
      "16 метр зузаан байгалийн боржин хадан дор байрласан бөмбөгдөлтөд өртөөгүй газар доорх аварга хуаран.",
    contextNote: "Цахилгаан станц, эмнэлэг, өдөрт 28,000 ширхэг талх барих цехтэй бүхэл бүтэн газар доорх хот байв.",
  },
];

interface StatisticsDossierTabsProps {
  defaultTab?: string;
}

export function StatisticsDossierTabs({
  defaultTab = "all",
}: StatisticsDossierTabsProps) {
  // Map old tab keys (stats, voie, villages) to new clean categories
  const resolvedTab = useMemo(() => {
    if (defaultTab === "voie") return "logistics";
    if (defaultTab === "villages") return "artillery";
    if (defaultTab === "casualties") return "human";
    if (defaultTab === "artillery") return "artillery";
    if (defaultTab === "logistics") return "logistics";
    return "all";
  }, [defaultTab]);

  const [activeTab, setActiveTab] = useState<string>(resolvedTab);

  const filteredStats = useMemo(() => {
    if (activeTab === "all") return VERDUN_KEY_STATISTICS;
    return VERDUN_KEY_STATISTICS.filter((s) => s.category === activeTab);
  }, [activeTab]);

  return (
    <div className="w-full space-y-5">
      {/* Top 4 Hero Highlight KPI Cards - Optimized for Mobile 2x2 & Desktop 4x1 */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        <div className="flex flex-col justify-between rounded-xl border border-brass/35 bg-card/90 p-3 sm:p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
              <Calendar className="size-3 text-brass shrink-0 sm:size-3.5" />
              <span className="truncate">Тулааны хугацаа</span>
            </div>
            <div className="mt-1 font-display text-xl font-bold tracking-tight text-brass tabular-nums sm:text-2xl lg:text-3xl">
              302 хоног
            </div>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
            Дэлхийн I дайны хамгийн урт
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-brass/35 bg-card/90 p-3 sm:p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
              <HeartCrack className="size-3 text-brass shrink-0 sm:size-3.5" />
              <span className="truncate">Хүний хохирол</span>
            </div>
            <div className="mt-1 font-display text-xl font-bold tracking-tight text-brass tabular-nums sm:text-2xl lg:text-3xl">
              700,000+
            </div>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
            305,000+ амь үрэгдсэн дайчин
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-brass/35 bg-card/90 p-3 sm:p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
              <Bomb className="size-3 text-brass shrink-0 sm:size-3.5" />
              <span className="truncate">Их бууны сум</span>
            </div>
            <div className="mt-1 font-display text-xl font-bold tracking-tight text-brass tabular-nums sm:text-2xl lg:text-3xl">
              40–60 сая
            </div>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
            Секунд тутамд 2 дэлбэрэлт
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-brass/35 bg-card/90 p-3 sm:p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
              <MapPin className="size-3 text-brass shrink-0 sm:size-3.5" />
              <span className="truncate">Сүйрсэн суурин</span>
            </div>
            <div className="mt-1 font-display text-xl font-bold tracking-tight text-brass tabular-nums sm:text-2xl lg:text-3xl">
              9 тосгон
            </div>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
            Газрын хөрснөөс арчигдсан
          </p>
        </div>
      </div>

      {/* Clean Category Tabs: Swipeable on Mobile, Grid on Desktop */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="inline-flex h-auto w-auto min-w-full items-center justify-start gap-1 bg-muted/60 p-1 rounded-xl sm:grid sm:grid-cols-4 sm:w-full">
            <TabsTrigger
              value="all"
              className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:text-brass data-[state=active]:shadow-sm"
            >
              <Layers className="size-3.5 shrink-0" />
              <span>Бүх баримт</span>
              <span className="font-mono text-[10px] opacity-75">({VERDUN_KEY_STATISTICS.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="human"
              className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:text-brass data-[state=active]:shadow-sm"
            >
              <Users className="size-3.5 shrink-0" />
              <span>Хүний хохирол</span>
              <span className="font-mono text-[10px] opacity-75">(5)</span>
            </TabsTrigger>
            <TabsTrigger
              value="artillery"
              className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:text-brass data-[state=active]:shadow-sm"
            >
              <Flame className="size-3.5 shrink-0" />
              <span>Их буу & Сүйрэл</span>
              <span className="font-mono text-[10px] opacity-75">(7)</span>
            </TabsTrigger>
            <TabsTrigger
              value="logistics"
              className="flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:text-brass data-[state=active]:shadow-sm"
            >
              <Truck className="size-3.5 shrink-0" />
              <span>Ариун зам</span>
              <span className="font-mono text-[10px] opacity-75">(4)</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents: Responsive 1-col on mobile, 2-col on desktop */}
        <div className="mt-4">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {filteredStats.map((item) => (
              <Card
                key={item.id}
                className="border border-border/80 bg-card/85 transition-colors hover:border-brass/50 shadow-sm"
              >
                <CardHeader className="p-3.5 sm:p-5 pb-1.5 sm:pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="border-brass/35 bg-brass/10 text-[10px] sm:text-[11px] font-medium text-brass"
                    >
                      {item.categoryLabel}
                    </Badge>
                  </div>
                  <div className="mt-1 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brass tabular-nums">
                    {item.value}
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-foreground">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3.5 sm:p-5 pt-0 space-y-2">
                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                    {item.description}
                  </p>
                  {item.contextNote && (
                    <div className="rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5 text-[10px] sm:text-[11px] leading-snug text-muted-foreground">
                      💡 {item.contextNote}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

// Backward-compatibility export if needed
export function StatisticsSummaryStrip() {
  return null;
}
