"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Heart, User } from "lucide-react";

// Navigation for the account dashboard's own views — NOT the site's main
// nav. "Home" is this dashboard's overview (not the marketing homepage),
// "Account" is where profile editing / sign-out live. Two renderings of the
// same tab list: a pill row in normal flow (desktop) and a fixed app-style
// bar (mobile only), same swap pattern as the rest of the site's responsive
// nav — never both at once.
const tabs = [
  { href: "/account", label: "Home", icon: Home, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { href: "/account/profile", label: "Account", icon: User, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountTabBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: pill tab row, in normal document flow */}
      <nav className="hidden lg:flex items-center gap-2">
        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#16241a] text-white"
                  : "bg-white/50 text-[#16241a]/60 hover:bg-white/70 border border-white/60"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile: fixed app-style bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-[#16241a]/10 bg-white/95 backdrop-blur-md pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] lg:hidden">
        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <Icon
                size={20}
                className={active ? "text-[#4f7957]" : "text-[#16241a]/45"}
                strokeWidth={active ? 2.1 : 1.75}
              />
              <span
                className={`text-[10.5px] font-medium ${active ? "text-[#4f7957]" : "text-[#16241a]/55"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
