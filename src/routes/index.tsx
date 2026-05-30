import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HeroAmbientBackground } from "@/components/HeroAmbientBackground";
import { GlassButton } from "@/components/ui/glass-button";
import { CopyEmail } from "@/components/ui/copy-email";
import { useAmbientMotionPause, usePageVisible, usePerfTier } from "@/hooks/use-performance";
import { PROJECTS } from "@/lib/projects";
import type { PerfTier } from "@/lib/performance";
import { ProjectPreview } from "@/components/ProjectPreview";
import {
  STUDIO_EMAIL,
  mailtoSubject,
  PRICING,
  formatUGX,
  STARTING_PRICE_DISPLAY,
} from "@/lib/constants";

export const Route = createFileRoute("/")({ component: Index });

const B1 = "#e8e8ed";
const B2 = "#a8a8b3";
const BG = "#060608";
const PANEL = "#0c0c0f";
const MAILTO = mailtoSubject("New project enquiry");
const EMAIL = STUDIO_EMAIL;

/* ─── Mouse parallax via CSS vars (high tier only) ─── */
function useParallax(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 32) return;
      last = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--px",
          String((e.clientX / innerWidth - 0.5).toFixed(4)),
        );
        document.documentElement.style.setProperty(
          "--py",
          String((e.clientY / innerHeight - 0.5).toFixed(4)),
        );
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);
}

