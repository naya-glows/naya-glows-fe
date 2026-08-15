import type { Metadata } from "next";

// The page itself is a client component (form state), so metadata can't be
// exported from page.tsx directly — this thin server layout is Next.js's
// standard way to attach per-route metadata to a client-component page
// without restructuring it.
export const metadata: Metadata = {
  title: "Contact Us | Naya Glows",
  description: "Questions about an order, a product, or anything else? Get in touch with Naya Glows.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Us | Naya Glows", url: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
