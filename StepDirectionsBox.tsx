// src/StepDirectionsBox.tsx
import React, { useEffect, useMemo, useState,useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Step } from "./routeServices";
import type { LngLat } from "./routeData";
import { distanceMeters } from "./mapUtils";

type Props = {
  steps: Step[];
  userCoord: LngLat | null;
  stepArriveM?: number; // default 70
};
const PROMOTE_M = 46; // when to show next maneuver as the main instruction
const ARRIVE_M = 50;  // when to consider a maneuver crossed and advance

function formatDistance(meters?: number) {
  if (meters == null) return "";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function makeMiddleInstruction(step?: Step) {
  if (!step) return null;

  // avoid noise for tiny segments
  if (step.distance != null && step.distance < 120) return null; // COME BACK

  const road = (step.name ?? "").trim();
  const dist = formatDistance(step.distance);

  if (road) return `Continue on ${road}${dist ? ` for ${dist}` : ""}`;
  if (dist) return `Continue for ${dist}`;
  return null;
}
function inferStepIdxFromUser(steps: Step[], userCoord: LngLat): number {
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
  return bestJ;
}

export default function StepDirectionsBox({ steps, userCoord, stepArriveM = 70 }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<"pre" | "between">("pre");
  const [distToNextM, setDistToNextM] = useState<number | null>(null);
  const [promoted, setPromoted] = useState(false);

  // reset when a new route arrives
  useEffect(() => {
    setStepIdx(0);
    setPhase("pre");
    setDistToNextM(null);
    setPromoted(false)
  }, [steps.length]);

  // Step A with your requested behavior:
  // show ONLY middle+next once the maneuver has been taken.
  useEffect(() => {
    if (!userCoord) return;
    if (steps.length === 0) return;

    const cur = steps[stepIdx];
    if (!cur) return;

    const distToCur = distanceMeters(userCoord, cur.maneuver.location as LngLat);

    if (phase === "pre") {
      setDistToNextM(null);

      if (distToCur <= stepArriveM) {
        setPhase("between");
        setPromoted(false); // start fresh for this between segment
      }
      return;
    }

    // phase === "between": advance to next step when we reach next maneuver point
    // phase === "between"
    const next = steps[stepIdx + 1];
    if (!next) return;

    const dNext = distanceMeters(userCoord, next.maneuver.location as LngLat);
    console.log(promoted)
    setDistToNextM(dNext);

    // LATCH: once we hit promote, keep it true until we advance steps
    if (!promoted && dNext <= PROMOTE_M) {
      setPromoted(true);
    }

    // Only advance if we've already promoted AND we are within arrive threshold
    if (promoted && dNext >= ARRIVE_M) { ////SEE CHANGE HERE
      setStepIdx((i) => Math.min(i + 1, steps.length - 1));
      setPhase("pre");
      setDistToNextM(null);
      setPromoted(false);
    }


  }, [userCoord, steps.length, stepIdx, phase, stepArriveM]);
  const didHydrateRef = useRef(false);

  useEffect(() => {
    if (didHydrateRef.current) return;
    if (!userCoord) return;
    if (steps.length === 0) return;

    const inferredIdx = inferStepIdxFromUser(steps, userCoord);

    setStepIdx(inferredIdx);

    // If we’re basically at the inferred maneuver, treat it as taken and go "between".
    const distToInferred = distanceMeters(
      userCoord,
      steps[inferredIdx].maneuver.location as LngLat
    );

    if (distToInferred <= stepArriveM) {
      setPhase("between");
    } else {
      // Typically still safe to be between; but for step 0, let them approach normally.
      setPhase(inferredIdx === 0 ? "pre" : "between");
    }

    setDistToNextM(null);
    setPromoted(false);

    didHydrateRef.current = true;
  }, [userCoord, steps.length, stepArriveM]);

  const currentStep = steps[stepIdx];
  const nextStep = steps[stepIdx + 1];
  const currentInstruction = currentStep?.maneuver.instruction ?? "—";
  const nextInstruction = nextStep?.maneuver.instruction ?? null;

  const middleInstruction = useMemo(
    () => makeMiddleInstruction(currentStep),
    [currentStep]
  );

  const currentStepMin =
    currentStep?.duration != null ? Math.max(1, Math.round(currentStep.duration / 60)) : null;

  if (steps.length === 0) return null;
  const promoteNext = phase === "between" && promoted;

  return (
    <View style={styles.directionsBox}>
      <Text style={styles.directionsTitle}>
        Step {Math.min(stepIdx + 1, steps.length)} / {steps.length}
        {currentStepMin ? ` • ${currentStepMin} min` : ""}
      </Text>

      {phase === "pre" ? (
        <Text style={styles.directionsItem}>{currentInstruction}</Text>
      ) : promoteNext ? (
        // Close to next maneuver: show it as the main instruction
        <>
          {nextInstruction && <Text style={styles.directionsItem}>{nextInstruction}</Text>}
          {distToNextM != null && (
            <Text style={[styles.directionsItem, { opacity: 0.75 }]}>
              In {Math.round(distToNextM)} m
            </Text>
          )}
        </>
      ) : (
        // Normal between state: show continue + next
        <>
          {middleInstruction && <Text style={styles.directionsItem}>{middleInstruction}</Text>}
          {nextInstruction && (
            <Text style={[styles.directionsItem, { opacity: 0.75 }]}>Next: {nextInstruction}</Text>
          )}
        </>
      )}

    </View>
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
});
