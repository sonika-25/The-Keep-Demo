//Directions box and step forwarding logic
import React, { useEffect, useMemo, useState,useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Step } from "../utils/routeServices";
import type { LngLat } from "../utils/routeData";
import { distanceMeters } from "../utils/mapUtils";
import { lineString, point } from "@turf/helpers";
import nearestPointOnLine from "@turf/nearest-point-on-line";

type Props = {
    tripMins: number | null,
    steps: Step[];
    userCoord: LngLat | null;
    routeCoords: LngLat[];
    onStepChange?: (stepIdx: number) => void;
};
const PROMOTE_M = 30; // when to show next maneuver as the main instruction
const ARRIVE_M = 8;  

export default function NewSteps({tripMins, steps, userCoord, routeCoords,onStepChange}:Props){
    const [stepIdx, setStepIdx] = useState(0);
    const [phase, setPhase] = useState (false)
    const [distToNextM, setDistToNextM] = useState<number | null>(null);
    const[promoted,setPromoted]=useState(false)
    const [timeToNextS, setTimeToNextS] = useState<number | null>(null);
    const [tripTimeRemainingMins, setTripTimeRemainingMins] = useState<number | null>(null);
    const [totalDistLeft,setTotalDistLeft] = useState <string | null> (null)
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
    useEffect(() => {
        onStepChange?.(stepIdx);
    }, [stepIdx, onStepChange]);
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


        const totalRouteM =
            getDistanceAlongRouteMeters(
                routeCoords,
                routeCoords[routeCoords.length - 1]
            );
        const remainingRouteM = Math.max(0, totalRouteM - userAlongM);
    const remainingRoute =
    remainingRouteM == null
        ? ""
        : remainingRouteM >= 1000
        ? `${(remainingRouteM / 1000).toFixed(1)} km`
        : `${Math.round(remainingRouteM)} m`;

    setTotalDistLeft (remainingRoute)


        if (tripMins && tripMins > 0) {
            const remainingMins =
                (remainingRouteM / totalRouteM) * tripMins;

            setTripTimeRemainingMins(remainingMins);
        
        }


        const distToNext = Math.max(0, nextAlongM - userAlongM);
        let nextTime = null;

        const segmentDistanceM = Math.max(1, nextAlongM - currAlongM);
        if (currStep?.duration > 0) {
            nextTime =
                (distToNext / segmentDistanceM) * currStep.duration;
        }

        /*if (nextStep?.distance > 0 && nextStep?.duration > 0) {
            nextTime = (distToNext / nextStep.distance) * nextStep.duration;
        }*/
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

        const match = instruction.match(/\b(onto|toward|towards)\b/i);

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
       
        const totalTripLabel =
            tripTimeRemainingMins == null
            ? ""
            : tripTimeRemainingMins >= 60
            ? `${Math.floor(tripTimeRemainingMins / 60)} hr ${Math.ceil(tripTimeRemainingMins % 60)} min`
            : `${Math.ceil(tripTimeRemainingMins)} min`;


        const timeLabel = 
            timeM == null ? "" : timeM>=3600 ? (`${Math.floor(timeM / 3600)} hrs and ${Math.floor((timeM % 3600) / 60)}mins`) : `${Math.ceil(timeM / 60)} min`
        const splitPrimary = splitInstruction(primary);
        return (
            <View style={styles.directionsBox}>
                <View style={styles.tripSummaryRow}>
                {!!timeLabel && (
                    <View style={styles.summaryPill}>
                    <Text style={styles.summaryLabel}>Next</Text>
                    <Text style={styles.summaryValue}>{timeLabel}</Text>
                    </View>
                )}

                {!!distLabel && (
                    <View style={styles.summaryPill}>
                    <Text style={styles.summaryLabel}>Distance</Text>
                    <Text style={styles.summaryValue}>{distLabel}</Text>
                    </View>
                )}

                {!!totalTripLabel && (
                    <View style={styles.summaryPill}>
                    <Text style={styles.summaryLabel}>Trip</Text>
                    <Text style={styles.summaryValue}>{totalTripLabel}</Text>
                    </View>
                )}
                </View>

                <View style={styles.instructionBlock}>
                <Text style={styles.primary} numberOfLines={2}>{splitPrimary.line1}</Text>

                {!!splitPrimary.line2 && (
                    <Text style={styles.primarySub} numberOfLines={1}>{splitPrimary.line2}</Text>
                )}
                </View>

                {!!secondary && !promoted && (
                <View style={styles.secondaryBox}>
                    <Text style={styles.secondaryLabel}>Upcoming</Text>
                    <Text style={styles.secondary}>{secondary.replace("Next: ", "")}</Text>
                </View>
                )}

                {!!totalDistLeft && (
                <Text style={styles.remainingText}>{totalDistLeft} remaining</Text>
                )}
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
    primary = `Continue on ${currentStep?.ref ? currentStep.ref : ""}/${currentStep?.name} for ${distLabel}`;
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
  width: "92%",
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 18,
  backgroundColor: "rgba(2, 53, 6, 0.94)",
  elevation: 10,
},

  
    tripSummaryRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    },

summaryPill: {
  flex: 1,
  paddingVertical: 6,
  paddingHorizontal: 8,
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.14)",
  alignItems: "center",
},

  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
    fontFamily: 'CormorantGaramond-SemiBold',
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
    fontFamily: 'CormorantGaramond-SemiBold',
  },

  instructionBlock: {
    marginTop: 2,
  },

primary: {
  fontSize: 20,
  lineHeight: 24,
  fontWeight: "800",
  color: "#ffffff",
  textAlign: "center",
  fontFamily: 'CormorantGaramond-SemiBold',
},
 primarySub: {
  fontSize: 18,
  lineHeight: 22,
  fontWeight: "700",
  color: "#ffffff",
  textAlign: "center",
  fontFamily: 'CormorantGaramond-SemiBold',
},

secondaryBox: {
  marginTop: 8,
  paddingVertical: 7,
  paddingHorizontal: 10,
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.1)",
},
  secondaryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    marginBottom: 3,
    textTransform: "uppercase",
    fontFamily: 'CormorantGaramond-SemiBold',
  },

  secondary: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: 'CormorantGaramond-SemiBold',

  },

  remainingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    fontFamily: 'CormorantGaramond-SemiBold',
  },
});

