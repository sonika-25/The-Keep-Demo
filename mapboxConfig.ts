// src/mapboxConfig.ts
import Mapbox from "@rnmapbox/maps";

export const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic29uaWthMjUiLCJhIjoiY21sNmVzNWFyMGU0bjNtcHJobjFxbXdtaiJ9.cFN9TpWXt3rrmQR46xPIJw";

export const MAP_STYLE_URL = "mapbox://styles/mapbox/navigation-day-v1";
export const OFFLINE_PACK_NAME = "new-pack";

export function initMapbox() {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
}
