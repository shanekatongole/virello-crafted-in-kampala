import { useState } from "react";
import type { Project } from "@/lib/projects";
import { PROJECT_IMAGES } from "@/lib/projects";

type Props = {
  project: Project;
  priority?: boolean;
  height?: number;
};

export function ProjectPreview({ project, priority, height = 220 }: Props) {
  const [hovered, setHovered] = useState(false);
  const isTouch =
    typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const img = PROJECT_IMAGES[project.slug];

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer noopener"
      onMouseEnter={() => !isTouch && setHovered(true)}
      onMouseLeave={() => !isTouch && setHovered(false)}
      data-hover
      aria-label={`Open ${project.name} live site in a new tab`}
      className="project-preview block relative w-full overflow-hidden"
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
        className="project-preview-img absolute inset-0 w-full h-full object-cover object-top"
        style={{
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: hovered ? "transform" : "auto",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(5,5,5,0) 55%, rgba(5,5,5,0.55) 100%)",
        }}
      />
      <span className="project-preview-badge lg-tag absolute right-3 top-3">View live ↗</span>
    </a>
  );
}
