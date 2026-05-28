import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { PROJECTS } from "@/lib/projects";
import { ProjectPreview } from "@/components/ProjectPreview";
import { STUDIO_EMAIL, mailtoSubject, PRICING, formatUGX, STARTING_PRICE_DISPLAY } from "@/lib/constants";

export const Route = createFileRoute("/")({ component: Index });

const EMAIL = STUDIO_EMAIL;
const MAILTO = mailtoSubject("New project enquiry");

const BLUE = "#00c2ff";
const BLUE2 = "#0057ff";
const BG = "#050505";
const PANEL = "#080810";

/* ─── Custom cursor ─── */
function useCustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.style.cssText = `position:fixed;top:0;left:0;width:6px;height:6px;border-radius:50%;background:${BLUE};pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform .15s ease,opacity .15s ease;box-shadow:0 0 8px ${BLUE};`;
    ring.style.cssText = `position:fixed;top:0;left:0;width:36px;height:36px;border-radius:50%;border:1.5px solid ${BLUE};pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .25s ease,height .25s ease,opacity .25s ease,border-color .25s ease;box-shadow:0 0 16px rgba(0,194,255,0.3);`;
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setHover = (on: boolean) => {
      if (on === hovering) return;
      hovering = on;
      if (on) {
        dot.style.transform = "translate(-50%,-50%) scale(0)";
        ring.style.width = "52px"; ring.style.height = "52px";
        ring.style.borderColor = BLUE; ring.style.opacity = "0.6";
      } else {
        dot.style.transform = "translate(-50%,-50%) scale(1)";
        ring.style.width = "36px"; ring.style.height = "36px";
        ring.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("[data-cursor='hide']")) { dot.style.opacity = "0"; ring.style.opacity = "0"; return; }
      dot.style.opacity = "1";
      setHover(!!(t?.closest("a,button,[data-cursor='hover']")));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      dot.remove(); ring.remove();
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);
}

/* ─── Reveal on scroll ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.transitionDelay = `${el.dataset.delay || "0"}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Fluid orb background ─── */
function FluidBg({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={style}>
      <div className="fluid-orb fluid-orb-1" style={{ top: "-15%", left: "-10%" }} />
      <div className="fluid-orb fluid-orb-2" style={{ top: "30%", right: "-8%" }} />
      <div className="fluid-orb fluid-orb-3" style={{ bottom: "10%", left: "35%" }} />
    </div>
  );
}