/* ─── Scroll reveal ─── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
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
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    addEventListener("keydown", fn);
    return () => removeEventListener("keydown", fn);
  }, []);

  const links = [
    ["#work", "Work"],
    ["#services", "Services"],
    ["#about", "About"],
    ["#pricing", "Pricing"],
    ["#contact", "Contact"],
  ];

  return (
    <>
      <div ref={ref} className="nav-pill en" style={{ animationDelay: ".15s" }}>
        <a href="#top" className="nav-logo">
          Virello<span>.</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <GlassButton
            href={`mailto:${EMAIL}`}
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Get in touch
          </GlassButton>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#f0f4ff",
                borderRadius: 2,
                transition: "transform .3s, opacity .3s",
                transform: open ? "translateY(5.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#f0f4ff",
                borderRadius: 2,
                transition: "opacity .3s",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#f0f4ff",
                borderRadius: 2,
                transition: "transform .3s",
                transform: open ? "translateY(-5.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="mob-menu md:hidden lg-card lg-card--blur">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="mob-menu-link" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <div style={{ padding: "8px 12px 4px" }}>
            <GlassButton
              href={`mailto:${EMAIL}`}
              variant="primary"
              block
              onClick={() => setOpen(false)}
            >
              Get in touch →
            </GlassButton>
          </div>
        </div>
      )}
    </>
  );
}

function StatPill({
  value,
  label,
  flt,
  style,
}: {
  value: string;
  label: string;
  flt?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`lg-stat lg-stat--blur ${flt ?? ""}`.trim()} style={style}>
      <div className="lg-stat-value">{value}</div>
      <div className="lg-stat-label">{label}</div>
    </div>
  );
}

function Hero({ motionActive, tier }: { motionActive: boolean; tier: PerfTier }) {
  return (
    <section id="top" className="hero">
      <HeroAmbientBackground active={motionActive} tier={tier} />
      <div className="hero-inner">
        <div className="hero-meta en" style={{ animationDelay: ".3s" }}>
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className="beacon-ring absolute inline-flex h-full w-full rounded-full"
                style={{ background: B1, opacity: 0.7 }}
              />
              <span
                className="relative h-2 w-2 rounded-full"
                style={{ background: B1, boxShadow: `0 0 8px ${B1}` }}
              />
            </span>
            <span className="hero-meta-accent">
              Available · Starting from {STARTING_PRICE_DISPLAY}
            </span>
          </span>
          <span className="hidden sm:block shrink-0">Est. 2024 · Kampala, UG</span>
        </div>

        <h1 className="heading-hero">
          <div className="heading-hero-line clip-line en" style={{ animationDelay: ".38s" }}>
            <span className="inner heading-hero-word">We design</span>
          </div>
          <div className="heading-hero-line clip-line en" style={{ animationDelay: ".48s" }}>
            <span className="inner heading-hero-word g-text" style={{ fontStyle: "italic" }}>
              digital
            </span>
          </div>
          <div className="heading-hero-line clip-line en" style={{ animationDelay: ".56s" }}>
            <span className="inner heading-hero-word">futures.</span>
          </div>
        </h1>

        <div className="hero-grid">
          <div className="en" style={{ animationDelay: ".68s" }}>
            <p className="text-body">
              A Kampala-based web design studio crafting fast, polished digital experiences for
              businesses across East Africa.
            </p>
          </div>
          <div
            className="hidden md:flex items-end justify-center en"
            style={{ animationDelay: ".72s" }}
          >
            <div className="flex gap-3 flex-wrap justify-center">
              <StatPill value="5+" label="Projects shipped" flt="flt-a" />
              <StatPill value="2–3w" label="Delivery" flt="flt-b" />
            </div>
          </div>
          <div className="flex md:justify-end items-end en" style={{ animationDelay: ".78s" }}>
            <a href="#contact" className="hero-cta-link">
              <span className="hero-cta-icon">→</span>
              <span className="hero-cta-text">
                Start a<br />
                <span className="g-text" style={{ fontStyle: "italic" }}>
                  project
                </span>
              </span>
            </a>
          </div>
        </div>

        <div className="hero-float-pill flt-c">
          <StatPill value="100%" label="Fixed scope" />
        </div>
      </div>
      <div className="hero-fade" />
    </section>
  );
}

/* ─── Marquee ticker ─── */
function Marquee() {
  const items = [
    "Web Design",
    "Digital Products",
    "Kampala",
    "East Africa",
    "React",
    "Tailwind CSS",
    "Supabase",
    "Framer Motion",
    "Real Estate",
    "Consulting",
    "Fitness",
    "Sports",
    "Responsive",
    "Fast",
    "Premium",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        background: PANEL,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 0",
        overflow: "hidden",
      }}
    >
      <div className="marquee-wrap">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className="marquee-item">
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(240,244,255,0.35)",
                }}
              >
                {item}
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: B1,
                  display: "inline-block",
                  opacity: 0.5,
                }}
              />
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
    <article className="bento refract-ring lg-card lg-card--blur">
      <ProjectPreview project={p} priority={priority} height={height ?? 220} />
      <div className="lg-card-body">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="lg-tag">
            <span className="lg-tag-dot" />
            {p.tag}
          </span>
          <span className="text-caption">{p.year}</span>
        </div>
        <h3
          className="heading-lg"
          style={{ fontSize: "clamp(1.15rem, 2vw, 1.625rem)", marginBottom: "0.35rem" }}
        >
          {p.name}
        </h3>
        <p className="text-body" style={{ fontSize: "0.8125rem", marginBottom: "0.875rem" }}>
          {p.description}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-wrap gap-1">
            {p.stack.map((s) => (
              <span
                key={s}
                className="lg-tag"
                style={{
                  textTransform: "none",
                  letterSpacing: "0",
                  fontSize: "0.625rem",
                  color: "rgba(240,244,255,0.5)",
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <Link
            to="/work/$slug"
            params={{ slug: p.slug }}
            className="lg-btn lg-btn--ghost lg-btn--sm"
            style={{ padding: "0.35rem 0.75rem" }}
          >
            Case study →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Services — numbered list ─── */
const SVCS = [
  {
    n: "01",
    title: "Web Design",
    body: "Custom-built websites that reflect your brand, load fast, and convert visitors. Designed mobile-first, pixel-perfect on every screen.",
  },
  {
    n: "02",
    title: "Digital Presence",
    body: "Landing pages and product sites shipped in 2–3 weeks. From wireframe to live URL — scope, timeline, and price locked upfront.",
  },
  {
    n: "03",
    title: "Performance & SEO",
    body: "Sub-3-second page loads, semantic HTML, and structured metadata. Sites that rank, load, and convert from day one.",
  },
  {
    n: "04",
    title: "Brand & Visual Identity",
    body: "Consistent design language across your website, materials, and touchpoints — so your brand looks intentional everywhere.",
  },
];

function Services() {
  return (
    <section id="services" className="section section--panel section-paint">
      <div className="site-container" style={{ paddingInline: 0, width: "100%" }}>
        <div className="grid-split">
          <div className="rv">
            <div className="section-label">Services</div>
            <h2 className="heading-xl" style={{ marginBottom: "1.5rem" }}>
              What we{" "}
              <span className="g-text" style={{ fontStyle: "italic" }}>
                do.
              </span>
            </h2>
            <p className="text-body" style={{ maxWidth: "22.5rem" }}>
              From first conversation to live site in 2–3 weeks. Scoped, priced, and delivered — no
              surprises.
            </p>
            <div className="rv" data-d="200" style={{ marginTop: "clamp(1.75rem, 4vw, 3rem)" }}>
              <GlassButton href="#contact" variant="primary">
                Start a project →
              </GlassButton>
            </div>
          </div>

          <div className="rv" data-d="100">
            {SVCS.map((s) => (
              <div key={s.n} className="svc-row">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flex: 1 }}>
                  <span className="svc-num">{s.n}</span>
                  <div>
                    <div className="svc-title" style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}>
                      {s.title}
                    </div>
                    <div className="svc-desc">{s.body}</div>
                  </div>
                </div>
                <span className="svc-arrow">↗</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section id="about" className="section section-paint">
      <div className="site-container" style={{ paddingInline: 0, width: "100%" }}>
        <div className="rule rv" />
        <div className="grid-split" style={{ marginTop: "clamp(2.5rem, 6vw, 5rem)" }}>
          <div className="rv">
            <div className="section-label">About</div>
            <h2 className="heading-xl" style={{ marginBottom: "2rem" }}>
              User is the
              <br />
              <span className="g-text" style={{ fontStyle: "italic" }}>
                only reality.
              </span>
            </h2>
            <div style={{ maxWidth: "28rem" }}>
              <p className="text-body" style={{ marginBottom: "1rem" }}>
                Virello is a Kampala-based web design studio building digital experiences for
                businesses across Uganda and East Africa.
              </p>
              <p className="text-body">
                Complexity belongs in the system, not on the user. Every pixel earns its place.
                Every interaction has a purpose.
              </p>
            </div>
          </div>

          <div className="rv" data-d="120">
            <div className="section-label" style={{ color: "rgba(240,244,255,0.35)" }}>
              Experience
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {[
                { c: "Virello Studio", r: "Founder & Lead Designer", y: "2024 — Now" },
                { c: "Client Projects", r: "Web Design & Development", y: "2024 — Now" },
                { c: "Freelance Work", r: "UI / Frontend Design", y: "2022 — 2024" },
              ].map((ex, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "20px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 17,
                        color: "#f0f4ff",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {ex.c}
                    </div>
                    <div style={{ fontSize: 12, color: "#4a5a70", marginTop: 4, fontWeight: 500 }}>
                      {ex.r}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#4a5a70",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                      paddingTop: 2,
                    }}
                  >
                    {ex.y}
                  </div>
                </li>
              ))}
            </ul>
            {/* Metric pills */}
            <div className="grid grid-cols-2 gap-2.5 mt-6">
              <StatPill value="&lt;3s" label="Page load" flt="flt-a" />
              <StatPill value="100%" label="Mobile first" flt="flt-b" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  return (
    <section id="pricing" className="section section--panel section-paint">
      <div className="site-container" style={{ paddingInline: 0, width: "100%" }}>
        <div className="rv" style={{ marginBottom: "clamp(2rem, 5vw, 3.75rem)" }}>
          <div className="section-label">Pricing</div>
          <h2 className="heading-xl" style={{ marginBottom: "0.625rem" }}>
            Transparent
            <br />
            <span className="g-text" style={{ fontStyle: "italic" }}>
              pricing.
            </span>
          </h2>
          <p className="text-caption">{PRICING.paymentTerms}</p>
        </div>

        <div className="grid-pricing">
          {PRICING.packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`price-card refract-ring lg-card lg-card--blur rv ${pkg.highlight ? "lg-card--highlight" : ""}`.trim()}
              data-d={i * 80}
              style={{
                padding: "1.75rem 1.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {pkg.highlight && (
                <span
                  className="lg-tag"
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #d4af37, #a8862a)",
                    color: "#060608",
                    border: "none",
                  }}
                >
                  Most Popular
                </span>
              )}
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.03em",
                  margin: "0 0 0.35rem",
                }}
              >
                {pkg.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                {pkg.pricePrefix && <span className="text-caption">{pkg.pricePrefix}</span>}
                <span style={{ fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.04em" }}>
                  {formatUGX(pkg.price)}
                </span>
              </div>
              <p className="text-body" style={{ fontSize: "0.8125rem", marginBottom: "1.25rem" }}>
                {pkg.tagline}
              </p>
              <ul className="flex-1 m-0 p-0 list-none flex flex-col gap-2.5 mb-6">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-sm"
                    style={{ color: "rgba(240,244,255,0.82)", lineHeight: 1.5 }}
                  >
                    <span
                      style={{
                        color: B1,
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <GlassButton
                href={mailtoSubject(`${pkg.name} package — new project`)}
                variant={pkg.highlight ? "primary" : "ghost"}
                block
              >
                Get started →
              </GlassButton>
            </div>
          ))}
        </div>

        <div
          className="rv lg-card lg-card--blur"
          data-d="120"
          style={{ marginTop: "clamp(0.75rem, 1.5vw, 1.125rem)", padding: "1.5rem 1.75rem" }}
        >
          <div className="section-label">Add-ons</div>
          <div className="grid-addons">
            {PRICING.addons.map((a) => (
              <div
                key={a.name}
                className="flex justify-between items-baseline gap-3 pb-3 border-b border-white/6"
              >
                <span className="text-body" style={{ fontSize: "0.8125rem" }}>
                  {a.name}
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "0.9375rem",
                    color: B1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatUGX(a.price)}
                  <span className="text-caption" style={{ marginLeft: 2 }}>
                    {a.unit}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="rv text-caption" style={{ textAlign: "center", marginTop: "1rem" }}>
          All prices in Ugandan Shillings · No hidden fees · No retainers
        </p>
      </div>
    </section>
  );
}

/* ─── Full-bleed CTA banner ─── */
function CTABanner() {
  return (
    <section className="section section-paint" style={{ position: "relative", overflow: "hidden" }}>
      <div
        className="soft-glow"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(60vw, 800px)",
          height: "min(40vw, 500px)",
        }}
      />
      <div
        className="site-container"
        style={{ paddingInline: 0, width: "100%", position: "relative", zIndex: 2 }}
      >
        <div className="rv cta-banner-card lg-card lg-card--blur">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(167,139,250,0.45), transparent)",
            }}
          />
          <div className="cta-banner-grid">
            <div>
              <h2 className="heading-xl" style={{ marginBottom: "1rem" }}>
                Ready to build
                <br />
                something{" "}
                <span className="g-text" style={{ fontStyle: "italic" }}>
                  great?
                </span>
              </h2>
              <p className="text-body" style={{ maxWidth: "28rem" }}>
                Tell us about your project. We reply within one business day — usually faster. Fixed
                scope, fixed timeline.
              </p>
            </div>
            <GlassButton href="#contact" variant="primary" size="lg" className="shrink-0">
              Start a project →
            </GlassButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  return (
    <section
      id="contact"
      className="section section--panel section-paint"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div
        className="soft-glow"
        style={{
          bottom: "-10%",
          right: "-5%",
          width: "min(50vw, 600px)",
          height: "min(50vw, 600px)",
        }}
      />
      <div
        className="site-container"
        style={{ paddingInline: 0, width: "100%", position: "relative", zIndex: 2 }}
      >
        <div className="grid-split">
          <div className="rv">
            <div className="section-label">Get in Touch</div>
            <h2
              className="heading-xl"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)", marginBottom: "1.5rem" }}
            >
              Let's talk
              <br />
              <span className="g-text" style={{ fontStyle: "italic" }}>
                about it.
              </span>
            </h2>
            <p className="text-body" style={{ maxWidth: "22.5rem" }}>
              Currently accepting new projects. Share your goals — we respond within one business
              day with a clear next step.
            </p>
          </div>

          <div className="rv lg-card lg-card--blur contact-panel" data-d="100">
            <div className="contact-email-block">
              <CopyEmail email={EMAIL} />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <div
                className="section-label"
                style={{ color: "rgba(240,244,255,0.35)", marginBottom: "0.5rem" }}
              >
                Studio
              </div>
              <div style={{ fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "-0.025em" }}>
                Kampala, Uganda
              </div>
              <p className="contact-email-hint" style={{ marginTop: "0.25rem" }}>
                Serving clients across East Africa · Remote-friendly
              </p>
            </div>
            <GlassButton href={MAILTO} variant="primary" size="lg">
              Send me an email →
            </GlassButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer
      className="section"
      style={{
        paddingBlock: "clamp(2rem, 5vw, 3.25rem)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="site-container footer-grid" style={{ paddingInline: 0, width: "100%" }}>
        <div>
          <div className="footer-brand-title">
            Virello<span style={{ color: B1 }}>.</span>
          </div>
          <p className="text-body" style={{ fontSize: "0.75rem", marginBottom: "0.625rem" }}>
            Web design studio. Kampala, Uganda.
          </p>
          <CopyEmail email={EMAIL} compact />
        </div>
        <div>
          <div
            className="section-label"
            style={{ color: "rgba(240,244,255,0.3)", marginBottom: "0.875rem" }}
          >
            Work
          </div>
          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  className="nav-link"
                  style={{ fontSize: "0.8125rem" }}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-end md:text-right">
          <div className="text-caption">© 2026 Virello</div>
          <div className="text-caption" style={{ marginTop: 4 }}>
            Kampala, Uganda
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page root ─── */
function Index() {
  const tier = usePerfTier();
  const pageVisible = usePageVisible();
  const motionActive = pageVisible && tier !== "low";
  useAmbientMotionPause(motionActive);
  useParallax(tier === "high" && pageVisible);
  useReveal();

  const showGrain = tier !== "low";

  return (
    <div className="site-page">
      {showGrain && <div className="grain" aria-hidden />}
      <Nav />
      <main>
        <Hero motionActive={motionActive} tier={tier} />
        <Marquee />
        <section id="work" className="section section-paint">
          <div className="site-container" style={{ paddingInline: 0, width: "100%" }}>
            <div className="section-header rv">
              <div>
                <div className="section-label">Selected Work</div>
                <h2 className="heading-xl">
                  Built for
                  <br />
                  <span className="g-text" style={{ fontStyle: "italic" }}>
                    results.
                  </span>
                </h2>
              </div>
              <p
                className="text-caption"
                style={{ maxWidth: "10rem", textAlign: "right", lineHeight: 1.5 }}
              >
                Client projects
                <br />
                2024–2025
              </p>
            </div>

            <div className="bento-grid bento-grid--desktop">
              <div className="rv bento-span-2" data-d="0">
                <BentoCard p={PROJECTS[0]} height={260} priority />
              </div>
              <div className="rv" data-d="80">
                <BentoCard p={PROJECTS[1]} height={260} />
              </div>
              <div className="rv" data-d="120">
                <BentoCard p={PROJECTS[2]} height={200} />
              </div>
              <div className="rv bento-span-2" data-d="180">
                <BentoCard p={PROJECTS[3]} height={200} />
              </div>
              <div className="rv bento-span-3" data-d="240">
                <BentoCard p={PROJECTS[4]} height={220} />
              </div>
            </div>

            <div className="bento-grid bento-grid--mobile">
              {PROJECTS.map((p, i) => (
                <div key={p.slug} className="rv" data-d={i * 60}>
                  <BentoCard p={p} />
                </div>
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
