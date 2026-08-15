import type { Metadata } from "next";

// Private, per-user page — nothing here should ever show up in search
// results or get a rich link-preview card.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
