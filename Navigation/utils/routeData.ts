// src/routeData.ts
export type LngLat = [number, number];
export type TripType = "arrival" | "departure";
import type { GroupedRouteLocations } from "./routeServices";

export type PlaceKey =
  | "current_location"
  | "hobart_airport"
  | "launceston_airport"
  | "st_helens"
  | "hobart"
  | "georgetown"
  | "keep"
  | "canals"
  | "my_home"
  | "yarravile_library"
  | "cafe"

export type StopKey = 
  |"mokosz";

export type LocationPoint = {
  id: string;
  name: string;
  coordinates: LngLat;
};

export type Place = LocationPoint & {
  id: PlaceKey;
};

export type Stop = LocationPoint & {
  id: StopKey;
};

export const STOPOPTIONS: Stop[] = [
  { id: "mokosz", name: "Coffee home", coordinates: [ 144.9823845861333,-37.88205142474443, ]},
]

export const PLACES: Place[] = [
  { id: "current_location", name: "Current Location", coordinates: [0,0]},
  { id: "hobart_airport", name: "Hobart Airport", coordinates: [144.96545039514692,-37.80975090094555]},
  { id: "launceston_airport", name: "Launceston Airport", coordinates: [147.205815, -41.545787] },
  { id: "st_helens", name: "St Helens", coordinates: [ 148.2487836530703,-41.320140455903335,] },
  { id: "georgetown", name: "George Town", coordinates: [ 146.82726207567794,-41.11376670099746,] },
  { id: "hobart", name: "Hobart", coordinates:[ 147.3289250945956,-42.88190403133573, ] },
  { id: "keep", name: "The Keep", coordinates: [148.04131898032878, -41.17826634239348]},
  { id: "my_home", name: "My home", coordinates: [144.8872877737715,-37.81946777589224 ]},
  { id: "yarravile_library", name: "Yarraville Library", coordinates: [ 144.87378665281878, -37.82046394706063, ]},
  { id: "cafe", name: "Wee Jeanie Cafe", coordinates: [  88.40114522476799 ,22.577717999223058]},

];

export const DEFAULT_ROUTE_NUMBER = 1;

export function getPlaceById(id: PlaceKey) {
  return PLACES.find((p) => p.id === id) ?? null;
}
export function getStopById(id: StopKey) {
  return STOPOPTIONS.find((s) => s.id === id) ?? null;
}

export function getLocationsForTrip(
  fromId: PlaceKey,
  toId: PlaceKey,
  stops: PlaceKey[],
  currentLocation?: LngLat | null
): GroupedRouteLocations | null {
  const from =  fromId === "current_location" && currentLocation
      ? {
          id: "current_location",
          name: "Current Location",
          coordinates: currentLocation,
        }:getPlaceById(fromId);
  const to = 
    toId === "current_location" && currentLocation
      ? {
          id: "current_location",
          name: "Current Location",
          coordinates: currentLocation,
        }
      : getPlaceById(toId);
  if (!from || !to) return null;
  const stopPlaces: Place[] = [];

  if (stops.length > 0) {
    for (let i = 0; i < stops.length; i++) {
      const stop = getPlaceById(stops[i]);

      if (stop) {
        stopPlaces.push(stop);
      }
    }
  }

  const returnGrouped: GroupedRouteLocations = [from, stopPlaces, to];

  return returnGrouped;
}

export const INITIAL_ZOOM = 13.12;


