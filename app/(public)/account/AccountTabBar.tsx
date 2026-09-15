"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Heart, User } from "lucide-react";

// Navigation for the account dashboard's own views — NOT the site's main
// nav. "Home" is this dashboard's overview (not the marketing homepage),
// "Account" is where profile editing / sign-out live.
const tabs = [
  { href: "/account", label: "Home", icon: Home, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart, exact: false },
  { href: "/account/profile", label: "Account", icon: User, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

// Two independent renderings of the same tab list — desktop pill row (normal
// flow) and mobile fixed app-style bar — picked by `variant` rather than both
// always mounting from one call, so each can be placed exactly where it needs
// to sit in the layout (the mobile bar in particular must NOT be nested
// inside anything with backdrop-filter/transform/filter, which creates a new
// containing block and breaks its position:fixed).
export default function AccountTabBar({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();

  if (variant === "desktop") {
    return (
      <nav className="flex items-center gap-2">
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
    );
  }

  return (
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
  );
}
