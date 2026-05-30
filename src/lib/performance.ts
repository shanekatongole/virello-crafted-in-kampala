export type PerfTier = "high" | "medium" | "low";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (dm !== undefined && dm <= 4) return true;
  const cores = navigator.hardwareConcurrency;
  if (cores !== undefined && cores <= 4) return true;
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return true;
  return false;
}

/** Client-only performance tier for animation / GPU budget. */
export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "medium";
  if (prefersReducedMotion()) return "low";
  if (isLowPowerDevice()) return "low";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  if (coarse || narrow) return "medium";
  return "high";
}

export function applyPerfTierToDocument(tier: PerfTier): void {
  document.documentElement.dataset.perf = tier;
}
