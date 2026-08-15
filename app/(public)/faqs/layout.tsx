import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Naya Glows",
  description: "Everything you need to know about shopping, shipping, and using Naya Glows.",
  alternates: { canonical: "/faqs" },
  openGraph: { title: "FAQs | Naya Glows", url: "/faqs" },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
