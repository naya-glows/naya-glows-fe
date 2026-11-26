"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Megaphone, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function InfluencerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
      anim(textRef.current, { x: -40 });
      anim(imageRef.current, { x: 40 }, 0.15);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#16241a] py-20">
      <div className="w-[90%] max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div ref={textRef}>
          <p className="text-xs tracking-[0.35em] uppercase text-[#8ab88e] font-medium mb-4 flex items-center gap-2">
            <Megaphone size={14} />
            Naya Glows Partners
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-white leading-tight mb-5">
            Share the glow.{" "}
            <span className="font-semibold text-[#8ab88e]">Earn recognition.</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Become a Naya Glows influencer, generate your own referral codes, and
            watch your community grow with every person you bring to the glow.
          </p>
          <Link
            href="/influencer/apply"
            className="inline-flex items-center gap-2 bg-white text-[#16241a] text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Become an Influencer
            <ArrowRight size={15} />
          </Link>
        </div>

        <div ref={imageRef} className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden">
          <Image
            src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381950/naya-glows/legacy/new/img_7566.jpg"
            alt="Become a Naya Glows influencer"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
