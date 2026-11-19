"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import GlassCard from "../helpers/glass/GlassCard";

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

function MarqueeStrip() {
  const items = Array(12).fill("NATURALLY RADIANT");
  return (
    <div className="relative overflow-hidden bg-[#10160f] py-3 select-none">
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="text-[11px] tracking-[0.35em] font-medium text-[#8ab88e] uppercase"
          >
            {t} <span className="text-[#8ab88e]/40 mx-3">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const galleryImages = [
  "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381908/naya-glows/legacy/new/dsc00339-copy.jpg",
  "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381916/naya-glows/legacy/new/img_7419.jpg",
  "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381923/naya-glows/legacy/new/img_7557.jpg",
  "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381912/naya-glows/legacy/new/dsc00420-copy.jpg",
];

export default function OurStoryPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) videoRef.current?.pause();
  }, []);

  return (
    <main className="bg-[#eafbf0] text-[#16241a] overflow-x-hidden">
      {/* ── VIDEO HERO ──────────────────────────────────────────── */}
      <section className="relative w-full h-[100dvh] min-h-[560px] overflow-hidden bg-[#10160f]">
        {videoFailed ? (
          <Image
            src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381916/naya-glows/legacy/new/img_7419.jpg"
            alt="Naya Glows"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="https://res.cloudinary.com/bhozkz7o/video/upload/v1784381904/naya-glows/legacy/new/41341302-c730-4f62-8bc1-1d03bc983a7d.mov"
            poster="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381916/naya-glows/legacy/new/img_7419.jpg"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#10160f]/60 via-[#10160f]/30 to-[#10160f]/70" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <RevealSection>
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-block"
            >
              <GlassCard className="!bg-white/10 !border-white/25 px-8 py-10 sm:px-14 sm:py-14">
                <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#c7ecc9] mb-5">
                  Naya Glows
                </p>
                <h1 className="text-[clamp(2.6rem,7vw,6rem)] font-light tracking-widest text-white leading-none">
                  OUR STORY
                </h1>
                <p className="mt-6 text-white/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Clean, intentional skincare, born from a personal journey,
                  made for real skin.
                </p>
              </GlassCard>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ── INTRO ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-2xl mx-auto text-center">
        <RevealSection>
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-xs tracking-[0.4em] uppercase text-[#6a9a72] mb-5"
          >
            Who We Are
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-[clamp(2.4rem,5vw,3.6rem)] font-light leading-tight mb-6"
          >
            Skincare as Identity
          </motion.h2>
          <motion.div
            variants={fadeUp}
            custom={2}
            className="w-10 h-px bg-[#8ab88e] mx-auto mb-8"
          />
          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-[1.05rem] leading-relaxed text-[#16241a]/70"
          >
            At Naya Glows, skincare is more than routine: it is identity,
            confidence, and quiet luxury.
          </motion.p>
        </RevealSection>
      </section>

      {/* ── FOUNDER SPLIT ───────────────────────────────────────── */}
      <section className="px-6 max-w-6xl mx-auto pb-24">
        <RevealSection>
          <motion.div variants={fadeIn} custom={0}>
            <GlassCard className="grid grid-cols-1 md:grid-cols-2 overflow-hidden !rounded-[2rem]">
              <div className="relative h-[360px] md:h-full min-h-[420px]">
                <Image
                  src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381852/naya-glows/legacy/founder-image.jpg"
                  alt="Susan Eze, founder of Naya Glows"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <p className="text-[10px] tracking-[0.5em] uppercase text-[#6a9a72] mb-6">
                  Naya Glows
                </p>
                <h3 className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-light leading-snug mb-6">
                  Born From a Personal Journey
                </h3>
                <p className="text-[#16241a]/70 text-[0.95rem] leading-relaxed mb-6">
                  The brand was born from a deeply personal journey by its
                  founder, Susan Eze, a woman who understood firsthand the
                  frustration of navigating skincare that overpromises and
                  underdelivers, especially within the African climate and
                  skin realities.
                </p>
                <div className="space-y-1.5 text-[#4a7a52] font-light text-lg italic">
                  <p>She wanted clarity.</p>
                  <p>She wanted results.</p>
                  <p>She wanted simplicity without compromise.</p>
                </div>
                <p className="mt-6 text-[#16241a]/50 text-sm italic">
                  So she began building what she couldn&apos;t find.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </RevealSection>
      </section>

      {/* ── BUILT FOR REAL SKIN + GALLERY ──────────────────────── */}
      <section className="px-6 max-w-6xl mx-auto pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <RevealSection>
          <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.4em] uppercase text-[#6a9a72] mb-4">
            Our Approach
          </motion.p>
          <motion.h3 variants={fadeUp} custom={1} className="text-[clamp(2rem,3.5vw,3rem)] font-light leading-snug mb-6">
            Built for Real Skin, Real Life
          </motion.h3>
          <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#8ab88e] mb-8" />
          <motion.p variants={fadeUp} custom={3} className="text-[0.95rem] leading-relaxed text-[#16241a]/70 mb-8">
            Naya Glows was created with a clear vision: to develop intentional
            skincare that works with your skin, not against it.
          </motion.p>
          <motion.p variants={fadeUp} custom={4} className="text-sm text-[#16241a]/50 mb-3 uppercase tracking-widest">
            Every formula is crafted using:
          </motion.p>
          {[
            "Skin-supportive ingredients",
            "Targeted actives",
            "Balanced formulations that respect melanin-rich skin",
          ].map((item, i) => (
            <motion.div key={item} variants={fadeUp} custom={5 + i} className="flex items-start gap-3 mb-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8ab88e] flex-shrink-0" />
              <span className="text-[0.95rem] text-[#16241a]/70">{item}</span>
            </motion.div>
          ))}
        </RevealSection>

        <RevealSection>
          <motion.div variants={fadeIn} custom={0} className="grid grid-cols-2 gap-3">
            {galleryImages.map((src, i) => (
              <GlassCard
                key={src}
                className={`relative overflow-hidden !rounded-2xl ${i === 0 ? "row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "1 / 2.05" : "1 / 1" }}
              >
                <Image src={src} alt="Naya Glows moment" fill className="object-cover" />
              </GlassCard>
            ))}
          </motion.div>
        </RevealSection>
      </section>

      <MarqueeStrip />

      {/* ── PHILOSOPHY ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#10160f]">
        <div className="max-w-4xl mx-auto text-center">
          <RevealSection>
            <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#8ab88e] mb-6">
              The Philosophy
            </motion.p>
            <motion.h3 variants={fadeUp} custom={1} className="text-[clamp(2.2rem,4vw,3.5rem)] font-light text-white leading-snug mb-8">
              Luxury should feel effortless.
              <br />
              Results should feel visible.
            </motion.h3>
            <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#8ab88e] mx-auto mb-10" />
            <motion.p variants={fadeUp} custom={3} className="text-white/70 text-[1rem] leading-relaxed max-w-2xl mx-auto mb-6">
              We don&apos;t believe in overwhelming routines. We believe in
              smart skincare that fits into your life and enhances your glow
              over time.
            </motion.p>
            <motion.p variants={fadeUp} custom={4} className="text-[#8ab88e] text-lg italic font-light">
              Because glowing skin isn&apos;t just about appearance. It&apos;s
              about how you show up in the world.
            </motion.p>
          </RevealSection>
        </div>
      </section>

      {/* ── MISSION DETAIL ──────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <RevealSection>
          <motion.div variants={fadeIn} custom={0}>
            <GlassCard className="relative h-[480px] overflow-hidden !rounded-[1.75rem]">
              <Image
                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381923/naya-glows/legacy/new/img_7557.jpg"
                alt="Naya Glows mission"
                fill
                className="object-cover object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#10160f]/85 backdrop-blur-sm p-6">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#8ab88e] mb-2">
                  Contact Us
                </p>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  At the heart of Naya Glows is our commitment to empowering
                  individuals to embrace their skin with confidence.
                </p>
                <Link
                  href="/contact"
                  className="inline-block border border-[#8ab88e] text-[#8ab88e] text-xs tracking-[0.3em] uppercase px-5 py-2.5 hover:bg-[#8ab88e] hover:text-[#10160f] transition-all duration-300 rounded-full"
                >
                  Get in Touch
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </RevealSection>

        <RevealSection>
          <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.4em] uppercase text-[#6a9a72] mb-4">
            What We Stand For
          </motion.p>
          <motion.h3 variants={fadeUp} custom={1} className="text-[clamp(2rem,3vw,2.8rem)] font-light leading-snug mb-6">
            More Than a Skincare Line: A Movement
          </motion.h3>
          <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#8ab88e] mb-8" />
          <motion.p variants={fadeUp} custom={3} className="text-[0.95rem] text-[#16241a]/70 leading-relaxed mb-8">
            We are building a movement of intentional beauty, empowering
            individuals especially across Africa to feel confident in their
            skin.
          </motion.p>
          <motion.p variants={fadeUp} custom={4} className="text-sm text-[#16241a]/50 mb-4 uppercase tracking-widest">
            Through:
          </motion.p>
          {["Education", "Simplified routines", "High-performance formulations"].map((item, i) => (
            <motion.div key={item} variants={fadeUp} custom={5 + i} className="flex items-center gap-3 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8ab88e] flex-shrink-0" />
              <span className="text-[0.95rem] text-[#16241a]/70">{item}</span>
            </motion.div>
          ))}
        </RevealSection>
      </section>

      {/* ── FOUNDER QUOTE ───────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#10160f]">
        <div className="max-w-3xl mx-auto text-center">
          <RevealSection>
            <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#8ab88e] mb-8">
              From Our Founder
            </motion.p>
            <motion.div variants={fadeUp} custom={1} className="relative">
              <span
                className="absolute -top-10 left-1/2 -translate-x-1/2 text-[8rem] text-[#8ab88e]/10 leading-none select-none"
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote className="text-[clamp(1.3rem,2.5vw,2rem)] font-light text-white leading-relaxed italic mb-8 relative z-10">
                Naya Glows is for every person who has ever felt confused,
                frustrated, or unseen by skincare. This brand is my answer:
                simple, honest, and designed to truly work.
              </blockquote>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="w-10 h-px bg-[#8ab88e] mx-auto mb-6" />
            <motion.p variants={fadeUp} custom={3} className="text-[#8ab88e] text-sm tracking-[0.2em] uppercase">
              Susan Eze
            </motion.p>
            <motion.p variants={fadeUp} custom={4} className="text-white/40 text-xs tracking-[0.15em] mt-1">
              Founder, Naya Glows
            </motion.p>
          </RevealSection>
        </div>
      </section>

      {/* ── CLOSING CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "440px" }}>
        <Image
          src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381912/naya-glows/legacy/new/dsc00420-copy.jpg"
          alt="Naya Glows skincare"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#10160f]/60 flex flex-col items-center justify-center text-center px-6">
          <RevealSection>
            <motion.p variants={fadeUp} custom={0} className="text-[10px] tracking-[0.5em] uppercase text-[#8ab88e] mb-4">
              Explore
            </motion.p>
            <motion.h3 variants={fadeUp} custom={1} className="text-[clamp(2rem,4vw,3.5rem)] font-light text-white mb-6">
              Discover Your Glow
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="text-white/70 text-sm mb-8 max-w-md mx-auto">
              Explore our full range of formulations, crafted with intention
              for radiant skin.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link
                href="/catalog"
                className="inline-block border border-white/60 text-white text-xs tracking-[0.35em] uppercase px-8 py-3.5 hover:bg-white hover:text-[#10160f] transition-all duration-300 rounded-full"
              >
                Shop Now
              </Link>
            </motion.div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
