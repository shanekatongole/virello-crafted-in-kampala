import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

const EMAIL = "hello@virello.agency";
const WHATSAPP = "256700000000";

function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0f1a]/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-2xl tracking-tight">
          Virello<span className="text-[#00C8FF]">.</span>
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="text-sm text-white/80 hover:text-[#00C8FF] transition-colors border-b border-transparent hover:border-[#00C8FF] pb-0.5"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-40 pb-32 md:pt-56 md:pb-44 px-6 md:px-10 overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#00C8FF]/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <p className="text-[#00C8FF] text-sm tracking-[0.2em] uppercase mb-8">Web design agency · Kampala</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-white">
            We build fast.<br />We build well.
          </h1>
          <p className="mt-10 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
            Virello ships web products and SaaS for East African businesses using Lovable + Supabase.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-[#00C8FF] text-[#0a0f1a] px-7 py-3.5 font-medium hover:bg-white transition-colors"
            >
              See our work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 border border-white/20 text-white px-7 py-3.5 font-medium hover:border-[#00C8FF] hover:text-[#00C8FF] transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl border-t border-white/10 pt-10">
          {[
            ["8+", "projects shipped"],
            ["~2 week", "delivery"],
            ["Uganda", "based"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="font-display text-3xl md:text-4xl text-white">{k}</div>
              <div className="text-sm text-white/50 mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Project = {
  title: string;
  tag: string;
  description: string;
  stack: string[];
  featured?: boolean;
  href: string;
};

const PROJECTS: Project[] = [
  {
    title: "Chess Uganda",
    tag: "Live · SaaS",
    description:
      "Coaching directory connecting chess players to coaches in Uganda. Built with Lovable + Supabase. Mobile money payments (MTN/Airtel) with admin-issued access codes.",
    stack: ["Lovable", "Supabase", "React", "TypeScript"],
    featured: true,
    href: "#",
  },
  {
    title: "Virello Agency Site",
    tag: "Live · Agency",
    description:
      "The Virello agency website — dark navy aesthetic, editorial layout, scroll-driven animations. Deployed on Cloudflare Pages.",
    stack: ["Lovable", "Cloudflare Pages", "Tailwind"],
    href: "#",
  },
  {
    title: "Smart Ideas Limited",
    tag: "Client · Consulting",
    description:
      "Homepage for an institutional consulting firm. Cormorant Garamond typography, dark hero with red accents, Framer Motion animations. Delivered in a single-pass.",
    stack: ["React", "Framer Motion", "TypeScript"],
    href: "#",
  },
];

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <article
      className={`group relative p-8 md:p-10 border transition-all hover:-translate-y-1 ${
        p.featured
          ? "border-[#00C8FF]/60 bg-[#00C8FF]/[0.03]"
          : "border-white/10 bg-white/[0.015] hover:border-white/25"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs tracking-[0.2em] uppercase text-[#00C8FF]">{p.tag}</span>
        <span className="font-display text-white/20 text-lg">0{index + 1}</span>
      </div>
      <h3 className="font-display text-3xl md:text-4xl text-white mb-4">{p.title}</h3>
      <p className="text-white/65 leading-relaxed mb-8">{p.description}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {p.stack.map((s) => (
          <span key={s} className="text-xs px-3 py-1.5 border border-white/15 text-white/70">
            {s}
          </span>
        ))}
      </div>
      <a
        href={p.href}
        className="inline-flex items-center gap-2 text-[#00C8FF] border-b border-[#00C8FF]/40 pb-1 hover:border-[#00C8FF] transition-colors"
      >
        View project <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </article>
  );
}

function Projects() {
  return (
    <section id="projects" className="px-6 md:px-10 py-24 md:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <p className="text-[#00C8FF] text-sm tracking-[0.2em] uppercase mb-4">Portfolio</p>
            <h2 className="font-display text-4xl md:text-6xl text-white">Selected Works</h2>
          </div>
          <p className="text-white/50 max-w-xs">A handful of products we've shipped recently.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className={p.featured ? "md:col-span-2" : ""}>
              <ProjectCard p={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stack() {
  const tools = ["Lovable", "Supabase", "React", "TypeScript", "Tailwind CSS", "Cloudflare Pages"];
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#00C8FF] text-sm tracking-[0.2em] uppercase mb-4">Toolkit</p>
        <h2 className="font-display text-4xl md:text-6xl text-white mb-12">How we build</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          {tools.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white/85 hover:border-[#00C8FF] hover:text-[#00C8FF] transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full" />
              {t}
            </span>
          ))}
        </div>
        <p className="text-white/65 text-lg max-w-3xl leading-relaxed">
          We use Lovable to move fast without sacrificing quality. Supabase handles auth, database, and storage.
          <br className="hidden md:block" />
          Everything is deployed to production from day one.
        </p>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="px-6 md:px-10 py-24 md:py-36 bg-[#0d1420] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#00C8FF] text-sm tracking-[0.2em] uppercase mb-6">Contact</p>
        <h2 className="font-display text-5xl md:text-7xl text-white mb-6">Let's build something</h2>
        <p className="text-white/60 text-lg max-w-2xl mb-14">
          Based in Kampala. Working with clients across Uganda and East Africa.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="font-display text-3xl sm:text-5xl md:text-6xl text-white underline decoration-[#00C8FF] decoration-2 underline-offset-8 hover:text-[#00C8FF] transition-colors break-all"
        >
          {EMAIL}
        </a>
        <div className="mt-14">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-white hover:border-[#00C8FF] hover:text-[#00C8FF] transition-colors"
          >
            <span className="w-2 h-2 bg-[#00C8FF] rounded-full" />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-10 py-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-white/40">
        <div className="font-display text-lg text-white/70">Virello<span className="text-[#00C8FF]">.</span></div>
        <div>© {new Date().getFullYear()} Virello — Kampala, Uganda</div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white">
      <TopBar />
      <Hero />
      <Projects />
      <Stack />
      <Contact />
      <Footer />
    </main>
  );
}
