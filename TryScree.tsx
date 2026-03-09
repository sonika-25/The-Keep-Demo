import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { Feature, LineString } from "geojson";

import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  UserLocation,
} from "@rnmapbox/maps";

Mapbox.setAccessToken("YOUR_MAPBOX_TOKEN");

const START: [number, number] = [144.98234884657907, -37.882088063265165];
const END: [number, number] = [144.99805066544096, -37.910395647987016];

export default function TryScreen() {
const [route, setRoute] = useState<Feature<LineString> | null>(null);

useEffect(() => {
  const fetchRoute = async () => {
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${START[0]},${START[1]};${END[0]},${END[1]}` +
      `?geometries=geojson&access_token=YOUR_MAPBOX_TOKEN`;

    const res = await fetch(url);
    const json = await res.json();

    const geom = json?.routes?.[0]?.geometry;
    if (geom?.type === "LineString" && Array.isArray(geom.coordinates)) {
      setRoute({
        type: "Feature",
        properties: {},
        geometry: geom as LineString,
      });
    }
  };

  fetchRoute();
}, []);
  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          zoomLevel={13}
          centerCoordinate={START}
        />

        <UserLocation visible={true} />

        {route && (
        <ShapeSource id="routeSource" shape={route}>
            <LineLayer
            id="routeLine"
            style={{
                lineColor: "#007AFF",
                lineWidth: 5,
            }}
            />
        </ShapeSource>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});