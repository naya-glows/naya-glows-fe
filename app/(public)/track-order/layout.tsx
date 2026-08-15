import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order | Naya Glows",
  robots: { index: false, follow: false },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
