"use client";

import {
  ExternalLink,
  Home,
  Landmark,
  Layers,
  MapPin,
  Mountain,
  Orbit,
  Route,
  Search,
  Shield,
  Sparkles,
  Truck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VERDUN_COORDINATES } from "@/data/verdun";
import {
  formatCoordPair,
  googleMapsUrl,
  openStreetMapUrl,
} from "@/lib/cartography";
import type { LocationCategory, MapCoordinate } from "@/types/exhibition";
import { GoogleMap3DStage } from "./GoogleMap3DStage";

export type MapCategoryKey =
  | "all"
  | "fort"
  | "battlefield"
  | "logistics"
  | "memorial"
  | "village";

interface CategoryMeta {
  key: MapCategoryKey;
  label: string;
  icon: LucideIcon;
}

const CATEGORY_TABS: CategoryMeta[] = [
  { key: "all", label: "Бүх газар", icon: Layers },
  { key: "fort", label: "Цайз, бэхлэлт", icon: Shield },
  { key: "battlefield", label: "Өндөрлөг, фронт", icon: Mountain },
  { key: "logistics", label: "«Ариун зам»", icon: Truck },
  { key: "memorial", label: "Бунхан, дурсгал", icon: Landmark },
  { key: "village", label: "Сүйрсэн тосгон", icon: Home },
];

const CATEGORY_LABEL: Record<LocationCategory, string> = {
  fort: "Бэхлэлт цайз",
  battlefield: "Тулааны талбар",
  village: "Сүйрсэн тосгон",
  memorial: "Дурсгалын бунхан",
  cemetery: "Цэргийн оршуулга",
  peace: "Энх тайвны төв",
  zone_rouge: "Улаан бүс",
  logistics: "Цэргийн ложистик (Ариун зам)",
};

const COORD_ALIASES: Record<string, string> = {
  "village-fleury": "fleury-devant-douaumont",
  "fleury": "fleury-devant-douaumont",
  "peace-center-episcopal": "centre-mondial-paix",
  "citadel": "verdun-citadel",
  "citadelle": "verdun-citadel",
  "douaumont": "fort-douaumont",
  "douaumont-ossuary": "ossuaire-douaumont",
  "voie-sacree": "voie-sacree-terminal",
};

export function getCategoryGroup(loc: MapCoordinate): MapCategoryKey {
  if (loc.id.startsWith("voie-sacree") || loc.category === "logistics") {
    return "logistics";
  }
  if (loc.category === "fort") return "fort";
  if (loc.category === "battlefield") return "battlefield";
  if (loc.category === "village" || loc.category === "zone_rouge") return "village";
  return "memorial";
}

export function LocationCategoryIcon({
  category,
  id,
  className,
}: {
  category: LocationCategory;
  id: string;
  className?: string;
}) {
  if (id.startsWith("voie-sacree") || category === "logistics") {
    return <Truck className={className} />;
  }
  if (category === "fort") return <Shield className={className} />;
  if (category === "battlefield") return <Mountain className={className} />;
  if (category === "village" || category === "zone_rouge") {
    return <Home className={className} />;
  }
  if (category === "peace") return <Sparkles className={className} />;
  return <Landmark className={className} />;
}

interface SlideMapStageProps {
  initialSelectedId?: string;
}

