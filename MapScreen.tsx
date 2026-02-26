// src/MapScreen.tsx
import React, { useEffect, useState,useRef } from "react";
import { StatusBar, StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native";
import Mapbox, { Camera, MapView, UserLocation, PointAnnotation, ShapeSource, LineLayer } from "@rnmapbox/maps";
import { lineString, point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import StepDirectionsBox from "./StepDirectionsBox";
import { locations, INITIAL_CENTER, INITIAL_ZOOM, type LngLat } from "./routeData";
import { distanceMeters, toLineFeature } from "./mapUtils";
import { MAP_STYLE_URL  , MAPBOX_TOKEN} from "./mapboxConfig";
import { downloadOfflineForLocations, fetchDirectionsRoute, type RouteFeature, type Step } from "./routeServices";
Mapbox.setAccessToken( MAPBOX_TOKEN)
const STEP_ARRIVE_M = 70;

export default function MapScreen() {
  const [routeFeature, setRouteFeature] = useState<RouteFeature | null>(null);
  const [routeCoords, setRouteCoords] = useState<LngLat[]>([]);
  const [tripMinutes, setTripMinutes] = useState<number | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(0);

  const [userCoord, setUserCoord] = useState<LngLat | null>(null);
  const [coveredFeature, setCoveredFeature] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [remainingFeature, setRemainingFeature] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null); 
  const cameraRef = useRef<Camera>(null);

  // Fetch route once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const out = await fetchDirectionsRoute(locations);
        if (cancelled) return;
        setRouteFeature(out.routeFeature);
        setRouteCoords(out.routeCoords);
        setTripMinutes(out.tripMinutes);
        setSteps(out.steps);
        setStepIdx(0);
      } catch (e) {
        console.log("route fetch failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Split route into covered vs remaining
  useEffect(() => {
    if (!userCoord) return;
    if (routeCoords.length < 2) return;

    const routeLine = lineString(routeCoords);
    const here = point(userCoord);

    const snapped = nearestPointOnLine(routeLine, here, { units: "kilometers" });
    const snappedCoord = snapped.geometry.coordinates as LngLat;

    const segIdx = Number((snapped.properties as any)?.index ?? 0);
    const safeIdx = Math.max(0, Math.min(segIdx, routeCoords.length - 2));

    const coveredCoords: LngLat[] = [...routeCoords.slice(0, safeIdx + 1), snappedCoord];
    const remainingCoords: LngLat[] = [snappedCoord, ...routeCoords.slice(safeIdx + 1)];

    setCoveredFeature(toLineFeature(coveredCoords));
    setRemainingFeature(toLineFeature(remainingCoords));
  }, [userCoord, routeCoords]);

  // Advance steps as user reaches maneuver points
  useEffect(() => {
    if (!userCoord) return;
    if (steps.length === 0) return;

    setStepIdx((i) => {
      if (i >= steps.length - 1) return i;

      const target = steps[i].maneuver.location as LngLat;
      //console.log(steps[i])
      const d = distanceMeters(userCoord, target);

      //console.log(`step ${i + 1}/${steps.length} dist(m):`, Math.round(d));
      if (d <= STEP_ARRIVE_M) return i + 1;
      
      return i;
    });
  }, [userCoord, steps]);

  function formatDistance(meters?: number) {
    if (meters == null) return "";
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
    }

    function makeMiddleInstruction(step?: Step) {
    if (!step) return null;

    const road = (step.name ?? "").trim();
    const dist = formatDistance(step.distance);

    // Don't spam for tiny segments
    if (step.distance != null && step.distance < 120) return null;

    if (road) return `Continue on ${road}${dist ? ` for ${dist}` : ""}`;
    if (dist) return `Continue for ${dist}`;
    return null;
    }

  const currentStep = steps[stepIdx];
  const nextStep = steps[stepIdx + 1];

  const currentInstruction = currentStep?.maneuver.instruction ?? "—";
  const nextInstruction = nextStep?.maneuver.instruction ?? null;

  const currentStepMin =
    currentStep?.duration != null ? Math.max(1, Math.round(currentStep.duration / 60)) : null;
  const middleInstruction = makeMiddleInstruction(currentStep);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />

      <Pressable onPress={() => downloadOfflineForLocations(locations)} style={styles.downloadBtn}>
        <Text style={styles.downloadBtnText}>Download offline</Text>
      </Pressable>
      <Pressable
          style={styles.recenterBtn}
          onPress={() => {
            if (!userCoord) return;

            cameraRef.current?.flyTo(
              [userCoord[0], userCoord[1]],
              600
            );
          }}
        >
          <Text style={styles.recenterText}>◎</Text>
        </Pressable>
      <MapView
        style={styles.map}
        styleURL={MAP_STYLE_URL}
        zoomEnabled
        projection="globe"
        rotateEnabled
        pitchEnabled
        logoEnabled
        compassEnabled
        scaleBarEnabled={false}
      >
        <Camera
          ref={cameraRef}
          centerCoordinate={INITIAL_CENTER}
          zoomLevel={INITIAL_ZOOM}
          animationDuration={3000}
          animationMode="flyTo"
        />

        {routeFeature && (
          <ShapeSource id="route-source" shape={routeFeature}>
            <LineLayer
              id="route-line"
              style={{ lineWidth: 5, lineJoin: "round", lineCap: "round", lineOpacity: 0.9 }}
            />
          </ShapeSource>
        )}

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

        <Mapbox.Camera followUserLocation followZoomLevel={15} />

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
        <StepDirectionsBox steps={steps} userCoord={userCoord} stepArriveM={STEP_ARRIVE_M} />
    )}

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
    backgroundColor: "#ff3b30",
    borderWidth: 2,
    borderColor: "#fff",
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
    top: 160,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 24,
    backgroundColor: "rgb(238, 10, 10)",
    alignItems: "center",
    elevation:10,
    zIndex:9999,
    justifyContent: "center",
  },
  recenterText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});
