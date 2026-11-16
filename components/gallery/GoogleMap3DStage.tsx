// Adapted from Google Maps Platform Code Assist & @vis.gl/react-google-maps/3d patterns
"use client";

import { AltitudeMode, APIProvider, Pin } from "@vis.gl/react-google-maps";
import { Map3D, MapMode, type Map3DRef, Marker3D, Polyline3D } from "@vis.gl/react-google-maps/3d";
import { Compass, ExternalLink, KeyRound, Orbit, Route } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VOIE_SACREE_COORDINATES } from "@/data/verdun";
import type { LocationCategory, MapCoordinate } from "@/types/exhibition";

const ENV_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "AIzaSyBLU_F07Wwa74fssg9I_B8YiTP5CEJNoig";

const PIN_STYLE: Record<LocationCategory, { bg: string; border: string }> = {
  fort: { bg: "#c59b5f", border: "#7c5c2e" },
  battlefield: { bg: "#d97757", border: "#8a422b" },
  village: { bg: "#b8423d", border: "#6e1f1c" },
  memorial: { bg: "#ece7dd", border: "#8d867a" },
  cemetery: { bg: "#9ba3b0", border: "#555b66" },
  peace: { bg: "#739982", border: "#3d5948" },
  zone_rouge: { bg: "#dc2626", border: "#7f1d1d" },
  logistics: { bg: "#eab308", border: "#854d0e" },
};