export function SlideMapStage({ initialSelectedId }: SlideMapStageProps = {}) {
  const normalizedInitial =
    (initialSelectedId && COORD_ALIASES[initialSelectedId]) ||
    initialSelectedId ||
    "ossuaire-douaumont";

  const [selectedId, setSelectedId] = useState<string>(normalizedInitial);
  const [activeCategory, setActiveCategory] = useState<MapCategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeItemRef = useRef<HTMLButtonElement | null>(null);

  const selected = useMemo(() => {
    const norm = COORD_ALIASES[selectedId] ?? selectedId;
    return (
      VERDUN_COORDINATES.find((c) => c.id === norm) ??
      VERDUN_COORDINATES.find((c) => c.id === selectedId) ??
      VERDUN_COORDINATES[0]
    );
  }, [selectedId]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const map: Record<MapCategoryKey, number> = {
      all: VERDUN_COORDINATES.length,
      fort: 0,
      battlefield: 0,
      logistics: 0,
      memorial: 0,
      village: 0,
    };
    for (const loc of VERDUN_COORDINATES) {
      const grp = getCategoryGroup(loc);
      map[grp] = (map[grp] || 0) + 1;
    }
    return map;
  }, []);

  // Filter locations based on active category tab & search query
  const filteredLocations = useMemo(() => {
    return VERDUN_COORDINATES.filter((loc) => {
      if (activeCategory !== "all" && getCategoryGroup(loc) !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = loc.name.toLowerCase().includes(q);
        const matchFrench = loc.frenchName?.toLowerCase().includes(q);
        const matchDesc = loc.description.toLowerCase().includes(q);
        return matchName || matchFrench || matchDesc;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Auto-scroll the active item into view inside the tab list
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selected.id]);

  // Handle switching category tab
  const handleSelectCategory = (catKey: MapCategoryKey) => {
    setActiveCategory(catKey);
    setSearchQuery("");

    // If currently selected location is not in this new category, select the first one
    if (catKey !== "all") {
      const firstInCat = VERDUN_COORDINATES.find(
        (l) => getCategoryGroup(l) === catKey,
      );
      if (firstInCat && getCategoryGroup(selected) !== catKey) {
        setSelectedId(firstInCat.id);
      }
    }
  };

  // Handle selecting a location (either from list or directly from 3D map pin)
  const handleSelectLocation = (id: string) => {
    const norm = COORD_ALIASES[id] ?? id;
    setSelectedId(norm);

    const target = VERDUN_COORDINATES.find((l) => l.id === norm);
    if (target && activeCategory !== "all" && getCategoryGroup(target) !== activeCategory) {
      // If user clicks a pin outside active category, switch to "all" so they see context
      setActiveCategory("all");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Tabs: Clean, easily clickable category tabs with count chips */}
      <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:pb-0">
          {CATEGORY_TABS.map((cat) => {
            const count = categoryCounts[cat.key];
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleSelectCategory(cat.key)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "border border-brass/70 bg-brass/20 text-brass shadow-xs font-semibold ring-1 ring-brass/30"
                    : "border border-border/70 bg-card/60 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                }`}
              >
                <Icon
                  className={`size-3.5 ${
                    isActive ? "text-brass" : "text-muted-foreground"
                  }`}
                />
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                    isActive
                      ? "bg-brass/30 font-bold text-brass"
                      : "bg-muted/70 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: 3D Map (Left 7 cols) + Location Selector & Detail Card (Right 5 cols) */}
      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
        {/* Left: Google Maps 3D Viewport */}
        <div className="space-y-2 lg:col-span-7">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-brass">
              <Orbit className="size-3.5 text-brass" />
              <span>Google Maps 3D · Бодит рельеф</span>
            </div>
            <span className="hidden sm:inline text-[11px] text-muted-foreground/80">
              Хулганаар эргүүлэх: Ctrl/⌘ + Чирэх
            </span>
          </div>

          <GoogleMap3DStage
            locations={filteredLocations}
            selectedId={selected.id}
            onSelect={handleSelectLocation}
          />
        </div>

        {/* Right: Selected Location Detail Card + Vertical Location Tab List */}
        <div className="space-y-3.5 lg:col-span-5">
          {/* Card: Active Selected Location Details */}
          <Card className="border-brass/30 bg-card/95 shadow-md">
            <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant="outline"
                  className="gap-1 border-brass/50 bg-brass/10 text-xs font-medium text-brass"
                >
                  <LocationCategoryIcon
                    category={selected.category}
                    id={selected.id}
                    className="size-3 text-brass"
                  />
                  <span>{CATEGORY_LABEL[selected.category]}</span>
                </Badge>

                {selected.unesco2023 && (
                  <Badge
                    variant="secondary"
                    className="border border-sage/40 bg-sage/15 text-[11px] font-semibold text-sage"
                  >
                    UNESCO 2023
                  </Badge>
                )}
              </div>

              <CardTitle className="mt-2 font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {selected.name}
              </CardTitle>

              {selected.frenchName && (
                <p className="text-xs italic text-muted-foreground">
                  {selected.frenchName}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-1 sm:p-5 sm:pt-1">
              <div className="flex items-center gap-2 font-mono text-[11px] text-brass">
                <MapPin className="size-3 text-brass shrink-0" />
                <span>{formatCoordPair(selected.lat, selected.lng)}</span>
              </div>

              <p className="text-xs sm:text-[13px] leading-relaxed text-foreground/90">
                {selected.description}
              </p>

              {/* Special Voie Sacrée 57.2 km corridor interactive stepper */}
              {selected.id.startsWith("voie-sacree") && (
                <div className="rounded-lg border border-brass/35 bg-brass/[0.08] p-3 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-brass">
                    <Route className="size-3.5" />
                    <span>«Ариун зам»-ын 57.2 км үндсэн өртөөнүүд:</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] sm:text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleSelectLocation("voie-sacree-bar-le-duc")}
                      className={`flex flex-col items-center justify-center rounded-md border p-1.5 text-center transition-all ${
                        selected.id === "voie-sacree-bar-le-duc"
                          ? "border-brass bg-brass text-background font-bold shadow-xs"
                          : "border-brass/30 bg-card/60 text-foreground hover:bg-brass/20 hover:text-brass"
                      }`}
                    >
                      <span className="font-bold">0.0 км</span>
                      <span className="truncate max-w-full">Бар-ле-Дюк</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectLocation("voie-sacree-souilly")}
                      className={`flex flex-col items-center justify-center rounded-md border p-1.5 text-center transition-all ${
                        selected.id === "voie-sacree-souilly"
                          ? "border-brass bg-brass text-background font-bold shadow-xs"
                          : "border-brass/30 bg-card/60 text-foreground hover:bg-brass/20 hover:text-brass"
                      }`}
                    >
                      <span className="font-bold">39.8 км</span>
                      <span className="truncate max-w-full">Суйи (Штаб)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectLocation("voie-sacree-terminal")}
                      className={`flex flex-col items-center justify-center rounded-md border p-1.5 text-center transition-all ${
                        selected.id === "voie-sacree-terminal"
                          ? "border-brass bg-brass text-background font-bold shadow-xs"
                          : "border-brass/30 bg-card/60 text-foreground hover:bg-brass/20 hover:text-brass"
                      }`}
                    >
                      <span className="font-bold">55.4 км</span>
                      <span className="truncate max-w-full">Мулен-Брюле</span>
                    </button>
                  </div>
                </div>
              )}

              {/* External Maps Links */}
              <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-2.5 text-xs">
                <a
                  href={googleMapsUrl(selected.lat, selected.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-brass hover:underline"
                >
                  <span>Google Maps дээр үзэх</span>
                  <ExternalLink className="size-3" />
                </a>

                <a
                  href={openStreetMapUrl(selected.lat, selected.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <span>OpenStreetMap</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Location Tabs Section */}
          <div className="space-y-2 rounded-xl border border-border/80 bg-card/70 p-3 sm:p-4">
            {/* Header: Title + Search Input */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Байршил сонгох ({filteredLocations.length})
              </span>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                  <span>Цэвэрлэх</span>
                </button>
              )}
            </div>

            {/* Quick Search Bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Газар хайх... (Дуомон, 304, Во, Флери...)"
                className="w-full rounded-lg border border-border/70 bg-card/90 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-brass/70 focus:ring-1 focus:ring-brass/40"
              />
            </div>

            {/* Scrollable Location Tab Rows */}
            <div className="max-h-[240px] space-y-1.5 overflow-y-auto pr-1 sm:max-h-[270px]">
              {filteredLocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
                  <p>Таны хайсан байршил олдсонгүй.</p>
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-1 text-brass text-xs"
                  >
                    Бүх 19 байршлыг харах
                  </Button>
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isSelected = loc.id === selected.id;
                  return (
                    <button
                      key={loc.id}
                      ref={isSelected ? activeItemRef : null}
                      type="button"
                      onClick={() => handleSelectLocation(loc.id)}
                      className={`group flex w-full items-start gap-2.5 rounded-lg border p-2 text-left transition-all ${
                        isSelected
                          ? "border-brass bg-brass/15 text-foreground shadow-xs ring-1 ring-brass/40"
                          : "border-border/60 bg-card/40 text-muted-foreground hover:border-border/90 hover:bg-card/90 hover:text-foreground"
                      }`}
                    >
                      {/* Icon container */}
                      <div
                        className={`mt-0.5 flex size-6.5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          isSelected
                            ? "border-brass/50 bg-brass/25 text-brass"
                            : "border-border/60 bg-muted/40 text-muted-foreground group-hover:border-brass/30 group-hover:text-brass"
                        }`}
                      >
                        <LocationCategoryIcon
                          category={loc.category}
                          id={loc.id}
                          className="size-3.5"
                        />
                      </div>

                      {/* Info & labels */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isSelected ? "text-brass" : "text-foreground"
                            }`}
                          >
                            {loc.name.replace(" (ерөнхий цэг)", "")}
                          </span>

                          {isSelected && (
                            <span className="shrink-0 rounded bg-brass px-1.5 py-0.2 text-[9px] font-bold text-background uppercase tracking-wider">
                              Сонгосон
                            </span>
                          )}
                        </div>

                        <p className="line-clamp-1 text-[11px] text-muted-foreground/80 mt-0.5">
                          {loc.frenchName || CATEGORY_LABEL[loc.category]}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}