import { useEffect, useState, useSyncExternalStore } from "react";
import { applyPerfTierToDocument, detectPerfTier, type PerfTier } from "@/lib/performance";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function usePerfTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>("medium");

  useEffect(() => {
    const next = detectPerfTier();
    setTier(next);
    applyPerfTierToDocument(next);
  }, []);

  return tier;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
}

export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return visible;
}

/** Pause CSS-driven ambient motion when the tab is hidden. */
export function useAmbientMotionPause(active: boolean): void {
  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", !active);
    return () => document.documentElement.classList.remove("motion-paused");
  }, [active]);
}
