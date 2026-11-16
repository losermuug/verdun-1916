"use client";

import {
  HeartHandshake,
  Home,
  Shield,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VERDUN_CONCLUSIONS } from "@/data/verdun";

const QUESTION_ICONS: Record<string, LucideIcon> = {
  "war-role": Shield,
  "battles-events": Swords,
  "civilian-suffering": Home,
  "modern-lessons": HeartHandshake,
};

interface ExhibitionConclusionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExhibitionConclusionDialog({
  open,
  onOpenChange,
}: ExhibitionConclusionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] w-[calc(100vw-1.5rem)] max-w-4xl overflow-y-auto border-border bg-card p-4 sm:p-7 sm:max-w-4xl">
        <DialogHeader className="border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-brass/40 text-brass text-xs">
              Түүхийн судалгаа
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              Вердун 1916 · 4 гол асуулт
            </span>
          </div>
          <DialogTitle className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Дүгнэлт
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Вердуны дайнд гүйцэтгэсэн үүрэг, тулалдааны явц, энгийн иргэдийн зовлон ба орчин үеийн энх тайвны үнэ цэнэ.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4 sm:gap-5">
          {VERDUN_CONCLUSIONS.map((item) => {
            const Icon = QUESTION_ICONS[item.id] ?? Shield;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border/75 bg-card/70 p-4 sm:p-5 shadow-xs transition-colors hover:border-brass/45 hover:bg-card space-y-3"
              >
                {/* Header with Number and Category Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-brass/15 text-brass font-mono text-xs font-bold border border-brass/30">
                      {item.number}
                    </span>
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {item.badge}
                    </Badge>
                  </div>
                  <div className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-brass/80">
                    <Icon className="size-3.5" />
                  </div>
                </div>

                {/* The Question */}
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                  {item.question}
                </h3>

                {/* Concise Continuous Prose Answer */}
                <p className="text-xs sm:text-[13.5px] leading-relaxed text-foreground/90 text-pretty">
                  {item.answer}
                </p>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
