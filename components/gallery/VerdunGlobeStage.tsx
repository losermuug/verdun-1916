"use client";

import { Compass, Globe2, Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import countriesTopo from "world-atlas/countries-110m.json";
import { Button } from "@/components/ui/button";
import type { LocationCategory, MapCoordinate } from "@/types/exhibition";

const DEG2RAD = Math.PI / 180;

const CATEGORY_COLOR: Record<LocationCategory, string> = {
  fort: "#c59b5f",
  battlefield: "#d97757",
  village: "#b8423d",
  memorial: "#ece7dd",
  cemetery: "#9ba3b0",
  peace: "#739982",
  zone_rouge: "#dc2626",
  logistics: "#eab308",
};

interface RingPoint {
  lat: number;
  lng: number;
}

interface GlobePolygon {
  id: string;
  rings: RingPoint[][];
}

// Parse world-atlas countries once statically (zero network dependency, deterministic).
const WORLD_POLYGONS: GlobePolygon[] = (() => {
  const topo = countriesTopo as unknown as Topology;
  const countriesObj = topo.objects.countries;
  const geo = feature(topo, countriesObj);
  if (geo.type !== "FeatureCollection") return [];

  const result: GlobePolygon[] = [];
  for (const feat of geo.features) {
    const id = String(feat.id ?? "");
    const geom = feat.geometry;
    if (!geom) continue;
    if (geom.type === "Polygon") {
      result.push({
        id,
        rings: geom.coordinates.map((ring) =>
          ring.map(([lng, lat]) => ({ lat, lng })),
        ),
      });
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) {
        result.push({
          id,
          rings: poly.map((ring) => ring.map(([lng, lat]) => ({ lat, lng }))),
        });
      }
    }
  }
  return result;
})();

function projectPoint(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
) {
  const phi = lat * DEG2RAD;
  const lambda = lng * DEG2RAD;
  const phi0 = centerLat * DEG2RAD;
  const lambda0 = centerLng * DEG2RAD;

  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosPhi0 = Math.cos(phi0);
  const sinPhi0 = Math.sin(phi0);
  const dLambda = lambda - lambda0;
  const cosD = Math.cos(dLambda);
  const sinD = Math.sin(dLambda);

  const x = cosPhi * sinD;
  const y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosD;
  const z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosD;

  return { x, y, z };
}

