"use client";

import Image from "next/image";
import type { ArchivalAsset } from "@/types/exhibition";
import { CloseIcon } from "./Icons";

interface LightboxModalProps {
  asset: ArchivalAsset | null;
  onClose: () => void;
}

export function LightboxModal({ asset, onClose }: LightboxModalProps) {
  if (!asset || !asset.localSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={asset.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="room-enter relative max-h-[92vh] w-full max-w-4xl overflow-auto rounded-xl border border-brass/35 bg-surface p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4 border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
              Архивын үзмэр · {asset.year} · {asset.license}
            </span>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              {asset.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Томруулалт хаах"
            className="rounded-full border border-white/15 p-1.5 text-muted hover:border-brass hover:text-foreground"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black">
          <Image
            src={asset.localSrc}
            alt={asset.title}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <p className="max-w-2xl leading-relaxed">{asset.caption}</p>
          <a
            href={asset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-brass hover:underline"
          >
            {asset.sourceName} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
