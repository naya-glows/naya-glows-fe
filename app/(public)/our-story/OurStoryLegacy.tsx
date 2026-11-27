"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { CSSProperties } from "react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ── Fade-up variant ────────────────────────────────────────────────
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: i * 0.12, ease: smoothEase },
    }),
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
        opacity: 1,
        transition: { duration: 1, delay: i * 0.1, ease: smoothEase },
    }),
};

// ── Marquee strip ──────────────────────────────────────────────────
function MarqueeStrip() {
    const text = "TREAT YOURSELF";
    const items = Array(12).fill(text);
    return (
        <div className="relative overflow-hidden bg-[#1c1410] py-3 select-none">
            <motion.div
                className="flex whitespace-nowrap gap-8"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {[...items, ...items].map((t, i) => (
                    <span
                        key={i}
                        className="text-[11px] tracking-[0.35em] font-medium text-[#c9a97a] uppercase"
                    >
                        {t} <span className="text-[#c9a97a]/40 mx-3">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

// ── Section wrapper with in-view ────────────────────────────────────
function RevealSection({
    children,
    className = "",
    style,
}: {
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}

// ── Main page ──────────────────────────────────────────────────────
export default function OurStoryPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    // GSAP: stagger hero mosaic images on mount
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".mosaic-img",
                { opacity: 0, scale: 1.08, y: 24 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1.1,
                    stagger: 0.12,
                    ease: "power3.out",
                    delay: 0.3,
                }
            );
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <main className="bg-[#f5efe8] text-[#1c1410]  overflow-x-hidden">

            {/* ── HERO MOSAIC ────────────────────────────────────────── */}
            <section
                ref={heroRef}
                className="relative bg-[#1c1410] overflow-hidden"
                style={{ minHeight: "92vh" }}
            >
                <motion.div style={{ y: heroY }} className="relative w-full h-full">
                    {/* Grid mosaic — mirrors Coral reference layout */}
                    <div className="grid grid-cols-12 grid-rows-6 gap-1 w-full"
                        style={{ minHeight: "92vh" }}>

                        {/* Top-left portrait — woman relaxing */}
                        <div className="mosaic-img col-span-4 row-span-3 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381876/naya-glows/legacy/img_6328.jpg"
                                alt="Relaxed woman"
                                fill
                                className="object-cover object-top"
                            />
                        </div>

                        {/* Center large — glowing skin */}
                        <div className="mosaic-img col-span-5 row-span-4 col-start-5 row-start-1 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381854/naya-glows/legacy/img_6320.jpg"
                                alt="Glowing skin"
                                fill
                                className="object-cover"
                            />
                            {/* Overlay title */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h1
                                    className="text-[clamp(3rem,7vw,7rem)] font-light tracking-widest text-white"
                                    style={{
                                        textShadow: "0 2px 40px rgba(0,0,0,0.55)",
                                        letterSpacing: "0.18em",
                                    }}
                                >
                                    OUR STORY
                                </h1>
                            </div>
                        </div>

                        {/* Top-right — product shot */}
                        <div className="mosaic-img col-span-3 row-span-2 col-start-10 row-start-1 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381835/naya-glows/legacy/19ea7a51-adb2-4a49-bcb7-0bbc0116f4f2.png"
                                alt="Naya product"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Mid-left — nature girl */}
                        <div className="mosaic-img col-span-4 row-span-3 row-start-4 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381871/naya-glows/legacy/img_6325.jpg"
                                alt="Nature girl"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Mid-right top — close skin texture */}
                        <div className="mosaic-img col-span-3 row-span-2 col-start-10 row-start-3 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381858/naya-glows/legacy/img_6322.jpg"
                                alt="Skin close-up"
                                fill
                                className="object-cover object-center"
                            />
                        </div>

                        {/* Bottom-right — product flat */}
                        <div className="mosaic-img col-span-3 row-span-2 col-start-10 row-start-5 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381873/naya-glows/legacy/img_6326.jpg"
                                alt="Product detail"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Bottom center fill */}
                        <div className="mosaic-img col-span-3 row-span-2 col-start-5 row-start-5 relative overflow-hidden">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381879/naya-glows/legacy/img_6331.jpg"
                                alt="Skincare routine"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="mosaic-img col-span-2 row-span-2 col-start-8 row-start-5 relative overflow-hidden bg-[#2a1f16]">
                            <Image
                                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381867/naya-glows/legacy/img_6324.jpg"
                                alt="Model"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── THANK YOU / INTRO ──────────────────────────────────── */}
            <section className="bg-[#f5efe8] py-24 px-6 text-center max-w-2xl mx-auto">
                <RevealSection>
                    <motion.p
                        variants={fadeUp}
                        custom={0}
                        className="text-xs tracking-[0.4em] uppercase text-[#8a6f52] mb-5"
                    >
                        Who We Are
                    </motion.p>
                    <motion.h2
                        variants={fadeUp}
                        custom={1}
                        className="text-[clamp(2.6rem,5vw,4rem)] font-light leading-tight mb-6"

                    >
                        Our Story
                    </motion.h2>
                    <motion.div
                        variants={fadeUp}
                        custom={2}
                        className="w-10 h-px bg-[#c9a97a] mx-auto mb-8"
                    />
                    <motion.p
                        variants={fadeUp}
                        custom={3}
                        className="text-[1.05rem] leading-relaxed text-[#3d2f25]/80 "
                    >
                        At Naya Glows, skincare is more than routine: it is identity,
                        confidence, and quiet luxury.
                    </motion.p>
                </RevealSection>
            </section>

            {/* ── FOUNDER SPLIT SECTION ──────────────────────────────── */}
            <section className="bg-[#1c1410] grid grid-cols-1 md:grid-cols-2">
                {/* Left: image */}
                <RevealSection className="relative overflow-hidden" style={{ minHeight: "560px" }}>
                    <motion.div variants={fadeIn} custom={0} className="relative h-[560px] md:h-full">
                        <Image
                            src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381852/naya-glows/legacy/founder-image.jpg"
                            alt="Susan Eze founder"
                            fill
                            className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c1410]/60" />
                    </motion.div>
                </RevealSection>

                {/* Right: text */}
                <RevealSection className="p-12 md:p-16 flex flex-col justify-center">
                    <motion.p
                        variants={fadeUp}
                        custom={0}
                        className="text-[10px] tracking-[0.5em] uppercase text-[#c9a97a] mb-6"
                    >
                        Naya Glows
                    </motion.p>
                    <motion.h3
                        variants={fadeUp}
                        custom={1}
                        className="text-[clamp(2rem,3.5vw,3rem)] font-light text-white leading-snug mb-6"

                    >
                        Born From a Personal Journey
                    </motion.h3>
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="text-[#d4c5b4]/75 text-[0.95rem] leading-relaxed  mb-6"
                    >
                        The brand was born from a deeply personal journey by its founder,
                        Susan Eze, a woman who understood firsthand the frustration of
                        navigating skincare that overpromises and underdelivers, especially
                        within the African climate and skin realities.
                    </motion.p>
                    <motion.div variants={fadeUp} custom={3} className="space-y-2 text-[#c9a97a] font-light text-lg italic">
                        <p>She wanted clarity.</p>
                        <p>She wanted results.</p>
                        <p>She wanted simplicity without compromise.</p>
                    </motion.div>
                    <motion.p
                        variants={fadeUp}
                        custom={4}
                        className="mt-6 text-[#d4c5b4]/60 text-sm  italic"
                    >
                        So she began building what she couldn't find.
                    </motion.p>
                </RevealSection>
            </section>

            {/* ── BUILT FOR REAL SKIN ────────────────────────────────── */}
            <section className="bg-[#f5efe8] py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <RevealSection>
                    <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.4em] uppercase text-[#8a6f52] mb-4">
                        Our Approach
                    </motion.p>
                    <motion.h3
                        variants={fadeUp}
                        custom={1}
                        className="text-[clamp(2rem,3.5vw,3rem)] font-light leading-snug mb-6"

                    >
                        Built for Real Skin, Real Life
                    </motion.h3>
                    <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#c9a97a] mb-8" />
                    <motion.p variants={fadeUp} custom={3} className="text-[0.95rem] leading-relaxed text-[#3d2f25]/80  mb-8">
                        Naya Glows was created with a clear vision: to develop intentional
                        skincare that works with your skin, not against it.
                    </motion.p>
                    <motion.p variants={fadeUp} custom={4} className="text-sm text-[#3d2f25]/60  mb-3 uppercase tracking-widest">
                        Every formula is crafted using:
                    </motion.p>
                    {[
                        "Skin-supportive ingredients",
                        "Targeted actives",
                        "Balanced formulations that respect melanin-rich skin",
                    ].map((item, i) => (
                        <motion.div
                            key={item}
                            variants={fadeUp}
                            custom={5 + i}
                            className="flex items-start gap-3 mb-3"
                        >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c9a97a] flex-shrink-0" />
                            <span className="text-[0.95rem] text-[#3d2f25]/80 ">{item}</span>
                        </motion.div>
                    ))}
                    <motion.p variants={fadeUp} custom={9} className="mt-6 text-[0.9rem] text-[#3d2f25]/60  italic">
                        No unnecessary steps. No confusion. Just effective, elevated skincare.
                    </motion.p>
                </RevealSection>

                {/* Image collage */}
                <RevealSection>
                    <motion.div variants={fadeIn} custom={0} className="grid grid-cols-2 gap-3 h-[480px]">
                        <div className="relative overflow-hidden rounded-sm row-span-2">
                            <Image src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381863/naya-glows/legacy/img_6323.jpg" alt="Skincare" fill className="object-cover" />
                        </div>
                        <div className="relative overflow-hidden rounded-sm">
                            <Image src="https://res.cloudinary.com/bhozkz7o/image/upload/v1795774504/naya-glows/bhdjn8omcikp8b0fx6h1.jpg" alt="Natural beauty" fill className="object-cover" />
                        </div>
                        <div className="relative overflow-hidden rounded-sm">
                            <Image src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381849/naya-glows/legacy/body-scrub-with-lemon-and-mint.png" alt="Body scrub" fill className="object-cover" />
                        </div>
                    </motion.div>
                </RevealSection>
            </section>

            {/* ── MARQUEE ────────────────────────────────────────────── */}
            <MarqueeStrip />

            {/* ── PHILOSOPHY ────────────────────────────────────────── */}
            <section className="bg-[#2a1f16] py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealSection>
                        <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#c9a97a] mb-6">
                            The Philosophy
                        </motion.p>
                        <motion.h3
                            variants={fadeUp}
                            custom={1}
                            className="text-[clamp(2.2rem,4vw,3.5rem)] font-light text-white leading-snug mb-8"

                        >
                            Luxury should feel effortless.<br />
                            Results should feel visible.
                        </motion.h3>
                        <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#c9a97a] mx-auto mb-10" />
                        <motion.p variants={fadeUp} custom={3} className="text-[#d4c5b4]/70 text-[1rem] leading-relaxed  max-w-2xl mx-auto mb-6">
                            We don't believe in overwhelming routines. We believe in smart
                            skincare that fits into your life and enhances your glow over time.
                        </motion.p>
                        <motion.p variants={fadeUp} custom={4} className="text-[#c9a97a] text-lg italic font-light">
                            Because glowing skin isn't just about appearance. It's about how
                            you show up in the world.
                        </motion.p>
                    </RevealSection>
                </div>
            </section>

            {/* ── LEMON / INGREDIENT BANNER ─────────────────────────── */}
            <section className="relative overflow-hidden" style={{ height: "420px" }}>
                <Image
                    src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381849/naya-glows/legacy/body-scrub-with-lemon-and-mint.png"
                    alt="Fresh ingredients"
                    fill
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[#1c1410]/55 flex flex-col items-center justify-center text-center px-6">
                    <RevealSection>
                        <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#c9a97a] mb-4">
                            Our Mission
                        </motion.p>
                        <motion.h3
                            variants={fadeUp}
                            custom={1}
                            className="text-[clamp(2rem,4vw,3.5rem)] font-light text-white leading-tight max-w-2xl"

                        >
                            Empowering individuals across Africa to feel confident in their skin.
                        </motion.h3>
                    </RevealSection>
                </div>
            </section>

            {/* ── MISSION DETAIL ────────────────────────────────────── */}
            <section className="bg-[#f5efe8] py-20 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Left image block */}
                <RevealSection>
                    <motion.div variants={fadeIn} custom={0} className="relative h-[480px] overflow-hidden rounded-sm">
                        <Image
                            src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381871/naya-glows/legacy/img_6325.jpg"
                            alt="Naya Glows mission"
                            fill
                            className="object-cover object-top"
                        />
                        {/* Dark card overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#1c1410]/85 p-6">
                            <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a97a] mb-2">Contact Us</p>
                            <p className="text-white/80 text-sm  leading-relaxed mb-4">
                                At the heart of Naya Glows is our commitment to empowering
                                individuals to embrace their skin with confidence.
                            </p>
                            <a
                                href="/contact"
                                className="inline-block border border-[#c9a97a] text-[#c9a97a] text-xs tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-[#c9a97a] hover:text-[#1c1410] transition-all duration-300"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </motion.div>
                </RevealSection>

                {/* Right mission text */}
                <RevealSection>
                    <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.4em] uppercase text-[#8a6f52] mb-4">
                        What We Stand For
                    </motion.p>
                    <motion.h3
                        variants={fadeUp}
                        custom={1}
                        className="text-[clamp(2rem,3vw,2.8rem)] font-light leading-snug mb-6"

                    >
                        More Than a Skincare Line: A Movement
                    </motion.h3>
                    <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#c9a97a] mb-8" />
                    <motion.p variants={fadeUp} custom={3} className="text-[0.95rem] text-[#3d2f25]/80  leading-relaxed mb-8">
                        We are building a movement of intentional beauty, empowering
                        individuals especially across Africa to feel confident in their skin.
                    </motion.p>
                    <motion.p variants={fadeUp} custom={4} className="text-sm text-[#3d2f25]/60  mb-4 uppercase tracking-widest">
                        Through:
                    </motion.p>
                    {["Education", "Simplified routines", "High-performance formulations"].map((item, i) => (
                        <motion.div key={item} variants={fadeUp} custom={5 + i} className="flex items-center gap-3 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a97a] flex-shrink-0" />
                            <span className="text-[0.95rem] text-[#3d2f25]/80 ">{item}</span>
                        </motion.div>
                    ))}
                </RevealSection>
            </section>

            {/* ── FOUNDER QUOTE ─────────────────────────────────────── */}
            <section className="bg-[#1c1410] py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <RevealSection>
                        <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#c9a97a] mb-8">
                            From Our Founder
                        </motion.p>
                        <motion.div variants={fadeUp} custom={1} className="relative">
                            {/* Large decorative quote mark */}
                            <span
                                className="absolute -top-10 left-1/2 -translate-x-1/2 text-[8rem] text-[#c9a97a]/10 leading-none select-none"
                                aria-hidden
                            >
                                "
                            </span>
                            <blockquote
                                className="text-[clamp(1.3rem,2.5vw,2rem)] font-light text-white leading-relaxed italic mb-8 relative z-10"

                            >
                                Naya Glows is for every person who has ever felt confused,
                                frustrated, or unseen by skincare. This brand is my answer:
                                simple, honest, and designed to truly work.
                            </blockquote>
                        </motion.div>
                        <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#c9a97a] mx-auto mb-6" />
                        <motion.p variants={fadeUp} custom={3} className="text-[#c9a97a] text-sm tracking-[0.2em] uppercase">
                            Susan Eze
                        </motion.p>
                        <motion.p variants={fadeUp} custom={4} className="text-[#d4c5b4]/40 text-xs tracking-[0.15em] mt-1">
                            Founder, Naya Glows
                        </motion.p>
                    </RevealSection>
                </div>
            </section>

            {/* ── NEW ARRIVALS BANNER ────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ height: "480px" }}>
                <Image
                    src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381858/naya-glows/legacy/img_6322.jpg"
                    alt="Naya Glows skincare"
                    fill
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[#1c1410]/60 flex flex-col items-center justify-center text-center px-6">
                    <RevealSection>
                        <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#c9a97a] mb-4">
                            Explore
                        </motion.p>
                        <motion.h3
                            variants={fadeUp}
                            custom={1}
                            className="text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-6"

                        >
                            New Arrivals
                        </motion.h3>
                        <motion.p variants={fadeUp} custom={2} className="text-[#d4c5b4]/70  text-sm mb-8 max-w-md mx-auto">
                            Discover our latest formulations, crafted with intention for radiant skin.
                        </motion.p>
                        <motion.a
                            variants={fadeUp}
                            custom={3}
                            href="/shop"
                            className="inline-block border border-white/60 text-white text-xs tracking-[0.35em] uppercase px-8 py-3.5 hover:bg-white hover:text-[#1c1410] transition-all duration-300"
                        >
                            Shop Now
                        </motion.a>
                    </RevealSection>
                </div>
            </section>
        </main>
    );
}