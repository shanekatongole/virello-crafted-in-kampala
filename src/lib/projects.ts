export type Project = {
  slug: string;
  name: string;
  url: string;
  tag: string;
  year: string;
  description: string;
  stack: string[];
  problem: string;
  approach: string;
  result: string;
};

import lenore from "@/assets/work/lenore-estates.webp";
import smart from "@/assets/work/smart-ideas.webp";
import meta from "@/assets/work/metafit256.webp";
import roof from "@/assets/work/roofman-ug.webp";
import silver from "@/assets/work/silverfin.webp";

export const PROJECT_IMAGES: Record<string, string> = {
  "lenore-estates": lenore,
  "smart-ideas": smart,
  metafit256: meta,
  "roofman-ug": roof,
  silverfin: silver,
};

export const PROJECTS: Project[] = [
  {
    slug: "lenore-estates",
    name: "Lenore Estates",
    url: "https://kampala-dream-homes.lovable.app",
    tag: "Real Estate",
    year: "2025",
    description:
      "Premium property listings platform for Kampala's luxury real estate market.",
    stack: ["React", "Supabase", "Tailwind"],
    problem:
      "Kampala's luxury real estate buyers were stuck browsing low-trust classified sites with no filters, slow load times, and stock-photo listings that all looked the same.",
    approach:
      "We designed a calm, editorial property platform with clean typography, generous imagery, and structured filters by price, bedrooms, and location. Listings load instantly and look the way premium homes should be presented.",
    result:
      "A polished, conversion-ready listings site that positions Lenore Estates as the trusted name for premium properties in Kampala.",
  },
  {
    slug: "smart-ideas",
    name: "Smart Ideas Limited",
    url: "https://smart-ideas.lovable.app/",
    tag: "Consulting",
    year: "2025",
    description:
      "Institutional consulting firm homepage with capacity building and training services.",
    stack: ["React", "Framer Motion", "TypeScript"],
    problem:
      "An established consulting firm needed a homepage that matched the calibre of their institutional clients, not a generic template that undersold them.",
    approach:
      "We built a refined editorial single-page site with serif typography, fluid motion, and a clear hierarchy: who they serve, what they do, and how to reach them.",
    result:
      "A site that finally reflects the firm's stature and converts cold prospects into discovery calls.",
  },
  {
    slug: "metafit256",
    name: "MetaFit256",
    url: "https://metafit256.katongoleshane.workers.dev/",
    tag: "Fitness",
    year: "2025",
    description:
      "Premier gym in Kampala — strength training, elite coaching, and group fitness.",
    stack: ["React", "Cloudflare Workers", "Tailwind"],
    problem:
      "MetaFit256 wanted to stand apart from generic gym sites and attract serious lifters and high-intent members in Kampala.",
    approach:
      "A bold, high-contrast brutalist design with monospaced accents, neon lime highlights, and confident typography. Hosted at the edge on Cloudflare Workers for sub-second loads.",
    result:
      "A gym site that looks and loads like the membership they're selling — premium, fast, and unmistakable.",
  },
  {
    slug: "roofman-ug",
    name: "Roofman UG Constructors",
    url: "https://roofman-ug-builds-trust.lovable.app",
    tag: "Construction",
    year: "2025",
    description:
      "Professional roofing and waterproofing contractors serving Kampala and beyond.",
    stack: ["React", "Tailwind", "Lovable"],
    problem:
      "A trusted local contractor was losing high-value jobs to bigger firms because their online presence didn't match the quality of their work.",
    approach:
      "We designed a trust-first site led by real project photography, clear service breakdowns, verified reviews, and a 24/7 call-to-action that meets clients in their actual decision moment.",
    result:
      "Cold prospects now arrive on a site that proves the work before the first call, shortening the path from search to signed quote.",
  },
  {
    slug: "silverfin",
    name: "Silverfin Swimming Club",
    url: "https://silverfin-academy.lovable.app",
    tag: "Sports",
    year: "2025",
    description:
      "Premium swimming programs and elite competition coaching for all ages.",
    stack: ["React", "Supabase", "Tailwind"],
    problem:
      "A premium swim club needed a website that felt as refined as their coaching, with clear pathways for parents, adults, and competitive swimmers.",
    approach:
      "We led with immersive pool imagery, a teal-and-cream palette inspired by water and lane lines, and program cards that make it easy to find the right level in seconds.",
    result:
      "A site that converts curious parents into trial bookings and gives the club a presence that matches their coaching pedigree.",
  },
];

export const getProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);