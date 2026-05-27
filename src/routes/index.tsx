import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/projects";
import { ProjectPreview } from "@/components/ProjectPreview";
import { STUDIO_EMAIL, mailtoSubject, PRICING, formatUGX, STARTING_PRICE_DISPLAY } from "@/lib/constants";

export const Route = createFileRoute("/")({ component: Index });

const EMAIL = STUDIO_EMAIL;
const MAILTO = mailtoSubject("New project enquiry");

/* ---------------- Custom Cursor ---------------- */
function useCustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.style.cssText =
      "position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:#00C8FF;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .18s ease, opacity .18s ease;";
    ring.style.cssText =
      "position:fixed;top:0;left:0;width:32px;height:32px;border-radius:50%;border:1.5px solid #00C8FF;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .25s ease, height .25s ease, opacity .25s ease, border-color .25s ease;";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setHover = (on: boolean) => {
      if (on === hovering) return;
      hovering = on;
      if (on) {
        dot.style.transform = "translate(-50%,-50%) scale(0)";
        ring.style.width = "48px";
        ring.style.height = "48px";
        ring.style.opacity = "0.5";
      } else {
        dot.style.transform = "translate(-50%,-50%) scale(1)";
        ring.style.width = "32px";
        ring.style.height = "32px";
        ring.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest("[data-cursor='hide']")) {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
        return;
      }
      dot.style.opacity = "1";
      if (t && t.closest("a,button,[data-cursor='hover']")) setHover(true);
      else setHover(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      dot.remove();
      ring.remove();
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);
}

/* ---------------- Reveal on scroll ---------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = el.dataset.delay || "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------- Nav ---------------- */
function Nav() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      if (window.scrollY > 24) ref.current.classList.add("is-scrolled");
      else ref.current.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      ref={ref}
      className="fixed top-0 inset-x-0 z-40 transition-all duration-300 rise [animation-delay:.3s] [&.is-scrolled]:bg-[rgba(8,12,20,0.85)] [&.is-scrolled]:backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-[22px] text-white tracking-tight">
          Virello<span className="text-[#00C8FF]">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-9 text-[13px] text-white/70">
          <a href="#work" className="hover:text-[#00C8FF] transition-colors">Selected Work</a>
          <a href="#about" className="hover:text-[#00C8FF] transition-colors">About</a>
          <a href="#pricing" className="hover:text-[#00C8FF] transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-[#00C8FF] transition-colors">Contact</a>
        </nav>
        <a
          href={`mailto:${EMAIL}`}
          className="text-[13px] font-medium px-4 py-2 rounded-full border border-[rgba(0,200,255,0.4)] text-[#00C8FF] hover:bg-[rgba(0,200,255,0.1)] transition-colors"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen px-6 md:px-10 overflow-hidden pt-28 pb-16"
    >
      <div className="noise-overlay" />
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/55 rise">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00C8FF] opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00C8FF]" />
            </span>
            <span className="text-[#00C8FF]">Online</span>
          </div>
          <div>Est. 2024 — Kampala, UG</div>
        </div>

        <div className="mt-10 md:mt-14">
          <h1 className="font-display text-white leading-[0.92] tracking-[-0.02em] text-[68px] sm:text-[110px] md:text-[150px] lg:text-[180px]">
            <span className="block rise">Virello</span>
            <span className="block italic text-[#00C8FF] rise [animation-delay:.1s]">Studio.</span>
          </h1>
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-6 rise [animation-delay:.25s]">
            <p className="text-[16px] md:text-[18px] text-white/75 leading-relaxed max-w-xl">
              A web design studio crafting fast, polished, conversion-ready
              digital experiences for businesses across Uganda &amp; East Africa.
            </p>
          </div>
          <div className="md:col-span-3 rise [animation-delay:.35s]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-2">Discipline</div>
            <div className="font-display text-white text-[22px] leading-tight">
              Visual craft <span className="text-[#00C8FF]">+</span> System thinking
            </div>
          </div>
          <div className="md:col-span-3 rise [animation-delay:.45s] md:text-right">
            <a href="#contact" className="inline-flex items-center gap-3 group">
              <span className="h-12 w-12 rounded-full bg-[#00C8FF] text-[#080c14] flex items-center justify-center text-[18px] group-hover:scale-110 transition-transform">
                →
              </span>
              <span className="font-display text-white text-[22px] leading-none text-left">
                Start a<br />
                <span className="italic text-[#00C8FF]">project</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8 reveal">
          <div>
            <div className="font-display text-white text-[40px] leading-none">5+</div>
            <div className="text-[12px] text-white/55 mt-2 uppercase tracking-[0.15em]">Projects Shipped</div>
          </div>
          <div>
            <div className="font-display text-white text-[40px] leading-none">2–3<span className="text-[#00C8FF]">w</span></div>
            <div className="text-[12px] text-white/55 mt-2 uppercase tracking-[0.15em]">Delivery</div>
          </div>
          <div>
            <div className="font-display text-white text-[40px] leading-none">100<span className="text-[#00C8FF]">%</span></div>
            <div className="text-[12px] text-white/55 mt-2 uppercase tracking-[0.15em]">Fixed Scope</div>
          </div>
          <div>
            <div className="font-display text-white text-[40px] leading-none">UG</div>
            <div className="text-[12px] text-white/55 mt-2 uppercase tracking-[0.15em]">Kampala Based</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
