"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useSectionContent, useSectionLoading } from "../../store/useSectionContent";
import { defaultTestimonialsContent } from "@/lib/content/homeTestimonials";
import TestimonialsSkeleton from "./skeletons/TestimonialsSkeleton";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
    const content = useSectionContent("home.testimonials", defaultTestimonialsContent);
    const testimonials = content.testimonials;
    const isLoading = useSectionLoading("home.testimonials");
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Scroll animations (reversible)
    useEffect(() => {
        const ctx = gsap.context(() => {
            const anim = (el: Element | null, from: gsap.TweenVars, delay = 0) => {
                if (!el) return;
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 40, ...from },
                    {
                        opacity: 1, y: 0, x: 0,
                        duration: 1.4, delay,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            end: "top 25%",
                            toggleActions: "play none none none", // was "...reverse" — scrolling back up past this section no longer re-hides it (see ScrollTriggerRefresher.tsx for the full context on why)
                        },
                    }
                );
            };

            anim(headingRef.current, {});
            cardRefs.current.forEach((el, i) => anim(el, { y: 60 }, 0.18 + i * 0.08));
        }, sectionRef);

        return () => ctx.revert();
        // Re-run if the testimonial count changes (e.g. an admin edit swaps
        // in a longer/shorter list) so scroll triggers stay bound to real,
        // currently-mounted cards instead of stale/removed ones.
    }, [testimonials.length]);

    // Track scroll position to enable/disable arrows
    const updateArrows = () => {
        const el = sliderRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, []);

    const scrollBy = (direction: "left" | "right") => {
        const el = sliderRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.7;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <section ref={sectionRef} className="relative w-full py-20">
            {isLoading && (
                <div className="absolute inset-0 z-50">
                    <TestimonialsSkeleton />
                </div>
            )}
            <div className="w-[90%] max-w-[1440px] mx-auto max-[1275px]:w-full">
                <div className=" p-8 sm:p-10 lg:p-14 max-[800px]:px-4">

                    {/* ── Heading ──────────────────────────────────────────────── */}
                    <div ref={headingRef} className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight">
                                {content.headingHighlight}
                            </h2>
                            {/* Inline bubble */}
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-[#f5c775] border-2 border-white shadow-md flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-lg">✦</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-[#9a9ab8] tracking-tight">
                                {content.headingRest}
                            </h2>
                        </div>
                    </div>

                    {/* ── Horizontal scroll slider ────────────────────────────── */}
                    <div
                        ref={sliderRef}
                        className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar"
                        style={{ scrollbarWidth: "none" }}
                    >
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                ref={(el) => { cardRefs.current[i] = el; }}
                                className="group relative flex-shrink-0 snap-start rounded-3xl overflow-hidden cursor-pointer bg-[#f5f5f5] transition-all duration-300 shadow-lg"
                                style={{ width: "min(320px, 82vw)", height: 320 }}
                            >
                                {/* ── HOVER BG IMAGE (CSS-only reveal via group-hover) ── */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <Image
                                        src={t.photo}
                                        alt={t.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out scale-105 group-hover:scale-100"
                                    />
                                    {/* Dark gradient for text legibility on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55" />
                                </div>

                                {/* ── DEFAULT CONTENT (avatar + quote) — hidden on hover ── */}
                                <div className="relative z-10 h-full flex flex-col items-center text-center p-6 pt-8 transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
                                    {/* Avatar */}
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-3 flex-shrink-0">
                                        <Image
                                            src={t.photo}
                                            alt={t.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Rating badge */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#f5c775] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                                            <Star size={9} fill="white" strokeWidth={0} />
                                            {t.rating}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-[#1a1a2e] mt-3 mb-3">
                                        {t.name}
                                    </h3>

                                    {/* Quote */}
                                    <p className="text-sm text-[#5a5a7a] leading-relaxed italic px-1 flex-1">
                                        "{t.quote}"
                                    </p>

                                    {/* Tags */}
                                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                                        {t.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs font-semibold text-[#1a1a2e] bg-white px-3 py-1 rounded-full shadow-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* ── HOVER OVERLAY CONTENT (name + tags + glass product card) ── */}
                                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    {/* Top: name + tags */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl font-bold text-white drop-shadow-lg mr-2">
                                            {t.name}
                                        </h3>
                                        {t.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] font-semibold text-white bg-[#f5c775] px-3 py-1 rounded-full shadow-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Bottom: glass product card */}
                                    <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-3 flex items-center gap-3 pointer-events-auto shadow-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white/40 flex-shrink-0 overflow-hidden">
                                            <Image
                                                src={t.productImage}
                                                alt={t.product}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] uppercase tracking-wider text-white/80 font-medium">Product</p>
                                            <p className="text-sm font-semibold text-white truncate">{t.product}</p>
                                        </div>
                                        <button
                                            aria-label="View product"
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1a1a2e] hover:scale-110 transition-transform flex-shrink-0"
                                        >
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Navigation arrows ────────────────────────────────────── */}
                    <div className="flex justify-center items-center gap-3 mt-8">
                        <button
                            onClick={() => scrollBy("left")}
                            disabled={!canScrollLeft}
                            aria-label="Previous"
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollLeft
                                ? "bg-[#fdeadf] text-[#1a1a2e] hover:bg-[#f5c775] hover:scale-105"
                                : "bg-[#f5f1ff] text-[#d8d4f0] cursor-not-allowed"
                                }`}
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <button
                            onClick={() => scrollBy("right")}
                            disabled={!canScrollRight}
                            aria-label="Next"
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollRight
                                ? "bg-[#fdeadf] text-[#1a1a2e] hover:bg-[#f5c775] hover:scale-105"
                                : "bg-[#f5f1ff] text-[#d8d4f0] cursor-not-allowed"
                                }`}
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hide scrollbar across browsers */}
            <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
}