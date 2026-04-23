// src/routeData.ts
export type LngLat = [number, number];
export type TripType = "arrival" | "departure";

export type PlaceKey =
  | "hobart_airport"
  | "launceston_airport"
  | "st_helens"
  | "hobart"
  | "georgetown"
  | "mokosz"
  | "bladehome"
  | "keep"
  | "home"
  | "brighton";

export type Place = {
  id: PlaceKey;
  name: string;
  coordinates: LngLat;
};

export const PLACES: Place[] = [
  { id: "hobart_airport", name: "Hobart Airport", coordinates: [147.3271949, -42.8821377]},
  { id: "launceston_airport", name: "Launceston Airport", coordinates: [147.205815, -41.545787] },
  { id: "st_helens", name: "St Helens", coordinates: [ 148.2487836530703,-41.320140455903335,] },
  { id: "georgetown", name: "George Town", coordinates: [ 146.82726207567794,-41.11376670099746,] },
  { id: "hobart", name: "Hobart", coordinates:[ 147.3289250945956,-42.88190403133573, ] },
  { id: "keep", name: "The Keep", coordinates: [148.04131898032878, -41.17826634239348]},
  { id: "bladehome", name: "Joshua home", coordinates: [ 144.97984009515184,-37.87946017690272]},
  { id: "mokosz", name: "Coffee home", coordinates: [ 144.9823845861333,-37.88205142474443, ]},
  { id: "home", name: "My home", coordinates: [145.00661377980842 ,-37.860077042500265, ]},
  { id: "brighton", name: "Books home", coordinates: [ 144.99793743748293,-37.91066963085596 ]},
  
];
export type LocationStop = {
  id: string;
  coordinates: LngLat;
  name: string;
};

/*export const routeOptions:Record<number, LocationStop[] >= {
  0 :[
    { id: "0", coordinates: , name: "Hobart" },
    {id: "1", coordinates: [148.04131898032878, -41.17826634239348], name: "The Keep" },

    
  ],
  1:[
    { id: "0", coordinates: [147.205815, -41.545787], name: "Launceston Airport" },
    { id: "1", coordinates: [148.04131898032878, -41.17826634239348], name: "The Keep" },
    
  ],
  2: [
    { id: "0", coordinates: [ 148.2487836530703,-41.320140455903335,], name: "St Helen's" },
    { id: "1", coordinates: [ 147.3289250945956,-42.88190403133573, ], name: "Hobart" },
  ]
 
};  
*/

export const DEFAULT_ROUTE_NUMBER = 1;
export function getPlaceById(id: PlaceKey) {
  return PLACES.find((p) => p.id === id) ?? null;
}

export function getLocationsForTrip(fromId: PlaceKey, toId: PlaceKey) {
  const from = getPlaceById(fromId);
  const to = getPlaceById(toId);

  if (!from || !to) return [];

  return [from, to];
}
//returns coordinates depending on arrival or departure
/*export function getLocationsForRoute(routeNumber: number,tripType: TripType): LocationStop[] {
  const selected = routeOptions[routeNumber] ?? routeOptions[DEFAULT_ROUTE_NUMBER]
   if (tripType === "departure") {
    return selected.reverse();
  }

  return selected;
}*/


export const INITIAL_ZOOM = 13.12;
