import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Droplet, Leaf, Sun } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";

export const metadata: Metadata = {
  title: "Key Ingredients | Naya Glows",
  description:
    "What's actually in your skincare, and what it does — Kojic Acid, Niacinamide, Hyaluronic Acid, and more, explained plainly.",
  alternates: { canonical: "/ingredients" },
  openGraph: { title: "Key Ingredients | Naya Glows", url: "/ingredients" },
};

const groups = [
  {
    name: "Boost & Correct",
    subtitle: "Serums — brightening, evening, renewing",
    icon: Sparkles,
    ingredients: [
      { name: "Vitamin C", meaning: "Brightens and helps even out overall skin tone." },
      { name: "Niacinamide", meaning: "Minimizes the look of pores and calms redness." },
      { name: "Azelaic Acid", meaning: "Gently renews skin and softens post-acne marks." },
      { name: "Alpha Arbutin", meaning: "Fades dark spots without irritating sensitive skin." },
      { name: "Kojic Acid", meaning: "Supports a brighter, more even complexion over time." },
      { name: "Licorice Root Extract", meaning: "Soothes skin while helping correct discoloration." },
    ],
  },
  {
    name: "Renew & Correct",
    subtitle: "Creams & oils — hydration, barrier repair",
    icon: Droplet,
    ingredients: [
      { name: "Squalane", meaning: "A lightweight oil that strengthens the skin barrier." },
      { name: "Argan Oil", meaning: "Nourishes deeply without leaving a greasy finish." },
      { name: "Chia Seed Oil", meaning: "Rich in fatty acids that lock in lasting moisture." },
      { name: "Aloe Vera", meaning: "Cools and soothes while delivering light hydration." },
    ],
  },
  {
    name: "Purify & Balance",
    subtitle: "Cleansers & toners — clarity, pore care",
    icon: Leaf,
    ingredients: [
      { name: "Salicylic Acid", meaning: "Clears pores from within to help prevent breakouts." },
      { name: "Lactic Acid", meaning: "Gently resurfaces skin for a smoother, brighter feel." },
      { name: "Kaolin Clay", meaning: "Draws out excess oil and impurities without stripping." },
    ],
  },
  {
    name: "Glow & Nourish",
    subtitle: "Body care — radiance, repair",
    icon: Sun,
    ingredients: [
      { name: "Tranexamic Acid", meaning: "Helps even out skin tone from neck to toe." },
      { name: "Vitamin E", meaning: "Protects skin while locking in lasting softness." },
      { name: "Sweet Almond Oil", meaning: "Fast-absorbing nourishment for a luminous glow." },
    ],
  },
];

export default function IngredientsPage() {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="What's Inside"
          heading="The ingredients behind every formula"
          subtitle="Every Naya Glows product is built around clean, purposeful actives — here's what they do and where you'll find them."
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-14">
          {groups.map((group) => (
            <div key={group.name}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0">
                  <group.icon size={17} className="text-[#6a9a72]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">{group.name}</h2>
                  <p className="text-xs text-[#16241a]/45">{group.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.ingredients.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white/55 backdrop-blur-xl border border-white/60 rounded-2xl p-5"
                  >
                    <p className="text-sm font-semibold text-[#4f7957] mb-1">{item.name}</p>
                    <p className="text-sm text-[#16241a]/65 leading-relaxed">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <GlassCard className="px-6 py-10 text-center">
            <h2 className="text-xl sm:text-2xl font-light mb-3">
              Ready to find your formula?
            </h2>
            <p className="text-sm text-[#16241a]/60 mb-6 max-w-md mx-auto">
              Shop the full catalog, or take our two-minute Skin Quiz for a
              personalized starting point.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/catalog"
                className="inline-block text-sm font-semibold bg-[#16241a] text-white px-7 py-3 rounded-full hover:bg-[#233324] transition-colors"
              >
                Shop All Products
              </Link>
              <Link
                href="/skin-quiz"
                className="inline-block text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-7 py-3 rounded-full hover:bg-[#16241a]/5 transition-colors"
              >
                Take the Skin Quiz
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
