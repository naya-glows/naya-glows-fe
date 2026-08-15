import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns | Naya Glows",
  description: "Delivery timelines, fees, and how returns and exchanges work at Naya Glows.",
  alternates: { canonical: "/shipping" },
  openGraph: { title: "Shipping & Returns | Naya Glows", url: "/shipping" },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
