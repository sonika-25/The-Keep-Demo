// src/MapScreen.tsx
import React, { useEffect, useState,useRef } from "react";
import { StatusBar, StyleSheet, View, Text, Pressable, TouchableOpacity, Image} from "react-native";
import Mapbox, { Camera, MapView, UserLocation, PointAnnotation, ShapeSource, LineLayer,UserTrackingMode } from "@rnmapbox/maps";
import { lineString, point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import lineSliceAlong from "@turf/line-slice-along";
import length from "@turf/length";
import { getLocationsForTrip, INITIAL_ZOOM, type LngLat } from "../utils/routeData";
import { distanceMeters, toLineFeature } from "../utils/mapUtils";
import { MAP_STYLE_URL  , MAPBOX_TOKEN} from "../../mapboxConfig";
import { downloadOfflineForLocations, fetchDirectionsRoute,loadRouteFromCache,saveRouteToCache, getOfflinePackName,type RouteFeature, type Step } from "../utils/routeServices";
import NewSteps from "./NewSteps";
import Navbar from "../../components/Navbar";
Mapbox.setAccessToken( MAPBOX_TOKEN)
import along from "@turf/along";

export default function MapScreen({ route,navigation }: any) {
  const fromId = route?.params?.fromId;
  const toId = route?.params?.toId;
  const stops = route?.params?.stops ?? [];
  //const locations = getLocationsForTrip(fromId, toId, stops);
  // if (!locations) {
  // return null;
  // }
  // const flatLocations  = [
  //   locations[0],
  //   ...locations[1],
  //   locations[2],
  // ];
  const routeNumber = route?.params?.routeNumber ?? 1;

  console.log(route.params.routeNumber)
  //const INITIAL_CENTER = locations[0].coordinates;
  //console.log("INTIAL CENTER: ",INITIAL_CENTER)
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
  const [orientationMode, setOrientationMode] = useState<"north" | "course">("north");
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [routeUpMode, setRouteUpMode] = useState(false);

  const needsCurrentLocation =
  fromId === "current_location" || toId === "current_location";

  const locations = React.useMemo(() => {
    if (needsCurrentLocation && !userCoord) {
      return null;
    }

    return getLocationsForTrip(fromId, toId, stops, userCoord);
  }, [fromId, toId, stops, userCoord, needsCurrentLocation]);

  const flatLocations = locations
    ? [
        locations[0],
        ...locations[1],
        locations[2],
      ]
    : [];

  // Fetch route from cache or API

  useEffect(() => {
    if (!locations) return;
    let cancelled = false;

    (async () => {
      try {
        const cacheKeyFrom = fromId;
        const cacheKeyTo = toId;

        const cached = await loadRouteFromCache(locations);
        let routeData = cached;
        if (!routeData) {
          routeData = await fetchDirectionsRoute(locations);
          await saveRouteToCache(locations, routeData);
        }
        

        if (cancelled || !routeData) return;

        setRouteFeature(routeData.routeFeature);
        setRouteCoords(routeData.routeCoords);
        setTripMinutes(routeData.tripMinutes);
        setSteps(routeData.steps);

        const packName = getOfflinePackName(locations);
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
  }, [locations,toId,fromId,stops.join("-")]);

//Testing simuator
useEffect(() => {
  if (!simulate) return;
  if (routeCoords.length < 2) return;

  const routeLine = lineString(routeCoords);
  const totalKm = length(routeLine, { units: "kilometers" });

  let progressKm = 0;

  const interval = setInterval(() => {
    progressKm += 0.05;

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


//NEW one for route up
useEffect(() => {
  if (!userCoord) return;
  if (!steps.length) return;

  const currentStep = steps[activeStepIdx];
  let heading = currentStep?.maneuver?.bearing_after;
  if (!routeUpMode) { heading =0};

  if (typeof heading !== "number") return;

  cameraRef.current?.setCamera({
    //centerCoordinate: userCoord,
    //zoomLevel: 16,
    heading,
    //pitch: 45,
    //animationDuration: 500,
  });
}, [routeUpMode, userCoord, steps, activeStepIdx]);
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
      <View>
        <Navbar
        title="THE KEEP"
        leftText="Back"
        onLeftPress={() => navigation.goBack()}
        />
      </View>
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
      
        {needsCurrentLocation && !userCoord && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Getting your current location...</Text>
          </View>
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

        <Mapbox.Camera 
          ref={cameraRef} 
          followUserLocation={followUser && !simulate} 
          followZoomLevel={14}  
          centerCoordinate={simulate && userCoord ? userCoord : undefined}
        />

        <UserLocation
          visible = {!simulate}
          animated={false}
          androidRenderMode={"gps"}
          showsUserHeadingIndicator
          requestsAlwaysUse
          onUpdate={(loc) => {
            if (simulate) {
              return;
            }
            const { longitude, latitude } = loc.coords;
            setUserCoord([longitude, latitude]);
          }}
        />
        
        {flatLocations.map((m) => (
          <PointAnnotation id={m.id} coordinate={m.coordinates} key={m.id}>
            <View style={styles.marker} />
          </PointAnnotation>
        ))}
        {simulate && userCoord && (
        <PointAnnotation id="simulated-user" coordinate={userCoord}>
          <View style={styles.simulatedUserMarker} />
        </PointAnnotation>
      )}
      </MapView>
      <View style={styles.bottomOverlay}>
        <Pressable
          style={styles.orientationBtn}
          onPress={() => {
            if (routeUpMode) {
              setRouteUpMode(false);
              setFollowUser(true);

              cameraRef.current?.setCamera({
                heading: 0,
                //pitch: 0,
                //animationDuration: 500,
              });

              return;
            }

            setRouteUpMode(true);
            setFollowUser(false);
          }}
        >
          <Text style={styles.orientationText}>
            {routeUpMode ? "North Up" : "Route Up"}
          </Text>
        </Pressable>
        <Pressable
          style={styles.recenterBtn}
          onPress={() => {
            if (!userCoord) return;
              setFollowUser(true);
            }}
          >
            <Text style={styles.recenterText}>Re-Center</Text>
          </Pressable>
      {(tripMinutes !== null || steps.length > 0) && (
        <NewSteps tripMins = {tripMinutes} steps={steps} userCoord={userCoord} routeCoords={routeCoords} onStepChange={setActiveStepIdx}/>    )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  orientationBtn: {
    position: "absolute",
    bottom: 260,
    right: 16,
    width: 90,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#236426",
    alignItems: "center",
    justifyContent: "center",
    elevation: 15,
    zIndex: 9999,
  },
loadingOverlay: {
  position: "absolute",
  top: 140,
  left: 20,
  right: 20,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: "rgba(0,0,0,0.75)",
  alignItems: "center",
  zIndex: 9999,
  elevation: 10,
},

loadingText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
  fontFamily: "CormorantGaramond-Bold",
},
  orientationText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "CormorantGaramond-Bold",
  },
  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#236426",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
simulatedUserMarker: {
  width: 18,
  height: 18,
  borderRadius: 9,
  backgroundColor: "#007AFF",
  borderWidth: 3,
  borderColor: "#ffffff",
},
 downloadBtn: {
    position: "absolute",
    top: 180,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(30,30,30)",
    zIndex: 9999,
    elevation: 10,
  },
  directionsTitle: { fontFamily: 'CormorantGaramond-Medium', fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#ffffff" },
  directionsItem: { fontFamily: 'CormorantGaramond-Regular',fontSize: 14, marginBottom: 4, color: "#ffffff" },
  downloadBtnText: {  fontFamily: 'CormorantGaramond-SemiBold',color: "#fff", fontWeight: "600" },

  recenterBtn: {
    position: "absolute",
    bottom: 207,
    right: 16,
    width: 110,
    height: 40,
    borderRadius: 24,
    backgroundColor: "#236426",
    fontWeight:"bold",
    alignItems: "center",
    elevation:15,
    zIndex:9999,
    marginBottom: 12,
    fontFamily: 'CormorantGaramond-Bold',

    justifyContent: "center",
  },
  recenterText: {
    fontSize:20,
    fontWeight:'bold',
    textAlign:"right",
    color:"white",
    fontFamily: 'CormorantGaramond-Bold',
  },
});
