// src/routeData.ts
export type LngLat = [number, number];
export type TripType = "arrival" | "departure";

export type LocationStop = {
  id: string;
  coordinates: LngLat;
  name: string;
};

export const routeOptions:Record<number, LocationStop[] >= {
  0 :[
    //{ id: "0", coordinates: [147.3271949, -42.8821377], name: "Hobart" },
    // id: "1", coordinates: [148.04131898032878, -41.17826634239348], name: "The Keep" },

    { id: "0", coordinates: [144.99799108195631,-37.910610377749386, ], name: "Hobart" },
    { id: "1", coordinates: [ 144.98310532613206,-37.88236736801096,], name: "The Keep" },
  ],
  1:[
    //{ id: "0", coordinates: [147.205815, -41.545787], name: "Launceston Airport" },
    //{ id: "1", coordinates: [148.04131898032878, -41.17826634239348], name: "The Keep" },
    { id: "0", coordinates: [144.99799108195631,-37.910610377749386, ], name: "Launceston Airport" },
    { id: "1", coordinates: [  145.006667424282,-37.859966925349376,], name: "The Keep" },
  ],
 
};  


export const DEFAULT_ROUTE_NUMBER = 1;

//returns coordinates depending on arrival or departure
export function getLocationsForRoute(routeNumber: number,tripType: TripType): LocationStop[] {
  const selected = routeOptions[routeNumber] ?? routeOptions[DEFAULT_ROUTE_NUMBER]
   if (tripType === "departure") {
    return selected.reverse();
  }

  return selected;
}


export const INITIAL_ZOOM = 13.12;
