"use client";

import { ExternalLink, Scale, TableProperties } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ARCHIVAL_ASSETS,
  COMPARATIVE_STATISTICS,
  DESTROYED_VILLAGES,
  VOIE_SACREE_METRICS,
} from "@/data/verdun";

interface StatisticsSummaryStripProps {
  onOpenDetails: (tab?: "stats" | "voie" | "villages" | "archives") => void;
}

const KPI_ITEMS: {
  label: string;
  value: string;
  note: string;
  tab: "stats" | "voie" | "villages";
}[] = [
  {
    label: "Тулалдааны хугацаа",
    value: "302 хоног",
    note: "1916.02.21 – 12.18 · Уламжлал: «300 өдөр, 300 шөнө»",
    tab: "stats",
  },
  {
    label: "Нийт хүний хохирол",
    value: "700k – 750k",
    note: "Мемориал 700k+ · Филпотт 714k · Британника ~750k",
    tab: "stats",
  },
  {
    label: "Их бууны сум",
    value: "40–60 сая",
    note: "Герман 23 сая · Минутад дунджаар 92–138 сум",
    tab: "stats",
  },
  {
    label: "Сүйрсэн нутаг",
    value: "9 тосгон · 1,200 км²",
    note: "6 нь 0 хүн амтай · Хотод 2,305 барилга устсан",
    tab: "villages",
  },
];

export function StatisticsSummaryStrip({
  onOpenDetails,
}: StatisticsSummaryStripProps) {
  return (
    <section
      aria-label="Гол тоо баримт"
      className="mx-auto mt-4 w-full max-w-5xl px-4 sm:px-6"
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Scale className="size-3.5 text-brass" />
          <span>Түүхэн үндсэн тоо баримт (эшлэлийн харьцуулалттай)</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => onOpenDetails("stats")}
          className="text-brass hover:text-brass"
        >
          <TableProperties className="size-3.5" />
          Бүрэн хүснэгт
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_ITEMS.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => onOpenDetails(kpi.tab)}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <Card
              size="sm"
              className="h-full border border-border/80 bg-card/85 transition-colors hover:border-brass/50"
            >
              <CardHeader className="pb-1">
                <CardDescription className="text-xs text-muted-foreground">
                  {kpi.label}
                </CardDescription>
                <CardTitle className="font-display text-2xl font-bold tracking-tight text-brass tabular-nums">
                  {kpi.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-snug text-foreground/75">{kpi.note}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </section>
  );
}

interface StatisticsDossierTabsProps {
  defaultTab?: "stats" | "voie" | "villages" | "archives";
}

