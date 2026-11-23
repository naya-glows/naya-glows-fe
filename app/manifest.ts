import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Naya Glows",
    short_name: "Naya Glows",
    description: "Radiance-boosting skincare crafted with clean, potent ingredients.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4faf3",
    theme_color: "#16241a",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
