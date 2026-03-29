//Directions box and step forwarding logic

import React, { useEffect, useMemo, useState,useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Step } from "./routeServices";
import type { LngLat } from "./routeData";
import { lineString, point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

type Props = {
  steps: Step[];
  userCoord: LngLat | null;
  routeCoords: LngLat[];
};
const PROMOTE_M = 30; // when to show next maneuver as the main instruction
const ARRIVE_M = 30;  

export default function NewSteps({steps, userCoord, routeCoords}:Props){ //props from MapScreen
    const [stepIdx, setStepIdx] = useState(0);
    const [distToNextM, setDistToNextM] = useState<number | null>(null);
    const [promoted,setPromoted] = useState(false)

    //basic setup
    useEffect(() => {
        //console.log(steps)
        setStepIdx(0);
        setDistToNextM(null);
        setPromoted(false)
        let step  = inferStepIdxFromUser(steps, userCoord, routeCoords) //case: user is not at start when app is loaded
        if(steps){
            //console.log(steps[step])
            setStepIdx(step)
        }
    }, [steps, routeCoords]);

    //step logic
    useEffect(() => {
        if (!userCoord) return;
        if (!steps.length) return;
        if (routeCoords.length < 2) return;
        if (stepIdx >= steps.length - 1) return;

        let nextStep = steps[Math.min(stepIdx + 1, steps.length - 1)];
        let currStep = steps[stepIdx];

        const userAlongM = getDistanceAlongRouteMeters(routeCoords, userCoord);
        const nextAlongM = getDistanceAlongRouteMeters(routeCoords, nextStep.maneuver.location as LngLat);

        const distToNext = Math.max(0, nextAlongM - userAlongM);

        console.log(
        "distToNext:", distToNext,
        "| promoted:", promoted,
        "| stepIdx:", stepIdx
        );

        setDistToNextM(distToNext);

        // Show upcoming turn early
        if (distToNext <= PROMOTE_M && !promoted) {
        setPromoted(true);
        return;
        }

        // Actually move to next step only when very close to / at the maneuver
        if (distToNext <= ARRIVE_M) {
        setStepIdx((i) => Math.min(i + 1, steps.length - 1));
        setPromoted(false);
        return;
        }
    }, [userCoord, steps, routeCoords, stepIdx, promoted]);
    
    function getDistanceAlongRouteMeters(routeCoords: LngLat[], coord: LngLat): number {
        const routeLine = lineString(routeCoords);
        const snapped = nearestPointOnLine(routeLine, point(coord), { units: "kilometers" });
        const locationKm = Number((snapped.properties as any)?.location ?? 0);
        return locationKm * 1000;
    }
    // For cases where user closes and reopens the map
    function inferStepIdxFromUser(
        steps: Step[],
        userCoord: LngLat | null,
        routeCoords: LngLat[]
        ): number {
        if (!userCoord) return 0;
        if (steps.length === 0) return 0;
        if (routeCoords.length < 2) return 0;

        const userAlongM = getDistanceAlongRouteMeters(routeCoords, userCoord);

        for (let i = 0; i < steps.length; i++) {
            const stepAlongM = getDistanceAlongRouteMeters(
            routeCoords,
            steps[i].maneuver.location as LngLat
            );

            if (userAlongM < stepAlongM) {
            return Math.max(0, i - 1);
            }
        }

        return Math.max(0, steps.length - 1);
        }
    
    //returns the main card calculating Time and Distance
    function ManeuverCard({
        primary,
        secondary,
        distM,
        timeM,
        promoted,
        }: {
        primary: string;
        secondary?: string;
        distM: number | null;
        timeM: number | null;
        promoted: boolean|false;
        }) {
       
        const timeLabel = 
            timeM == null ? "" : timeM>=3600 ? (`${Math.floor(timeM / 3600)} hrs and ${Math.floor((timeM % 3600) / 60)}mins`) : `${Math.ceil(timeM / 60)} min`
        return (
            <View style={styles.directionsBox}>
            <View style={styles.row}>
                
                <View style={{ flex: 1 }}>
                    {!!distLabel && (
                    <Text style={styles.distanceTop}>{distLabel}</Text>
                    )}

                    <Text style={styles.primary}>{primary}</Text>

                    {!!secondary && !promoted && (
                    <Text style={styles.secondary}>Then {secondary}</Text>
                    )}

                    {!!timeLabel && (
                    <Text style={styles.meta}>{timeLabel} remaining</Text>
                    )}
                </View>
                </View>
                </View>
        );
    }
    const currentStep = steps[stepIdx];
    const nextStep = steps[Math.min(stepIdx + 1, steps.length - 1)];

    const distLabel =
    distToNextM == null
        ? ""
        : distToNextM >= 1000
        ? `${(distToNextM / 1000).toFixed(1)} km`
        : `${Math.round(distToNextM)} m`;

    let primary = "";
    let secondary = "";

    if (promoted) {
    primary = nextStep?.maneuver?.instruction ?? "";
    secondary = "";
    } else {
    primary = `Continue ${currentStep?.mode} on ${currentStep?.name} for ${distLabel}`;
    secondary = nextStep?.maneuver?.instruction ?? "";
    }
    return (
        <ManeuverCard
            primary={primary}
            secondary={secondary}
            distM={distToNextM}
            timeM={steps[stepIdx].duration}
            promoted={promoted}
        />
    );
}

const styles = StyleSheet.create({
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
  //primary: { fontSize: 18, fontWeight: "700", color: "#fff" },
  //secondary: { fontSize: 14, marginTop: 6, color: "rgba(255,255,255,0.9)" },
  //meta: { fontSize: 12, marginTop: 6, color: "rgba(255,255,255,0.75)" },
  row: {
  flexDirection: "row",
  alignItems: "center",
},

icon: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#f1f3f5",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

distanceTop: {
  fontSize: 12,
  fontWeight: "700",
  color: "#52ff72",
  marginBottom: 4,
  letterSpacing: 0.5,
},

primary: {
  fontSize: 20,
  fontWeight: "700",
  color: "#ffffff",
},

secondary: {
  fontSize: 14,
  marginTop: 4,
  color: "#ffffff",
},

meta: {
  fontSize: 12,
  marginTop: 6,
  color: "#ffffff",
},
});

