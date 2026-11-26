"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionContent, useSectionLoading } from "../../store/useSectionContent";
import { defaultHowItWorksContent } from "@/lib/content/homeHowItWorks";
import HowItWorksSkeleton from "./skeletons/HowItWorksSkeleton";

gsap.registerPlugin(ScrollTrigger);

// Step numbers are structural (one per fixed slot), not admin-editable content.
const stepNumbers = ["01", "02", "03"];

const DOT_COUNT = 24;
const RING_R = 52;

function DotRing({ active }: { active: boolean }) {
    const CX = 64, CY = 64;
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 128 128"
        >
            {Array.from({ length: DOT_COUNT }).map((_, i) => {
                const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
                const cx = CX + RING_R * Math.cos(angle);
                const cy = CY + RING_R * Math.sin(angle);
                const delay = active ? `${(i / DOT_COUNT) * 0.6}s` : "0s";
                return (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={active ? 3.5 : 2.5}
                        fill={active ? "#c4745a" : "#f5c8b8"}
                        style={{
                            transition: active
                                ? `fill 0.15s ease ${delay}, opacity 0.15s ease ${delay}`
                                : "fill 0.3s ease",
                            opacity: active ? 1 : 0.5,
                        }}
                    />
                );
            })}
        </svg>
    );
}

export default function HowItWorksSection() {
    const content = useSectionContent("home.howItWorks", defaultHowItWorksContent);
    const steps = content.steps;
    const isLoading = useSectionLoading("home.howItWorks");
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const connectorRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [activeStep, setActiveStep] = useState(0);

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
            anim(connectorRef.current, { y: 20 }, 0.12);
            cardRefs.current.forEach((el, i) => anim(el, { y: 50 }, 0.2 + i * 0.1));
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Auto-cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((p) => (p + 1) % steps.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#FaFaFa] py-20">
            {isLoading && (
                <div className="absolute inset-0 z-50">
                    <HowItWorksSkeleton />
                </div>
            )}
            <div className="w-[90%] mx-auto max-[1275px]:w-full">
                <div className="p-8 sm:p-10 lg:p-14 max-[800px]:px-4">

                    {/* ── Heading ─────────────────────────────────────────────────── */}
                    <div ref={headingRef} className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 flex-wrap mb-1">
                            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight">
                                {content.headingPart1}
                            </h2>
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-[#ffe1d7]">
                                <Image src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381879/naya-glows/legacy/img_6331.jpg" alt="step" width={44} height={44} className="object-cover w-full h-full" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight">
                                {content.headingPart2}
                            </h2>
                        </div>
                        <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-gray-300 tracking-tight">
                            {content.headingPart3}
                        </p>
                    </div>

                    {/* ── Centered connector row ───────────────────────────────────── */}
                    <div ref={connectorRef} className="flex items-center justify-center mb-10 px-2 max-[700px]:hidden">
                        <div className="flex items-center justify-center gap-0 min-w-1/2 mx-auto">

                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center" style={{ flex: i < steps.length - 1 ? "0 0 auto" : "0 0 auto" }}>

                                    {/* Number bubble */}
                                    <button
                                        onClick={() => setActiveStep(i)}
                                        className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-500 ${activeStep === i
                                            ? "bg-[#c4745a] text-white shadow-lg scale-110"
                                            : activeStep > i
                                                ? "bg-[#1a1a2e] text-white"
                                                : "bg-[#fff5f2] text-[#c09080] border border-[#f5c8b8]"
                                            }`}
                                    >
                                        {stepNumbers[i]}
                                        {activeStep === i && (
                                            <span className="absolute inset-0 rounded-full bg-[#c4745a]/25 animate-ping pointer-events-none" />
                                        )}
                                    </button>

                                    {/* Dot chain connector between numbers */}
                                    {i < steps.length - 1 && (
                                        <div className="flex items-center gap-[6px] mx-3 flex-1" style={{ minWidth: 120 }}>
                                            {Array.from({ length: 14 }).map((_, d) => {
                                                const filled = activeStep > i;
                                                return (
                                                    <div
                                                        key={d}
                                                        className="rounded-full flex-shrink-0 transition-all duration-300"
                                                        style={{
                                                            width: 6,
                                                            height: 6,
                                                            backgroundColor: filled ? "#1a1a2e" : "#f5c8b8",
                                                            transitionDelay: filled ? `${d * 25}ms` : `${(13 - d) * 25}ms`,
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* ── Step cards ──────────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                ref={(el) => { cardRefs.current[i] = el; }}
                                onClick={() => setActiveStep(i)}
                                className={`relative rounded-3xl p-7 flex flex-col items-center text-center cursor-pointer transition-all duration-400 group ${activeStep === i
                                    ? "bg-[#fff5f2] shadow-md ring-1 ring-[#ffd0ba]"
                                    : "bg-[#f5f5f5] hover:bg-[#fff5f2]/50 shadow-lg"
                                    }`}
                            >
                                {/* Image + dot ring wrapper */}
                                <div className="relative mb-6 flex-shrink-0 border border-dotted rounded-full" style={{ width: 136, height: 136 }}>
                                    {/* <DotRing key={`${i}-${activeStep === i}`} active={activeStep === i} /> */}

                                    {/* Circular image */}
                                    <div className="absolute inset-0 m-auto w-[120px] h-[120px] rounded-full overflow-hidden"
                                    >
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            width={112}
                                            height={112}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>

                                <h3 className={`text-lg font-bold leading-snug mb-3 text-center w-[120px] transition-colors duration-300 ${activeStep === i ? "text-[#1a1a2e]" : "text-[#1a1a2e]/75"
                                    }`}>
                                    {step.title}
                                </h3>

                                <p className={`text-sm leading-relaxed transition-colors duration-300 ${activeStep === i ? "text-[#5a5a7a]" : "text-[#5a5a7a]/65"
                                    }`}>
                                    {step.description}
                                </p>

                                {activeStep === i && (
                                    <div className="mt-5 w-2 h-2 rounded-full bg-[#c4745a]" />
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-xs text-[#b09088]">
                        {content.footerNote}
                    </p>
                </div>
            </div>
        </section>
    );
}