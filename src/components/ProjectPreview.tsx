import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { PROJECT_IMAGES } from "@/lib/projects";

type Props = {
  project: Project;
  priority?: boolean;
  height?: number;
};

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
      style={{ height, background: "#08080f", borderRadius: "20px 20px 0 0" }}
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
          background: "linear-gradient(to bottom, rgba(5,5,5,0) 55%, rgba(5,5,5,0.55) 100%)",
        }}
      />
      <span
        className="absolute right-3 top-3 text-[11px] font-bold tracking-wider uppercase rounded-full px-3 py-1.5"
        style={{
          background: "rgba(5,5,5,0.72)",
          color: "#00c2ff",
          border: "1px solid rgba(0,194,255,0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          letterSpacing: "0.1em",
          boxShadow: "0 0 12px rgba(0,194,255,0.2)",
        }}
      >
        View live ↗
      </span>
    </a>
  );
}
