export function formatSecondsToMMSS(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatPanelAnchor(panelNumber: number): string {
  return `panel-${panelNumber}`;
}