interface VerdunGlobeStageProps {
  locations: MapCoordinate[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function VerdunGlobeStage({
  locations,
  selectedId,
  onSelect,
}: VerdunGlobeStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selected = useMemo(
    () => locations.find((l) => l.id === selectedId) ?? locations[0],
    [locations, selectedId],
  );

  // Camera state (target vs animated current for silky fly-to transitions)
  const targetRef = useRef({ lat: 47.0, lng: 5.4, zoom: 3.2 });
  const currentRef = useRef({ lat: 47.0, lng: 5.4, zoom: 3.2 });
  const dragRef = useRef<{
    active: boolean;
    lastX: number;
    lastY: number;
    moved: boolean;
  }>({ active: false, lastX: 0, lastY: 0, moved: false });

  const [preset, setPreset] = useState<"world" | "europe" | "verdun">("europe");
  const projectedPinsRef = useRef<
    { id: string; sx: number; sy: number; r: number }[]
  >([]);

  const flyTo = useCallback(
    (lat: number, lng: number, zoom: number, mode?: "world" | "europe" | "verdun") => {
      targetRef.current = { lat, lng, zoom };
      if (mode) setPreset(mode);
    },
    [],
  );

  // Smoothly focus globe when user picks a location while in close-up Verdun mode
  useEffect(() => {
    if (!selected) return;
    if (preset === "verdun") {
      targetRef.current = {
        ...targetRef.current,
        lat: selected.lat,
        lng: selected.lng,
      };
    }
  }, [selected, preset]);

  // Continuous smooth 60fps orthographic projection loop
  useEffect(() => {
    let rafId = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (w > 0 && h > 0) {
          if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
          }

          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Smooth camera interpolation
            const cur = currentRef.current;
            const tgt = targetRef.current;
            cur.lat += (tgt.lat - cur.lat) * 0.12;
            cur.lng += (tgt.lng - cur.lng) * 0.12;
            cur.zoom += (tgt.zoom - cur.zoom) * 0.12;

            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, w, h);

            const cx = w / 2;
            const cy = h / 2;
            const radius = Math.min(w, h) * 0.42 * cur.zoom;

            // Deep space backdrop & warm brass atmospheric rim
            const atmo = ctx.createRadialGradient(
              cx - radius * 0.18,
              cy - radius * 0.18,
              radius * 0.45,
              cx,
              cy,
              radius * 1.18,
            );
            atmo.addColorStop(0, "rgba(28, 36, 48, 0.92)");
            atmo.addColorStop(0.75, "rgba(13, 17, 23, 0.98)");
            atmo.addColorStop(0.92, "rgba(197, 155, 95, 0.18)");
            atmo.addColorStop(1, "rgba(9, 11, 13, 0)");

            ctx.fillStyle = atmo;
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 1.18, 0, Math.PI * 2);
            ctx.fill();

            // Clip inside Earth sphere
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.clip();

            // Ocean sphere
            const oceanGrad = ctx.createRadialGradient(
              cx - radius * 0.25,
              cy - radius * 0.25,
              radius * 0.1,
              cx,
              cy,
              radius,
            );
            oceanGrad.addColorStop(0, "#141a22");
            oceanGrad.addColorStop(1, "#090c10");
            ctx.fillStyle = oceanGrad;
            ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

            // Graticule grid (15° latitude/longitude lines)
            ctx.strokeStyle = "rgba(236, 231, 221, 0.06)";
            ctx.lineWidth = 0.7;
            for (let lat = -75; lat <= 75; lat += 15) {
              ctx.beginPath();
              let started = false;
              for (let lng = -180; lng <= 180; lng += 5) {
                const p = projectPoint(lat, lng, cur.lat, cur.lng);
                if (p.z > 0) {
                  const sx = cx + p.x * radius;
                  const sy = cy - p.y * radius;
                  if (!started) {
                    ctx.moveTo(sx, sy);
                    started = true;
                  } else {
                    ctx.lineTo(sx, sy);
                  }
                } else {
                  started = false;
                }
              }
              ctx.stroke();
            }
            for (let lng = -180; lng < 180; lng += 15) {
              ctx.beginPath();
              let started = false;
              for (let lat = -85; lat <= 85; lat += 4) {
                const p = projectPoint(lat, lng, cur.lat, cur.lng);
                if (p.z > 0) {
                  const sx = cx + p.x * radius;
                  const sy = cy - p.y * radius;
                  if (!started) {
                    ctx.moveTo(sx, sy);
                    started = true;
                  } else {
                    ctx.lineTo(sx, sy);
                  }
                } else {
                  started = false;
                }
              }
              ctx.stroke();
            }

            // Continents & Countries (highlighting France & Germany)
            for (const poly of WORLD_POLYGONS) {
              const isFrance = poly.id === "250";
              const isGermany = poly.id === "276";

              ctx.beginPath();
              let anyVisible = false;
              for (const ring of poly.rings) {
                let drawing = false;
                for (let i = 0; i < ring.length; i++) {
                  const pt = ring[i];
                  const p = projectPoint(pt.lat, pt.lng, cur.lat, cur.lng);
                  if (p.z > -0.05) {
                    anyVisible = true;
                    const sx = cx + p.x * radius;
                    const sy = cy - p.y * radius;
                    if (!drawing) {
                      ctx.moveTo(sx, sy);
                      drawing = true;
                    } else {
                      ctx.lineTo(sx, sy);
                    }
                  } else {
                    drawing = false;
                  }
                }
              }
              if (!anyVisible) continue;

              if (isFrance) {
                ctx.fillStyle = "rgba(197, 155, 95, 0.24)";
                ctx.strokeStyle = "rgba(197, 155, 95, 0.72)";
                ctx.lineWidth = 1.1;
              } else if (isGermany) {
                ctx.fillStyle = "rgba(115, 153, 130, 0.2)";
                ctx.strokeStyle = "rgba(115, 153, 130, 0.65)";
                ctx.lineWidth = 1.0;
              } else {
                ctx.fillStyle = "rgba(236, 231, 221, 0.08)";
                ctx.strokeStyle = "rgba(236, 231, 221, 0.18)";
                ctx.lineWidth = 0.6;
              }
              ctx.fill();
              ctx.stroke();
            }

            // Voie Sacrée geodesic supply arc (Bar-le-Duc 48.77N, 5.16E -> Verdun 49.16N, 5.38E)
            ctx.beginPath();
            const steps = 16;
            let arcStarted = false;
            for (let s = 0; s <= steps; s++) {
              const t = s / steps;
              const lat = 48.77 + (49.1598 - 48.77) * t;
              const lng = 5.16 + (5.3844 - 5.16) * t;
              const p = projectPoint(lat, lng, cur.lat, cur.lng);
              if (p.z > 0) {
                const sx = cx + p.x * radius;
                const sy = cy - p.y * radius;
                if (!arcStarted) {
                  ctx.moveTo(sx, sy);
                  arcStarted = true;
                } else {
                  ctx.lineTo(sx, sy);
                }
              }
            }
            ctx.strokeStyle = "#c59b5f";
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Region country labels when zoomed out
            if (cur.zoom < 8) {
              const labelSpots = [
                { name: "ФРАНЦ", lat: 46.8, lng: 2.4, color: "rgba(197, 155, 95, 0.9)" },
                { name: "ГЕРМАН", lat: 51.0, lng: 10.2, color: "rgba(115, 153, 130, 0.9)" },
              ];
              ctx.font = "600 10px sans-serif";
              ctx.textAlign = "center";
              for (const ls of labelSpots) {
                const p = projectPoint(ls.lat, ls.lng, cur.lat, cur.lng);
                if (p.z > 0.15) {
                  ctx.fillStyle = ls.color;
                  ctx.fillText(ls.name, cx + p.x * radius, cy - p.y * radius);
                }
              }
            }

            // Project & draw Verdun historical pins on visible hemisphere
            const hitPins: { id: string; sx: number; sy: number; r: number }[] = [];
            for (const loc of locations) {
              const p = projectPoint(loc.lat, loc.lng, cur.lat, cur.lng);
              if (p.z <= 0) continue;
              const sx = cx + p.x * radius;
              const sy = cy - p.y * radius;
              if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

              const isSel = loc.id === selected?.id;
              const color = CATEGORY_COLOR[loc.category];
              const pinR = isSel ? 6.5 : 4.2;

              if (isSel) {
                ctx.beginPath();
                ctx.arc(sx, sy, 14, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(197, 155, 95, 0.22)";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(sx, sy, 10, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(197, 155, 95, 0.8)";
                ctx.lineWidth = 1.2;
                ctx.stroke();
              }

              ctx.beginPath();
              ctx.arc(sx, sy, pinR, 0, Math.PI * 2);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.strokeStyle = isSel ? "#ffffff" : "#090b0d";
              ctx.lineWidth = isSel ? 1.8 : 1;
              ctx.stroke();

              // Draw site label when zoomed in or selected
              if (isSel || cur.zoom >= 9) {
                ctx.font = isSel ? "600 11px sans-serif" : "400 10px sans-serif";
                ctx.textAlign = "left";
                ctx.fillStyle = isSel ? "#ece7dd" : "rgba(236, 231, 221, 0.78)";
                ctx.fillText(loc.name, sx + 9, sy + 3);
              }

              hitPins.push({ id: loc.id, sx, sy, r: 14 });
            }
            projectedPinsRef.current = hitPins;

            ctx.restore(); // end sphere clip

            // Sphere border rim
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(197, 155, 95, 0.35)";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.restore();
          }
        }
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [locations, selected]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = {
      active: true,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) d.moved = true;
    d.lastX = e.clientX;
    d.lastY = e.clientY;

    const sens = 0.28 / Math.max(1, targetRef.current.zoom * 0.45);
    targetRef.current = {
      ...targetRef.current,
      lng: targetRef.current.lng - dx * sens,
      lat: Math.max(-75, Math.min(75, targetRef.current.lat + dy * sens)),
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragRef.current;
    dragRef.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!d.moved) {
      const box = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - box.left;
      const py = e.clientY - box.top;
      let best: { id: string; dist: number } | null = null;
      for (const pin of projectedPinsRef.current) {
        const dist = Math.hypot(px - pin.sx, py - pin.sy);
        if (dist <= pin.r && (!best || dist < best.dist)) {
          best = { id: pin.id, dist };
        }
      }
      if (best) onSelect(best.id);
    }
  };

