"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { User, MapPin } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import { useUserAuth } from "../../store/useUserAuth";
import { countries } from "@/lib/countries";
import AccountTabBar from "./AccountTabBar";

// Shell for the signed-in user's own dashboard area only (/account and its
// sub-views) — NOT the rest of the site. Centralizes the auth gate + the
// persistent identity strip + tab nav so each view (Home/Orders/Wishlist/
// Account) only has to render its own content.
export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUserAuth();

  if (loading) {
    return <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />;
  }

  if (!user) {
    return (
      <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5">
        <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
          <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-5">
            <User size={22} className="text-[#6a9a72]" />
          </div>
          <h1 className="text-xl font-medium mb-2">Sign in to view your account</h1>
          <p className="text-sm text-[#16241a]/50 mb-8">
            Track orders, save favorites, and manage your details.
          </p>
          <Link
            href="/signin"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
          >
            Sign In
          </Link>
        </GlassCard>
      </main>
    );
  }

  const countryName = countries.find((c) => c.code === user.country)?.name ?? user.country;

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[900px] mx-auto flex flex-col gap-6 pb-20 lg:pb-0">
          {/* Persistent identity strip — stays the same across every
              account view; editing/sign-out live under the Account tab. */}
          <GlassCard className="px-5 py-5 sm:p-6 flex items-center gap-5">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8ab88e] to-[#16241a] flex items-center justify-center flex-shrink-0 text-white text-lg font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold truncate">Hey, {user.firstName}</p>
                <p className="text-xs text-[#16241a]/50 truncate">{user.email}</p>
                {user.country && (
                  <p className="text-xs text-[#6a9a72] flex items-center gap-1 mt-0.5 min-w-0">
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="truncate">
                      {countryName} · {user.currency}
                    </span>
                  </p>
                )}
              </div>
            </div>
            {/* Desktop pill nav only — kept inline here since the pill row
                itself has no backdrop-filter/transform of its own. */}
            <div className="hidden lg:block">
              <AccountTabBar variant="desktop" />
            </div>
          </GlassCard>

          {/* Mobile fixed tab bar rendered OUTSIDE the GlassCard on purpose:
              GlassCard uses backdrop-blur-xl, and backdrop-filter (like
              transform/filter) creates a new containing block for
              position:fixed descendants — nested inside it, the bar pins
              itself to the card instead of the viewport. */}
          <AccountTabBar variant="mobile" />

          {children}
        </div>
      </section>
    </main>
  );
}
