import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/lib/projects";
import { ProjectPreview } from "@/components/ProjectPreview";
import {
  STUDIO_EMAIL,
  mailtoSubject,
  PRICING,
  formatUGX,
  STARTING_PRICE_DISPLAY,
} from "@/lib/constants";

export const Route = createFileRoute("/")({ component: Index });

const B1 = "#00c2ff";
const B2 = "#0057ff";
const BG = "#050505";
const PANEL = "#09090f";
const MAILTO = mailtoSubject("New project enquiry");
const EMAIL = STUDIO_EMAIL;

/* ─── SVG liquid-glass filter (injected once, referenced by id) ─── */
function LiquidFilter() {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter
          id="liq"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.007"
            numOctaves="4"
            seed="11"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.008 0.007;0.013 0.009;0.007 0.012;0.011 0.006;0.008 0.007"
              dur="32s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="55"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── Custom cursor ─── */
function useCustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;
    const dot = Object.assign(document.createElement("div"), {});
    const ring = Object.assign(document.createElement("div"), {});
    dot.style.cssText = `position:fixed;top:0;left:0;width:6px;height:6px;border-radius:50%;background:${B1};pointer-events:none;z-index:9999;transform:translate(-50%,-50%);box-shadow:0 0 10px ${B1};`;
    ring.style.cssText = `position:fixed;top:0;left:0;width:38px;height:38px;border-radius:50%;border:1.5px solid ${B1};pointer-events:none;z-index:9998;transform:translate(-50%,-50%);box-shadow:0 0 20px rgba(0,194,255,0.25);transition:width .25s,height .25s,border-color .25s,opacity .25s;`;
    document.body.append(dot, ring);
    document.documentElement.classList.add("no-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
      const t = e.target as HTMLElement | null;
      const h = !!(t?.closest("a,button,[data-hover]"));
      dot.style.transform = `translate(-50%,-50%) scale(${h ? 0 : 1})`;
      ring.style.width = h ? "52px" : "38px";
      ring.style.height = h ? "52px" : "38px";
    };
    const loop = () => {
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      dot.remove(); ring.remove();
      document.documentElement.classList.remove("no-cursor");
    };
  }, []);
}

/* ─── Mouse parallax via CSS vars ─── */
function useParallax() {
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / innerWidth - 0.5).toFixed(4);
        const y = (e.clientY / innerHeight - 0.5).toFixed(4);
        document.documentElement.style.setProperty("--px", x);
        document.documentElement.style.setProperty("--py", y);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

/* ─── Scroll reveal ─── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${el.dataset.d || 0}ms`;
          el.classList.add("vis");
          io.unobserve(el);
        }
      }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Floating pill nav ─── */
