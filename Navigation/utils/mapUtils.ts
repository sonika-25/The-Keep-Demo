// src/mapUtils.ts
import type { LngLat } from "./routeData";

export function boundsFromLocations(
  locs: { coordinates: LngLat }[],
  padDegrees = 0.02
): [[number, number], [number, number]] {
  const lngs = locs.map((l) => l.coordinates[0]);
  const lats = locs.map((l) => l.coordinates[1]);

  const minLng = Math.min(...lngs) - padDegrees;
  const maxLng = Math.max(...lngs) + padDegrees;
  const minLat = Math.min(...lats) - padDegrees;
  const maxLat = Math.max(...lats) + padDegrees;

  // Mapbox Offline expects: [NE], [SW]
  return [[maxLng, maxLat], [minLng, minLat]];
}

export function distanceMeters(a: LngLat, b: LngLat): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const [lng1, lat1] = a;
  const [lng2, lat2] = b;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);

  const aa =
    s1 * s1 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;

  return 2 * R * Math.asin(Math.sqrt(aa));
}

export function toLineFeature(coords: LngLat[]): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates: coords },
  };
}


//anchor next step to closest last point (store a map of starting points of each leg and restore to that point based off user location)
//change turning logic //
//put a marker following GPS 
//Improve UI


//next steps: 
//- add destinations
//- add hidden points to keep the route but don't display the end message
