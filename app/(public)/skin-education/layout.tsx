import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skin Education | Naya Glows",
  description: "Understand your skin type, common concerns, and how to build a routine around them.",
  alternates: { canonical: "/skin-education" },
  openGraph: { title: "Skin Education | Naya Glows", url: "/skin-education" },
};

export default function SkinEducationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
