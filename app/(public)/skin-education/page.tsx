"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlassCard from "../helpers/glass/GlassCard";

const skinTypes = [
  {
    title: "Oily & Acne-Prone",
    tips: [
      "Cleanse twice daily with a gentle foaming formula",
      "Look for Salicylic Acid & Niacinamide",
      "Never skip moisturizer: dehydration triggers more oil",
    ],
  },
  {
    title: "Dry & Dehydrated",
    tips: [
      "Layer a hydrating toner before your serum",
      "Look for Hyaluronic Acid & Squalane",
      "Seal it all in with a richer night cream",
    ],
  },
  {
    title: "Uneven Tone & Dark Spots",
    tips: [
      "Consistency matters more than potency",
      "Look for Kojic Acid, Alpha Arbutin & Vitamin C",
      "SPF daily: pigmentation worsens without it",
    ],
  },
];

const glossary = [
  { term: "Niacinamide", meaning: "Brightens, minimizes pores, and calms redness." },
  { term: "Hyaluronic Acid", meaning: "Draws moisture into the skin for lasting hydration." },
  { term: "Kojic Acid", meaning: "Fades dark spots and evens out skin tone over time." },
  { term: "Azelaic Acid", meaning: "Gently renews skin and softens post-acne marks." },
  { term: "Squalane", meaning: "A lightweight oil that strengthens the skin barrier." },
  { term: "Salicylic Acid", meaning: "Clears pores from within to prevent breakouts." },
];

export default function SkinEducationPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) videoRef.current?.pause();
  }, []);

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      {/* ── VIDEO HERO (same full-bleed treatment as Our Story) ──── */}
      <section className="relative w-full h-[100dvh] min-h-[560px] overflow-hidden bg-[#10160f]">
        {videoFailed ? (
          <Image
            src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381923/naya-glows/legacy/new/img_7557.jpg"
            alt="Skincare routine"
            fill
            priority
            className="object-cover object-top"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="https://res.cloudinary.com/bhozkz7o/video/upload/v1784381904/naya-glows/legacy/new/41341302-c730-4f62-8bc1-1d03bc983a7d.mov"
            poster="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381923/naya-glows/legacy/new/img_7557.jpg"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#10160f]/60 via-[#10160f]/30 to-[#10160f]/70" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="inline-block">
            <GlassCard className="!bg-white/10 !border-white/25 px-8 py-10 sm:px-14 sm:py-14">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#c7ecc9] mb-5">
                Naya Glows
              </p>
              <h1 className="text-[clamp(2.6rem,7vw,6rem)] font-light tracking-widest text-white leading-none">
                SKIN EDUCATION
              </h1>
              <p className="mt-6 text-white/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Understand your skin, choose the right routine.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="max-w-[1000px] mx-auto">
          {/* Skin types */}
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">
            Find Your Skin Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-20">
            {skinTypes.map((type) => (
              <GlassCard key={type.title} className="p-6">
                <h3 className="text-base font-semibold mb-4">{type.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {type.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 text-sm text-[#16241a]/65">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8ab88e] flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          {/* Ingredient glossary */}
          <h2 className="text-2xl sm:text-3xl font-light mb-8 text-center">
            Ingredient Glossary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
            {glossary.map((item) => (
              <div
                key={item.term}
                className="bg-white/55 backdrop-blur-xl border border-white/60 rounded-2xl p-5"
              >
                <p className="text-sm font-semibold text-[#4f7957] mb-1">{item.term}</p>
                <p className="text-sm text-[#16241a]/65 leading-relaxed">{item.meaning}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <GlassCard className="px-6 py-10 text-center">
            <h2 className="text-xl sm:text-2xl font-light mb-3">
              Not sure where to start?
            </h2>
            <p className="text-sm text-[#16241a]/60 mb-6 max-w-md mx-auto">
              Book a free online consultation and we&apos;ll help you build a
              routine suited to your skin.
            </p>
            <Link
              href="/consultation"
              className="inline-block text-sm font-semibold bg-[#16241a] text-white px-7 py-3 rounded-full hover:bg-[#233324] transition-colors"
            >
              Book a Consultation
            </Link>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
