"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCart } from "../../store/cartSlice";

// Signed-in-only, mobile-only app-style tab bar — mirrors the persistent
// bottom nav pattern from the sibling awaown project's dashboard shell
// (fixed, safe-area aware, active-tab highlight) using Naya's own existing
// routes as destinations instead of a separate dashboard route tree.
const tabs = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/catalog", label: "Catalog", icon: ShoppingBag, exact: false },
  { href: "/cart", label: "Cart", icon: ShoppingCart, exact: false },
  { href: "/account", label: "Account", icon: User, exact: false },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-[#16241a]/10 bg-white/95 backdrop-blur-md pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] lg:hidden">
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        const showBadge = href === "/cart" && itemCount > 0;
        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            <span className="relative">
              <Icon
                size={20}
                className={active ? "text-[#4f7957]" : "text-[#16241a]/45"}
                strokeWidth={active ? 2.1 : 1.75}
              />
              {showBadge && (
                <span className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#16241a] px-1 text-[9px] font-semibold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </span>
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
