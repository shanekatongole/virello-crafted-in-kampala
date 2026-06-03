export const STUDIO_EMAIL = "katongoleshane@gmail.com";

export const mailtoSubject = (subject: string) =>
  `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const STARTING_PRICE_DISPLAY = "UGX 550,000";

export const PRICING = {
  currency: "UGX",
  paymentTerms: "50% upfront · 50% on completion",
  packages: [
    {
      id: "starter",
      name: "Starter",
      price: 550_000,
      pricePrefix: "",
      tagline: "Perfect for small businesses and personal brands starting online.",
      highlight: false,
      features: [
        "Modern responsive website",
        "Up to 4 pages",
        "Mobile optimised",
        "WhatsApp integration",
        "Contact form",
        "Social media links",
        "Basic SEO setup",
        "1 revision round",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 1_100_000,
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
        "Performance optimisation",
        "2 revision rounds",
        "30-day post-launch support",
      ],
    },
    {
      id: "premium",
      name: "Premium Custom",
      price: 2_000_000,
      pricePrefix: "from ",
      tagline: "For brands that want a fully custom, premium experience.",
      highlight: false,
      features: [
        "11+ pages",
        "Fully custom modern design",
        "Advanced animations & interactions",
        "Custom layouts and branding",
        "Premium gallery sections",
        "CMS / blog setup",
        "Unlimited revisions",
        "60-day post-launch support",
      ],
    },
  ],
  addons: [
    { name: "Domain & Hosting Setup", price: 150_000, unit: "", pricePrefix: "" },
    { name: "Monthly Maintenance", price: 120_000, unit: "/mo", pricePrefix: "" },
    { name: "Additional Pages", price: 75_000, unit: "/page", pricePrefix: "" },
    { name: "WhatsApp Chatbot Setup", price: 200_000, unit: "", pricePrefix: "" },
    { name: "Rush Delivery (48–72hr)", price: 200_000, unit: "", pricePrefix: "+" },
  ],
} as const;

export function formatUGX(amount: number): string {
  return "UGX " + amount.toLocaleString("en-UG");
}
