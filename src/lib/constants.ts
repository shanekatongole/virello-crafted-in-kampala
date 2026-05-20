export const STUDIO_EMAIL = "katongoleshane@gmail.com";

export const mailtoSubject = (subject: string) =>
  `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const STARTING_PRICE_DISPLAY = "UGX 350,000";

export const PRICING = {
  currency: "UGX",
  paymentTerms: "50% upfront · 50% on completion",
  packages: [
    {
      id: "starter",
      name: "Starter",
      price: 350_000,
      pricePrefix: "",
      tagline: "Perfect for small businesses and personal brands starting online.",
      highlight: false,
      features: [
        "Modern responsive website",
        "3–5 pages",
        "Mobile optimization",
        "WhatsApp integration",
        "Contact form",
        "Social media links",
        "Basic SEO setup",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 700_000,
      pricePrefix: "",
      tagline: "Ideal for growing businesses that need a stronger online presence.",
      highlight: true,
      features: [
        "Everything in Starter",
        "6–10 pages",
        "Custom-designed sections",
        "Gallery integration",
        "Google Maps integration",
        "Enhanced UI/UX",
        "Performance optimization",
      ],
    },
    {
      id: "premium",
      name: "Premium Custom",
      price: 1_200_000,
      pricePrefix: "From ",
      tagline: "For brands that want a fully custom, premium experience.",
      highlight: false,
      features: [
        "11+ pages",
        "Fully custom modern design",
        "Advanced animations & interactions",
        "Custom layouts and branding",
        "Premium gallery sections",
        "Additional custom features",
        "Full optimization and polish",
      ],
    },
  ],
  addons: [
    { name: "Domain & Hosting Setup", price: 120_000, unit: "" },
    { name: "Monthly Maintenance", price: 80_000, unit: "/mo" },
    { name: "Additional Pages", price: 50_000, unit: "/page" },
  ],
} as const;

export function formatUGX(amount: number): string {
  return "UGX " + amount.toLocaleString("en-UG");
}
