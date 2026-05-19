import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, PROJECTS, PROJECT_IMAGES } from "@/lib/projects";

const SITE = "https://virellosites.lovable.app";
const EMAIL = "katongoleshane@gmail.com";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params, loaderData }) => {
    const project = loaderData?.project;
    if (!project) return { meta: [{ title: "Case study — Virello" }] };
    const title = `${project.name} — Virello case study`;
    const desc = project.description;
    const url = `${SITE}/work/${params.slug}`;
    const image = `${SITE}/og/${project.slug}.jpg`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.name,
            description: project.description,
            url: project.url,
            author: { "@type": "Organization", name: "Virello" },
            keywords: project.stack.join(", "),
          }),
        },
      ],
    };
  },
  component: CaseStudy,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="font-display text-5xl mb-4">Project not found</h1>
        <Link to="/" className="text-[#00C8FF] underline">
          Back to Virello
        </Link>
      </div>
    </div>
  ),
});

function CaseStudy() {
  const { project } = Route.useLoaderData();
  const img = PROJECT_IMAGES[project.slug];
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `New project — similar to ${project.name}`,
  )}`;
  const others = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <main
      className="min-h-screen text-white relative"
      style={{ background: "#080c14" }}
    >
      <div className="global-noise" aria-hidden />
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Top bar */}
        <header className="fixed top-0 inset-x-0 z-40 bg-[rgba(8,12,20,0.85)] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
            <Link
              to="/"
              className="font-display text-[22px] text-white tracking-tight"
            >
              Virello
            </Link>
            <Link
              to="/"
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-[rgba(0,200,255,0.4)] text-[#00C8FF] hover:bg-[rgba(0,200,255,0.1)] transition-colors"
            >
              ← All work
            </Link>
          </div>
        </header>

        <article className="pt-32 pb-24 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6 text-[12px] uppercase tracking-[0.18em] text-[#7a8a9a]">
              <span className="text-[#00C8FF]">●</span>
              <span>{project.tag}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>
            <h1 className="font-display text-white text-[44px] md:text-[72px] leading-[1.02] tracking-tight">
              {project.name}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] text-[#7a8a9a] leading-relaxed">
              {project.description}
            </p>

            <div
              className="mt-12 overflow-hidden rounded-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <img
                src={img}
                alt={`${project.name} homepage`}
                width={1440}
                height={900}
                className="w-full h-auto block"
              />
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-10 md:gap-12">
              <Block label="Problem" body={project.problem} />
              <Block label="Approach" body={project.approach} />
              <Block label="Result" body={project.result} />
            </div>

            <div className="mt-16 flex flex-wrap gap-2">
              {project.stack.map((s: string) => (
                <span
                  key={s}
                  className="text-[12px] px-3 py-1.5 rounded-md"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#a0aec0",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-4">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block bg-[#00C8FF] text-[#080c14] px-7 py-3 text-[14px] font-semibold hover:opacity-90 transition-opacity"
              >
                Visit live site ↗
              </a>
              <a
                href={mailto}
                className="inline-block border border-[#00C8FF] text-[#00C8FF] px-7 py-3 text-[14px] font-medium hover:bg-[rgba(0,200,255,0.1)] transition-colors"
              >
                Start a similar project →
              </a>
            </div>

            <div className="mt-32">
              <h2 className="font-display text-white text-[28px] md:text-[36px] mb-8">
                More work
              </h2>
              <ul className="grid sm:grid-cols-3 gap-4">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/work/$slug"
                      params={{ slug: p.slug }}
                      className="block p-5 rounded-xl glass hover:border-[rgba(0,200,255,0.3)] transition-colors"
                    >
                      <div className="text-[11px] uppercase tracking-[0.15em] text-[#00C8FF] mb-2">
                        {p.tag}
                      </div>
                      <div className="font-display text-[22px] text-white">
                        {p.name}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <footer className="px-6 md:px-10 py-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[12px] text-[#7a8a9a]">
            <span>© 2026 Virello</span>
            <a
              href={`mailto:${EMAIL}`}
              className="text-[#00C8FF] hover:underline"
            >
              {EMAIL}
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#00C8FF] mb-3">
        {label}
      </div>
      <p className="text-[15px] text-white/85 leading-relaxed">{body}</p>
    </div>
  );
}