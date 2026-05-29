import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { getSiteUrl } from "@/lib/site-url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "#050505" }}>
      <div className="max-w-md text-center">
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: 96, color: "#f0f4ff", letterSpacing: "-0.04em" }}>404</h1>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600, fontSize: 20, color: "#f0f4ff", marginTop: 8 }}>Page not found</h2>
        <p style={{ color: "#5a6a80", fontSize: 14, marginTop: 8 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "10px 24px", borderRadius: 999,
              background: "linear-gradient(135deg, #00c2ff, #0057ff)",
              color: "#050505", fontWeight: 700, fontSize: 14,
              textDecoration: "none",
            }}
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "#050505" }}>
      <div className="max-w-md text-center">
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: 24, color: "#f0f4ff" }}>
          This page didn't load
        </h1>
        <p style={{ color: "#5a6a80", fontSize: 14, marginTop: 8 }}>
          Something went wrong. Try refreshing or head back home.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { router.invalidate(); reset(); }}
            style={{
              padding: "10px 20px", borderRadius: 999,
              background: "linear-gradient(135deg, #00c2ff, #0057ff)",
              color: "#050505", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: "10px 20px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f0f4ff", fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const siteUrl = getSiteUrl();
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Virello — Web Design Studio, Kampala" },
      { name: "description", content: "Virello is a Kampala-based web design studio building fast, polished websites and digital products for businesses across East Africa." },
      { name: "author", content: "Virello" },
      { property: "og:site_name", content: "Virello" },
      { property: "og:title", content: "Virello — Web Design Studio, Kampala" },
      { property: "og:description", content: "Virello is a Kampala-based web design studio building fast, polished websites and digital products for businesses across East Africa." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:image", content: `${siteUrl}/og-cover.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Virello — Web Design Studio, Kampala" },
      { name: "twitter:description", content: "Virello is a Kampala-based web design studio building fast, polished websites and digital products for businesses across East Africa." },
      { name: "twitter:image", content: `${siteUrl}/og-cover.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Virello",
          url: siteUrl,
          email: "katongoleshane@gmail.com",
          description: "Web design studio building websites and digital products for businesses across East Africa.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kampala",
            addressCountry: "UG",
          },
          areaServed: "East Africa",
          logo: `${siteUrl}/og-cover.jpg`,
        }),
      },
    ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