interface GoogleMap3DStageProps {
  locations: MapCoordinate[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function VerdunGoogle3DViewport({
  locations,
  selectedId,
  onSelect,
}: GoogleMap3DStageProps) {
  const map3dRef = useRef<Map3DRef | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.HYBRID);
  const [webglError, setWebglError] = useState<string | null>(null);

  const selected = useMemo(() => {
    const norm =
      selectedId === "village-fleury"
        ? "fleury-devant-douaumont"
        : selectedId === "peace-center-episcopal"
        ? "centre-mondial-paix"
        : selectedId;
    return (
      locations.find((l) => l.id === norm) ??
      locations.find((l) => l.id === selectedId) ??
      locations[0]
    );
  }, [locations, selectedId]);

  // Fly photorealistic 3D camera whenever user selects a new Verdun historical coordinate
  useEffect(() => {
    const ctrl = map3dRef.current;
    if (!ctrl || !selected) return;
    try {
      if (selected.id.startsWith("voie-sacree")) {
        ctrl.flyCameraTo({
          endCamera: {
            center: { lat: selected.lat, lng: selected.lng, altitude: 200 },
            range: 3600,
            tilt: 56,
            heading: 18,
          },
          durationMillis: 1600,
        });
      } else {
        ctrl.flyCameraTo({
          endCamera: {
            center: { lat: selected.lat, lng: selected.lng, altitude: 120 },
            range: 1200,
            tilt: 64,
            heading: 22,
          },
          durationMillis: 1500,
        });
      }
    } catch {
      // Map3DElement may still be initializing on first mount
    }
  }, [selected]);

  if (webglError) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-xl border border-border bg-background/80 p-6 text-center sm:h-[530px] lg:h-[570px]">
        <div className="max-w-md space-y-2">
          <p className="font-display text-xl text-foreground">
            3D WebGL дүрслэл эхэлсэнгүй
          </p>
          <p className="text-xs text-muted-foreground">{webglError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-xl border border-brass/30 bg-[#080a0d] sm:h-[530px] lg:h-[570px]">
      <Map3D
        ref={map3dRef}
        mode={mapMode}
        defaultCenter={{
          lat: selected?.lat ?? 49.2081,
          lng: selected?.lng ?? 5.4239,
          altitude: 140,
        }}
        defaultRange={1400}
        defaultHeading={22}
        defaultTilt={64}
        defaultRoll={0}
        internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
        onError={() =>
          setWebglError(
            "Google Photorealistic 3D Tiles ачаалахад WebGL2 эсвэл API эрх шаардлагатай.",
          )
        }
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Render La Voie Sacrée (57.2 km) Arterial 3D Highway */}
        <Polyline3D
          coordinates={VOIE_SACREE_COORDINATES}
          strokeColor="#eab308"
          strokeWidth={8}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
        />

        {locations.map((loc) => {
          const isSelected = loc.id === selected?.id;
          const isVoieSacree = loc.id.startsWith("voie-sacree");
          const colors = PIN_STYLE[loc.category];
          return (
            <Marker3D
              key={loc.id}
              position={{
                lat: loc.lat,
                lng: loc.lng,
                altitude: isSelected ? 45 : isVoieSacree ? 35 : 22,
              }}
              altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
              extruded
              onClick={() => onSelect(loc.id)}
              title={loc.name}
            >
              <Pin
                background={isSelected ? "#c59b5f" : colors.bg}
                borderColor={isSelected ? "#ffffff" : colors.border}
                glyphColor={isSelected ? "#0d0f11" : "#ffffff"}
                scale={isSelected ? 1.25 : isVoieSacree ? 1.05 : 0.9}
              />
            </Marker3D>
          );
        })}
      </Map3D>

      {/* Camera & Satellite/Hybrid Controls */}
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <Button
          type="button"
          size="xs"
          variant={mapMode === MapMode.HYBRID ? "default" : "secondary"}
          onClick={() => setMapMode(MapMode.HYBRID)}
        >
          Hybrid (Шошготой)
        </Button>
        <Button
          type="button"
          size="xs"
          variant={mapMode === MapMode.SATELLITE ? "default" : "secondary"}
          onClick={() => setMapMode(MapMode.SATELLITE)}
        >
          Satellite (Цэвэр 3D)
        </Button>
        <Button
          type="button"
          size="xs"
          variant="secondary"
          onClick={() => {
            map3dRef.current?.flyCameraTo({
              endCamera: {
                center: { lat: 48.97, lng: 5.26, altitude: 1500 },
                range: 46000,
                tilt: 50,
                heading: 18,
              },
              durationMillis: 2200,
            });
          }}
          className="border-brass/40 text-brass hover:bg-brass/10 font-semibold"
        >
          <Route className="size-3 text-brass" />
          «Ариун зам» (57.2 км) артери харах
        </Button>
        <Button
          type="button"
          size="xs"
          variant="secondary"
          onClick={() => {
            if (!selected) return;
            map3dRef.current?.flyCameraAround({
              camera: {
                center: { lat: selected.lat, lng: selected.lng, altitude: 120 },
                range: 900,
                tilt: 66,
                heading: 0,
              },
              durationMillis: 12000,
              rounds: 1,
            });
          }}
        >
          <Orbit className="size-3" />
          Тойрон нисэх
        </Button>
      </div>
    </div>
  );
}

export function GoogleMap3DStage({
  locations,
  selectedId,
  onSelect,
}: GoogleMap3DStageProps) {
  const [sessionKey, setSessionKey] = useState("");
  const [inputKey, setInputKey] = useState("");

  const activeKey = ENV_API_KEY || sessionKey;

  if (!activeKey) {
    return (
      <Card className="flex h-[430px] flex-col justify-between border-brass/30 bg-background/70 p-2 sm:h-[490px]">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-brass/40 text-brass">
              Google Maps Platform · Photorealistic 3D
            </Badge>
            <Badge variant="secondary">Maps JavaScript API (maps3d)</Badge>
          </div>
          <CardTitle className="mt-1 font-display text-2xl">
            Google Maps 3D хиймэл дагуулын горим идэвхжүүлэх
          </CardTitle>
          <CardDescription>
            Бодит рельеф, Дуомоны бунхан, цайзуудын 3D загварыг харахын тулд{" "}
            <code className="text-brass">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> эсвэл
            үнэгүй туршилтын <strong>Maps Demo Key</strong> шаардлагатай.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <ol className="space-y-1.5 text-foreground/85">
            <li>
              1. Google-ийн үнэгүй{" "}
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brass underline underline-offset-2"
              >
                Maps Demo Key хуудас
                <ExternalLink className="size-3" />
              </a>{" "}
              руу орж (төлбөрийн карт шаардахгүй) туршилтын түлхүүр авна уу.
            </li>
            <li>
              2. Төслийн үндсэн хавтсанд{" "}
              <code className="rounded bg-card px-1.5 py-0.5 text-brass">
                .env.local
              </code>{" "}
              файл үүсгээд{" "}
              <code className="rounded bg-card px-1.5 py-0.5 text-brass">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
              </code>{" "}
              гэж хадгалах эсвэл доор шууд шалгаж үзнэ үү.
            </li>
          </ol>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputKey.trim()) setSessionKey(inputKey.trim());
            }}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/70 p-3"
          >
            <KeyRound className="size-4 shrink-0 text-brass" />
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Google Maps API Key (зөвхөн энэ хөтөчид түр ашиглах)"
              aria-label="Google Maps API Key"
              className="min-w-[220px] flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button type="submit" size="sm" disabled={!inputKey.trim()}>
              <Compass className="size-3.5" />
              3D нээх
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <APIProvider
      apiKey={activeKey}
      libraries={["maps3d", "marker"]}
      version="beta"
      language="mn"
      region="FR"
    >
      <VerdunGoogle3DViewport
        locations={locations}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </APIProvider>
  );
}
