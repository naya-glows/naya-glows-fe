import Link from "next/link";
import { CalendarHeart, Layers, Gift, ArrowRight } from "lucide-react";
import GlassCard from "./glass/GlassCard";

const cards = [
  {
    icon: CalendarHeart,
    title: "Book a Consultation",
    copy: "Talk to a skin specialist before you buy — ₦10,000, 30 minutes.",
    href: "/consultation",
  },
  {
    icon: Layers,
    title: "Treatment Kits",
    copy: "Curated multi-month skincare programmes, Bronze through Premium.",
    href: "/kits",
  },
  {
    icon: Gift,
    title: "Black Friday Reservation",
    copy: "Reserve your kit now with just a ₦5,000 deposit.",
    href: "/black-friday",
  },
];

export default function ServicesDirectorySection() {
  return (
    <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7957] mb-2">
            Beyond The Shelf
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-[#16241a]">Services &amp; Programmes</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {cards.map(({ icon: Icon, title, copy, href }) => (
            <Link key={href} href={href}>
              <GlassCard className="p-6 h-full flex flex-col hover:bg-white/70 transition-colors group">
                <div className="w-11 h-11 rounded-full bg-[#d4e8d0] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#4f7957]" />
                </div>
                <h3 className="text-base font-semibold text-[#16241a] mb-1.5">{title}</h3>
                <p className="text-sm text-[#16241a]/55 leading-relaxed flex-1">{copy}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4f7957] mt-4">
                  Learn more
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
