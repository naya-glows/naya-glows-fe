import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transformations | Naya Glows",
  description: "Real before-and-after results from people using Naya Glows.",
  alternates: { canonical: "/transformations" },
  openGraph: { title: "Transformations | Naya Glows", url: "/transformations" },
};

export default function TransformationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
