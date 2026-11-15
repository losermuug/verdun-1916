"use client";

import { ExternalLink, Orbit } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VERDUN_COORDINATES } from "@/data/verdun";
import {
  formatCoordPair,
  googleMapsUrl,
  openStreetMapUrl,
} from "@/lib/cartography";
import type { LocationCategory, PanelId } from "@/types/exhibition";
import { GoogleMap3DStage } from "./GoogleMap3DStage";

const CATEGORY_LABEL: Record<LocationCategory, string> = {
  fort: "Бэхлэлт",
  battlefield: "Тулааны талбар",
  village: "Сүйрсэн тосгон",
  memorial: "Дурсгал",
  cemetery: "Оршуулга",
  peace: "Энх тайвны төв",
  zone_rouge: "Улаан бүс",
};

interface SlideMapStageProps {
  initialSelectedId?: string;
}

export function SlideMapStage({ initialSelectedId }: SlideMapStageProps = {}) {
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId ?? "ossuaire-douaumont",
  );
  const [panelFilter, setPanelFilter] = useState<"all" | PanelId>("all");

  const selected =
    VERDUN_COORDINATES.find((c) => c.id === selectedId) ?? VERDUN_COORDINATES[0];

  const filtered =
    panelFilter === "all"
      ? VERDUN_COORDINATES
      : VERDUN_COORDINATES.filter((c) => c.panelIds.includes(panelFilter));

  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
      {/* Left: Google Maps 3D Stage */}
      <div className="lg:col-span-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-brass/40 px-2.5 py-1 text-xs text-brass">
              <Orbit className="size-3.5 text-brass" />
              Google Maps 3D
            </Badge>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Бодит хиймэл дагуул ба фотореалист рельеф
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {(["all", "panel-1", "panel-2", "panel-3", "panel-4", "panel-5"] as const).map(
              (pf) => (
                <Button
                  key={pf}
                  type="button"
                  size="xs"
                  variant={panelFilter === pf ? "default" : "outline"}
                  onClick={() => setPanelFilter(pf)}
                  className="rounded-full text-[11px]"
                >
                  {pf === "all" ? "Бүх 14" : pf.replace("panel-", "S")}
                </Button>
              ),
            )}
          </div>
        </div>

        <GoogleMap3DStage
          locations={filtered}
          selectedId={selected.id}
          onSelect={setSelectedId}
        />
      </div>

      {/* Right: Museum Location Card + All 14 Selector Buttons */}
      <Card className="border-brass/25 bg-card/90 lg:col-span-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="border-brass/40 text-brass">
              {CATEGORY_LABEL[selected.category]}
            </Badge>
            {selected.unesco2023 && (
              <Badge variant="secondary" className="text-sage">
                UNESCO 2023
              </Badge>
            )}
          </div>
          <CardTitle className="mt-2 font-display text-2xl font-bold text-foreground">
            {selected.name}
          </CardTitle>
          {selected.frenchName && (
            <p className="text-xs italic text-muted-foreground">{selected.frenchName}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="font-mono text-xs text-brass">
            {formatCoordPair(selected.lat, selected.lng)}
          </p>

          <p className="text-sm leading-relaxed text-foreground/90">
            {selected.description}
          </p>

          {selected.highlightMetric && (
            <p className="border-l-2 border-brass/70 pl-3 text-xs text-brass">
              {selected.highlightMetric}
            </p>
          )}

          <div className="border-t border-border pt-3">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              Байршил сонгох ({filtered.length})
            </p>
            <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto pr-1">
              {filtered.map((loc) => (
                <Button
                  key={loc.id}
                  type="button"
                  size="xs"
                  variant={loc.id === selected.id ? "default" : "outline"}
                  onClick={() => setSelectedId(loc.id)}
                  className="text-[11px]"
                >
                  {loc.name.replace(" (ерөнхий цэг)", "")}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs">
            <a
              href={googleMapsUrl(selected.lat, selected.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brass hover:underline"
            >
              Google Maps
              <ExternalLink className="size-3" />
            </a>
            <a
              href={openStreetMapUrl(selected.lat, selected.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-brass"
            >
              OpenStreetMap
              <ExternalLink className="size-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
