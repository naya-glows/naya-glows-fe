import type { Metadata } from "next";

// Covers both /influencer (private dashboard) and /influencer/apply.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
