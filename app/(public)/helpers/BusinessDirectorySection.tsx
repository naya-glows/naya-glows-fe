import Link from "next/link";
import { Building2, Gift, Sparkles, ArrowRight } from "lucide-react";
import GlassCard from "./glass/GlassCard";

const cards = [
  {
    icon: Building2,
    title: "Wholesale",
    copy: "Stock Naya Glows in your store or spa.",
    href: "/wholesale",
  },
  {
    icon: Gift,
    title: "Corporate Gifting",
    copy: "Customised skincare gift boxes for your team, clients or events.",
    href: "/corporate-gifting",
  },
  {
    icon: Sparkles,
    title: "White-Label Services",
    copy: "Launch skincare under your own brand, built with us.",
    href: "/white-label",
  },
];

export default function BusinessDirectorySection() {
  return (
    <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-12 bg-gradient-to-b from-transparent to-[#eafbf0]/60">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7957] mb-2">
            Partner With Naya Glows
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-[#16241a]">For Businesses</h2>
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
