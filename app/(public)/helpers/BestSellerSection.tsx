"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionContent } from "../../store/useSectionContent";
import { defaultBestSellersContent } from "@/lib/content/homeBestSellers";

gsap.registerPlugin(ScrollTrigger);

export default function BestSellersSection() {
    const content = useSectionContent("home.bestSellers", defaultBestSellersContent);
    const cards = content.cards;
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
                    }
                );
            };
            anim(headingRef.current, {});
            anim(cardRefs.current[0], { x: -40 }, 0.18);
            anim(cardRefs.current[1], { x: 40 }, 0.28);
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-[#eafbf0] py-20">
            <div className="w-[90%] mx-auto max-[1275px]:w-full">
                <div className="p-8 sm:p-10 lg:p-14 max-[800px]:px-4">

                    {/* ── Heading ──────────────────────────────────────────── */}
                    <div ref={headingRef} className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight leading-tight mb-1">
                            Best Sellers,{" "}
                            <span className="font-light text-[#6a9a72]">{content.headingHighlight}</span>
                        </h2>
                        <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-[#6a9a72] tracking-tight">
                            {content.headingRest}
                        </p>
                    </div>

                    {/* ── Cards grid ───────────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {cards.map((card, i) => (
                            <div
                                key={card.name}
                                ref={(el) => { cardRefs.current[i] = el; }}
                                className="rounded-3xl p-7 sm:p-9 flex flex-col justify-between min-h-[520px]"
                                style={{ backgroundColor: "#ddf6e5" }}
                            >
                                {/* Top: name + result + quote */}
                                <div className="text-center">
                                    <p className="text-base font-bold text-[#1a1a2e]">
                                        {card.name}
                                    </p>
                                    <p className="text-base font-semibold text-[#1a1a2e] mb-4">
                                        {card.result}
                                    </p>
                                    <p className="text-sm text-gray-950 leading-relaxed min-[800px]:w-[60%] mx-auto">
                                        {card.quote}
                                    </p>
                                </div>

                                {/* Middle: circular image */}
                                <div className="flex items-center justify-center my-7">
                                    <div
                                        className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                                        style={{
                                            width: 240,
                                            height: 240,
                                            backgroundColor: "#add0b3",
                                        }}
                                    >
                                        <Image
                                            src={card.image}
                                            alt={card.name}
                                            width={220}
                                            height={220}
                                            className="object-cover rounded-[220px] w-[220px] h-[220px]"
                                        />
                                    </div>
                                </div>

                                {/* Bottom: product + CTA */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#ffe1d7] flex-shrink-0">
                                            <Image
                                                src={card.productImage}
                                                alt={card.productName}
                                                width={44}
                                                height={44}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1a1a2e] leading-tight">
                                                {card.productName}
                                            </p>
                                            <p className="text-xs text-[#9a9ab8]">{card.productSub}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={card.href}
                                        className="bg-[#1a1a2e] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2d2d4a] transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-7 text-xs text-[#8888aa]">
                        Results may vary. Individual skin improvement depends on consistent use and skin type.
                    </p>
                </div>
            </div>
        </section>
    );
}