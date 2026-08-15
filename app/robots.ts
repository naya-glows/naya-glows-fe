import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/cart", "/checkout", "/signin", "/influencer", "/track-order"],
    },
    sitemap: "https://nayaglows.skin/sitemap.xml",
  };
}
