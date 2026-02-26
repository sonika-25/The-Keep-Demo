// src/routeData.ts
export type LngLat = [number, number];

export type LocationStop = {
  id: string;
  coordinates: LngLat;
  name: string;
};

export const locations: LocationStop[] = [
  { id: "0", coordinates: [ 145.006657,-37.860069,], name: "Home" },
  { id: "1", coordinates: [144.99805066544096, -37.910395647987016], name: "Brighton Library" },
  //{ id: "1", coordinates: [ 145.000544,-37.905329], name: "po1" },
  //{ id: "2", coordinates: [ 144.98862329838852,-37.90263624309351], name: "po2" },
  //{ id: "3", coordinates: [ 144.99049283109755,-37.887118730566584], name: "po3" },
  //{ id: "5", coordinates: [144.98234884657907, -37.882088063265165], name: "Mokosz" },
];

export const INITIAL_CENTER: LngLat = locations[0].coordinates;
export const INITIAL_ZOOM = 13.12;

export const legEndCoords: LngLat[] = locations.slice(1).map((l) => l.coordinates);
