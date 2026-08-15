import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale | Naya Glows",
  description: "Interested in stocking Naya Glows in your store or spa? Tell us about your business.",
  alternates: { canonical: "/wholesale" },
  openGraph: { title: "Wholesale | Naya Glows", url: "/wholesale" },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
