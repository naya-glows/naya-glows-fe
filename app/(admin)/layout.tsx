import type { Metadata } from "next";

// Applies to every /admin/* route (admin/layout.tsx is a client component
// and can't export metadata itself) — the whole admin dashboard is
// internal-only and should never appear in search results.
export const metadata: Metadata = {
  title: "Admin | Naya Glows",
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