  return (
    <div className="relative h-[430px] w-full overflow-hidden rounded-xl border border-brass/30 bg-[#080a0d] sm:h-[490px]">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={(e) => {
          e.preventDefault();
          const factor = e.deltaY < 0 ? 1.2 : 0.84;
          targetRef.current = {
            ...targetRef.current,
            zoom: Math.max(0.85, Math.min(18, targetRef.current.zoom * factor)),
          };
        }}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        aria-label="3D Дэлхийн бөмбөрцөг — Вердуны байршлууд"
      />

      {/* Camera Orbit Presets */}
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="xs"
          variant={preset === "world" ? "default" : "secondary"}
          onClick={() => flyTo(42, 12, 1.0, "world")}
        >
          <Globe2 className="size-3" />
          Дэлхий (1x)
        </Button>
        <Button
          type="button"
          size="xs"
          variant={preset === "europe" ? "default" : "secondary"}
          onClick={() => flyTo(47.5, 5.8, 3.2, "europe")}
        >
          <Compass className="size-3" />
          Европ (3x)
        </Button>
        <Button
          type="button"
          size="xs"
          variant={preset === "verdun" ? "default" : "secondary"}
          onClick={() =>
            flyTo(selected?.lat ?? 49.18, selected?.lng ?? 5.4, 14, "verdun")
          }
        >
          Вердун ойртуулалт
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-border bg-card/85 p-1 backdrop-blur-sm">
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Томруулах"
          onClick={() => {
            targetRef.current = {
              ...targetRef.current,
              zoom: Math.min(18, targetRef.current.zoom * 1.45),
            };
          }}
        >
          <Plus className="size-3.5" />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Жижигрүүлэх"
          onClick={() => {
            targetRef.current = {
              ...targetRef.current,
              zoom: Math.max(0.85, targetRef.current.zoom * 0.7),
            };
          }}
        >
          <Minus className="size-3.5" />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label="Анхны байрлал"
          onClick={() => flyTo(47.5, 5.8, 3.2, "europe")}
        >
          <RotateCcw className="size-3" />
        </Button>
      </div>

      {/* Subtle hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border/80 bg-black/70 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-sm">
        Чирж эргүүлэх · Ойртуулахын тулд «Вердун ойртуулалт» дарна уу
      </div>
    </div>
  );
}
