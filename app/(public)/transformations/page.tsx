"use client";

import Link from "next/link";
import GlassCard from "../helpers/glass/GlassCard";
import BeforeAfterSlider from "../helpers/BeforeAfterSlider";
import PageHeader from "../helpers/PageHeader";

const AGING_IMAGE =
  "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381846/naya-glows/legacy/aging.png";
const YOUTHFUL_IMAGE =
  "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381952/naya-glows/legacy/youthful.png";

// Placeholder client photos — every entry reuses the same two stock
// before/after images until real client photos are ready to swap in.
const transformations = [
  {
    name: "Amara, 34",
    result: "Visibly brighter skin in 4 weeks",
    quote: "The dark spots I'd had for years finally started fading.",
  },
  {
    name: "Kezia, 29",
    result: "Smoother, more even tone in 3 weeks",
    quote: "My skin feels softer and looks so much more radiant now.",
  },
  {
    name: "Chidinma, 27",
    result: "Reduced dryness and dullness in 5 weeks",
    quote: "I finally found a routine that actually works for my skin.",
  },
  {
    name: "Ngozi, 31",
    result: "Clearer complexion in 6 weeks",
    quote: "Consistent use made all the difference. I see it every day.",
  },
  {
    name: "Halima, 26",
    result: "Firmer, more hydrated skin in 4 weeks",
    quote: "People keep asking what I'm using now. It's this simple.",
  },
  {
    name: "Zainab, 33",
    result: "Even skin tone in 5 weeks",
    quote: "This is the first routine that didn't overwhelm my skin.",
  },
];

export default function TransformationsPage() {
  return (
    <main className="bg-gradient-to-b from-[#f5f1ff] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Real Skin, Real Results"
          heading="Inspiring transformations from real people like you"
          subtitle="Drag each slider to see the difference. Photos below are placeholders, and real client transformations are coming soon."
          images={[{ src: YOUTHFUL_IMAGE, alt: "Radiant skin", afterWord: 1 }]}
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {transformations.map((t) => (
            <GlassCard key={t.name} className="p-5 sm:p-6 flex flex-col">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <BeforeAfterSlider beforeSrc={AGING_IMAGE} afterSrc={YOUTHFUL_IMAGE} />
              </div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-sm font-medium text-[#6a9a72] mb-2">{t.result}</p>
              <p className="text-sm text-[#16241a]/60 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </GlassCard>
          ))}
        </div>

        <div className="text-center mt-14">
          <p className="text-sm text-[#16241a]/50 mb-5">
            Ready to start your own transformation?
          </p>
          <Link
            href="/catalog"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-7 py-3.5 rounded-full hover:bg-[#233324] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
