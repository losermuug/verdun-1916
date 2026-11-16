export type PanelId = "panel-1" | "panel-2" | "panel-3" | "panel-4" | "panel-5";

export type LocationCategory =
  | "fort"
  | "battlefield"
  | "village"
  | "memorial"
  | "cemetery"
  | "peace"
  | "zone_rouge"
  | "logistics";

export interface ExhibitionMeta {
  primaryTitle: string;
  subtitleVariants: string[];
  timeframeLabel: string;
  exactDays: number;
  traditionalDaysLabel: string;
  startDate: string;
  endDate: string;
  historiographicalNotes: {
    id: string;
    title: string;
    summary: string;
    sourceRefs: number[];
  }[];
}

export interface MapCoordinate {
  id: string;
  name: string;
  frenchName?: string;
  panelIds: PanelId[];
  lat: number;
  lng: number;
  category: LocationCategory;
  description: string;
  unesco2023?: boolean;
  highlightMetric?: string;
  sourceRef: number;
}

export interface CitationReference {
  id: number;
  title: string;
  url: string | null;
}
