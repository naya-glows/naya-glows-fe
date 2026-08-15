import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

const BASE_URL = "https://nayaglows.skin";

const staticRoutes = [
  { path: "/", priority: 1, frequency: "daily" as const },
  { path: "/catalog", priority: 0.9, frequency: "daily" as const },
  { path: "/subscribe-save", priority: 0.7, frequency: "weekly" as const },
  { path: "/our-story", priority: 0.6, frequency: "monthly" as const },
  { path: "/ingredients", priority: 0.6, frequency: "monthly" as const },
  { path: "/skin-education", priority: 0.6, frequency: "monthly" as const },
  { path: "/transformations", priority: 0.5, frequency: "monthly" as const },
  { path: "/blog", priority: 0.5, frequency: "weekly" as const },
  { path: "/faqs", priority: 0.5, frequency: "monthly" as const },
  { path: "/shipping", priority: 0.4, frequency: "monthly" as const },
  { path: "/contact", priority: 0.4, frequency: "yearly" as const },
  { path: "/consultation", priority: 0.4, frequency: "monthly" as const },
  { path: "/wholesale", priority: 0.4, frequency: "yearly" as const },
  { path: "/skin-quiz", priority: 0.4, frequency: "monthly" as const },
  { path: "/branches", priority: 0.3, frequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, frequency: "yearly" as const },
  { path: "/terms", priority: 0.2, frequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      changeFrequency: route.frequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
