import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { PROJECT_IMAGES } from "@/lib/projects";

type Props = {
  project: Project;
  priority?: boolean;
  height?: number;
};

/**
 * Screenshot-first preview. On desktop hover, mounts the live iframe
 * after a short delay and fades it in over the image. On touch devices
 * no iframe is ever mounted — the whole tile is a tap target opening
 * the live site.
 */
export function ProjectPreview({ project, priority, height = 220 }: Props) {
  const [hot, setHot] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useEffect(
    () => () => {
      if (enterTimer.current) window.clearTimeout(enterTimer.current);
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  const onEnter = () => {
    if (isTouch) return;
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => setHot(true), 180);
  };
  const onLeave = () => {
    if (isTouch) return;
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setHot(false);
      setIframeReady(false);
    }, 250);
  };

  const img = PROJECT_IMAGES[project.slug];

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer noopener"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor="hover"
      aria-label={`Open ${project.name} live site in a new tab`}
      className="block relative w-full overflow-hidden"
      style={{ height, background: "#0d1322" }}
    >
      <img
        src={img}
        alt={`${project.name} — live site preview`}
        width={1440}
        height={900}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      {hot && !isTouch && (
        <iframe
          src={project.url}
          title={project.name}
          loading="lazy"
          scrolling="no"
          onLoad={() => setIframeReady(true)}
          className="absolute inset-0 w-full h-full border-0 block"
          style={{
            pointerEvents: "none",
            opacity: iframeReady ? 1 : 0,
            transition: "opacity .4s ease",
          }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,12,20,0) 60%, rgba(8,12,20,0.45) 100%)",
        }}
      />
      <span
        className="absolute right-3 top-3 text-[11px] font-medium tracking-wider uppercase rounded-full px-3 py-1.5"
        style={{
          background: "rgba(8,12,20,0.7)",
          color: "#00C8FF",
          border: "1px solid rgba(0,200,255,0.35)",
          backdropFilter: "blur(8px)",
        }}
      >
        View live ↗
      </span>
    </a>
  );
}