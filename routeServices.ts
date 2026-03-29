// src/routeServices.ts
import { Alert } from "react-native";
import Mapbox from "@rnmapbox/maps";
import type { LngLat } from "./routeData";
import { MAPBOX_TOKEN, MAP_STYLE_URL, OFFLINE_PACK_NAME } from "./mapboxConfig";
import { boundsFromLocations } from "./mapUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Step = {
  maneuver: { instruction: string; location: [number, number], type?:string, modifier?:string};
  distance: number;
  duration: number;
  mode: string;
  name:string;
  bannerInstruction:{primary: string};
};
export type CachedRouteData = {
  routeFeature: RouteFeature;
  routeCoords: LngLat[];
  tripMinutes: number;
  steps: Step[];
};
export type RouteFeature = GeoJSON.Feature<GeoJSON.LineString>;

/*helper to build waypoints for URL*/
function buildWaypoints(locs: { coordinates: [number, number] }[]): string {
  return locs.map((l) => `${l.coordinates[0]},${l.coordinates[1]}`).join(";");
}

//build URL
function buildDirectionsUrl(locs: { coordinates: [number, number] }[]): string {
  const waypoints = buildWaypoints(locs);
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(
    waypoints
  )}?alternatives=true&annotations=distance%2Cduration&banner_instructions=true&geometries=geojson&language=en&overview=full&roundabout_exits=true&steps=true&access_token=${MAPBOX_TOKEN}`
 }

/*call the API (in case of no cache)*/
export async function fetchDirectionsRoute(locations: { coordinates: LngLat }[]): Promise<{
  routeFeature: RouteFeature;
  routeCoords: LngLat[];
  tripMinutes: number;
  steps: Step[];
}> {
  const url = buildDirectionsUrl(locations);
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    console.log(text)
    throw new Error(`Directions API failed: ${res.status} ${text}`);
  }
  
  const data = await res.json();
  console.log(data)
  const route0 = data.routes[0];

  const coords = route0?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) {
    throw new Error("No route geometry returned from Mapbox.");
  }

  const feature: RouteFeature = {
    type: "Feature",
    properties: { source: "mapbox-directions" },
    geometry: { type: "LineString", coordinates: coords },
  };

  const steps: Step[] = (route0.legs ?? []).flatMap((leg: any) => leg.steps ?? []);
  const tripMinutes = Math.round(route0.duration / 60);

  return { routeFeature: feature, routeCoords: coords, tripMinutes, steps };
}

/*HELPERS*/
function getRouteCacheKey(routeNumber: number, tripType: string) {
  return `route-cache:${tripType}:${routeNumber}`;
}

//save to cache
export async function saveRouteToCache(
  routeNumber: number,
  tripType: string,
  data: CachedRouteData
): Promise<void> {
  const key = getRouteCacheKey(routeNumber, tripType);
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

//load from cache if exists 
export async function loadRouteFromCache(
  routeNumber: number,
  tripType: string
): Promise<CachedRouteData | null> {
  const key = getRouteCacheKey(routeNumber, tripType);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CachedRouteData;
  } catch (e) {
    console.log("failed to parse cached route:", e);
    return null;
  }
}

//download tiles styles etc
export async function downloadOfflineForLocations(
  locations: { coordinates: LngLat }[],
  packName: string
): Promise<void> {
  const bounds = boundsFromLocations(locations, 0.02);

  const packs = await Mapbox.offlineManager.getPacks();
  const alreadyExists = (packs ?? []).some((p: any) => p?.name === packName);
  if (alreadyExists) {
    return;
  }

  const onProgress = (status: any) => console.log("offline progress:", status);
  const onError = (err: any) => {
    console.log("offline error:", err);
  };

  await Mapbox.offlineManager.createPack(
    {
      name: packName,
      styleURL: MAP_STYLE_URL,
      bounds,
      minZoom: 11,
      maxZoom: 16,
    },
    onProgress,
    onError
  );

}