export function StatisticsDossierTabs({
  defaultTab = "stats",
}: StatisticsDossierTabsProps) {
  const linkOnlyAssets = ARCHIVAL_ASSETS.filter((a) => !a.embedAllowed);

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/80 p-1">
        <TabsTrigger value="stats" className="text-xs">
          Харьцуулсан тоо баримт
        </TabsTrigger>
        <TabsTrigger value="voie" className="text-xs">
          Ариун зам (La Voie Sacrée)
        </TabsTrigger>
        <TabsTrigger value="villages" className="text-xs">
          Сүйрсэн 9 тосгон & Улаан бүс
        </TabsTrigger>
        <TabsTrigger value="archives" className="text-xs">
          1984 / 2016 ба LOC Архив
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: Comparative Statistics Table & Forces */}
      <TabsContent value="stats" className="mt-4 space-y-5">
        <Card className="border border-border bg-background/50">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Эх сурвалжуудын харьцуулсан тоо баримт
            </CardTitle>
            <CardDescription>
              Түүхэн судалгааны зөрүүтэй тооцоог нэг тоонд шахахгүйгээр зэрэгцүүлэн үзүүлэв.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[180px] whitespace-normal text-brass">
                    Үзүүлэлт
                  </TableHead>
                  <TableHead className="whitespace-normal text-foreground">
                    Музей / Албан ёс
                  </TableHead>
                  <TableHead className="whitespace-normal text-foreground">
                    Түүхчид / Нэвтэрхий толь
                  </TableHead>
                  <TableHead className="whitespace-normal text-muted-foreground">
                    Тайлбар
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARATIVE_STATISTICS.map((row) => (
                  <TableRow key={row.id} className="border-border/70">
                    <TableCell className="whitespace-normal font-medium text-foreground align-top">
                      {row.metric}
                    </TableCell>
                    <TableCell className="whitespace-normal text-foreground/90 align-top tabular-nums">
                      {row.museumFigure}
                    </TableCell>
                    <TableCell className="whitespace-normal text-foreground/90 align-top tabular-nums">
                      {row.historianFigure}
                    </TableCell>
                    <TableCell className="whitespace-normal text-xs text-muted-foreground align-top">
                      {row.methodology}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card size="sm" className="border border-border bg-background/50">
            <CardHeader>
              <CardDescription>Оролцсон хүч</CardDescription>
              <CardTitle className="font-display text-xl text-brass">
                75 vs ~50 дивиз
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              «Нориа» ээлжийн системээр Францын армийн 3/4 (75 дивиз), Герман ~50 дивиз тулалдсан.
            </CardContent>
          </Card>

          <Card size="sm" className="border border-border bg-background/50">
            <CardHeader>
              <CardDescription>Дуомоны дурсгал</CardDescription>
              <CardTitle className="font-display text-xl text-brass">
                130,000 + 16,142
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Бунханд 130,000 танигдаагүй цэрэг, 14.438 га оршуулгад 16,142 булш (592 лал хөшөө).
            </CardContent>
          </Card>

          <Card size="sm" className="border border-border bg-background/50">
            <CardHeader>
              <CardDescription>ЮНЕСКО-гийн Дэлхийн өв</CardDescription>
              <CardTitle className="font-display text-xl text-brass">
                2023.09.20
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Дуомоны цогцолбор, Дуомон бэхлэлт, Жадын шуудуу Баруун фронтын 139 дурсгалд бүртгэгдэв.
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab 2: La Voie Sacrée & Citadel */}
      <TabsContent value="voie" className="mt-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VOIE_SACREE_METRICS.map((m) => (
            <Card
              key={m.id}
              size="sm"
              className="border border-border bg-background/55"
            >
              <CardHeader>
                <CardDescription className="text-xs">{m.label}</CardDescription>
                <CardTitle className="font-display text-2xl text-brass tabular-nums">
                  {m.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-foreground/85">
                  {m.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Tab 3: Destroyed Villages & Zone Rouge */}
      <TabsContent value="villages" className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card size="sm" className="border border-border bg-background/50">
            <CardHeader>
              <CardDescription>Хотын сүйрэл (1919)</CardDescription>
              <CardTitle className="font-display text-xl text-brass">
                2,305 барилга
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Вердун 26 одон медальтай Францын хамгийн олон шагналтай хот.
            </CardContent>
          </Card>

          <Card size="sm" className="border border-border bg-background/50">
            <CardHeader>
              <CardDescription>Улаан бүс (Zone Rouge)</CardDescription>
              <CardTitle className="font-display text-xl text-brass">
                1,200 км² · 300–700 жил
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Place à Gaz хэсэгт 1 кг хөрсөнд 176 г хүнцэл илэрсэн (Баузингер, 2007).
            </CardContent>
          </Card>

          <Card size="sm" className="border border-border bg-background/50">
            <CardHeader>
              <CardDescription>Дэлбэрээгүй сум</CardDescription>
              <CardTitle className="font-display text-xl text-brass">
                300 сум / 1 га
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              2005–2006 оны хөрсний дээд 15 см-ийн туршилтаар илэрсэн нягтрал.
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border bg-background/50">
          <CardContent className="pt-2">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="whitespace-normal text-brass">
                    Тосгон
                  </TableHead>
                  <TableHead className="whitespace-normal text-foreground">
                    1911 оны хүн ам
                  </TableHead>
                  <TableHead className="whitespace-normal text-foreground">
                    Эзлэгдсэн / Хугацаа
                  </TableHead>
                  <TableHead className="whitespace-normal text-foreground">
                    Өнөөгийн статус
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DESTROYED_VILLAGES.map((v) => (
                  <TableRow key={v.id} className="border-border/70">
                    <TableCell className="whitespace-normal align-top">
                      <span className="font-medium text-foreground">{v.nameMn}</span>
                      <span className="block text-xs text-muted-foreground">
                        {v.nameFr}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-normal align-top tabular-nums text-foreground/90">
                      {v.population1911 !== null ? v.population1911 : "Тодорхойгүй"}
                    </TableCell>
                    <TableCell className="whitespace-normal align-top text-xs text-muted-foreground">
                      {v.occupiedRange}
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            v.statusType === "uninhabited"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {v.statusType === "uninhabited"
                            ? "0 хүн амтай"
                            : "Дахин боссон"}
                        </Badge>
                        {v.memorialNote && (
                          <span className="text-xs text-muted-foreground">
                            {v.memorialNote}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 4: 1984 / 2016 & LOC Link-only Archives */}
      <TabsContent value="archives" className="mt-4 space-y-3">
        <p className="text-xs text-muted-foreground">
          Зохиогчийн эрх болон архивын журмын дагуу АНУ-ын Конгрессын номын сан (LOC)
          болон 1984, 2016 оны албан ёсны гэрэл зургуудыг шууд эх хуудас руу холбов.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {linkOnlyAssets.map((a) => (
            <a
              key={a.id}
              href={a.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card
                size="sm"
                className="h-full border border-border bg-background/55 transition-colors group-hover:border-brass/60"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-brass border-brass/30">
                      {a.year}
                    </Badge>
                    <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-brass" />
                  </div>
                  <CardTitle className="mt-1 font-display text-lg group-hover:text-brass">
                    {a.title}
                  </CardTitle>
                  <CardDescription className="text-xs">{a.caption}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{a.sourceName}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
