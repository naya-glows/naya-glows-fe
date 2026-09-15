"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";

gsap.registerPlugin(ScrollTrigger);

const cardColors = [
  "#fff2ec",
  "#ffeaf6",
  "#eafbf0",
  "#f3f9fe",
  "#f5f1ff",
  "#ffe4e3",
  "#fffef3",
  "#f4f5ff",
];

const arrowContainerColors = [
  "#f0cbb4",
  "#dba6c1",
  "#aed4b4",
  "#bcd0fb",
  "#bfb7d7",
  "#f4a09e",
  "#ebd393",
  "#b4addd"
]

// Curated display labels + the "recent/" photoshoot image for each card —
// the only section authorized to use those photos (per an earlier explicit
// instruction). Price/originalPrice/fullName are deliberately NOT hardcoded
// here anymore — they're pulled live from lib/products.ts by slug below, so
// this section can never drift out of sync with real pricing again.
const catalogCards = [
  {
    slug: "radiance-boost-serum",
    category: "Radiance",
    name: "Boost Serum",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160441/naya-glows/recent/radiance-boost-serum.png",
  },
  {
    slug: "clarifying-foam-cleanser",
    category: "Clarifying",
    name: "Foaming Cleanser",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160441/naya-glows/recent/clarifying-foaming-cleanser.png",
  },
  {
    slug: "radiance-barrier-face-oil",
    category: "Naya",
    name: "Barrier Face Oil",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160447/naya-glows/recent/naya-barrier-face-oil.png",
  },
  {
    slug: "acne-correcting-serum",
    category: "Glow Renewal",
    name: "Serum (Acne Treatment)",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160450/naya-glows/recent/glow-renewal-serum-acne-treatment.png",
  },
  {
    slug: "exfoliating-body-scrub",
    category: "Radiant",
    name: "Body Scrub",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160444/naya-glows/recent/radiance-exfoliating-body-scrub.png",
  },
  {
    slug: "pigment-corrector-face-cream",
    category: "Pigment",
    name: "Corrector Cream",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160451/naya-glows/recent/pigment-corrector-face-cream.png",
  },
  {
    slug: "radiance-balance-toner",
    category: "Radiant",
    name: "Balance Toner",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160454/naya-glows/recent/radiance-balance-toner-alt1.png",
  },
  {
    slug: "luminous-glow-body-oil",
    category: "Luminous",
    name: "Glow Oil",
    image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1785160445/naya-glows/recent/luminous-glow-body-oil.png",
  },
];

type DisplayCard = {
  category: string;
  name: string;
  fullName: string;
  price: string;
  originalPrice: string;
  image: string;
  href: string;
};

function ProductCard({
  product,
  bgColor,
  arrowBgColor,
  animRef,
}: {
  product: DisplayCard;
  bgColor: string;
  animRef: (el: HTMLDivElement | null) => void;
  arrowBgColor: string;
}) {
  return (
    <div
      ref={animRef}
      className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-6 min-h-[260px] group cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── HOVER BG IMAGE — CSS-only reveal with scaledown ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Image
          src={product.image}
          alt={product.fullName}
          fill
          className="object-contain sm:object-cover scale-100 sm:scale-[1.18] sm:group-hover:scale-100 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Card top: category label */}
      <div className="relative z-10">
        <p className="group-hover:opacity-0  text-sm font-medium mb-4 transition-colors duration-300 text-[#1a1a2e]/50">
          <span className="font-bold transition-colors duration-300 text-[#1a1a2e] group-hover:text-white">
            {product.category}
          </span>{" "}
          <span className="transition-colors duration-300 text-[#1a1a2e]/50 group-hover:text-white/60">
            {product.name}
          </span>
        </p>

        {/* Product image — shown when NOT hovered */}
        <div
          className="w-full flex justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-hover:pointer-events-none"
          style={{ height: 110 }}
        >
          <Image
            src={product.image}
            alt={product.fullName}
            width={100}
            height={110}
            className="object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Card bottom: price + button */}
      <div className="relative z-10 flex items-center justify-between mt-4">
        <div className="group-hover:opacity-0 ">
          <span className="text-base font-bold transition-colors duration-300 text-[#1a1a2e] group-hover:text-white">
            {product.price}
          </span>
          {product.originalPrice && (
            <>
              {" "}
              <span className="text-sm line-through transition-colors duration-300 text-[#1a1a2e]/35 group-hover:text-white/50">
                {product.originalPrice}
              </span>
            </>
          )}
        </div>

        {/* Arrow button — uses white overlay for hover bg to allow smooth CSS transition */}
        <Link
          href={product.href}
          onClick={(e) => e.stopPropagation()}
          className="relative w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden"
          style={{ backgroundColor: arrowBgColor }}
        >
          {/* White overlay fades in on hover */}
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          <ArrowRight size={15} className="relative z-10 text-white group-hover:text-black transition-colors duration-300" />
        </Link>
      </div>
    </div>
  );
}

export default function CatalogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { format: formatPrice } = useCurrencyDisplay();

  const products = useMemo<DisplayCard[]>(
    () =>
      catalogCards.flatMap((card) => {
        const product = getProductBySlug(card.slug);
        if (!product) return [];
        return [
          {
            category: card.category,
            name: card.name,
            fullName: product.name,
            price: formatPrice(product.price),
            originalPrice:
              product.originalPrice > product.price ? formatPrice(product.originalPrice) : "",
            image: card.image,
            href: `/products/${card.slug}`,
          },
        ];
      }),
    [formatPrice],
  );

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

      cardRefs.current.forEach((el, i) => {
        anim(el, { y: 50 + (i % 2) * 10 }, 0.08 + i * 0.055);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-20">
      <div className="w-[90%] mx-auto max-[1275px]:w-full">
        <div className=" p-8 sm:p-10 lg:p-14  max-[800px]:px-4">
          {/* ── Heading + CTA ─────────────────────────────────────────────── */}
          <div
            ref={headingRef}
            className="flex items-end justify-between mb-10 flex-wrap gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1a1a2e] tracking-tight leading-tight">
                Find the perfect Solution
              </h2>
              <p className="text-3xl sm:text-4xl lg:text-[2.6rem] font-light text-[#9a9ab8] tracking-tight leading-tight">
                for your goals
              </p>
            </div>
            <Link
              href="/catalog"
              className="flex items-center gap-2 bg-[#1a1a2e] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#2d2d4a] transition-colors flex-shrink-0"
            >
              Go to catalog
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                <ArrowRight size={11} />
              </span>
            </Link>
          </div>

          {/* ── Product grid ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.fullName}
                product={product}
                bgColor={cardColors[i % cardColors.length]}
                animRef={(el) => {
                  cardRefs.current[i] = el;
                }}
                arrowBgColor={arrowContainerColors[i % arrowContainerColors.length]}
              />
            ))}
          </div>

          <p className="mt-8 text-xs text-[#8888aa]">
            Prices shown in USD. Results may vary based on skin type and
            consistent use.
          </p>
        </div>
      </div>
    </section>
  );
}