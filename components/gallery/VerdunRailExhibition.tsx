"use client";

import {
  BookOpen,
  Landmark,
  MapPin,
  Menu,
  TableProperties,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PictureRailGallery, {
  type PictureRailItem,
} from "@/components/ui/picture-rail-gallery";
import {
  CITATION_REFERENCES,
  CURATED_EXHIBITS,
  EXHIBITION_META,
} from "@/data/verdun";
import { VerdunAmbientPlayer } from "@/lib/ambientMusic";
import { AmbientMusicControl } from "./AmbientMusicControl";
import { SlideMapStage } from "./SlideMapStage";
import { StatisticsDossierTabs } from "./StatisticsDossier";

type ModalKind = "map" | "dossier" | "sources" | null;
type DossierTab = "stats" | "voie" | "villages" | "archives";

export function VerdunRailExhibition() {
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [dossierTab, setDossierTab] = useState<DossierTab>("stats");
  const [mapTargetId, setMapTargetId] = useState<string>("ossuaire-douaumont");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ambient D-minor memorial music
  const playerRef = useRef<VerdunAmbientPlayer | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.32);

  useEffect(() => {
    const player = new VerdunAmbientPlayer();
    playerRef.current = player;
    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, []);

  const toggleMusic = async () => {
    const player = playerRef.current;
    if (!player) return;
    if (player.isPlaying()) {
      player.stop();
      setMusicPlaying(false);
    } else {
      await player.start();
      player.setVolume(musicVolume);
      setMusicPlaying(true);
    }
  };

  const changeVolume = (val: number) => {
    setMusicVolume(val);
    playerRef.current?.setVolume(val);
  };

  const openMapForExhibit = (coordId?: string) => {
    if (coordId) {
      setMapTargetId(coordId);
    }
    setActiveModal("map");
  };

  const railItems: PictureRailItem[] = useMemo(() => {
    return CURATED_EXHIBITS.map((ex, i) => ({
      id: ex.id,
      title: ex.title,
      artist: ex.subtitle,
      year: ex.year,
      image: ex.image,
      aspect: ex.aspect,
      frame: i % 3 === 0 ? "black" : i % 3 === 1 ? "oak" : "white",
      mat: true,
      tag: ex.category,
      subtitle: ex.subtitle,
      category: ex.category,
      narrative: ex.narrative,
      memoir: ex.memoir,
      whatIsThis: ex.whatIsThis,
      fascinatingFacts: ex.fascinatingFacts,
      eyewitnessQuote: ex.eyewitnessQuote,
      mapCoordinateId: ex.mapCoordinateId,
      onOpenMap: (coordId: string) => {
        openMapForExhibit(coordId);
      },
    }));
  }, []);

  const openDossier = (tab: DossierTab = "stats") => {
    setDossierTab(tab);
    setActiveModal("dossier");
  };

  return (
    <div className="min-h-svh w-full bg-background text-foreground selection:bg-brass/30">
      {/* Modern Minimal Clean Museum Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brass/40 bg-card/80 text-brass shadow-sm">
              <Landmark className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-wider text-foreground sm:text-lg">
                ВЕРДУН 1916
              </span>
              <span className="-mt-1 text-[11px] tracking-wide text-muted-foreground">
                Цахим музей
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Minimal, No cluttered badges) */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => {
                setMapTargetId("ossuaire-douaumont");
                setActiveModal("map");
              }}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <MapPin className="size-4 text-brass" />
              <span>Газрын зураг</span>
            </button>

            <button
              type="button"
              onClick={() => openDossier("stats")}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <TableProperties className="size-4 text-brass" />
              <span>Тоо баримт</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("sources")}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <BookOpen className="size-4 text-brass" />
              <span>Эх сурвалж</span>
            </button>
          </nav>

          {/* Right Action: Sound Control & Mobile Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <AmbientMusicControl
                isPlaying={musicPlaying}
                volume={musicVolume}
                onTogglePlay={toggleMusic}
                onVolumeChange={changeVolume}
              />
            </div>

            {/* Mobile Sound Quick Toggle */}
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Ая унтраах" : "Ая асаах"}
              className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-card/80 text-foreground transition-colors hover:border-brass/50 md:hidden"
            >
              {musicPlaying ? (
                <Volume2 className="size-4 text-brass" />
              ) : (
                <VolumeX className="size-4 text-muted-foreground" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Цэс хаах" : "Цэс нээх"}
              className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-card/80 text-foreground transition-colors hover:border-brass/50 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="size-5 text-brass" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border/80 bg-background/95 backdrop-blur-2xl md:hidden">
            <div className="flex flex-col space-y-1 px-4 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setMapTargetId("ossuaire-douaumont");
                  setActiveModal("map");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-card hover:text-brass"
              >
                <MapPin className="size-4 text-brass" />
                <span>Газрын зураг (3D Maps)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openDossier("stats");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-card hover:text-brass"
              >
                <TableProperties className="size-4 text-brass" />
                <span>Тоо баримт</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModal("sources");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-card hover:text-brass"
              >
                <BookOpen className="size-4 text-brass" />
                <span>Эх сурвалж</span>
              </button>

              <div className="my-2 border-t border-border/50" />

              {/* Mobile Volume Control */}
              <div className="flex items-center justify-between rounded-lg bg-card/60 px-3 py-2.5">
                <button
                  type="button"
                  onClick={toggleMusic}
                  className="flex items-center gap-2.5 text-xs font-medium text-foreground"
                >
                  {musicPlaying ? (
                    <Volume2 className="size-4 text-brass" />
                  ) : (
                    <VolumeX className="size-4 text-muted-foreground" />
                  )}
                  <span>{musicPlaying ? "Ая явж байна" : "Ая асаах"}</span>
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={musicVolume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  aria-label="Аяны дууны хэмжээ"
                  className="h-1.5 w-24 cursor-pointer accent-brass"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Full-Screen Picture Rail Wall */}
      <main className="flex w-full flex-1 flex-col pb-4">
        <PictureRailGallery
          items={railItems}
          eyebrow="1916 · ДЭЛХИЙН I ДАЙН"
          heading={EXHIBITION_META.primaryTitle}
          autoplay={true}
          interval={3800}
          labels={{
            front: "Нүүр",
            back: "Ар тал",
            close: "Хаах",
            open: "Дэлгэрэнгүй үзэх",
          }}
        />
      </main>

      {/* Shadcn Dialog: 14 GPS Coordinates Map */}
      <Dialog
        open={activeModal === "map"}
        onOpenChange={(open) => setActiveModal(open ? "map" : null)}
      >
        <DialogContent className="max-h-[92svh] max-w-6xl overflow-y-auto border-border bg-card p-6 sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Вердуны тулалдааны 14 байршил (GPS)
            </DialogTitle>
            <DialogDescription>
              Цайз, бэхлэлт, сүйрсэн тосгод, дурсгалын газруудын түүхэн солбицол.
            </DialogDescription>
          </DialogHeader>
          <SlideMapStage key={mapTargetId} initialSelectedId={mapTargetId} />
        </DialogContent>
      </Dialog>

      {/* Shadcn Dialog: Comparative Statistics Dossier */}
      <Dialog
        open={activeModal === "dossier"}
        onOpenChange={(open) => setActiveModal(open ? "dossier" : null)}
      >
        <DialogContent className="max-h-[92svh] w-[calc(100vw-1.5rem)] max-w-5xl overflow-y-auto overflow-x-hidden border-border bg-card p-4 sm:p-6 sm:max-w-5xl">
          <DialogHeader className="pb-2 border-b border-border/60">
            <DialogTitle className="font-display text-2xl tracking-wide text-foreground">
              Вердуны гол тоо баримтууд
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              1916 оны түүхэн тулалдааны хүчний харьцаа, зэвсэглэл, хохирол ба ложистикийн гол хэмжүүрүүд.
            </DialogDescription>
          </DialogHeader>
          <StatisticsDossierTabs key={dossierTab} defaultTab={dossierTab} />
        </DialogContent>
      </Dialog>

      {/* Shadcn Dialog: Citations */}
      <Dialog
        open={activeModal === "sources"}
        onOpenChange={(open) => setActiveModal(open ? "sources" : null)}
      >
        <DialogContent className="max-h-[85svh] max-w-3xl overflow-y-auto border-border bg-card p-6 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Эрдэм шинжилгээний эх сурвалж ({CITATION_REFERENCES.length})
            </DialogTitle>
            <DialogDescription>
              Судалгаанд ашигласан түүхэн баримт, музейн архив ба академик бүтээлүүд.
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            {CITATION_REFERENCES.map((c) => (
              <li key={c.id} className="border-b border-border/60 pb-2">
                <span className="mr-2 font-mono text-brass">[{c.id}]</span>
                <span className="text-foreground/90">{c.title}</span>
                {c.url && (
                  <>
                    {" — "}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brass underline-offset-2 hover:underline"
                    >
                      {c.url}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  );
}
