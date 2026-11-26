"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import DirectoryTileSkeleton from "./skeletons/DirectoryTileSkeleton";

gsap.registerPlugin(ScrollTrigger);

// Same soft pastel accent set CatalogSection uses for its arrow buttons —
// reused here so these tiles read as part of the same system rather than
// introducing a new palette.
const arrowBgColors = ["#f0cbb4", "#aed4b4", "#bcd0fb", "#dba6c1", "#ebd393", "#b4addd"];

export type DirectoryTile = {
  title: string;
  copy: string;
  href: string;
  image: string;
};

export default function DirectoryTileGrid({
  eyebrow,
  headingBold,
  headingLight,
  tiles,
  isLoading,
}: {
  eyebrow?: string;
  headingBold: string;
  headingLight: string;
  tiles: DirectoryTile[];
  isLoading?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
            scale: 1,
            duration: 1.2,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 30%",
              toggleActions: "play none none reverse",
            },
          },
        );
      };

      anim(headingRef.current, {});
      cardRefs.current.forEach((el, i) => anim(el, { y: 50, scale: 0.97 }, 0.1 + i * 0.1));
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-20">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white">
          <div className="w-[90%] mx-auto max-[1275px]:w-full p-8 sm:p-10 lg:p-14 max-[800px]:px-4">
            <DirectoryTileSkeleton />
          </div>
        </div>
      )}
      <div className="w-[90%] mx-auto max-[1275px]:w-full">
        <div className="p-8 sm:p-10 lg:p-14 max-[800px]:px-4">
          <div ref={headingRef} className="mb-10">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a9ab8] mb-2">{eyebrow}</p>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight leading-tight">
              {headingBold}
            </h2>
            <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-[#9a9ab8] tracking-tight leading-tight">
              {headingLight}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiles.map((tile, i) => (
              <Link
                key={tile.href}
                href={tile.href}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="group relative block h-[300px] sm:h-[340px] rounded-2xl overflow-hidden"
              >
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <span
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${arrowBgColors[i % arrowBgColors.length]}33` }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <ArrowRight
                    size={15}
                    className="relative z-10 -rotate-45 text-white group-hover:text-black transition-colors duration-300"
                  />
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-semibold text-white tracking-tight mb-1">{tile.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{tile.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
