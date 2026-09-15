"use client";

import Link from "next/link";
import {
  Package,
  Heart,
  Repeat,
  Sparkles,
  Truck,
  ShoppingBag,
  Megaphone,
  ArrowUpRight,
  Leaf,
} from "lucide-react";
import { useUserAuth } from "../../store/useUserAuth";
import {
  useListSavedProductsQuery,
  useListMyOrdersQuery,
  useListMyProductSubscriptionsQuery,
} from "../../store/userApi";
import { isApiConfigured } from "@/lib/api";

// The "Pay Once, Save More" promo gradient every stat tile now shares — a
// deliberately dark, single brand surface instead of one color per card.
const darkGradient = "bg-gradient-to-br from-[#16241a] to-[#2d4530]";

export default function AccountHomePage() {
  const { user } = useUserAuth();
  const { data: savedProducts = [] } = useListSavedProductsQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const { data: myOrders = [] } = useListMyOrdersQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const { data: mySubscriptions = [] } = useListMyProductSubscriptionsQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });

  if (!user) return null;

  const memberSinceYear = new Date(user.createdAt).getFullYear();

  const quickLinks = [
    { label: "Track Order", icon: Truck, href: "/track-order" },
    { label: "Shop Catalog", icon: ShoppingBag, href: "/catalog" },
    { label: "Subscribe & Save Big", icon: Repeat, href: "/subscribe-save" },
    user.role === "INFLUENCER"
      ? { label: "Influencer Dashboard", icon: Megaphone, href: "/influencer" }
      : { label: "Become an Influencer", icon: Megaphone, href: "/influencer/apply" },
  ];

  return (
    <>
      {/* Stat tiles — same dark brand gradient as the promo banner below */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Orders", value: myOrders.length, icon: Package },
          { label: "Saved Products", value: savedProducts.length, icon: Heart },
          { label: "Reorder Discounts", value: mySubscriptions.length, icon: Repeat },
          { label: "Member Since", value: memberSinceYear, icon: Sparkles },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${darkGradient} rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[110px]`}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <stat.icon size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none text-white">{stat.value}</p>
              <p className="text-xs text-white/50 mt-1.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe & Save Big promo banner — abstract leaf motif is what
          sets this card apart from the stat tiles sharing its gradient */}
      <Link
        href="/subscribe-save"
        className={`group relative overflow-hidden rounded-2xl ${darkGradient} px-6 py-7 sm:px-8 sm:py-8 flex items-center justify-between gap-6 flex-wrap`}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl bg-[#aed4b4]" />
        <Leaf
          size={150}
          strokeWidth={1}
          className="absolute -bottom-10 -left-8 text-white/10 rotate-[25deg] pointer-events-none"
        />
        <Leaf
          size={80}
          strokeWidth={1}
          className="absolute top-4 right-28 text-white/10 -rotate-[15deg] pointer-events-none hidden sm:block"
        />
        <div className="relative z-10 max-w-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8ab88e] mb-2">
            Pay Once, Save More
          </p>
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-1.5">
            Subscribe &amp; Save Big
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Commit to 3, 6, or 12 months upfront and unlock the biggest discount we offer.
          </p>
        </div>
        <span className="relative z-10 flex items-center gap-2 bg-white text-[#16241a] text-sm font-semibold px-5 py-2.5 rounded-full flex-shrink-0 group-hover:gap-3 transition-all">
          Explore Plans
          <ArrowUpRight size={15} />
        </span>
      </Link>

      {/* Quick links — glass pills, no per-item color */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-2.5 rounded-full pl-2 pr-4 py-2 flex-shrink-0 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(22,36,26,0.1)] hover:bg-white/70 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
              <link.icon size={13} className="text-[#4f7957]" />
            </span>
            <span className="text-xs font-semibold whitespace-nowrap">{link.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
