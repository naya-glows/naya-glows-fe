import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation | Naya Glows",
  description:
    "Tell us about your skin and goals — one of our specialists will help you build a routine that actually works.",
  alternates: { canonical: "/consultation" },
  openGraph: { title: "Book a Consultation | Naya Glows", url: "/consultation" },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
