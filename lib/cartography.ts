/**
 * Pure cartographic projection and formatting utilities for the Verdun sector.
 * Bounds are calibrated around the 14 verified GPS coordinates (49.15°N–49.30°N, 5.25°E–5.54°E).
 */

export const VERDUN_MAP_BOUNDS = {
  minLat: 49.142,
  maxLat: 49.312,
  minLng: 5.23,
  maxLng: 5.565,
  centerLat: 49.215,
  centerLng: 5.405,
} as const;

export const SVG_VIEWBOX = {
  width: 1000,
  height: 760,
  padX: 60,
  padY: 50,
} as const;

/**
 * Equirectangular projection with cosine latitude correction at 49.2°N
 * so north-south vs east-west aspect ratio matches real geography.
 */
export function projectVerdunCoord(lat: number, lng: number): {
  x: number;
  y: number;
} {
  const cosLat = Math.cos((VERDUN_MAP_BOUNDS.centerLat * Math.PI) / 180);
  const lngSpan =
    (VERDUN_MAP_BOUNDS.maxLng - VERDUN_MAP_BOUNDS.minLng) * cosLat;
  const latSpan = VERDUN_MAP_BOUNDS.maxLat - VERDUN_MAP_BOUNDS.minLat;

  const usableW = SVG_VIEWBOX.width - SVG_VIEWBOX.padX * 2;
  const usableH = SVG_VIEWBOX.height - SVG_VIEWBOX.padY * 2;

  // Keep uniform geographic scale inside the SVG canvas
  const scale = Math.min(usableW / lngSpan, usableH / latSpan);
  const renderedW = lngSpan * scale;
  const renderedH = latSpan * scale;
  const offsetX = (SVG_VIEWBOX.width - renderedW) / 2;
  const offsetY = (SVG_VIEWBOX.height - renderedH) / 2;

  const x = offsetX + (lng - VERDUN_MAP_BOUNDS.minLng) * cosLat * scale;
  const y = offsetY + (VERDUN_MAP_BOUNDS.maxLat - lat) * scale;

  return {
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
  };
}

export function formatCoordPair(lat: number, lng: number): string {
  return `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`;
}

export function googleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat.toFixed(5)},${lng.toFixed(5)}`;
}

export function openStreetMapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(5)}&mlon=${lng.toFixed(5)}#map=14/${lat.toFixed(5)}/${lng.toFixed(5)}`;
}
