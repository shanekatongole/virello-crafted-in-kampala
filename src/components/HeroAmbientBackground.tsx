import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-performance";
import type { PerfTier } from "@/lib/performance";

/** Local copy of reference: Pinterest liquid-glass / warp-speed ambient loop */
export const HERO_AMBIENT_GIF = "/media/hero-ambient.gif";

type Props = {
  /** When false (hidden tab), animation is not rendered to save CPU/GPU */
  active: boolean;
  /** Current performance tier of the browser */
  tier: PerfTier;
};

/**
 * Full-bleed cinematic hero background using the reference GIF.
 * Scoped to the hero only — does not run across the whole page.
 */
export function HeroAmbientBackground({ active, tier }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Load the heavy 55MB gif only on desktop viewports and high-performance tier
  const loadGif = active && tier === "high" && isDesktop && !reducedMotion;

  if (reducedMotion) {
    return (
      <div className="hero-ambient hero-ambient--static" aria-hidden>
        <div className="hero-ambient-static-burst" />
        <div className="hero-ambient-scrim" />
      </div>
    );
  }

  return (
    <div className="hero-ambient" aria-hidden>
      {loadGif ? (
        <img
          src={HERO_AMBIENT_GIF}
          alt=""
          className="hero-ambient-gif"
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
        />
      ) : (
        /* Highly performant, beautiful liquid CSS gradients fallback */
        <div className="hero-ambient-css-fallback">
          <div className="css-blob css-blob-1" />
          <div className="css-blob css-blob-2" />
          <div className="css-blob css-blob-3" />
        </div>
      )}
      <div className="hero-ambient-scrim" />
      <div className="hero-ambient-vignette" />
    </div>
  );
}
