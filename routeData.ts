// src/routeData.ts
export type LngLat = [number, number];

export type LocationStop = {
  id: string;
  coordinates: LngLat;
  name: string;
};

export const routeOptions:Record<number, LocationStop[] >= {
  0 :[
    { id: "0", coordinates: [147.3271949, -42.8821377], name: "Hobart" },
    { id: "1", coordinates: [148.04131898032878, -41.17826634239348], name: "The Keep" },
  ],
  1:[
    { id: "0", coordinates: [147.205815, -41.545787], name: "Launceston Airport" },
    { id: "1", coordinates: [148.04131898032878, -41.17826634239348], name: "The Keep" },
  ],
  2:[
    {id:"0", coordinates: [ 145.00663523777544,-37.859916101993214] , name: "Home"},
    {id:"1", coordinates: [144.98314782900465,-37.88191715097658] , name: "Mokosz"}
  ]
 
};  


export const DEFAULT_ROUTE_NUMBER = 1;

export function getLocationsForRoute(routeNumber: number): LocationStop[] {
  return routeOptions[routeNumber] ?? routeOptions[DEFAULT_ROUTE_NUMBER];
}

export const INITIAL_ZOOM = 13.12;
