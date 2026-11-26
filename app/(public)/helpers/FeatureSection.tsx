"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionContent } from "../../store/useSectionContent";
import { defaultFeaturedProductsContent } from "@/lib/content/homeFeaturedProducts";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedSection() {
  const content = useSectionContent("home.featuredProducts", defaultFeaturedProductsContent);
  const [card1, card2] = content.cards;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const anim = (el: Element | null, from: gsap.TweenVars, delay = 0) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, ...from },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1.4,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 25%",
              toggleActions: "play none none none", // was "...reverse" — scrolling back up past this section no longer re-hides it (see ScrollTriggerRefresher.tsx for the full context on why)
            },
          },
        );
      };

      anim(headingRef.current, {});
      anim(subheadRef.current, {}, 0.08);
      anim(descRef.current, {}, 0.14);
      anim(labelRef.current, {}, 0.2);
      anim(card1Ref.current, { x: -40 }, 0.25);
      anim(card2Ref.current, { y: 60 }, 0.32);
      anim(card3Ref.current, { x: 40 }, 0.38);
      anim(disclaimerRef.current, {}, 0.44);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 bg-white">
      <div className="w-[90%] mx-auto max-[1275px]:w-full">
        {/* ── White card container ─────────────────────────────────────────── */}
        <div className=" p-8 sm:p-10 lg:p-14 max-[800px]:px-2">
          {/* ── Heading line 1 ──────────────────────────────────────────────── */}
          <div ref={headingRef} className="text-center mb-1">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#1a1a2e]">
                ▶
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#1a1a2e] tracking-tight">
                {content.headingLine1}
              </h2>
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <Image
                  src={content.headingIcon1}
                  alt="product"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#1a1a2e] tracking-tight">
                {content.headingLine1Suffix}
              </h2>
            </div>
          </div>

          {/* ── Heading line 2 ──────────────────────────────────────────────── */}
          <div ref={subheadRef} className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-[#9a9ab8] tracking-tight">
                {content.headingLine2Prefix}
              </span>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <Image
                  src={content.headingIcon2}
                  alt="product"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#1a1a2e] tracking-tight">
                {content.headingLine2Bold}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-[#9a9ab8] tracking-tight">
                {content.headingLine2Light}
              </span>
            </div>
          </div>

          <p
            ref={descRef}
            className="text-center text-base text-[#5a5a7a] max-w-md mx-auto leading-relaxed mb-10"
          >
            {content.description}
          </p>

          {/* ── Label ───────────────────────────────────────────────────────── */}
          <p
            ref={labelRef}
            className="text-sm font-semibold text-[#1a1a2e] mb-5 tracking-wide"
          >
            {content.label}
          </p>

          {/* ── Cards grid - Updated to grid of 3 with equal height ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ── Card 1 — 10% wider than others ───────────────────────────────────────── */}
            <div
              ref={card1Ref}
              className="rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden lg:col-span-1 max-[400px]:p-6"
              style={{ backgroundColor: "#ffe1d7" }}
            >
              {/* Watermark rings */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.07] pointer-events-none">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="#c9a87c"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="62"
                    stroke="#c9a87c"
                    strokeWidth="1"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="34"
                    stroke="#c9a87c"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>

              <div>
                {/* Short wide rounded image */}
                <Image
                  src={card1.image}
                  alt={card1.title}
                  width={140}
                  height={88}
                  className="object-cover rounded-2xl w-20 h-20 mb-10"
                />
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-3 leading-tight">
                  {card1.title}
                </h3>
                <p className="text-sm text-[#5a5a7a] leading-relaxed max-w-xs">
                  {card1.description}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-7 max-[400px]:gap-[4px] w-fit">
                <Link
                  href={card1.primaryCtaHref}
                  className=" max-[400px]:px-3 max-[400px]:py-1.5 bg-[#1a1a2e] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2d2d4a] transition-colors"
                >
                  {card1.primaryCtaLabel}
                </Link>
                <Link
                  href={card1.secondaryCtaHref}
                  className=" max-[400px]:px-3 max-[400px]:py-1.5 border border-[#1a1a2e]/25 text-[#1a1a2e] text-sm font-semibold px-6 py-2.5 rounded-full hover:border-[#1a1a2e]/60 transition-colors"
                >
                  {card1.secondaryCtaLabel}
                </Link>
              </div>
            </div>

            {/* ── Card 2 ───────────────────────────────────────── */}
            <div
              ref={card2Ref}
              className="rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden max-[400px]:p-6"
              style={{ backgroundColor: "#f5f1ff" }}
            >
              <div className="absolute -bottom-6 -right-6 w-48 h-48 opacity-[0.07] pointer-events-none">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="#6b6baa"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="55"
                    stroke="#6b6baa"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div>
                <Image
                  src={card2.image}
                  alt={card2.title}
                  width={128}
                  height={72}
                  className="object-cover rounded-2xl w-20 h-20 mb-10"
                />
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2 leading-tight">
                  {card2.title}
                </h3>
                <p className="text-sm text-[#5a5a7a] leading-relaxed">
                  {card2.description}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-5 max-[400px]:gap-[4px]">
                <Link
                  href={card2.primaryCtaHref}
                  className=" max-[400px]:px-3 max-[400px]:py-1.5 bg-[#1a1a2e] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2d2d4a] transition-colors"
                >
                  {card2.primaryCtaLabel}
                </Link>
                <Link
                  href={card2.secondaryCtaHref}
                  className="max-[400px]:px-3 max-[400px]:py-1.5 border border-[#1a1a2e]/25 text-[#1a1a2e] text-sm font-semibold px-6 py-2.5 rounded-full hover:border-[#1a1a2e]/60 transition-colors"
                >
                  {card2.secondaryCtaLabel}
                </Link>
              </div>
            </div>

            {/* ── Card 3 — image container with scale hover on image only ───────────────────────────────────────── */}
            <div
              ref={card3Ref}
              className="rounded-3xl overflow-hidden relative group cursor-pointer min-h-[300px]"
            >
              {/* Inner container clips the scaling image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <Image
                  src={content.lifestyleImage}
                  alt={content.lifestyleText}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              {/* Gradient overlay — deepens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/85 rounded-3xl" />

              {/* Skin Health badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 transition-all duration-300 group-hover:bg-white/35 group-hover:scale-105">
                <span className="text-white text-xs font-semibold">
                  {content.lifestyleBadge}
                </span>
                <div className="w-5 h-5 rounded-full bg-[#c9a87c] flex items-center justify-center">
                  <span className="text-[9px] text-white font-bold">✦</span>
                </div>
              </div>

              {/* Bottom text — lifts on hover */}
              <div className="absolute bottom-5 left-5 right-5 transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <p className="text-white text-xl font-bold leading-snug">
                  {content.lifestyleText}
                </p>
              </div>
            </div>
          </div>
          {/* end cards grid */}

          {/* ── Disclaimer ───────────────────────────────────────────────────── */}
          <p ref={disclaimerRef} className="mt-7 text-xs text-[#8888aa]">
            {content.disclaimer}
          </p>
        </div>
        {/* end white card */}
      </div>
    </section>
  );
}
