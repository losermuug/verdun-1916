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

export type VillageStatusType =
  | "uninhabited"
  | "partially_rebuilt"
  | "rebuilt";

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

export interface PrimaryQuote {
  id: string;
  author: string;
  role: string;
  date: string;
  quote: string;
  originalPhrase?: string;
  sourceRef: number;
}

export interface ArchivalAsset {
  id: string;
  panelIds: PanelId[];
  title: string;
  year: string;
  creator: string;
  license: string;
  sourceName: string;
  sourceUrl: string;
  localSrc?: string;
  width?: number;
  height?: number;
  caption: string;
  embedAllowed: boolean;
  legalNote?: string;
  sourceRef?: number;
}

export interface ExhibitionPanel {
  id: PanelId;
  number: 1 | 2 | 3 | 4 | 5;
  romanNumeral: "I" | "II" | "III" | "IV" | "V";
  navLabel: string;
  pdfTopic: string;
  title: string;
  subtitle: string;
  shortSummary: string;
  historicalSections: {
    heading: string;
    paragraphs: string[];
  }[];
  quotes: PrimaryQuote[];
  keyLocationIds: string[];
  interactiveKind:
    | "voie-sacree"
    | "timeline"
    | "zone-rouge"
    | "memorials"
    | "reconciliation";
  footnoteRefs: number[];
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

export interface TimelineEvent {
  id: string;
  dateRange: string;
  monthIndex: number;
  phase: "assault" | "attrition" | "crisis" | "relief" | "counteroffensive";
  phaseLabel: string;
  title: string;
  significance: string;
  locationId?: string;
  sourceRef: number;
}

export interface DestroyedVillage {
  id: string;
  nameMn: string;
  nameFr: string;
  population1911: number | null;
  populationNote?: string;
  occupiedRange: string;
  currentStatus: string;
  statusType: VillageStatusType;
  memorialNote?: string;
  sourceRefs: number[];
}

export interface ComparativeStatistic {
  id: string;
  metric: string;
  museumFigure: string;
  historianFigure: string;
  methodology: string;
  sourceRefs: number[];
}

export interface VoieSacreeMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  category: "fleet" | "volume" | "speed" | "citadel";
}

export interface AudioGuideSegment {
  id: string;
  panelId: PanelId | "intro";
  timeRange: string;
  startSec: number;
  endSec: number;
  title: string;
  script: string;
  sourceRef: number;
}

export interface CitationReference {
  id: number;
  title: string;
  url: string | null;
}
