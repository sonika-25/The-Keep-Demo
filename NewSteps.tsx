//Directions box and step forwarding logic

import React, { useEffect, useMemo, useState,useRef } from "react";
//import {ArrowUp,ArrowRight,ArrowLeft,CornerUpRight,CornerUpLeft, RotateCcw,Navigation,Flag} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { Step } from "./routeServices";
import type { LngLat } from "./routeData";
import { distanceMeters } from "./mapUtils";
import { lineString, point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

type Props = {
  steps: Step[];
  userCoord: LngLat | null;
  routeCoords: LngLat[];
};
const PROMOTE_M = 30; // when to show next maneuver as the main instruction
const ARRIVE_M = 15;  

export default function NewSteps({steps, userCoord, routeCoords}:Props){
    const [stepIdx, setStepIdx] = useState(0);
    const [phase, setPhase] = useState (false)
    const [distToNextM, setDistToNextM] = useState<number | null>(null);
    const[promoted,setPromoted]=useState(false)
    const [timeToNextS, setTimeToNextS] = useState<number | null>(null);
    //basic setup
    useEffect(() => {
        if (!steps.length) return
        if (routeCoords.length <2 ) return
        console.log(steps)
        setPhase(false);
        setDistToNextM(null);
        setPromoted(false)
        let step  = inferStepIdxFromUser(steps, userCoord, routeCoords)
        console.log(steps[step])
        setStepIdx(step)
        
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
        const currAlongM = getDistanceAlongRouteMeters(routeCoords, currStep.maneuver.location as LngLat);

        const distToNext = Math.max(0, nextAlongM - userAlongM);
        let nextTime = null;

        if (nextStep?.distance > 0 && nextStep?.duration > 0) {
            nextTime = (distToNext / nextStep.distance) * nextStep.duration;
        }
        setTimeToNextS(nextTime);

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
        setPhase(false);
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
    
    function splitInstruction(instruction?: string) {
        if (!instruction) return { line1: "", line2: "" };

        const match = instruction.match(/\b(onto|toward|towards|for)\b/i);

        if (!match || match.index == null) {
            return { line1: instruction, line2: "" };
        }

        const idx = match.index;

        return {
            line1: instruction.slice(0, idx).trim(),
            line2: instruction.slice(idx).trim(),
        };
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
        const splitPrimary = splitInstruction(primary);
        return (
            <View style={styles.directionsBox}>
            <View style={styles.row}>
                
                <View style={{ flex: 1 }}>
                    <View style={styles.topMetaRow}>
                        {!!timeLabel && <Text style={styles.topMetaText}>{timeLabel}</Text>}
                        {!!timeLabel && !!distLabel && <Text style={styles.topMetaDivider}> • </Text>}
                        {!!distLabel && <Text style={styles.topMetaText}>{distLabel}</Text>}
                        </View>

                        <Text style={styles.primary}>{splitPrimary.line1}</Text>
                        {!!splitPrimary.line2 && (
                        <Text style={styles.primarySub}>{splitPrimary.line2}</Text>
                        )}
                        {!!secondary && !promoted && (
                        <Text style={styles.secondary}>{secondary}</Text>
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
    primary = `Continue on ${currentStep?.name} for ${distLabel}`;
    secondary = `Next: ${nextStep?.maneuver?.instruction}` ;
    
    }
    return (
        <ManeuverCard
            primary={primary}
            secondary={secondary}
            distM={distToNextM}
            timeM={timeToNextS}
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
topMetaRow: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 8,
},

topMetaText: {
  fontSize: 17,
  fontFamily:' sans-serif',
  fontWeight: "600",
  color: "rgb(255, 255, 255)",
},
primarySub: {
  fontSize: 20,
  fontWeight: "600",
  color: "#fff",
  marginTop: 2,
},
topMetaDivider: {
  fontSize: 17,
  fontWeight: "600",
  color: "rgba(255,255,255,0.7)",
  marginHorizontal: 4,
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
  fontSize: 16,
  marginTop: 4,
  color: "#ffffff",
},

meta: {
  fontSize: 12,
  marginTop: 6,
  color: "#ffffff",
},
});