type ProjectLike = (typeof PROJECTS)[number];

function ProjectCard({
  p,
  tall,
  delay,
  priority,
}: {
  p: ProjectLike;
  tall?: boolean;
  delay: number;
  priority?: boolean;
}) {
  const iframeH = tall === undefined ? 200 : tall ? 220 : 160;
  return (
    <article
      className="overflow-hidden group reveal"
      data-delay={delay}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,200,255,0.35)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,200,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <ProjectPreview project={p} priority={priority} height={iframeH} />
      <div className="p-5">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#00C8FF",
            background: "rgba(0,200,255,0.07)",
            border: "1px solid rgba(0,200,255,0.22)",
            borderRadius: 999,
            padding: "4px 12px",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C8FF", display: "inline-block" }} />
          {p.tag}
        </span>
        <h3
          className="font-display"
          style={{ fontSize: 26, fontWeight: 400, color: "#fff", letterSpacing: "-0.01em", margin: "10px 0 6px" }}
        >
          {p.name}
        </h3>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: "#7a8a9a", lineHeight: 1.6 }}>
          {p.description}
        </p>
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="stack-chip"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  fontSize: 11,
                  color: "#a0aec0",
                  padding: "3px 9px",
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <Link
            to="/work/$slug"
            params={{ slug: p.slug }}
            className="visit-link"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12,
              fontWeight: 500,
              color: "#00C8FF",
              letterSpacing: "0.04em",
              textDecoration: "none",
            }}
          >
            Case study <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  const left = [PROJECTS[0], PROJECTS[2]];
  const right = [PROJECTS[1], PROJECTS[3]];
  const odd = PROJECTS[4];
  return (
    <section id="work" className="px-6 md:px-10 py-28 md:py-40 relative">
      <div className="max-w-7xl mx-auto">
        <div className="reveal" style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontSize: "clamp(40px, 6vw, 64px)",
            }}
          >
            Selected Works
          </h2>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11,
              color: "#7a8a9a",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Client projects · 2024–2025
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="flex flex-col gap-6 md:gap-8">
            <ProjectCard p={left[0]} tall delay={0} priority />
            <ProjectCard p={left[1]} tall delay={200} />
          </div>
          <div className="flex flex-col gap-6 md:gap-8 md:mt-12">
            <ProjectCard p={right[0]} tall={false} delay={100} />
            <ProjectCard p={right[1]} tall={false} delay={300} />
          </div>
        </div>
        <div className="mt-6 md:mt-8 mx-auto w-full md:w-1/2">
          <ProjectCard p={odd} delay={500} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-28 md:py-40 relative">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-7 reveal">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#00C8FF] mb-6">About</div>
          <h2 className="font-display text-white text-[44px] md:text-[72px] leading-[1.02] tracking-tight">
            The user is the<br />
            <span className="italic text-[#00C8FF]">only reality.</span>
          </h2>
          <div className="mt-10 space-y-5 text-[15px] md:text-[16px] text-white/75 leading-relaxed max-w-xl">
            <p>
              Virello is a Kampala-based web design studio building digital products for
              businesses across Uganda and East Africa.
            </p>
            <p>
              Our philosophy is simple: complexity belongs in the system, not on the user.
              Every pixel earns its place. Every interaction has a job. We bridge brand,
              engineering, and intuition so your site loads fast, looks sharp, and converts.
            </p>
          </div>
        </div>

        <div className="md:col-span-5 reveal" data-delay="120">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 mb-6">Experience</div>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {[
              { c: "Virello Studio", r: "Founder · Lead Designer", y: "2024 — Now" },
              { c: "Client Projects", r: "Web & Product Design", y: "2024 — Now" },
              { c: "Freelance", r: "UI / Frontend", y: "2022 — 2024" },
            ].map((e) => (
              <li key={e.c} className="py-5 flex items-baseline justify-between gap-4">
                <div>
                  <div className="font-display text-white text-[20px]">{e.c}</div>
                  <div className="text-[12px] text-white/55 mt-1">{e.r}</div>
                </div>
                <div className="text-[12px] text-white/55 whitespace-nowrap">{e.y}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Services (numbered) ---------------- */
const SERVICES = [
  {
    n: "01",
    title: "Web Design",
    body: "Custom-built websites that reflect your brand and turn visitors into customers. Pixel-perfect interfaces, designed mobile-first.",
  },
  {
    n: "02",
    title: "Digital Presence",
    body: "Landing pages, product pages, and launch-ready sites shipped in 2–3 weeks. From wireframe to live URL.",
  },
  {
    n: "03",
    title: "Performance & SEO",
    body: "Sub-3-second loads, semantic HTML, structured metadata. Built to rank, built to convert.",
  },
];

function Services() {
  return (
    <section id="services" className="px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-14">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#00C8FF] mb-4">Services</div>
          <h2 className="font-display text-white text-[44px] md:text-[64px] leading-[1.02] tracking-tight">
            What we <span className="italic text-[#00C8FF]">do.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="reveal p-8 md:p-10 bg-[#080c14] hover:bg-[#0d1322] transition-colors"
              data-delay={i * 100}
            >
              <div className="font-display text-[#00C8FF] text-[18px] mb-10">{s.n}</div>
              <h3 className="font-display text-white text-[28px] md:text-[32px] leading-tight">{s.title}</h3>
              <p className="text-[14px] text-white/65 mt-4 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <section className="px-6 md:px-10 py-28 md:py-36" style={{ background: "#0d1322" }}>
      <div className="max-w-[560px] mx-auto glass rounded-2xl p-10 md:p-14 text-center reveal">
        <h2 className="font-display italic text-white text-[40px] md:text-[52px] leading-tight">
          Let's build something.
        </h2>
        <p className="mt-5 text-[15px] text-[#7a8a9a] leading-relaxed">
          Based in Kampala. Building for East Africa and beyond. Reach out and let's talk about your
          project.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="font-display text-[#00C8FF] text-[20px] md:text-[24px] mt-8 inline-block hover:underline break-all"
        >
          {EMAIL}
        </a>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="px-6 md:px-10 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3 text-[13px] text-[#7a8a9a]">
        <div>
          <div className="font-display text-white text-[22px] mb-2">Virello</div>
          <p className="leading-relaxed">Web design studio. Kampala, Uganda.</p>
          <a href={`mailto:${EMAIL}`} className="mt-3 inline-block text-[#00C8FF] hover:underline">
            {EMAIL}
          </a>
        </div>
        <div>
          <div className="uppercase tracking-[0.15em] text-[11px] text-white/60 mb-3">Work</div>
          <ul className="space-y-1.5">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link to="/work/$slug" params={{ slug: p.slug }} className="hover:text-[#00C8FF] transition-colors">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right md:self-end">© 2026 Virello · Kampala, Uganda</div>
      </div>
    </footer>
  );
}

/* ---------------- Process strip ---------------- */
function Process() {
  const steps = [
    { n: "01", k: "Discover", v: "30-min call. We scope the project, agree timeline and price upfront." },
    { n: "02", k: "Design & build", v: "2–3 weeks. One round of revisions. You see progress every few days." },
    { n: "03", k: "Launch", v: "We ship, train you on edits, and stay available for 30 days of support." },
  ];
  return (
    <section className="px-6 md:px-10 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="glass rounded-2xl p-6 md:p-7 reveal"
              data-delay={i * 100}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[#00C8FF] font-display text-[20px]">{s.n}</span>
                <span className="uppercase tracking-[0.18em] text-[11px] text-white/60">{s.k}</span>
              </div>
              <p className="text-[14px] text-white/85 leading-relaxed">{s.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-[#7a8a9a] text-center reveal">
          From {STARTING_PRICE_DISPLAY} · Fixed scope · Fixed timeline · No retainers required.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Sticky CTA ---------------- */
function Pricing() {
  return (
    <section id="pricing" className="px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12 md:mb-16">
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              fontSize: "clamp(40px, 6vw, 64px)",
            }}
          >
            Pricing
          </h2>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11,
              color: "#7a8a9a",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Transparent · Fixed scope · {PRICING.paymentTerms}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {PRICING.packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className="glass rounded-2xl p-8 reveal relative flex flex-col"
              data-delay={i * 100}
              style={
                pkg.highlight
                  ? {
                      border: "1px solid rgba(0,200,255,0.45)",
                      boxShadow: "0 12px 40px rgba(0,200,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }
                  : undefined
              }
            >
              {pkg.highlight && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em]"
                  style={{
                    background: "#00C8FF",
                    color: "#080c14",
                    borderRadius: 999,
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                >
                  Most Popular
                </span>
              )}

              <h3 className="font-display text-white text-[28px] leading-tight">
                {pkg.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                {pkg.pricePrefix && (
                  <span className="text-[14px] text-[#7a8a9a]">{pkg.pricePrefix}</span>
                )}
                <span className="font-display text-white text-[34px] md:text-[40px]">
                  {formatUGX(pkg.price)}
                </span>
              </div>

              <p className="mt-3 text-[13px] text-[#7a8a9a] leading-relaxed">
                {pkg.tagline}
              </p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[13.5px] text-white/85 leading-relaxed"
                  >
                    <span className="text-[#00C8FF] mt-[2px]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={mailtoSubject(`New project — ${pkg.name} package`)}
                className="mt-8 inline-block text-center px-6 py-3 text-[13px] font-semibold transition-opacity"
                style={
                  pkg.highlight
                    ? { background: "#00C8FF", color: "#080c14" }
                    : {
                        border: "1px solid #00C8FF",
                        color: "#00C8FF",
                        background: "transparent",
                      }
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
                }}
              >
                Get started →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 glass rounded-2xl p-8 reveal">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#00C8FF] mb-5">
            Optional add-ons
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {PRICING.addons.map((addon) => (
              <li
                key={addon.name}
                className="flex items-baseline justify-between gap-4 pb-3 border-b border-white/5 sm:border-b-0"
              >
                <span className="text-[14px] text-white/85">{addon.name}</span>
                <span className="font-display text-[18px] text-[#00C8FF] whitespace-nowrap">
                  {formatUGX(addon.price)}
                  <span className="text-[12px] text-[#7a8a9a]">{addon.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-[12px] text-[#7a8a9a] reveal">
          {PRICING.paymentTerms} · All prices in Ugandan Shillings · No hidden fees
        </p>
      </div>
    </section>
  );
}

/* ---------------- Sticky CTA ---------------- */
function StickyCTA() {
  return (
    <section className="px-6 md:px-10 py-16 md:py-24">
      <div
        className="max-w-5xl mx-auto rounded-3xl p-10 md:p-16 reveal relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,200,255,0.08), rgba(255,255,255,0.02))",
          border: "1px solid rgba(0,200,255,0.25)",
        }}
      >
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <h3 className="font-display italic text-white text-[36px] md:text-[52px] leading-[1.05]">
              Like what you see?
            </h3>
            <p className="mt-4 text-[15px] md:text-[16px] text-white/75 max-w-xl leading-relaxed">
              Tell us about your project. We reply within one business day — usually faster.
            </p>
          </div>
          <a
            href={MAILTO}
            className="inline-block bg-[#00C8FF] text-[#080c14] px-7 py-4 text-[14px] font-semibold tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Start a project →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */
function Index() {
  useCustomCursor();
  useReveal();
  return (
    <main className="min-h-screen text-white relative" style={{ background: "#080c14" }}>
      <div className="global-noise" aria-hidden />
      <div className="relative" style={{ zIndex: 1 }}>
        <Nav />
        <Hero />
        <Process />
        <Projects />
        <Pricing />
        <StickyCTA />
        <Services />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