/* ─── Nav ─── */
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
      className="fixed top-0 inset-x-0 z-40 rise [animation-delay:.2s]"
      style={{ transition: "background 0.3s ease, backdrop-filter 0.3s ease" }}
    >
      <style>{`
        header.is-scrolled {
          background: rgba(5,5,5,0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
        <a href="#top" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: 20, color: "#f0f4ff", letterSpacing: "-0.04em", textDecoration: "none" }}>
          Virello<span style={{ color: BLUE }}>.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8" style={{ fontSize: 13, fontWeight: 500 }}>
          {[["#work","Work"],["#about","About"],["#pricing","Pricing"],["#contact","Contact"]].map(([href, label]) => (
            <a key={href} href={href} style={{ color: "rgba(240,244,255,0.6)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,244,255,0.6)")}
            >{label}</a>
          ))}
        </nav>
        <a
          href={`mailto:${EMAIL}`}
          style={{
            fontSize: 13, fontWeight: 700, padding: "9px 22px", borderRadius: 999,
            background: "linear-gradient(135deg, #00c2ff, #0057ff)",
            color: "#050505", textDecoration: "none", letterSpacing: "-0.01em",
            boxShadow: "0 0 24px rgba(0,87,255,0.35)",
            transition: "box-shadow 0.25s ease, opacity 0.25s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(0,87,255,0.55)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 24px rgba(0,87,255,0.35)")}
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

/* ─── Floating Data Card ─── */
function DataCard({ label, value, accent, floatClass, style }: {
  label: string; value: string; accent?: string; floatClass?: string; style?: React.CSSProperties;
}) {
  const color = accent || BLUE;
  return (
    <div
      className={floatClass}
      style={{
        background: "rgba(8,8,16,0.75)",
        border: `1px solid rgba(0,194,255,0.18)`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 16,
        padding: "14px 20px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,194,255,0.08), inset 0 1px 0 rgba(255,255,255,0.07)`,
        minWidth: 120,
        ...style,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,244,255,0.45)", textTransform: "uppercase", letterSpacing: "0.14em", marginTop: 5 }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section id="top" className="relative min-h-screen px-6 md:px-10 overflow-hidden pt-32 pb-20" style={{ background: BG }}>
      <div className="noise-overlay" />
      <FluidBg />

      <div className="relative max-w-7xl mx-auto w-full" style={{ zIndex: 2 }}>
        {/* Status bar */}
        <div className="flex items-center justify-between rise" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.4)" }}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="beacon-ping absolute inline-flex h-full w-full rounded-full" style={{ background: BLUE, opacity: 0.7 }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: BLUE, boxShadow: `0 0 8px ${BLUE}` }} />
            </span>
            <span style={{ color: BLUE }}>Available for projects</span>
          </div>
          <span>Est. 2024 — Kampala, UG</span>
        </div>

        {/* Headline */}
        <div className="mt-12 md:mt-16 relative">
          <h1 style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800,
            lineHeight: 0.9, letterSpacing: "-0.04em",
            fontSize: "clamp(72px, 13vw, 180px)", color: "#f0f4ff",
          }}>
            <span className="block rise">Virello</span>
            <span className="block rise gradient-text [animation-delay:.08s]" style={{ fontStyle: "italic" }}>
              Studio.
            </span>
          </h1>

          {/* Floating data cards — desktop only */}
          <div className="hidden lg:block">
            <div className="float-a absolute" style={{ top: "8%", right: "2%" }}>
              <DataCard value="5+" label="Projects Shipped" accent={BLUE} />
            </div>
            <div className="float-b absolute" style={{ top: "52%", right: "12%" }}>
              <DataCard value="2–3w" label="Avg Delivery" accent={BLUE2} />
            </div>
            <div className="float-c absolute" style={{ bottom: "-10%", right: "28%" }}>
              <DataCard value="100%" label="Fixed Scope" accent={BLUE} />
            </div>
          </div>
        </div>

        {/* Sub-row */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-6 rise [animation-delay:.22s]">
            <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "rgba(240,244,255,0.7)", lineHeight: 1.7, maxWidth: 520, fontWeight: 400 }}>
              A web design studio crafting fast, polished, conversion-ready
              digital experiences for businesses across Uganda & East Africa.
            </p>
          </div>
          <div className="md:col-span-3 rise [animation-delay:.32s]">
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.35)", marginBottom: 8 }}>Discipline</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#f0f4ff", lineHeight: 1.4, letterSpacing: "-0.02em" }}>
              Visual craft <span style={{ color: BLUE }}>+</span> System thinking
            </div>
          </div>
          <div className="md:col-span-3 rise [animation-delay:.42s] md:text-right">
            <a href="#contact" className="inline-flex items-center gap-3 group">
              <span
                style={{
                  height: 52, width: 52, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`,
                  color: "#050505", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 800, boxShadow: `0 0 32px rgba(0,87,255,0.45)`,
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 48px rgba(0,87,255,0.65)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px rgba(0,87,255,0.45)`; }}
              >→</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: "#f0f4ff", lineHeight: 1.2, textAlign: "left", letterSpacing: "-0.03em" }}>
                Start a<br /><span className="gradient-text" style={{ fontStyle: "italic" }}>project</span>
              </span>
            </a>
          </div>
        </div>

        {/* Stats strip — mobile */}
        <div className="mt-16 lg:hidden grid grid-cols-2 gap-4 reveal">
          <DataCard value="5+" label="Projects Shipped" accent={BLUE} />
          <DataCard value="2–3w" label="Avg Delivery" accent={BLUE2} />
          <DataCard value="100%" label="Fixed Scope" accent={BLUE} />
          <DataCard value="UG" label="Kampala Based" accent={BLUE2} />
        </div>

        {/* Bottom rule */}
        <div className="mt-20 md:mt-28 border-t reveal" style={{ borderColor: "rgba(255,255,255,0.07)", paddingTop: 28 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: "5+", l: "Projects Shipped" },
              { v: "2–3w", l: "Delivery" },
              { v: "100%", l: "Fixed Scope" },
              { v: "UG", l: "Kampala Based" },
            ].map((s) => (
              <div key={s.l} className="hidden lg:block">
                <div style={{ fontSize: 42, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,244,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Process ─── */
function Process() {
  const steps = [
    { n: "01", k: "Discover", v: "30-min call. We scope the project, agree timeline and price upfront." },
    { n: "02", k: "Design & build", v: "2–3 weeks. One round of revisions. You see progress every few days." },
    { n: "03", k: "Launch", v: "We ship, train you on edits, and stay available for 30 days of support." },
  ];
  return (
    <section className="px-6 md:px-10 pb-10 md:pb-16" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="refract-border reveal"
              data-delay={i * 100}
              style={{
                background: "rgba(8,8,16,0.6)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 20,
                padding: "28px 28px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(0,194,255,0.3)";
                el.style.boxShadow = `0 0 40px rgba(0,87,255,0.1)`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.08)";
                el.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em" }}>{s.n}</span>
                <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.5)" }}>{s.k}</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(240,244,255,0.8)", lineHeight: 1.7, fontWeight: 400 }}>{s.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center reveal" style={{ fontSize: 12, color: "#5a6a80", letterSpacing: "0.04em" }}>
          From {STARTING_PRICE_DISPLAY} · Fixed scope · Fixed timeline · No retainers
        </p>
      </div>
    </section>
  );
}

/* ─── Project card ─── */
type ProjectLike = (typeof PROJECTS)[number];

function ProjectCard({ p, tall, delay, priority }: { p: ProjectLike; tall?: boolean; delay: number; priority?: boolean }) {
  const iframeH = tall === undefined ? 200 : tall ? 220 : 160;
  return (
    <article
      className="overflow-hidden group reveal refract-border"
      data-delay={delay}
      style={{
        background: "rgba(8,8,16,0.75)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = `rgba(0,194,255,0.3)`;
        el.style.boxShadow = `0 16px 60px rgba(0,87,255,0.12), 0 0 0 1px rgba(0,194,255,0.15), inset 0 1px 0 rgba(255,255,255,0.07)`;
        el.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)";
        el.style.transform = "translateY(0)";
      }}
    >
      <ProjectPreview project={p} priority={priority} height={iframeH} />
      <div style={{ padding: "20px 22px 22px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          color: BLUE, background: "rgba(0,194,255,0.08)", border: `1px solid rgba(0,194,255,0.2)`,
          borderRadius: 999, padding: "4px 12px",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: BLUE, display: "inline-block", boxShadow: `0 0 6px ${BLUE}` }} />
          {p.tag}
        </span>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.03em", margin: "12px 0 6px", lineHeight: 1.2 }}>
          {p.name}
        </h3>
        <p style={{ fontSize: 13, color: "#5a6a80", lineHeight: 1.65, fontWeight: 400 }}>
          {p.description}
        </p>
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="stack-chip" style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 6, fontSize: 11, color: "rgba(240,244,255,0.55)", padding: "3px 9px", fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
          <Link to="/work/$slug" params={{ slug: p.slug }} className="visit-link" style={{
            fontSize: 12, fontWeight: 700, color: BLUE, letterSpacing: "0.04em", textDecoration: "none",
          }}>
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
    <section id="work" className="px-6 md:px-10 py-28 md:py-40 relative" style={{ background: BG }}>
      <FluidBg style={{ opacity: 0.5 }} />
      <div className="relative max-w-7xl mx-auto" style={{ zIndex: 2 }}>
        <div className="reveal mb-14">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BLUE, marginBottom: 14 }}>Selected Work</div>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.04em", lineHeight: 1, fontSize: "clamp(40px, 6vw, 72px)" }}>
            Built for results.
          </h2>
          <p style={{ fontSize: 11, color: "#5a6a80", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 10, fontWeight: 600 }}>
            Client projects · 2024–2025
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-start">
          <div className="flex flex-col gap-5 md:gap-6">
            <ProjectCard p={left[0]} tall delay={0} priority />
            <ProjectCard p={left[1]} tall delay={200} />
          </div>
          <div className="flex flex-col gap-5 md:gap-6 md:mt-14">
            <ProjectCard p={right[0]} tall={false} delay={100} />
            <ProjectCard p={right[1]} tall={false} delay={300} />
          </div>
        </div>
        <div className="mt-5 md:mt-6 mx-auto w-full md:w-1/2">
          <ProjectCard p={odd} delay={500} />
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-28 md:py-40 relative" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-7 reveal">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BLUE, marginBottom: 20 }}>About</div>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#f0f4ff", fontSize: "clamp(36px, 5.5vw, 72px)", lineHeight: 1.0, letterSpacing: "-0.04em" }}>
            The user is the<br />
            <span className="gradient-text" style={{ fontStyle: "italic" }}>only reality.</span>
          </h2>
          <div className="mt-10 space-y-5" style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(240,244,255,0.7)", lineHeight: 1.75, maxWidth: 520 }}>
            <p>Virello is a Kampala-based web design studio building digital products for businesses across Uganda and East Africa.</p>
            <p>Our philosophy is simple: complexity belongs in the system, not on the user. Every pixel earns its place. Every interaction has a job. We bridge brand, engineering, and intuition so your site loads fast, looks sharp, and converts.</p>
          </div>
        </div>

        <div className="md:col-span-5 reveal" data-delay="120">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.4)", marginBottom: 20 }}>Experience</div>
          <ul style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { c: "Virello Studio", r: "Founder · Lead Designer", y: "2024 — Now" },
              { c: "Client Projects", r: "Web & Product Design", y: "2024 — Now" },
              { c: "Freelance", r: "UI / Frontend", y: "2022 — 2024" },
            ].map((e) => (
              <li key={e.c} className="py-5 flex items-baseline justify-between gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#f0f4ff", letterSpacing: "-0.02em" }}>{e.c}</div>
                  <div style={{ fontSize: 12, color: "#5a6a80", marginTop: 4, fontWeight: 500 }}>{e.r}</div>
                </div>
                <div style={{ fontSize: 12, color: "#5a6a80", whiteSpace: "nowrap", fontWeight: 500 }}>{e.y}</div>
              </li>
            ))}
          </ul>

          {/* Floating metric cards */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { v: "Sub-3s", l: "Page loads" },
              { v: "Mobile", l: "First design" },
            ].map((m, i) => (
              <DataCard key={m.l} value={m.v} label={m.l} accent={i === 0 ? BLUE : BLUE2} floatClass={i === 0 ? "float-a" : "float-b"} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
const SERVICES = [
  { n: "01", title: "Web Design", body: "Custom-built websites that reflect your brand and turn visitors into customers. Pixel-perfect interfaces, designed mobile-first." },
  { n: "02", title: "Digital Presence", body: "Landing pages, product pages, and launch-ready sites shipped in 2–3 weeks. From wireframe to live URL." },
  { n: "03", title: "Performance & SEO", body: "Sub-3-second loads, semantic HTML, structured metadata. Built to rank, built to convert." },
];

function Services() {
  return (
    <section id="services" className="px-6 md:px-10 py-24 md:py-32 relative" style={{ background: BG }}>
      <FluidBg style={{ opacity: 0.4 }} />
      <div className="relative max-w-7xl mx-auto" style={{ zIndex: 2 }}>
        <div className="reveal mb-14">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BLUE, marginBottom: 14 }}>Services</div>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#f0f4ff", fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.04em" }}>
            What we <span className="gradient-text" style={{ fontStyle: "italic" }}>do.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="service-card refract-border reveal"
              data-delay={i * 100}
              style={{
                padding: "36px 32px",
                background: "rgba(8,8,16,0.65)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: 20,
              }}
            >
              <div className="gradient-text mb-10" style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.1em" }}>{s.n}</div>
              <h3 style={{ fontWeight: 800, fontSize: "clamp(24px, 2.5vw, 30px)", color: "#f0f4ff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(240,244,255,0.6)", marginTop: 14, lineHeight: 1.7, fontWeight: 400 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  return (
    <section id="pricing" className="px-6 md:px-10 py-24 md:py-32 relative" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-14">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BLUE, marginBottom: 14 }}>Pricing</div>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#f0f4ff", fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.0, letterSpacing: "-0.04em" }}>
            Transparent.
          </h2>
          <p style={{ fontSize: 11, color: "#5a6a80", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 10, fontWeight: 600 }}>
            Fixed scope · {PRICING.paymentTerms}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PRICING.packages.map((pkg, i) => {
            const highlighted = pkg.highlight;
            return (
              <div
                key={pkg.id}
                className="reveal flex flex-col relative refract-border"
                data-delay={i * 100}
                style={{
                  borderRadius: 20,
                  padding: "32px 28px",
                  background: highlighted
                    ? "linear-gradient(160deg, rgba(0,87,255,0.12) 0%, rgba(0,194,255,0.06) 100%)"
                    : "rgba(8,8,16,0.7)",
                  border: highlighted
                    ? `1px solid rgba(0,194,255,0.35)`
                    : "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: highlighted
                    ? `0 0 60px rgba(0,87,255,0.15), 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,194,255,0.15)`
                    : "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {highlighted && (
                  <span style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 16px", fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.15em", borderRadius: 999,
                    background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`,
                    color: "#050505",
                    boxShadow: `0 0 20px rgba(0,87,255,0.4)`,
                  }}>Most Popular</span>
                )}

                <h3 style={{ fontWeight: 800, fontSize: 24, color: "#f0f4ff", letterSpacing: "-0.03em" }}>{pkg.name}</h3>

                <div className="mt-4 flex items-baseline gap-1">
                  {pkg.pricePrefix && <span style={{ fontSize: 13, color: "#5a6a80", fontWeight: 500 }}>{pkg.pricePrefix}</span>}
                  <span style={{ fontWeight: 800, fontSize: "clamp(26px, 3vw, 34px)", color: "#f0f4ff", letterSpacing: "-0.04em" }}>
                    {formatUGX(pkg.price)}
                  </span>
                </div>

                <p style={{ marginTop: 10, fontSize: 13, color: "#5a6a80", lineHeight: 1.6, fontWeight: 400 }}>{pkg.tagline}</p>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3" style={{ fontSize: 13.5, color: "rgba(240,244,255,0.85)", lineHeight: 1.6 }}>
                      <span style={{ color: BLUE, marginTop: 2, fontWeight: 700, fontSize: 12 }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={mailtoSubject(`New project — ${pkg.name} package`)}
                  style={{
                    marginTop: 28,
                    display: "block",
                    textAlign: "center",
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                    transition: "opacity 0.2s ease, box-shadow 0.2s ease",
                    ...(highlighted
                      ? { background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`, color: "#050505", boxShadow: `0 0 24px rgba(0,87,255,0.35)` }
                      : { border: `1px solid rgba(0,194,255,0.3)`, color: BLUE, background: "transparent" }),
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Get started →
                </a>
              </div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="mt-10 reveal" style={{
          borderRadius: 20, padding: "28px 32px",
          background: "rgba(8,8,16,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BLUE, marginBottom: 18 }}>Optional Add-ons</div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {PRICING.addons.map((addon) => (
              <li key={addon.name} className="flex items-baseline justify-between gap-4 pb-3 sm:pb-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 14, color: "rgba(240,244,255,0.8)", fontWeight: 500 }}>{addon.name}</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: BLUE, whiteSpace: "nowrap" }}>
                  {formatUGX(addon.price)}<span style={{ fontSize: 11, color: "#5a6a80", fontWeight: 500 }}>{addon.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-7 text-center reveal" style={{ fontSize: 12, color: "#5a6a80" }}>
          {PRICING.paymentTerms} · All prices in Ugandan Shillings · No hidden fees
        </p>
      </div>
    </section>
  );
}

/* ─── StickyCTA ─── */
function StickyCTA() {
  return (
    <section className="px-6 md:px-10 py-16 md:py-24" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto reveal relative overflow-hidden" style={{
        borderRadius: 24, padding: "48px 40px md:64px",
        background: "linear-gradient(135deg, rgba(0,87,255,0.1) 0%, rgba(0,194,255,0.06) 50%, rgba(0,40,180,0.08) 100%)",
        border: "1px solid rgba(0,194,255,0.2)",
        boxShadow: "0 0 80px rgba(0,87,255,0.1), 0 8px 40px rgba(0,0,0,0.4)",
      }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,194,255,0.5), transparent)" }} />
        <div className="noise-overlay" style={{ opacity: 0.03 }} />
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <h3 style={{ fontWeight: 800, fontSize: "clamp(30px, 4.5vw, 52px)", color: "#f0f4ff", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              Like what you see?
            </h3>
            <p style={{ marginTop: 14, fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(240,244,255,0.7)", maxWidth: 480, lineHeight: 1.7 }}>
              Tell us about your project. We reply within one business day — usually faster.
            </p>
          </div>
          <a
            href={MAILTO}
            style={{
              display: "inline-block", whiteSpace: "nowrap",
              padding: "16px 32px", borderRadius: 12,
              background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`,
              color: "#050505", fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em",
              textDecoration: "none",
              boxShadow: "0 0 32px rgba(0,87,255,0.4)",
              transition: "box-shadow 0.25s ease, opacity 0.25s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 56px rgba(0,87,255,0.6)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(0,87,255,0.4)")}
          >
            Start a project →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <section id="contact" className="px-6 md:px-10 py-28 md:py-36 relative" style={{ background: PANEL }}>
      <FluidBg style={{ opacity: 0.6 }} />
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-12 gap-14 md:gap-20" style={{ zIndex: 2 }}>
        <div className="md:col-span-6 reveal">
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BLUE, marginBottom: 20 }}>Contact</div>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, color: "#f0f4ff", fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            Ready to<br />
            start the<br />
            <span className="gradient-text" style={{ fontStyle: "italic" }}>project?</span>
          </h2>
          <p style={{ marginTop: 28, fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(240,244,255,0.65)", maxWidth: 420, lineHeight: 1.7 }}>
            Currently accepting new projects. Tell us about yours — we reply within one business day, usually faster.
          </p>
        </div>
        <div className="md:col-span-6 reveal" data-delay="120">
          <div className="space-y-10">
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.35)", marginBottom: 12 }}>Email</div>
              <a
                href={`mailto:${EMAIL}`}
                style={{ fontWeight: 800, fontSize: "clamp(18px, 2.5vw, 26px)", color: "#f0f4ff", textDecoration: "none", letterSpacing: "-0.03em", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = "#f0f4ff")}
              >{EMAIL}</a>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.35)", marginBottom: 12 }}>Studio</div>
              <div style={{ color: "rgba(240,244,255,0.85)", fontSize: 16, fontWeight: 600 }}>Kampala, Uganda</div>
              <div style={{ color: "#5a6a80", fontSize: 13, marginTop: 5, fontWeight: 400 }}>Working remotely across East Africa</div>
            </div>
            <a href={MAILTO} className="inline-flex items-center gap-4 group">
              <span style={{
                height: 60, width: 60, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`,
                color: "#050505", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800,
                boxShadow: `0 0 36px rgba(0,87,255,0.45)`,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.1)"; el.style.boxShadow = `0 0 56px rgba(0,87,255,0.65)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1)"; el.style.boxShadow = `0 0 36px rgba(0,87,255,0.45)`; }}
              >→</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: "#f0f4ff", letterSpacing: "-0.03em" }}>Send a brief</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="px-6 md:px-10 py-12" style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3" style={{ fontSize: 13, color: "#5a6a80" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "#f0f4ff", letterSpacing: "-0.04em", marginBottom: 8 }}>Virello</div>
          <p style={{ lineHeight: 1.65, fontWeight: 400 }}>Web design studio. Kampala, Uganda.</p>
          <a href={`mailto:${EMAIL}`} style={{ marginTop: 10, display: "inline-block", color: BLUE, textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >{EMAIL}</a>
        </div>
        <div>
          <div style={{ textTransform: "uppercase", letterSpacing: "0.15em", fontSize: 10, color: "rgba(240,244,255,0.4)", fontWeight: 700, marginBottom: 14 }}>Work</div>
          <ul className="space-y-2">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link to="/work/$slug" params={{ slug: p.slug }} style={{ color: "#5a6a80", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = BLUE)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#5a6a80")}
                >{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right md:self-end" style={{ fontWeight: 500 }}>© 2026 Virello · Kampala, Uganda</div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
function Index() {
  useCustomCursor();
  useReveal();
  return (
    <main className="min-h-screen relative" style={{ background: BG, color: "#f0f4ff" }}>
      <div className="global-noise" aria-hidden />
      <div className="relative" style={{ zIndex: 1 }}>
        <Nav />
        <Hero />
        <Process />
        <Projects />
        <About />
        <Pricing />
        <StickyCTA />
        <Services />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
