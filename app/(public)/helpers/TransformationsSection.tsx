"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const concerns = [
  {
    label: "Dark Spots & Pigmentation",
    href: "/products/acne-correcting-serum",
  },
  { label: "Uneven Skin Tone", href: "/products/radiance-boost-serum" },
  {
    label: "Dryness & Dullness",
    href: "/products/radiance-repair-body-lotion",
  },
];

export default function TransformationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  // Before/after slider state
  const [sliderX, setSliderX] = useState(0); // percent
  const isDragging = useRef(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // While the divider is actively moving, only the label in the direction of
  // travel shows; both reappear once it stops or pauses (no movement for
  // MOTION_PAUSE_MS), whether that's from releasing or just holding still
  // mid-drag.
  const MOTION_PAUSE_MS = 180;
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const motionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const moveSliderTo = useCallback((next: number) => {
    setSliderX((prev) => {
      if (next > prev) setDragDirection("right");
      else if (next < prev) setDragDirection("left");
      return next;
    });
    setIsMoving(true);
    if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);
    motionTimeoutRef.current = setTimeout(() => setIsMoving(false), MOTION_PAUSE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (motionTimeoutRef.current) clearTimeout(motionTimeoutRef.current);
    };
  }, []);

  const showBeforeLabel = !isMoving || dragDirection === "right";
  const showAfterLabel = !isMoving || dragDirection === "left";

  useLayoutEffect(() => {
    // Set initial slider position to 50%
    setSliderX(50);
  }, []);

  // ── Scroll animations ──────────────────────────────────────────────────
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
              toggleActions: "play none none reverse",
            },
          },
        );
      };
      anim(headingRef.current, {});
      anim(leftCardRef.current, { x: -40 }, 0.18);
      anim(rightCardRef.current, { x: 40 }, 0.28);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Slider drag logic ──────────────────────────────────────────────────
  const getPercent = useCallback((clientX: number) => {
    const rect = sliderContainerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    moveSliderTo(getPercent(e.clientX));
  };
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      moveSliderTo(getPercent(e.clientX));
    },
    [getPercent, moveSliderTo],
  );
  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    moveSliderTo(getPercent(e.touches[0].clientX));
  };
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      moveSliderTo(getPercent(e.touches[0].clientX));
    },
    [getPercent, moveSliderTo],
  );

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove]);

  return (
    <section ref={sectionRef} className="w-full bg-[#f5f1ff]  py-20">
      <div className="w-[90%] mx-auto max-[1275px]:w-full">
        <div className="p-8 sm:p-10 lg:p-14 max-[800px]:px-4">
          {/* ── Heading ──────────────────────────────────────────────────── */}
          <div ref={headingRef} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight leading-tight mb-2">
              Inspiring transformations{" "}
              <span className="font-light text-[#c2bbd4]">from real</span>
            </h2>
            <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-[#c2bbd4] tracking-tight">
              people like you
            </p>
          </div>

          {/* ── Two-column layout ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* ── LEFT: Story card ─────────────────────────────────────────── */}
            <div
              ref={leftCardRef}
              className="rounded-3xl p-7 sm:p-9 flex flex-col justify-between min-h-[480px]"
              style={{ backgroundColor: "#e4ddf8" }}
            >
              {/* Top: name + testimonial — all centered */}
              <div className="text-center">
                <p className="text-base font-bold text-[#1a1a2e]">
                  Amara, 34 years
                </p>
                <p className="text-base font-semibold text-[#1a1a2e] mb-5">
                  Visibly brighter skin in 4 weeks
                </p>
                <p className="text-sm text-gray-950 leading-relaxed">
                  "I'd struggled with dark spots and uneven tone for years.
                  After using the Naya Radiance Boost Serum consistently, I
                  finally started seeing a real difference — my skin looks
                  clearer and more radiant than ever."
                </p>
              </div>

              {/* Middle: concerns list */}
              <div className="my-7">
                <div className="bg-white rounded-2xl px-5 py-5 shadow-sm w-[80%] max-[800px]:w-full mx-auto">
                  <p className="text-sm font-bold text-[#1a1a2e] mb-4 text-center">
                    Amara also has concerns with
                  </p>
                  <div className="flex flex-col gap-2">
                    {concerns.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="flex items-center justify-between px-3 py-3 rounded-2xl bg-gradient-to-tr from-[#f5f1ff] to-white hover:from-[#f5f1ff] hover:to-[#e8dffa] hover:bg-[#ede8ff] transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Small icon placeholder — swap for your icon */}
                          <span className="text-[#9a9ab8] text-sm">✦</span>
                          <span className="text-sm font-medium text-[#1a1a2e]">
                            {c.label}
                          </span>
                        </div>
                        {/* Circular arrow button */}
                        <span className="w-7 h-7 rounded-full border border-[#d4d4e8] flex items-center justify-center flex-shrink-0 bg-white">
                          <ArrowRight size={13} className="text-[#6b6baa]" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom: product + CTA — unchanged */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#ffe1d7] flex-shrink-0">
                    <Image
                      src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381851/naya-glows/legacy/eca30ff9-62ea-4126-8301-03d590c8250d.png"
                      alt="Radiance Boost Serum"
                      width={44}
                      height={44}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e] leading-tight">
                      Radiance Boost Serum
                    </p>
                    <p className="text-xs text-[#9a9ab8]">
                      Brightening & Hydration
                    </p>
                  </div>
                </div>
                <Link
                  href="/transformations"
                  className="bg-[#1a1a2e] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2d2d4a] transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Before/after slider card ─────────────────────────── */}
            <div
              ref={rightCardRef}
              className="rounded-3xl overflow-hidden relative"
              style={{ backgroundColor: "#e4ddf8", minHeight: 460 }}
            >
              {/* Improvements badge */}
              <div className="absolute top-4 right-4 z-20 bg-white rounded-2xl px-4 py-3 shadow-md">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#9a9ab8] font-semibold mb-1.5">
                  Your improvements
                </p>
                {/* Arc progress */}
                <div className="flex items-center gap-2">
                  <ArcProgress percent={100 - sliderX} />
                  <span className="text-lg font-semibold text-[#1a1a2e]">
                    {Number(100 - sliderX).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Before/After slider */}
              <div
                ref={sliderContainerRef}
                className="relative w-1/2 h-full select-none mx-auto"
                style={{ minHeight: 460, cursor: "col-resize" }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
              >
                {/* AFTER (full — bottom layer) */}
                <div className="absolute inset-0">
                  <Image
                    src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381952/naya-glows/legacy/youthful.png"
                    alt="After — youthful skin"
                    fill
                    className="object-contain"
                    draggable={false}
                  />
                  {/* After label — right side, visible unless the divider is
                      actively moving rightward */}
                  <span
                    className={`absolute bottom-5 right-4 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full select-none transition-opacity duration-150 ${
                      showAfterLabel ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    After
                  </span>
                </div>

                {/* BEFORE (clipped — top layer) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderX}%` }}
                >
                  <Image
                    src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381846/naya-glows/legacy/aging.png"
                    alt="Before — aging skin"
                    fill
                    className="object-contain"
                    style={{
                      minWidth: sliderContainerRef.current?.offsetWidth ?? 400,
                    }}
                    draggable={false}
                  />
                  {/* Before label — left side, visible unless the divider is
                      actively moving leftward */}
                  <span
                    className={`absolute bottom-5 left-4 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full select-none transition-opacity duration-150 ${
                      showBeforeLabel ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Before
                  </span>
                </div>

                {/* Divider line */}
                <div
                  className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
                  style={{ left: `${sliderX}%`, transform: "translateX(-50%)" }}
                >
                  <div className="w-[2px] h-full bg-white/80 shadow-lg" />
                </div>

                {/* Drag handle */}
                <div
                  className="absolute top-1/2 z-20 -translate-y-1/2 flex items-center justify-center pointer-events-none"
                  style={{
                    left: `${sliderX}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5 8L2 5.5M2 5.5L5 3M2 5.5H6"
                        stroke="#1a1a2e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11 8L14 5.5M14 5.5L11 3M14 5.5H10"
                        stroke="#1a1a2e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end grid */}

          <p className="mt-7 text-xs text-[#8888aa]">
            Results may vary. Individual skin improvement depends on consistent
            use and skin type.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Arc progress SVG ──────────────────────────────────────────────────────
function ArcProgress({ percent }: { percent: number }) {
  const r = 18;
  const cx = 22;
  const cy = 22;
  const startAngle = -210;
  const sweepAngle = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcX = (angle: number) => cx + r * Math.cos(toRad(angle));
  const arcY = (angle: number) => cy + r * Math.sin(toRad(angle));

  const endAngle = startAngle + (sweepAngle * percent) / 100;
  const largeArc = (sweepAngle * percent) / 100 > 180 ? 1 : 0;

  const trackEnd = startAngle + sweepAngle;

  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* Track */}
      <path
        d={`M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 1 1 ${arcX(trackEnd)} ${arcY(trackEnd)}`}
        fill="none"
        stroke="#e8e8f4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Progress */}
      <path
        d={`M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${largeArc} 1 ${arcX(endAngle)} ${arcY(endAngle)}`}
        fill="none"
        stroke="#6b6baa"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
