"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionContent, useSectionLoading } from "../../store/useSectionContent";
import { defaultCategoriesContent } from "@/lib/content/homeCategories";
import CategoriesSkeleton from "./skeletons/CategoriesSkeleton";

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesSection() {
    const content = useSectionContent("home.categories", defaultCategoriesContent);
    const categories = content.categories;
    const isLoading = useSectionLoading("home.categories");
    const sectionRef = useRef<HTMLElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 60, scale: 0.96 },
                    {
                        opacity: 1, y: 0, scale: 1,
                        duration: 1,
                        delay: i * 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            end: "top 25%",
                            toggleActions: "play none none none", // was "...reverse" — scrolling back up past this section no longer re-hides it (see ScrollTriggerRefresher.tsx for the full context on why)
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-white overflow-y-hidden">
            {isLoading && (
                <div className="absolute inset-0 z-50">
                    <CategoriesSkeleton />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        ref={(el) => { cardRefs.current[i] = el; }}
                        className="relative overflow-hidden group cursor-pointer h-[380px] sm:h-[440px] md:h-[580px] lg:h-[640px]"
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            <Image
                                src={cat.image}
                                alt={cat.label}
                                fill
                                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                                priority={i === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
                        </div>

                        {/* Vertical label (left side) */}
                        <div className="absolute top-7 left-7 z-10">
                            <span
                                className="text-white text-4xl  sm:text-5xl font-light tracking-wide capitalize drop-shadow-md"
                                style={{
                                    writingMode: "vertical-rl",
                                    transform: "rotate(180deg)",
                                }}
                            >
                                {cat.label}
                            </span>
                        </div>

                        {/* Shop button (bottom-left) */}
                        <div className="absolute bottom-7 left-7 right-7 flex z-10">
                            <Link
                                href={cat.href}
                                className="inline-flex items-center bg-white text-[#1a1a2e] text-sm font-medium px-6 py-3 rounded-full shadow-lg lowercase tracking-wide hover:bg-[#1a1a2e] hover:text-white transition-all duration-300 group-hover:translate-y-[-2px]"
                            >
                                {cat.buttonText}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}