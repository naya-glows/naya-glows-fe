"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const formulas = [
  {
    name: "Radiance Boost Serum",
    tagline: "Niacinamide · Green Tea · Hyaluronic Acid",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160472/naya-glows/recent/radiance-boost-serum-styled.png",
    href: "/products/radiance-boost-serum",
  },
  {
    name: "Radiance Correcting Serum",
    tagline: "Alpha Arbutin · Kojic Acid · Licorice Extract",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160475/naya-glows/recent/radiance-correcting-serum-styled.png",
    href: "/products/age-renewal-serum",
  },
];

export default function SignatureShowcaseSection() {
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
          },
        );
      };

      anim(headingRef.current, {});
      cardRefs.current.forEach((el, i) => anim(el, { y: 60 }, 0.15 + i * 0.15));
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#16241a] py-20">
      <div className="w-[90%] max-w-[1200px] mx-auto max-[1275px]:w-full">
        <div ref={headingRef} className="text-center mb-14">
          <p className="text-xs tracking-[0.35em] uppercase text-[#8ab88e] font-medium mb-4">
            Signature Formulas
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-white leading-tight">
            Two formulas. <span className="font-semibold text-[#8ab88e]">One glow.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {formulas.map((formula, i) => (
            <div
              key={formula.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="rounded-[2rem] bg-white overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={formula.image}
                  alt={formula.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-7 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#16241a] leading-tight mb-1">
                    {formula.name}
                  </h3>
                  <p className="text-xs text-[#16241a]/50">{formula.tagline}</p>
                </div>
                <Link
                  href={formula.href}
                  aria-label={`View ${formula.name}`}
                  className="w-11 h-11 rounded-full bg-[#16241a] flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
                >
                  <ArrowRight size={16} className="text-white" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