function Nav() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => ref.current?.classList.toggle("scrolled", scrollY > 30);
    addEventListener("scroll", fn, { passive: true });
    return () => removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", fn);
    return () => removeEventListener("keydown", fn);
  }, []);

  const links = [["#work","Work"],["#about","About"],["#services","Services"],["#pricing","Pricing"],["#contact","Contact"]];

  return (
    <>
      <div ref={ref} className="nav-pill en" style={{ animationDelay: ".15s" }}>
        {/* Logo */}
        <a href="#top" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 800, fontSize: 19, color: "#f0f4ff", letterSpacing: "-0.045em", textDecoration: "none", flexShrink: 0 }}>
          Virello<span style={{ color: B1 }}>.</span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6" style={{ fontSize: 13, fontWeight: 500 }}>
          {links.map(([href, label]) => (
            <a key={href} href={href} style={{ color: "rgba(240,244,255,0.5)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0f4ff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,244,255,0.5)")}
            >{label}</a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a href={`mailto:${EMAIL}`} data-hover className="hidden sm:block"
            style={{ fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 999,
              background: `linear-gradient(135deg,${B1},${B2})`,
              color: "#050505", textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: `0 0 24px rgba(0,87,255,0.3)`,
              transition: "box-shadow .25s ease, opacity .2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px rgba(0,87,255,0.55)`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 24px rgba(0,87,255,0.3)`)}
          >
            Get in touch
          </a>
          <button
            data-hover onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            style={{ background: "none", border: "none", cursor: "none" }}
            aria-label="Toggle menu"
          >
            <span style={{ display: "block", width: 22, height: 1.5, background: "#f0f4ff", borderRadius: 2, transition: "transform .3s, opacity .3s", transform: open ? "translateY(5.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "#f0f4ff", borderRadius: 2, transition: "opacity .3s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "#f0f4ff", borderRadius: 2, transition: "transform .3s, opacity .3s", transform: open ? "translateY(-5.5px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mob-menu md:hidden fixed inset-x-4 z-50"
          style={{ top: 90, borderRadius: 16, padding: "12px 8px",
            background: "rgba(9,9,15,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "14px 20px", fontSize: 18, fontWeight: 700,
                color: "#f0f4ff", textDecoration: "none", letterSpacing: "-0.02em",
                borderRadius: 10, transition: "background .2s, color .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,194,255,0.08)"; e.currentTarget.style.color = B1; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#f0f4ff"; }}
            >{label}</a>
          ))}
          <div style={{ padding: "8px 12px 4px" }}>
            <a href={`mailto:${EMAIL}`} onClick={() => setOpen(false)}
              style={{ display: "block", textAlign: "center", padding: "13px",
                borderRadius: 10, background: `linear-gradient(135deg,${B1},${B2})`,
                color: "#050505", fontWeight: 800, fontSize: 14, textDecoration: "none",
              }}
            >Get in touch →</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Floating data pill ─── */
function Pill({ value, label, flt, style }: { value: string; label: string; flt?: string; style?: React.CSSProperties }) {
  return (
    <div className={flt} style={{
      background: "rgba(9,9,15,0.78)",
      border: "1px solid rgba(0,194,255,0.18)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderRadius: 14, padding: "14px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,194,255,0.06), inset 0 1px 0 rgba(255,255,255,0.07)",
      ...style,
    }}>
      <div style={{ fontWeight: 800, fontSize: 24, color: B1, letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(240,244,255,0.4)", marginTop: 5 }}>{label}</div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section id="top" style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: BG, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "clamp(48px, 8vw, 96px)" }}>
      {/* Liquid filter def */}
      <LiquidFilter />

      {/* Liquid glass shapes — filtered for real distortion */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ filter: "url(#liq)", position: "absolute", inset: 0, zIndex: 0 }}>
          <div className="lq-shape lq-a p-s" />
          <div className="lq-shape lq-b p-m" />
          <div className="lq-shape lq-c p-f" />
        </div>
        {/* Soft glow beneath shapes, not filtered */}
        <div className="p-f" style={{ position: "absolute", top: "5%", left: "5%", width: "45vw", height: "45vw", maxWidth: 600, maxHeight: 600,
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,87,255,0.12) 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none" }} />
        <div className="p-m" style={{ position: "absolute", top: "20%", right: "0%", width: "35vw", height: "35vw", maxWidth: 480, maxHeight: 480,
          background: `radial-gradient(ellipse at 50% 50%, rgba(0,194,255,0.1) 0%, transparent 65%)`,
          filter: "blur(60px)", pointerEvents: "none" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 clamp(20px, 5vw, 60px)", paddingTop: "clamp(110px, 18vh, 160px)" }}>

        {/* Top meta row */}
        <div className="en" style={{ animationDelay: ".3s", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(40px, 7vw, 72px)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(240,244,255,0.38)" }}>
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="beacon-ring absolute inline-flex h-full w-full rounded-full" style={{ background: B1, opacity: 0.7 }} />
              <span className="relative h-2 w-2 rounded-full" style={{ background: B1, boxShadow: `0 0 8px ${B1}`, display: "inline-flex" }} />
            </span>
            <span style={{ color: B1 }}>Available · Starting from {STARTING_PRICE_DISPLAY}</span>
          </span>
          <span className="hidden sm:block">Est. 2024 · Kampala, UG</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.88, margin: 0, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
          <div className="clip-line en" style={{ animationDelay: ".38s" }}>
            <span className="inner" style={{ display: "block", fontSize: "clamp(64px, 13.5vw, 196px)", color: "#f0f4ff" }}>We design</span>
          </div>
          <div className="clip-line en" style={{ animationDelay: ".48s" }}>
            <span className="inner g-text" style={{ display: "block", fontSize: "clamp(64px, 13.5vw, 196px)", fontStyle: "italic" }}>digital</span>
          </div>
          <div className="clip-line en" style={{ animationDelay: ".56s" }}>
            <span className="inner" style={{ display: "block", fontSize: "clamp(64px, 13.5vw, 196px)", color: "#f0f4ff" }}>futures.</span>
          </div>
        </h1>

        {/* Bottom row */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12" style={{ marginTop: "clamp(36px, 6vw, 64px)" }}>
          <div className="md:col-span-1 en" style={{ animationDelay: ".68s" }}>
            <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "rgba(240,244,255,0.6)", lineHeight: 1.75, margin: 0 }}>
              A Kampala-based web design studio crafting fast, polished digital experiences for businesses across East Africa.
            </p>
          </div>
          <div className="md:col-span-1 hidden md:flex items-end justify-center en" style={{ animationDelay: ".72s" }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <Pill value="5+" label="Projects shipped" flt="flt-a" />
              <Pill value="2–3w" label="Delivery" flt="flt-b" />
            </div>
          </div>
          <div className="md:col-span-1 flex md:justify-end items-end en" style={{ animationDelay: ".78s" }}>
            <div>
              <a href={MAILTO} data-hover
                style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none" }}
                onMouseEnter={e => { const b = e.currentTarget.querySelector<HTMLElement>(".cta-circle"); if (b) { b.style.transform = "scale(1.12)"; b.style.boxShadow = `0 0 56px rgba(0,87,255,0.65)`; } }}
                onMouseLeave={e => { const b = e.currentTarget.querySelector<HTMLElement>(".cta-circle"); if (b) { b.style.transform = "scale(1)"; b.style.boxShadow = `0 0 36px rgba(0,87,255,0.4)`; } }}
              >
                <span className="cta-circle" style={{ width: 58, height: 58, borderRadius: "50%",
                  background: `linear-gradient(135deg,${B1},${B2})`,
                  color: "#050505", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 800, boxShadow: `0 0 36px rgba(0,87,255,0.4)`,
                  transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease", flexShrink: 0,
                }}>→</span>
                <span style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 22px)", color: "#f0f4ff", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                  Start a<br/><span className="g-text" style={{ fontStyle: "italic" }}>project</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Floating pills — desktop */}
        <div className="hidden lg:block">
          <div className="flt-c" style={{ position: "absolute", right: "6%", top: "22%", zIndex: 3 }}>
            <Pill value="100%" label="Fixed scope" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: `linear-gradient(to top, ${BG}, transparent)`, pointerEvents: "none", zIndex: 3 }} />
    </section>
  );
}

/* ─── Marquee ticker ─── */
function Marquee() {
  const items = [
    "Web Design", "Digital Products", "Kampala", "East Africa",
    "React", "Tailwind CSS", "Supabase", "Framer Motion",
    "Real Estate", "Consulting", "Fitness", "Sports",
    "Responsive", "Fast", "Premium",
  ];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: PANEL, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 0", overflow: "hidden" }}>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className="marquee-item">
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,244,255,0.35)" }}>{item}</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: B1, display: "inline-block", opacity: 0.5 }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Bento project card ─── */
type P = (typeof PROJECTS)[number];
function BentoCard({ p, height, priority }: { p: P; height?: number; priority?: boolean }) {
  return (
    <article className="bento refract-ring" style={{
      borderRadius: 20,
      background: "rgba(9,9,15,0.8)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      overflow: "hidden",
    }}>
      <ProjectPreview project={p} priority={priority} height={height ?? 220} />
      <div style={{ padding: "18px 22px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
            color: B1, background: "rgba(0,194,255,0.07)",
            border: `1px solid rgba(0,194,255,0.18)`,
            borderRadius: 999, padding: "3px 10px",
          }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: B1, boxShadow: `0 0 6px ${B1}`, display: "inline-block" }} />
            {p.tag}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,244,255,0.28)", letterSpacing: "0.1em" }}>{p.year}</span>
        </div>
        <h3 style={{ fontWeight: 800, fontSize: "clamp(20px, 2vw, 26px)", color: "#f0f4ff", letterSpacing: "-0.03em", margin: "0 0 6px", lineHeight: 1.15 }}>{p.name}</h3>
        <p style={{ fontSize: 13, color: "#4a5a70", lineHeight: 1.6, margin: "0 0 14px" }}>{p.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {p.stack.map((s) => (
              <span key={s} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 5, fontSize: 10, color: "rgba(240,244,255,0.45)", padding: "2px 8px", fontWeight: 500 }}>{s}</span>
            ))}
          </div>
          <Link to="/work/$slug" params={{ slug: p.slug }} data-hover style={{ fontSize: 11, fontWeight: 700, color: B1, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, transition: "gap .2s ease" }}
            onMouseEnter={e => (e.currentTarget.style.gap = "8px")}
            onMouseLeave={e => (e.currentTarget.style.gap = "4px")}
          >Case study →</Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Work section — bento grid ─── */
function Work() {
  const [a, b, c, d, e] = PROJECTS;
  return (
    <section id="work" style={{ background: BG, padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(32px, 5vw, 56px)", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 12 }}>Selected Work</div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(36px, 6vw, 80px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.93, margin: 0 }}>
              Built for<br /><span className="g-text" style={{ fontStyle: "italic" }}>results.</span>
            </h2>
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "#4a5a70", maxWidth: 180, textAlign: "right", lineHeight: 1.5 }}>
            Client projects<br />2024–2025
          </p>
        </div>

        {/* Bento grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto auto", gap: "clamp(10px, 1.2vw, 16px)" }}>
          {/* Row 1: 2/3 + 1/3 */}
          <div className="rv" style={{ gridColumn: "1 / 3", gridRow: "1" }} data-d="0">
            <BentoCard p={a} height={260} priority />
          </div>
          <div className="rv" style={{ gridColumn: "3 / 4", gridRow: "1" }} data-d="80">
            <BentoCard p={b} height={260} />
          </div>
          {/* Row 2: 1/3 + 2/3 */}
          <div className="rv" style={{ gridColumn: "1 / 2", gridRow: "2" }} data-d="120">
            <BentoCard p={c} height={200} />
          </div>
          <div className="rv" style={{ gridColumn: "2 / 4", gridRow: "2" }} data-d="180">
            <BentoCard p={d} height={200} />
          </div>
          {/* Row 3: full width */}
          <div className="rv" style={{ gridColumn: "1 / 4", gridRow: "3" }} data-d="240">
            <BentoCard p={e} height={220} />
          </div>
        </div>

        {/* Mobile: single column fallback */}
        <style>{`@media(max-width:768px){#work-bento{display:flex!important;flex-direction:column}}`}</style>
        <div id="work-bento" style={{ display: "none" }}>
          {PROJECTS.map((p, i) => (
            <div key={p.slug} className="rv" data-d={i * 80}>
              <BentoCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services — numbered list ─── */
const SVCS = [
  { n: "01", title: "Web Design", body: "Custom-built websites that reflect your brand, load fast, and convert visitors. Designed mobile-first, pixel-perfect on every screen." },
  { n: "02", title: "Digital Presence", body: "Landing pages and product sites shipped in 2–3 weeks. From wireframe to live URL — scope, timeline, and price locked upfront." },
  { n: "03", title: "Performance & SEO", body: "Sub-3-second page loads, semantic HTML, and structured metadata. Sites that rank, load, and convert from day one." },
  { n: "04", title: "Brand & Visual Identity", body: "Consistent design language across your website, materials, and touchpoints — so your brand looks intentional everywhere." },
];

function Services() {
  return (
    <section id="services" style={{ background: PANEL, padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 6vw, 80px)", alignItems: "start" }}>
          {/* Left: headline */}
          <div className="rv" style={{ gridColumn: "1 / 2" }}>
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 16 }}>Services</div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(36px, 5vw, 72px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.93, margin: "0 0 24px" }}>
              What we <span className="g-text" style={{ fontStyle: "italic" }}>do.</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.4vw, 15px)", color: "rgba(240,244,255,0.55)", lineHeight: 1.75, maxWidth: 360, margin: 0 }}>
              From first conversation to live site in 2–3 weeks. Scoped, priced, and delivered — no surprises.
            </p>
            <div className="rv" data-d="200" style={{ marginTop: "clamp(28px, 4vw, 48px)" }}>
              <a href={MAILTO} data-hover style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "12px 24px", borderRadius: 10,
                background: `linear-gradient(135deg,${B1},${B2})`,
                color: "#050505", fontWeight: 800, fontSize: 13, letterSpacing: "-0.01em",
                textDecoration: "none", boxShadow: `0 0 28px rgba(0,87,255,0.3)`,
                transition: "box-shadow .25s, opacity .2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 48px rgba(0,87,255,0.55)`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 28px rgba(0,87,255,0.3)`)}
              >Start a project →</a>
            </div>
          </div>

          {/* Right: numbered list */}
          <div className="rv" data-d="100" style={{ gridColumn: "2 / 3" }}>
            {SVCS.map((s) => (
              <div key={s.n} className="svc-row">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flex: 1 }}>
                  <span className="svc-num">{s.n}</span>
                  <div>
                    <div className="svc-title" style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}>{s.title}</div>
                    <div className="svc-desc">{s.body}</div>
                  </div>
                </div>
                <span className="svc-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: stack */}
        <style>{`@media(max-width:768px){#svc-grid{grid-template-columns:1fr!important}#svc-grid>div:first-child,#svc-grid>div:last-child{grid-column:1/2!important}}`}</style>
        <div id="svc-grid" style={{ display: "none" }} />
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section id="about" style={{ background: BG, padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="rule rv" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px, 6vw, 80px)", marginTop: "clamp(40px, 6vw, 80px)", alignItems: "start" }}>
          {/* Left */}
          <div className="rv">
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 20 }}>About</div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(36px, 5.5vw, 80px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.9, margin: "0 0 32px" }}>
              User is the<br /><span className="g-text" style={{ fontStyle: "italic" }}>only reality.</span>
            </h2>
            <div style={{ maxWidth: 440 }}>
              <p style={{ fontSize: "clamp(14px, 1.4vw, 15px)", color: "rgba(240,244,255,0.65)", lineHeight: 1.8, margin: "0 0 16px" }}>
                Virello is a Kampala-based web design studio building digital experiences for businesses across Uganda and East Africa.
              </p>
              <p style={{ fontSize: "clamp(14px, 1.4vw, 15px)", color: "rgba(240,244,255,0.65)", lineHeight: 1.8, margin: 0 }}>
                Complexity belongs in the system, not on the user. Every pixel earns its place. Every interaction has a purpose.
              </p>
            </div>
          </div>

          {/* Right: experience + pills */}
          <div className="rv" data-d="120">
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(240,244,255,0.3)", marginBottom: 20 }}>Experience</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {[
                { c: "Virello Studio", r: "Founder & Lead Designer", y: "2024 — Now" },
                { c: "Client Projects", r: "Web Design & Development", y: "2024 — Now" },
                { c: "Freelance Work", r: "UI / Frontend Design", y: "2022 — 2024" },
              ].map((ex, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: "#f0f4ff", letterSpacing: "-0.025em" }}>{ex.c}</div>
                    <div style={{ fontSize: 12, color: "#4a5a70", marginTop: 4, fontWeight: 500 }}>{ex.r}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#4a5a70", whiteSpace: "nowrap", fontWeight: 500, paddingTop: 2 }}>{ex.y}</div>
                </li>
              ))}
            </ul>
            {/* Metric pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 24 }}>
              <Pill value="&lt;3s" label="Page load" flt="flt-a" />
              <Pill value="100%" label="Mobile first" flt="flt-b" />
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){#about-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  return (
    <section id="pricing" style={{ background: PANEL, padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="rv" style={{ marginBottom: "clamp(36px, 5vw, 60px)" }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 14 }}>Pricing</div>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(36px, 6vw, 80px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.93, margin: "0 0 10px" }}>
            Transparent<br /><span className="g-text" style={{ fontStyle: "italic" }}>pricing.</span>
          </h2>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "#4a5a70", margin: 0 }}>{PRICING.paymentTerms}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(10px, 1.2vw, 16px)" }}>
          {PRICING.packages.map((pkg, i) => (
            <div key={pkg.id} className="price-card refract-ring rv" data-d={i * 80}
              style={{ position: "relative", borderRadius: 20, padding: "28px 24px 24px", display: "flex", flexDirection: "column",
                background: pkg.highlight ? "linear-gradient(160deg, rgba(0,87,255,0.1) 0%, rgba(0,194,255,0.05) 100%)" : "rgba(9,9,15,0.8)",
                border: pkg.highlight ? `1px solid rgba(0,194,255,0.32)` : "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                boxShadow: pkg.highlight ? `0 0 60px rgba(0,87,255,0.12), 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,194,255,0.14)` : "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {pkg.highlight && (
                <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  padding: "4px 14px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em",
                  borderRadius: 999, background: `linear-gradient(135deg,${B1},${B2})`,
                  color: "#050505", boxShadow: `0 0 20px rgba(0,87,255,0.4)`, whiteSpace: "nowrap",
                }}>Most Popular</span>
              )}
              <h3 style={{ fontWeight: 800, fontSize: 20, color: "#f0f4ff", letterSpacing: "-0.03em", margin: "0 0 6px" }}>{pkg.name}</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                {pkg.pricePrefix && <span style={{ fontSize: 12, color: "#4a5a70" }}>{pkg.pricePrefix}</span>}
                <span style={{ fontWeight: 800, fontSize: 28, color: "#f0f4ff", letterSpacing: "-0.04em" }}>{formatUGX(pkg.price)}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "#4a5a70", lineHeight: 1.6, margin: "0 0 20px" }}>{pkg.tagline}</p>
              <ul style={{ flex: 1, margin: "0 0 24px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {pkg.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(240,244,255,0.82)", lineHeight: 1.5 }}>
                    <span style={{ color: B1, fontWeight: 700, fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={mailtoSubject(`${pkg.name} package — new project`)} data-hover
                style={{ display: "block", textAlign: "center", padding: "11px 20px", borderRadius: 10,
                  fontSize: 12, fontWeight: 800, textDecoration: "none", letterSpacing: "-0.01em",
                  transition: "opacity .2s, box-shadow .2s",
                  ...(pkg.highlight
                    ? { background: `linear-gradient(135deg,${B1},${B2})`, color: "#050505", boxShadow: `0 0 24px rgba(0,87,255,0.3)` }
                    : { border: `1px solid rgba(0,194,255,0.28)`, color: B1, background: "transparent" }),
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >Get started →</a>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="rv" data-d="120" style={{ marginTop: "clamp(12px, 1.5vw, 18px)", borderRadius: 20, padding: "24px 28px",
          background: "rgba(9,9,15,0.8)", border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        }}>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 16 }}>Add-ons</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px 24px" }}>
            {PRICING.addons.map((a) => (
              <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 13, color: "rgba(240,244,255,0.75)", fontWeight: 500 }}>{a.name}</span>
                <span style={{ fontWeight: 800, fontSize: 15, color: B1, whiteSpace: "nowrap" }}>{formatUGX(a.price)}<span style={{ fontSize: 10, color: "#4a5a70", fontWeight: 500 }}>{a.unit}</span></span>
              </div>
            ))}
          </div>
        </div>
        <p className="rv" style={{ textAlign: "center", fontSize: 11, color: "#4a5a70", marginTop: 16 }}>All prices in Ugandan Shillings · No hidden fees · No retainers</p>
        <style>{`@media(max-width:768px){#pricing-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </section>
  );
}

/* ─── Full-bleed CTA banner ─── */
function CTABanner() {
  return (
    <section style={{ background: BG, padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
      {/* Glow */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "40vw", maxWidth: 800, background: `radial-gradient(ellipse, rgba(0,87,255,0.1) 0%, transparent 65%)`, filter: "blur(80px)" }} />
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div className="rv" style={{ borderRadius: 24, padding: "clamp(40px, 7vw, 80px)", overflow: "hidden", position: "relative",
          background: "linear-gradient(145deg, rgba(0,87,255,0.09) 0%, rgba(0,194,255,0.05) 50%, rgba(0,20,120,0.07) 100%)",
          border: "1px solid rgba(0,194,255,0.18)",
          boxShadow: "0 0 80px rgba(0,87,255,0.08), 0 8px 40px rgba(0,0,0,0.4)",
        }}>
          {/* Top highlight line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,194,255,0.5), transparent)" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(24px, 5vw, 60px)", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(32px, 5.5vw, 72px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.95, margin: "0 0 16px" }}>
                Ready to build<br />something <span className="g-text" style={{ fontStyle: "italic" }}>great?</span>
              </h2>
              <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(240,244,255,0.6)", maxWidth: 440, lineHeight: 1.75, margin: 0 }}>
                Tell us about your project. We reply within one business day — usually faster. Fixed scope, fixed timeline.
              </p>
            </div>
            <a href={MAILTO} data-hover
              style={{ display: "inline-block", whiteSpace: "nowrap", padding: "16px 32px", borderRadius: 12,
                background: `linear-gradient(135deg,${B1},${B2})`,
                color: "#050505", fontSize: 14, fontWeight: 800, textDecoration: "none", letterSpacing: "-0.01em",
                boxShadow: `0 0 32px rgba(0,87,255,0.35)`,
                transition: "box-shadow .25s ease, opacity .2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 56px rgba(0,87,255,0.6)`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 32px rgba(0,87,255,0.35)`)}
            >Start a project →</a>
          </div>
          <style>{`@media(max-width:640px){.cta-inner{grid-template-columns:1fr!important}}`}</style>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <section id="contact" style={{ background: PANEL, padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 60px)", position: "relative", overflow: "hidden" }}>
      {/* Background orb */}
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50vw", height: "50vw", maxWidth: 600, background: `radial-gradient(ellipse, rgba(0,87,255,0.1) 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px, 8vw, 100px)", alignItems: "start" }}>
          {/* Left */}
          <div className="rv">
            <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 20 }}>Get in Touch</div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(48px, 8vw, 110px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.88, margin: "0 0 24px" }}>
              Let's talk<br /><span className="g-text" style={{ fontStyle: "italic" }}>about it.</span>
            </h2>
            <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "rgba(240,244,255,0.55)", lineHeight: 1.8, maxWidth: 360, margin: 0 }}>
              Currently accepting new projects. Describe your goals and we'll respond within one business day.
            </p>
          </div>

          {/* Right */}
          <div className="rv" data-d="100">
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(240,244,255,0.3)", marginBottom: 10 }}>Email</div>
              <a href={`mailto:${EMAIL}`} data-hover style={{ fontWeight: 800, fontSize: "clamp(16px, 2.2vw, 24px)", color: "#f0f4ff", textDecoration: "none", letterSpacing: "-0.03em", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = B1)}
                onMouseLeave={e => (e.currentTarget.style.color = "#f0f4ff")}
              >{EMAIL}</a>
            </div>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(240,244,255,0.3)", marginBottom: 10 }}>Location</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#f0f4ff", letterSpacing: "-0.025em" }}>Kampala, Uganda</div>
              <div style={{ fontSize: 12, color: "#4a5a70", marginTop: 4 }}>Serving clients across East Africa · Remote-friendly</div>
            </div>
            <a href={MAILTO} data-hover style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none" }}
              onMouseEnter={e => { const c = e.currentTarget.querySelector<HTMLElement>(".c2"); if (c) { c.style.transform = "scale(1.1)"; c.style.boxShadow = `0 0 56px rgba(0,87,255,0.65)`; } }}
              onMouseLeave={e => { const c = e.currentTarget.querySelector<HTMLElement>(".c2"); if (c) { c.style.transform = "scale(1)"; c.style.boxShadow = `0 0 36px rgba(0,87,255,0.4)`; } }}
            >
              <span className="c2" style={{ width: 60, height: 60, borderRadius: "50%",
                background: `linear-gradient(135deg,${B1},${B2})`,
                color: "#050505", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800, boxShadow: `0 0 36px rgba(0,87,255,0.4)`,
                transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease", flexShrink: 0,
              }}>→</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(18px, 2vw, 22px)", color: "#f0f4ff", letterSpacing: "-0.03em" }}>Send a brief</span>
            </a>
          </div>
        </div>
        <style>{`@media(max-width:768px){#contact-grid{grid-template-columns:1fr!important}}`}</style>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(32px, 5vw, 52px) clamp(20px, 5vw, 60px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px 40px", fontSize: 12, color: "#4a5a70" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#f0f4ff", letterSpacing: "-0.04em", marginBottom: 8 }}>Virello<span style={{ color: B1 }}>.</span></div>
          <p style={{ lineHeight: 1.6, margin: "0 0 10px" }}>Web design studio. Kampala, Uganda.</p>
          <a href={`mailto:${EMAIL}`} data-hover style={{ color: B1, textDecoration: "none", fontWeight: 600, transition: "opacity .2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >{EMAIL}</a>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(240,244,255,0.3)", marginBottom: 14 }}>Work</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link to="/work/$slug" params={{ slug: p.slug }} data-hover style={{ color: "#4a5a70", textDecoration: "none", fontWeight: 500, transition: "color .2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = B1)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a5a70")}
                >{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", textAlign: "right" }}>
          <div style={{ fontWeight: 600, color: "#4a5a70" }}>© 2026 Virello</div>
          <div style={{ marginTop: 4 }}>Kampala, Uganda</div>
        </div>
      </div>
      <style>{`@media(max-width:640px){footer>div>div{grid-template-columns:1fr!important}footer>div>div>div:last-child{text-align:left!important}}`}</style>
    </footer>
  );
}

