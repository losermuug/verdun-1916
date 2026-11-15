"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AmbientMusicControlProps {
  isPlaying: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (val: number) => void;
}

export function AmbientMusicControl({
  isPlaying,
  volume,
  onTogglePlay,
  onVolumeChange,
}: AmbientMusicControlProps) {
  return (
    <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-border/70 bg-card/85 px-3 backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Ая зогсоох" : "Намуухан дурсгалын ая асаах"}
        className={`h-7 px-2 text-xs font-medium transition-colors ${
          isPlaying
            ? "text-brass hover:text-brass/80"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {isPlaying ? (
          <Volume2 className="size-4 text-brass" />
        ) : (
          <VolumeX className="size-4" />
        )}
        <span className="hidden md:inline">
          {isPlaying ? "Ая явж байна" : "Ая асаах"}
        </span>
      </Button>

      <div className="flex items-center gap-1.5 border-l border-border/50 pl-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Аяны дууны хэмжээ"
          className="h-1.5 w-16 cursor-pointer accent-brass sm:w-20"
        />
      </div>
    </div>
  );
}
