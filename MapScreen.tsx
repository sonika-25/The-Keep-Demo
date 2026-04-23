// src/MapScreen.tsx
import React, { useEffect, useState,useRef } from "react";
import { StatusBar, StyleSheet, View, Text, Pressable, TouchableOpacity, Image} from "react-native";
import Mapbox, { Camera, MapView, UserLocation, PointAnnotation, ShapeSource, LineLayer } from "@rnmapbox/maps";
import { lineString, point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import lineSliceAlong from "@turf/line-slice-along";
import length from "@turf/length";
import { getLocationsForTrip, INITIAL_ZOOM, type LngLat } from "./routeData";
import { distanceMeters, toLineFeature } from "./mapUtils";
import { MAP_STYLE_URL  , MAPBOX_TOKEN} from "./mapboxConfig";
import { downloadOfflineForLocations, fetchDirectionsRoute,loadRouteFromCache,saveRouteToCache, type RouteFeature, type Step } from "./routeServices";
import NewSteps from "./NewSteps";
Mapbox.setAccessToken( MAPBOX_TOKEN)
import along from "@turf/along";

export default function MapScreen({ route }: any) {
  const fromId = route?.params?.fromId;
  const toId = route?.params?.toId;

  const locations = getLocationsForTrip(fromId, toId);
  const routeNumber = route?.params?.routeNumber ?? 1;
  //const tripType = route?.params?.tripType ?? "arrival";
  //const locations = getLocationsForRoute(routeNumber, tripType);
  // offlinePackName = `offline-pack:${tripType}:${routeNumber}`;
  console.log(route.params.routeNumber)
  const INITIAL_CENTER = locations[0].coordinates;
  console.log("INTIAL CENTER: ",INITIAL_CENTER)
  const [routeFeature, setRouteFeature] = useState<RouteFeature | null>(null);
  const [routeCoords, setRouteCoords] = useState<LngLat[]>([]);
  const [tripMinutes, setTripMinutes] = useState<number | null>(null);
  const [simulate, setSimulate] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [offlineStarted, setOfflineStarted] = useState(false);
  const [userCoord, setUserCoord] = useState<LngLat | null>(null);
  const [coveredFeature, setCoveredFeature] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [remainingFeature, setRemainingFeature] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null); 
  const cameraRef = useRef<Camera>(null);
  const [followUser, setFollowUser] = useState(true);
  // Fetch route from cache or API
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cacheKeyFrom = fromId;
        const cacheKeyTo = toId;

        const cached = await loadRouteFromCache(cacheKeyFrom, cacheKeyTo);

        let routeData = cached;
        if (!routeData) {
          routeData = await fetchDirectionsRoute(locations);
          await saveRouteToCache(cacheKeyFrom, cacheKeyTo, routeData);
        }
        

        if (cancelled || !routeData) return;

        setRouteFeature(routeData.routeFeature);
        setRouteCoords(routeData.routeCoords);
        setTripMinutes(routeData.tripMinutes);
        setSteps(routeData.steps);

        const packName = `offlinePack:${fromId}:${toId}`;
        downloadOfflineForLocations(locations, packName).catch((e) =>
          console.log("offline pack download failed:", e)
        );
      } catch (e) {
        console.log("route fetch failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [toId, fromId]);

//Testing simuator
useEffect(() => {
  if (!simulate) return;
  if (routeCoords.length < 2) return;

  const routeLine = lineString(routeCoords);
  const totalKm = length(routeLine, { units: "kilometers" });

  let progressKm = 0;

  const interval = setInterval(() => {
    progressKm += 0.02;

    if (progressKm >= totalKm) {
      clearInterval(interval);
      return;
    }

    const pt = along(routeLine, progressKm, { units: "kilometers" });
    const coord = pt.geometry.coordinates as LngLat;

    setUserCoord(coord);
  }, 1000);

  return () => clearInterval(interval);
}, [simulate, routeCoords]);


// Split route into covered vs remaining using distance along polyline
  useEffect(() => {
    if (!userCoord) return;
    if (routeCoords.length < 2) return;

    const routeLine = lineString(routeCoords);
    const here = point(userCoord);

    const snapped = nearestPointOnLine(routeLine, here, { units: "kilometers" });
    const snappedCoord = snapped.geometry.coordinates as LngLat;

    const traveledKm = Number((snapped.properties as any)?.location ?? 0);
    const totalKm = length(routeLine, { units: "kilometers" });

    const safeTraveledKm = Math.max(0, Math.min(traveledKm, totalKm));

    const covered =
      safeTraveledKm <= 0
        ? toLineFeature([routeCoords[0], snappedCoord])
        : (lineSliceAlong(routeLine, 0, safeTraveledKm, {
            units: "kilometers",
          }) as GeoJSON.Feature<GeoJSON.LineString>);

    const remaining =
      safeTraveledKm >= totalKm
        ? toLineFeature([snappedCoord, routeCoords[routeCoords.length - 1]])
        : (lineSliceAlong(routeLine, safeTraveledKm, totalKm, {
            units: "kilometers",
          }) as GeoJSON.Feature<GeoJSON.LineString>);

    setCoveredFeature(covered);
    setRemainingFeature(remaining);
  }, [userCoord, routeCoords]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />

      
      <Pressable onPress={() => setSimulate(true)} style={styles.downloadBtn}>
        <Text style={styles.downloadBtnText}>Simulate</Text>
      </Pressable>
      <Pressable
          style={styles.recenterBtn}
          onPress={() => {
            console.log("WO")
            if (!userCoord) return;
              setFollowUser(true);
            }}
        >
          <Text style={styles.recenterText}>⦾ </Text>
        </Pressable>
      <MapView
        style={styles.map}
        styleURL={MAP_STYLE_URL}
        zoomEnabled
        rotateEnabled
        pitchEnabled
        logoEnabled
        compassEnabled
        scaleBarEnabled={false}
        onTouchStart={() => setFollowUser(false)}
      >
      
        

        {coveredFeature && (
          <Mapbox.ShapeSource id="covered-src" shape={coveredFeature}>
            <Mapbox.LineLayer
              id="covered-line"
              style={{
                lineWidth: 6,
                lineJoin: "round",
                lineCap: "round",
                lineOpacity: 0.9,
                lineColor: "#9E9E9E",
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {remainingFeature && (
          <Mapbox.ShapeSource id="remaining-src" shape={remainingFeature}>
            <Mapbox.LineLayer
              id="remaining-line"
              style={{
                lineWidth: 6,
                lineJoin: "round",
                lineCap: "round",
                lineOpacity: 0.95,
                lineColor: "#007AFF",
              }}
            />
          </Mapbox.ShapeSource>
        )}

        <Mapbox.Camera ref={cameraRef} followUserLocation={followUser} followZoomLevel={14} />

        <UserLocation
          visible = {true}
          animated={false}
          androidRenderMode={"gps"}
          showsUserHeadingIndicator
          requestsAlwaysUse
          onUpdate={(loc) => {
            const { longitude, latitude } = loc.coords;
            setUserCoord([longitude, latitude]);
          }}
        />
        
        {locations.map((m) => (
          <PointAnnotation id={m.id} coordinate={m.coordinates} key={m.name}>
            <View style={styles.marker} />
          </PointAnnotation>
        ))}
      </MapView>

    {(tripMinutes !== null || steps.length > 0) && (
      <NewSteps steps={steps} userCoord={userCoord} routeCoords={routeCoords} />    )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#187610",
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  directionsBox: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(2, 53, 6, 0.95)",
  },
  directionsTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#ffffff" },
  directionsItem: { fontSize: 14, marginBottom: 4, color: "#ffffff" },
  downloadBtn: {
    position: "absolute",
    top: 60,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(30,30,30,0.7)",
    zIndex: 9999,
    elevation: 10,
  },
  downloadBtnText: {  color: "black", fontWeight: "600" },
  recenterBtn: {
    position: "absolute",
    bottom: 155,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: "rgb(23, 131, 66)",
    alignItems: "center",
    elevation:15,
    zIndex:9999,
    justifyContent: "center",
  },
  recenterText: {
    fontSize:35,
    textAlign:"right",
    bottom:4,
    left:5,
    color:"white"
  },
});
