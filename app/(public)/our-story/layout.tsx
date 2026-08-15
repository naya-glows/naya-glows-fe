import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Naya Glows",
  description: "Why Naya Glows exists, and what clean, potent skincare means to us.",
  alternates: { canonical: "/our-story" },
  openGraph: { title: "Our Story | Naya Glows", url: "/our-story" },
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
