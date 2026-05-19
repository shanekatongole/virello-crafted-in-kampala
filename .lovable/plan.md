# Virello portfolio — speed, conversion & polish

Goal: page feels instant, projects are easy to access, cold-outreach visitors convert.

## 1. Screenshot-first project previews (biggest speed win)

Replace always-on iframes with static screenshots that swap to a live iframe on hover (desktop) or tap-to-load (mobile).

- Capture one high-quality screenshot per project (1440×900) at build time using the `product-shot` skill (or plain `browser--screenshot` against each project URL). Save as optimized WebP under `src/assets/work/{slug}.webp` plus a tiny LQIP placeholder.
- New `ProjectPreview` component: renders the `<img>` by default. On `mouseenter` (and after a 150ms delay to avoid accidental loads on scroll), mount the `<iframe>` and fade it in over the screenshot. On `mouseleave`, unmount the iframe after a short delay so memory stays low.
- Mobile (`hover: none`): no iframe at all — tap anywhere on the card opens the live site in a new tab. Add a clear `View live ↗` button overlay so the action is obvious.
- Whole card becomes clickable (`<a>` wrapping the media area), with a secondary "Case study →" link going to the new per-project route.
- Add `fetchpriority="high"` + `<link rel="preload">` for the first project's screenshot (it's near the LCP).

Expected result: First paint of the work section drops from 5+ iframe loads to 5 image loads (~50–150KB total).

## 2. Per-project case study routes

One file per project under `src/routes/work.$slug.tsx` with:
- Hero: project name, tag, year, live URL
- Static screenshot (large)
- Problem · Approach · Result (3 short paragraphs — you'll provide copy later; we'll seed reasonable placeholders you can edit)
- Tech stack
- "View live site ↗" + "Start a similar project →" (mailto with subject prefilled)
- Per-route `head()` with unique title, description, og:title, og:description, og:image (the screenshot), canonical
- JSON-LD `CreativeWork` schema

Index page project cards link to `/work/{slug}` as the secondary action, with the live URL as the primary.

Slugs: `lenore-estates`, `smart-ideas`, `metafit256`, `roofman-ug`, `silverfin`.

## 3. Process & pricing strip

New section between Hero and Selected Works. Three-column glass strip:

```text
01 · DISCOVER          02 · DESIGN & BUILD       03 · LAUNCH
30-min call,           2–3 weeks,                Handover, training,
fixed scope            1 round of revisions      30 days of support
```

Below: a single line — "Projects from $1,200 · Fixed scope, fixed timeline · No retainers required." (final number TBD by you — I'll use a placeholder you can edit in one place).

## 4. Sticky CTA after projects

Full-width band between Selected Works and Services:

> **Like what you see?**
> Tell us about your project. We reply within one business day.
> [Start a project →]  (mailto with subject "New project — [your name]")

Glass panel, large Cormorant Garamond italic heading, cyan accent border.

## 5. Smoothness polish

- Disable custom cursor while pointer is over a project card's media area (cursor flicker over iframes). Use a `data-cursor="hide"` attribute the cursor hook respects.
- Respect `prefers-reduced-motion`: skip the rise animation, reveal animation, and custom cursor for users who opted out.
- Show reveal content immediately on slow connections (use `navigator.connection.saveData` or `effectiveType` to detect 2g/3g and disable reveals).
- Lighten the noise overlay on mobile (it's a 300×300 SVG repeated full-viewport; drop to opacity 0.02 below 768px).
- Preload Cormorant Garamond + DM Sans `font-display: swap` (already swap via Google Fonts URL, but add `<link rel="preload" as="font" crossorigin>` for the two weights actually used).

## 6. SEO / shareability (full polish)

- Root `head()` in `__root.tsx`: viewport, charset, og:site_name "Virello", og:type "website", twitter:card "summary_large_image", default JSON-LD `Organization` + `LocalBusiness` (Kampala, Uganda, email).
- Per-route `head()` on `/`, `/work/$slug` (and any future routes) with unique title, description, og:image, canonical (leaf only).
- og:image for `/` = a hero composite image (we can generate one with imagegen — branded "Virello — We design the web for East Africa" card).
- Add `public/robots.txt` and a `src/routes/sitemap[.]xml.ts` server route that lists `/` plus all `/work/*` URLs.

## 7. Footer additions

Keep minimal but add:
- Email link (so the footer also converts)
- Small list of project names linking to their case studies (helps SEO + gives crawlers internal links)

## Technical notes

- Routes added: `src/routes/work.$slug.tsx` (one dynamic route with project data in a shared `src/lib/projects.ts` module). No per-project files needed.
- Screenshots: generated once via a small script (`scripts/capture-projects.ts`) that uses Playwright against each URL. Run manually, commit the WebPs. If Playwright isn't available, use `browser--screenshot` tool calls during the build session.
- No new dependencies required (Tailwind + custom CSS continues; no shadcn).
- All existing copy, fonts, colors, custom cursor behavior preserved.

## Ordering of work

1. Capture screenshots + add `src/lib/projects.ts`
2. Build `ProjectPreview` (screenshot + hover-iframe) and swap into index
3. Add `/work/$slug` route + link from cards
4. Add Process/Pricing strip + Sticky CTA section
5. Cursor/reduced-motion/connection-aware polish
6. Root + per-route head() meta, JSON-LD, sitemap, robots, og:image generation
7. Footer updates

Each step is independently shippable, so we can stop early if you want.