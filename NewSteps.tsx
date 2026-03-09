//Directions box and step forwarding logic

import React, { useEffect, useMemo, useState,useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Step } from "./routeServices";
import type { LngLat } from "./routeData";
import { distanceMeters } from "./mapUtils";

type Props = {
  steps: Step[];
  userCoord: LngLat | null;
};
const PROMOTE_M = 46; // when to show next maneuver as the main instruction
const ARRIVE_M = 51;  

export default function NewSteps({steps, userCoord}:Props){
    const [stepIdx, setStepIdx] = useState(0);
    const [phase, setPhase] = useState (false)
    const [distToNextM, setDistToNextM] = useState<number | null>(null);
    const[promoted,setPromoted]=useState(false)

    //basic setup
    useEffect(() => {
        console.log(steps)
        setStepIdx(0);
        setPhase(false);
        setDistToNextM(null);
        setPromoted(false)
        let step = inferStepIdxFromUser(steps,userCoord)
        if(steps){
            console.log(steps[step])
            setStepIdx(step)
        }
    }, [steps.length]);

    //step logic
    useEffect(()=>{
        if (!userCoord) return;
        let nextStep = steps[(Math.min(stepIdx+1, steps.length-1))]
        let currStep = steps[stepIdx]
        const distToNext = distanceMeters(userCoord, nextStep.maneuver.location as LngLat);
        const distFromCurr = distanceMeters(userCoord, currStep.maneuver.location as LngLat)
        console.log ("distance to next: , ", distToNext, "| distance from Current : ", distFromCurr, " | promoted : ",promoted)
        setDistToNextM(distToNext)
        
        if (distToNext<=PROMOTE_M && promoted==false){
            setStepIdx(stepIdx+1)   
            setPromoted(true)    
            setPhase(true)
            setDistToNextM(null)
        }
        if (distFromCurr>=ARRIVE_M && promoted==true){
            setPromoted(false)
            setPhase(false)
            setDistToNextM(distToNext)
        }
     
    }, [userCoord])

    // For cases where user closes and reopens the map
    function inferStepIdxFromUser(steps: Step[], userCoord: LngLat|null): number{
        if (!userCoord) return 0;
        const n = steps.length;
        if (n <= 1) return 0;

        const d = steps.map((s) =>
            distanceMeters(userCoord, s.maneuver.location as LngLat)
        );

        // If user is closest to the last maneuver point, keep them there.
        let closestIdx = 0;
        for (let i = 1; i < n; i++) {
            if (d[i] < d[closestIdx]) closestIdx = i;
        }
        if (closestIdx === n - 1) return n - 1;

        // Pick the segment whose endpoints are collectively closest
        let bestJ = 0;
        let bestScore = d[0] + d[1];
        for (let j = 1; j < n - 1; j++) {
            const score = d[j] + d[j + 1];
            if (score < bestScore) {
            bestScore = score;
            bestJ = j;
            }
        }
        console.log(bestJ)
        return bestJ;
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
            timeM == null ? "" : timeM>=3600 ? `${Math.floor(timeM / 3600)} hrs and ${Math.round(timeM%360)}mins` : `${Math.floor((timeM % 3600) / 60)} mins`
        return (
            <View style={styles.directionsBox}>
            <Text style={styles.primary}>{primary}</Text>
            {!!secondary && !!(!promoted) && <Text style={styles.secondary}>{secondary}</Text>}
            {<Text style={styles.secondary}>TIME: {timeLabel}</Text>}
            {!!distLabel && <Text style={styles.meta}>{distLabel}</Text>}
            </View>
        );
    }
    let primary= ""
     const distLabel =
            distToNextM == null ? "" : distToNextM >= 1000 ? `${(distToNextM / 1000).toFixed(1)} km` : `${Math.round(distToNextM)} m`;
    if (promoted){
        primary = steps[stepIdx]?.maneuver?.instruction ?? "";
    }
    else {
        primary = `Conintue ${steps[stepIdx].mode} on ${steps[stepIdx].name} for ${distLabel} `
    }
    const secondary = steps[stepIdx + 1]?.maneuver?.instruction;
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
  primary: { fontSize: 18, fontWeight: "700", color: "#fff" },
  secondary: { fontSize: 14, marginTop: 6, color: "rgba(255,255,255,0.9)" },
  meta: { fontSize: 12, marginTop: 6, color: "rgba(255,255,255,0.75)" },
});
