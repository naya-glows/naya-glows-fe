"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Benefit cards — 2 left, 2 right, mirroring the reference
const leftCards = [
    {
        title: "Balance & Refine",
        description: "Restores optimal skin pH for a clear, healthy complexion",
        icon: "◈",
    },
    {
        title: "Deeply Hydrate",
        description: "Locks in moisture and plumps skin with every application",
        icon: "◇",
    },
];

const rightCards = [
    {
        title: "Purify Pores",
        description: "Removes residual impurities and tightens visible pores",
        icon: "◈",
    },
    {
        title: "Boost Absorption",
        description: "Primes skin to absorb serums and treatments more effectively",
        icon: "◇",
    },
];

const getScale = () => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w < 400) return 0.38;
    if (w < 480) return 0.44;
    if (w < 640) return 0.54;
    if (w < 768) return 0.66;
    if (w < 1024) return 0.80;
    return 1;
};

export default function ProductSpotlightSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const productRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    // SVG line refs
    const svgRef = useRef<SVGSVGElement>(null);
    const lineRefs = useRef<(SVGLineElement | SVGPathElement | null)[]>([]);

    // Card refs
    const leftCardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rightCardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Apply scale on mount and resize
        const applyScale = () => {
            if (!innerRef.current) return;
            const s = getScale();
            innerRef.current.style.transform = `scale(${s})`;
            innerRef.current.style.transformOrigin = "top center";
        };
        applyScale();
        window.addEventListener("resize", applyScale);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: productRef.current,
                    start: "top center",  // Product center hits viewport center
                    toggleActions: "play none none none", // was "...reverse" — scrolling back up past this section no longer re-hides it (see ScrollTriggerRefresher.tsx for the full context on why)
                }
            });

            // 1. Heading
            tl.fromTo(
                headingRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
                0
            );
            tl.fromTo(
                subRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
                0.1
            );

            // 2. Product image
            tl.fromTo(
                productRef.current,
                { opacity: 0, scale: 0.85, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 1.15, ease: "back.out(1.4)" },
                0.2
            );

            // 3. Lines animate outward from center (strokeDashoffset → 0)
            lineRefs.current.forEach((el, i) => {
                if (!el) return;
                const length = (el as SVGGeometryElement).getTotalLength?.() ?? 200;
                gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
                tl.to(
                    el,
                    {
                        strokeDashoffset: 0,
                        opacity: 1,
                        duration: 1.0,
                        ease: "power2.out",
                    },
                    0.55 + i * 0.08
                );
            });

            // 4. Cards appear
            [...leftCardRefs.current, ...rightCardRefs.current].forEach((el, i) => {
                if (!el) return;
                const isLeft = i < leftCards.length;
                tl.fromTo(
                    el,
                    { opacity: 0, x: isLeft ? -24 : 24, y: 10 },
                    { opacity: 1, x: 0, y: 0, duration: 0.75, ease: "power3.out" },
                    0.7 + i * 0.1
                );
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            window.removeEventListener("resize", applyScale);
        };
    }, []);

    const cardStyle: React.CSSProperties = {
        backgroundColor: "#d4e8d0",
        boxShadow: "4px 6px 0px 0px #b8d4b4, 8px 12px 0px 0px #a0c4a8",
    };

    /*
      SVG viewBox: 660 wide × 420 tall
      Product center: x=330, y=210
      Cards sit at:
        Top-left:    x=0,   y=80   (higher, wider)
        Bottom-left: x=0,   y=290  (lower, closer)
        Top-right:   x=660, y=80
        Bottom-right:x=660, y=290

      Top lines: bracket/elbow shape matching reference —
        from image side → go horizontal out → drop down to card level
        Path drawn FROM card END toward center so dashoffset animates outward from image.

      Bottom lines: simpler shallower diagonal.

      Lines are drawn starting from the image-side endpoint so the
      strokeDashoffset animation reveals them growing outward from the product.
    */

    return (
        <section ref={sectionRef} className="w-full bg-[#eafbf0] py-20">
            <div className="w-[90%] max-w-[1440px] mx-auto max-[1275px]:w-full">
                <div
                    ref={wrapperRef}
                    className=" p-8 sm:p-10 lg:p-14 max-[800px]:px-4"
                >
                    {/* ── Heading ─────────────────────────────────────────── */}
                    <div ref={headingRef} className="text-center mb-10 lg:mb-14">
                        <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight leading-tight">
                            Boost Your Confidence with
                        </h2>
                        <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light tracking-tight leading-tight"
                            style={{ color: "#6a9a72" }}>
                            Radiance Balance Toner
                        </p>
                    </div>

                    {/* ── Scalable inner wrapper ───────────────────────────── */}
                    <div style={{ overflow: "visible" }}>
                        <div ref={innerRef} style={{ transformOrigin: "top center" }}>

                            {/* ── Main layout: cards + product + cards ──────── */}
                            <div className="relative flex items-center justify-center gap-0">

                                {/* LEFT CARDS */}
                                <div className="flex flex-col z-10 flex-shrink-0 " style={{ width: 160, gap: "100px" }}>
                                    {leftCards.map((card, i) => (
                                        <div
                                            key={card.title}
                                            ref={(el) => { leftCardRefs.current[i] = el; }}
                                            className="rounded-2xl p-4"
                                            style={cardStyle}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-[#1a1a2e]">{card.title}</span>
                                                <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-[#6a9a72] text-xs flex-shrink-0">
                                                    {card.icon}
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#4a6a4e] leading-relaxed">{card.description}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* CENTER: SVG lines + product image */}
                                <div className="relative flex items-center justify-center flex-shrink-0"
                                    style={{ width: 340, height: 420 }}>

                                    {/* Product image — behind lines */}
                                    <div
                                        ref={productRef}
                                        className="absolute inset-0 z-0 flex items-center justify-center"
                                    >
                                        <Image
                                            src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381848/naya-glows/legacy/black-radiance.png"
                                            alt="Naya Radiance Balance Toner"
                                            width={220}
                                            height={380}
                                            className="object-contain drop-shadow-2xl"
                                            style={{ width: 220, height: 380 }}
                                            priority
                                        />
                                    </div>

                                    {/* SVG connecting lines — over image */}
                                    <svg
                                        ref={svgRef}
                                        className="absolute pointer-events-none"
                                        style={{
                                            zIndex: -1,
                                            // Extend beyond the center div to reach the cards
                                            width: "660px",
                                            height: "420px",
                                            left: "50%",
                                            top: "0",
                                            transform: "translateX(-50%)",
                                            overflow: "visible",
                                        }}
                                        viewBox="0 0 660 420"
                                        fill="none"
                                    >
                                        {/*
                                          Top-left bracket: image left edge ~x=170, card right edge ~x=160
                                          Starts at image side (330-85=245 left edge of product area), goes left,
                                          elbows up, then goes to card.
                                          Drawn FROM image outward so dashoffset reveals left→card.
                                          Image center x=330, product left ~245.
                                          Card top sits at y≈80, bottom card at y≈290.
                                          Top line: from (245,155) → go left to (170,155) → up to (170,100) → left to (0,100)  [bracket]
                                          Bottom line: from (245,260) → straight left to (0,290)  [shallow diagonal]
                                        */}

                                        {/* Top-left bracket */}
                                        <path
                                            ref={(el) => { lineRefs.current[0] = el; }}
                                            d="M 245,165 L 185,165 L 185,100 L 0,100"
                                            stroke="#8ab88e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                                        />
                                        {/* Bottom-left shallow diagonal */}
                                        <line
                                            ref={(el) => { lineRefs.current[1] = el as SVGLineElement; }}
                                            x1="245" y1="265" x2="0" y2="290"
                                            stroke="#8ab88e" strokeWidth="1.5" strokeLinecap="round"
                                        />
                                        {/* Top-right bracket (mirror) */}
                                        <path
                                            ref={(el) => { lineRefs.current[2] = el; }}
                                            d="M 415,165 L 475,165 L 475,100 L 660,100"
                                            stroke="#8ab88e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                                        />
                                        {/* Bottom-right shallow diagonal */}
                                        <line
                                            ref={(el) => { lineRefs.current[3] = el as SVGLineElement; }}
                                            x1="415" y1="265" x2="660" y2="290"
                                            stroke="#8ab88e" strokeWidth="1.5" strokeLinecap="round"
                                        />

                                        {/* Terminal dots at card ends */}
                                        {[
                                            [0, 100], [0, 290], [660, 100], [660, 290],
                                        ].map(([cx, cy], i) => (
                                            <circle key={i} cx={cx} cy={cy} r={4} fill="#8ab88e" opacity={0.7} />
                                        ))}
                                        {/* Center origin dot */}
                                        <circle cx="330" cy="210" r="5" fill="#6a9a72" opacity={0.5} />
                                    </svg>
                                </div>

                                {/* RIGHT CARDS */}
                                <div className="flex flex-col z-10 flex-shrink-0 " style={{ width: 160, gap: "100px" }}>
                                    {rightCards.map((card, i) => (
                                        <div
                                            key={card.title}
                                            ref={(el) => { rightCardRefs.current[i] = el; }}
                                            className="rounded-2xl p-4"
                                            style={cardStyle}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-bold text-[#1a1a2e]">{card.title}</span>
                                                <div className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-[#6a9a72] text-xs flex-shrink-0">
                                                    {card.icon}
                                                </div>
                                            </div>
                                            <p className="text-xs text-[#4a6a4e] leading-relaxed">{card.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Footer text ─────────────────────────────────────── */}
                    <p ref={subRef} className="text-center text-sm text-[#4a6a4e]/80 mt-10 max-w-md mx-auto leading-relaxed">
                        This formula revitalizes your skin for a clearer, healthier look.
                        Say goodbye to dullness and hello to vibrant, radiant skin!
                    </p>
                </div>
            </div>
        </section>
    );
}