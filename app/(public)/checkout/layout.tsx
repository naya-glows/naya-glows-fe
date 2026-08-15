import type { Metadata } from "next";

// Covers both /checkout and /checkout/verify (nested route layouts apply to
// all child segments) — transactional pages, never indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
