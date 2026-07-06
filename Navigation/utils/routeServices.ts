// src/routeServices.ts
import { Alert } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { MAPBOX_TOKEN, MAP_STYLE_URL, OFFLINE_PACK_NAME } from "../../mapboxConfig";
import { boundsFromLocations } from "./mapUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LngLat, LocationPoint } from "./routeData";
export type Step = {
  maneuver: { instruction: string; location: [number, number], type?:string, modifier?:string,  bearing_after: number,bearing_before: number};
  distance: number;
  duration: number;
  mode: string;
  name:string;
  bannerInstruction:{primary: string};
  ref:string,

};
export type CachedRouteData = {
  routeFeature: RouteFeature;
  routeCoords: LngLat[];
  tripMinutes: number;
  steps: Step[];
};
export type GroupedRouteLocations = [
  LocationPoint,
  LocationPoint[],
  LocationPoint
];
export type RouteFeature = GeoJSON.Feature<GeoJSON.LineString>;

/*helper to build waypoints for URL*/
function buildWaypoints(locs: { coordinates: [number, number] }[]): string {
  return locs.map((l) => `${l.coordinates[0]},${l.coordinates[1]}`).join(";");
}
//helper to flatten ROute
function flattenRouteLocations(locations: GroupedRouteLocations) {
  const [from, stops, to] = locations;
  return [from, ...stops, to];
}
//build URL
function buildDirectionsUrl(locs: { coordinates: [number, number] }[]): string {
  const waypoints = buildWaypoints(locs);
  console.log("waypoints: " ,waypoints)
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeURIComponent(
    waypoints
  )}?alternatives=true&annotations=distance%2Cduration&banner_instructions=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${MAPBOX_TOKEN}`
 }

/*call the API (in case of no cache)*/
export async function fetchDirectionsRoute(locations: GroupedRouteLocations): Promise<{
    routeFeature: RouteFeature;
    routeCoords: LngLat[];
    tripMinutes: number;
    steps: Step[];
}> {
  const url = buildDirectionsUrl(flattenRouteLocations(locations));
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

function getRouteKey(
  locations: GroupedRouteLocations,
  prefix: "routeCache" | "offlinePack"
) {
  const [from, stops, to] = locations;

  const flatLocations = [from, ...stops, to];

  const routeKey = flatLocations
    .map((location) => {
      const lng = location.coordinates[0].toFixed(4);
      const lat = location.coordinates[1].toFixed(4);

      return `${location.id}:${lng},${lat}`;
    })
    .join("-");

  return `${prefix}:${routeKey}`;
}
function getRouteCacheKey(locations: GroupedRouteLocations) {
    return getRouteKey(locations, "routeCache");

}
//save and load from cache
export async function saveRouteToCache(
  locations: GroupedRouteLocations,
  data: CachedRouteData
): Promise<void> {
  const key = getRouteCacheKey(locations);
  await AsyncStorage.setItem(key, JSON.stringify(data));
  console.log("Cache Key: ", key);
}

export async function loadRouteFromCache(
  locations: GroupedRouteLocations
): Promise<CachedRouteData | null> {
  const key = getRouteCacheKey(locations);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    console.log("Got route from cache,", JSON.parse(raw) as CachedRouteData);
    return JSON.parse(raw) as CachedRouteData;
  } catch (e) {
    console.log("failed to parse cached route:", e);
    return null;
  }
}

export function getOfflinePackName(locations: GroupedRouteLocations) {
  return getRouteKey(locations, "offlinePack");
}
//gets the route offline and saves tiles as offline pack
export async function downloadOfflineForLocations(
  locations: GroupedRouteLocations,
  packName: string
): Promise<void> {
  const bounds = boundsFromLocations(flattenRouteLocations(locations), 0.02);

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