/* ─── Responsive grid fixes (inline for SSR safety) ─── */
const responsiveFix = `
  @media(max-width:768px){
    #work>div>div:first-of-type{display:none!important}
    #work>div>div:last-of-type{display:flex!important}
    #svc-main{grid-template-columns:1fr!important}
    #pricing-cards{grid-template-columns:1fr!important}
    #contact>div>div>div{grid-template-columns:1fr!important}
    .cta-inner{grid-template-columns:1fr!important}
    #about>div>div:last-child{grid-template-columns:1fr!important}
    .work-bento-desktop{display:none!important}
    .work-bento-mobile{display:flex!important;flex-direction:column;gap:12px}
  }
  @media(min-width:769px){
    .work-bento-mobile{display:none!important}
    .work-bento-desktop{display:grid!important}
  }
`;

/* ─── Page root ─── */
function Index() {
  useCustomCursor();
  useParallax();
  useReveal();
  return (
    <div style={{ background: BG, color: "#f0f4ff", minHeight: "100svh" }}>
      <style>{responsiveFix}</style>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        {/* Desktop bento */}
        <section id="work" style={{ background: BG, padding: "clamp(64px,10vw,120px) clamp(20px,5vw,60px)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="rv" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(32px,5vw,56px)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: B1, marginBottom: 12 }}>Selected Work</div>
                <h2 style={{ fontWeight: 800, fontSize: "clamp(36px,6vw,80px)", color: "#f0f4ff", letterSpacing: "-0.045em", lineHeight: 0.93, margin: 0 }}>
                  Built for<br /><span className="g-text" style={{ fontStyle: "italic" }}>results.</span>
                </h2>
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.16em", color: "#4a5a70", maxWidth: 160, textAlign: "right", lineHeight: 1.5 }}>
                Client projects<br />2024–2025
              </p>
            </div>

            {/* Desktop bento */}
            <div className="work-bento-desktop" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(10px,1.2vw,16px)" }}>
              <div className="rv" style={{ gridColumn: "1/3" }} data-d="0"><BentoCard p={PROJECTS[0]} height={260} priority /></div>
              <div className="rv" style={{ gridColumn: "3/4" }} data-d="80"><BentoCard p={PROJECTS[1]} height={260} /></div>
              <div className="rv" style={{ gridColumn: "1/2" }} data-d="120"><BentoCard p={PROJECTS[2]} height={200} /></div>
              <div className="rv" style={{ gridColumn: "2/4" }} data-d="180"><BentoCard p={PROJECTS[3]} height={200} /></div>
              <div className="rv" style={{ gridColumn: "1/4" }} data-d="240"><BentoCard p={PROJECTS[4]} height={220} /></div>
            </div>

            {/* Mobile stack */}
            <div className="work-bento-mobile">
              {PROJECTS.map((p, i) => (
                <div key={p.slug} className="rv" data-d={i * 60}><BentoCard p={p} /></div>
              ))}
            </div>
          </div>
        </section>

        <Services />
        <About />
        <Pricing />
        <CTABanner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
