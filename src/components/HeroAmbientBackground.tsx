import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-performance";

/** Cinematic hero loop — encoded as MP4/WebM (was a 55MB GIF). */
export const HERO_AMBIENT_MP4 = "/media/hero-ambient.mp4";
export const HERO_AMBIENT_WEBM = "/media/hero-ambient.webm";
export const HERO_AMBIENT_POSTER = "/media/hero-ambient-poster.jpg";

type Props = {
  /** When false (hidden tab), animation is not rendered to save CPU/GPU */
  active: boolean;
};

function usePrefersReducedData(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-data: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

/**
 * Full-bleed cinematic hero background using the reference GIF.
 * Scoped to the hero only — does not run across the whole page.
 */
export function HeroAmbientBackground({ active }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const reducedData = usePrefersReducedData();
  const [canLoadVideo, setCanLoadVideo] = useState(false);

  useEffect(() => {
    if (!active || reducedMotion || reducedData) {
      setCanLoadVideo(false);
      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (win.requestIdleCallback) {
      const handle = win.requestIdleCallback(() => setCanLoadVideo(true), { timeout: 1200 });
      return () => win.cancelIdleCallback?.(handle);
    }

    const handle = window.setTimeout(() => setCanLoadVideo(true), 600);
    return () => window.clearTimeout(handle);
  }, [active, reducedMotion, reducedData]);

  // Load the video after initial paint on every device, unless the user has
  // asked for reduced motion or reduced data.
  const loadVideo = active && !reducedMotion && !reducedData && canLoadVideo;

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
      {loadVideo ? (
        <video
          className="hero-ambient-gif"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={HERO_AMBIENT_POSTER}
          aria-hidden
        >
          <source src={HERO_AMBIENT_WEBM} type="video/webm" />
          <source src={HERO_AMBIENT_MP4} type="video/mp4" />
        </video>
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
