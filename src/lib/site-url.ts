const DEFAULT_SITE_URL = "https://virellosites.lovable.app";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Canonical site origin for SEO, sitemap, and OG tags. */
export function getSiteUrl(): string {
  const fromEnv =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL);

  if (typeof fromEnv === "string" && fromEnv.trim()) {
    return normalizeSiteUrl(fromEnv.trim());
  }

  return DEFAULT_SITE_URL;
}
