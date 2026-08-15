import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";

export const metadata: Metadata = {
  title: "Skincare Journal | Naya Glows",
  description:
    "Layering actives, reading your skin, and building a routine that actually works — skincare guides from Naya Glows.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Skincare Journal | Naya Glows", url: "/blog" },
};

const articles = [
  {
    title: "Layering Actives Without Irritating Your Skin",
    excerpt:
      "Vitamin C, Niacinamide, acids — a simple order to follow so your routine works with your skin, not against it.",
    tag: "Routine",
  },
  {
    title: "What Your Skin Is Trying to Tell You",
    excerpt:
      "Breakouts, tightness, dullness — small daily signs and what they usually mean for your routine.",
    tag: "Skin Health",
  },
  {
    title: "The Case for Consistency Over Potency",
    excerpt:
      "Why a gentler routine used daily beats a strong one used occasionally, especially for tone and texture.",
    tag: "Ingredients",
  },
  {
    title: "Building a Routine That Actually Fits Your Day",
    excerpt:
      "A realistic 3-step morning and evening routine for people who don't have ten minutes to spare.",
    tag: "Routine",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="The Glow Journal"
          heading="Skincare notes, straight from Naya Glows"
          subtitle="Short, practical reads on routines, ingredients, and skin health — new pieces publishing soon."
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
            {articles.map((article) => (
              <GlassCard key={article.title} className="p-6 flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[#6a9a72] mb-3 w-fit">
                  {article.tag}
                </span>
                <h2 className="text-lg font-semibold leading-snug mb-2">{article.title}</h2>
                <p className="text-sm text-[#16241a]/60 leading-relaxed">{article.excerpt}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="px-6 py-10 text-center">
            <h2 className="text-xl sm:text-2xl font-light mb-3">More on the way</h2>
            <p className="text-sm text-[#16241a]/60 mb-6 max-w-md mx-auto">
              We&apos;re building out the full Glow Journal. In the meantime,
              browse our Skin Education hub or book a free consultation.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/skin-education"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-[#16241a] text-white px-7 py-3 rounded-full hover:bg-[#233324] transition-colors"
              >
                Visit Skin Education
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/consultation"
                className="inline-block text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-7 py-3 rounded-full hover:bg-[#16241a]/5 transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
