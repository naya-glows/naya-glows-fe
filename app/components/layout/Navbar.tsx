"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { CART_LANDED_EVENT } from "../../store/cartFlyBus";
import { useCart } from "../../store/cartSlice";
import { useUserAuth } from "../../store/useUserAuth";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { FREE_SHIPPING_THRESHOLD_NGN, getProducts, type Product } from "@/lib/products";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  X,
  Menu,
  Home,
  BookOpen,
  HelpCircle,
  Phone,
} from "lucide-react";

const products = [
  {
    category: "Face Serums",
    accent: "Boost & Correct",
    items: [
      {
        name: "Radiance Boost Serum",
        description: "Brighten & hydrate with Niacinamide",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381851/naya-glows/legacy/eca30ff9-62ea-4126-8301-03d590c8250d.png",
        href: "/products/radiance-boost-serum",
      },
      {
        name: "Acne Correcting Serum",
        description: "Fade marks with Alpha Arbutin",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381853/naya-glows/legacy/img_6205.jpg",
        href: "/products/acne-correcting-serum",
      },
      {
        name: "Age Renewal Serum",
        description: "Renew with Azelaic Acid",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381833/naya-glows/legacy/08d216cc-1441-4068-996e-ed7d64a65701.png",
        href: "/products/age-renewal-serum",
      },
    ],
  },
  {
    category: "Face Creams",
    accent: "Renew & Correct",
    items: [
      {
        name: "Radiance Renewal Face Cream",
        description: "Deep hydration & renewal",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381847/naya-glows/legacy/b49340ae-6fe1-47f6-be61-8eac75c0ccbf.png",
        href: "/products/radiance-renewal-face-cream",
      },
      {
        name: "Pigment Corrector Cream",
        description: "Target hyperpigmentation",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381838/naya-glows/legacy/42cbfe95-d2a7-4d13-8a5e-72e62dcf1792.png",
        href: "/products/pigment-corrector-face-cream",
      },
      {
        name: "Radiance Barrier Face Oil",
        description: "Squalane & Argan Oil blend",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381845/naya-glows/legacy/9cb3aae2-d6b9-4d9d-8a24-e679c00c2705.png",
        href: "/products/radiance-barrier-face-oil",
      },
    ],
  },
  {
    category: "Cleanse & Tone",
    accent: "Purify & Balance",
    items: [
      {
        name: "Clarifying Foam Cleanser",
        description: "Salicylic Acid pore cleanser",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381840/naya-glows/legacy/432e42ab-30fd-4531-815a-e4ece090058b.png",
        href: "/products/clarifying-foam-cleanser",
      },
      {
        name: "Clarifying Black Soap",
        description: "African Black Soap deep cleanse",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381842/naya-glows/legacy/5d4e84fb-2a40-4b0c-ae19-62d695738a31.png",
        href: "/products/clarifying-black-soap",
      },
      {
        name: "Radiance Balance Toner",
        description: "Balance & refine pores",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381832/naya-glows/legacy/056bf54d-5022-45a9-861d-fa2a3620f4a3.png",
        href: "/products/radiance-balance-toner",
      },
    ],
  },
  {
    category: "Body Care",
    accent: "Glow & Nourish",
    items: [
      {
        name: "Exfoliating Body Scrub",
        description: "Kojic Acid & Lemon brightening",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381835/naya-glows/legacy/19ea7a51-adb2-4a49-bcb7-0bbc0116f4f2.png",
        href: "/products/exfoliating-body-scrub",
      },
      {
        name: "Purifying Body Wash",
        description: "Kaolin Clay daily cleanser",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381837/naya-glows/legacy/2999b980-d234-482d-9e97-982f1bf1579a.png",
        href: "/products/purifying-body-wash",
      },
      {
        name: "Radiance Repair Body Lotion",
        description: "Tranexamic Acid & Vitamin C",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381841/naya-glows/legacy/5bbe98ac-b9a9-40aa-95a1-ad2f9d7a2ce6.png",
        href: "/products/radiance-repair-body-lotion",
      },
      {
        name: "Luminous Glow Body Oil",
        description: "Argan & Sweet Almond Oil",
        image: "https://res.cloudinary.com/bhozkz7o/image/upload/v1784381830/naya-glows/legacy/0323d23a-ed8d-4ab5-8f52-b8a8eb31e04f.png",
        href: "/products/luminous-glow-body-oil",
      },
    ],
  },
];

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  // { label: "About", href: "/about", icon: BookOpen },
  { label: "Catalog", href: "/catalog", icon: ShoppingBag },
  { label: "Our Story", href: "/our-story", icon: HelpCircle },
  { label: "Contact", href: "/contact", icon: Phone },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemCount } = useCart();
  const { user } = useUserAuth();
  const { format: formatPrice } = useCurrencyDisplay();
  const cartIconControls = useAnimationControls();
  const router = useRouter();

  // The "All Products" mega-menu's 12 preview thumbnails used to only start
  // fetching the instant the dropdown opened — racing its ~220ms open
  // animation, so images visibly popped in one by one as each finished
  // downloading. Warming the browser's image cache once on mount (well
  // before anyone hovers) means they're already decoded by the time the
  // dropdown actually opens, without changing anything about how the
  // dropdown itself looks or renders.
  useEffect(() => {
    products.forEach((group) => {
      group.items.forEach((item) => {
        const img = new window.Image();
        img.src = item.image;
      });
    });
  }, []);

  // Search — products are fetched once, lazily, the first time the search
  // bar is opened (not on every keystroke, not on every page load), then
  // filtered entirely client-side. The query itself is debounced so typing
  // fast doesn't re-filter (and re-render the results dropdown) on every
  // keystroke.
  const [searchProducts, setSearchProducts] = useState<Product[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    if (!searchOpen || searchProducts) return;
    getProducts().then(setSearchProducts);
  }, [searchOpen, searchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Closing the search bar (Escape, toggle, navigating away) always starts
  // the next open with a clean slate rather than showing stale results.
  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery("");
      setDebouncedSearchQuery("");
    }
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const q = debouncedSearchQuery.trim().toLowerCase();
    if (!q || !searchProducts) return [];
    return searchProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [debouncedSearchQuery, searchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length === 0) return;
    router.push(`/products/${searchResults[0].slug}`);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handler = () => {
      cartIconControls.start({
        scale: [1, 1.35, 1],
        boxShadow: [
          "0 0 0 0 rgba(201,168,124,0)",
          "0 0 0 10px rgba(201,168,124,0.35)",
          "0 0 0 0 rgba(201,168,124,0)",
        ],
        transition: { duration: 0.6, ease: "easeOut" },
      });
    };
    window.addEventListener(CART_LANDED_EVENT, handler);
    return () => window.removeEventListener(CART_LANDED_EVENT, handler);
  }, [cartIconControls]);
  const pathname = usePathname();

  const closeAllMenus = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="w-full bg-[#1a1a1a] text-white text-center text-xs max-[800px]:text-[9px] tracking-[0.18em] uppercase py-2 font-light">
        Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_NGN)} &nbsp;·&nbsp; Use code{" "}
        <span className="font-medium">GLOW15</span> for 15% off your first order
      </div>

      {/* ── DESKTOP + MOBILE TOP NAVBAR ────────────────────────────────────── */}
      <nav className="w-full fixed top-7 left-0 z-50 bg-transparent">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center h-[64px] lg:h-[72px] gap-3">
            {/* LEFT: Logo + All Products (desktop only) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/"
                onClick={closeAllMenus}
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform duration-200"
              >
                <Image
                  src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381892/naya-glows/legacy/naya-logo.png"
                  alt="Naya Glows"
                  width={34}
                  height={34}
                  className="object-contain"
                  priority
                />
              </Link>

              {/* All Products pill — desktop only */}
              <div
                className="hidden lg:block relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1.5 text-black text-sm tracking-wide font-medium cursor-pointer">
                  <span className="border border-white/30 rounded-full px-4 py-1.5 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                    All Products
                    <motion.span
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} />
                    </motion.span>
                  </span>
                </button>
              </div>
            </div>

            {/* CENTER: Nav links glass pill — desktop only */}
            <div className="flex-1 flex justify-center">
              <div className="hidden lg:flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeAllMenus}
                    className={`text-sm tracking-wide transition-colors duration-150 px-3 py-1 rounded-full hover:bg-white/15 ${pathname === link.href
                      ? "text-black font-semibold"
                      : "text-black/80 hover:text-black"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: Action icons */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a1a1a] hover:scale-105 transition-transform duration-200 shadow-sm"
              >
                {searchOpen ? <X size={16} /> : <Search size={16} />}
              </button>

              {/* Account — desktop only */}
              <Link
                href="/account"
                onClick={closeAllMenus}
                className="hidden lg:flex w-10 h-10 rounded-full bg-white items-center justify-center text-[#1a1a1a] hover:scale-105 transition-transform duration-200 shadow-sm"
              >
                <User size={16} />
              </Link>

              {/* Cart */}
              <Link href="/cart" onClick={closeAllMenus} data-cart-icon>
                <motion.div
                  animate={cartIconControls}
                  className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a1a1a] hover:scale-105 transition-transform duration-200 shadow-sm"
                >
                  <ShoppingBag size={16} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c9a87c] text-black text-[9px] font-semibold rounded-full flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Sign In — desktop only, hidden once signed in */}
              {!user && (
                <Link
                  href="/signin"
                  onClick={closeAllMenus}
                  className="hidden lg:block ml-1 text-sm font-medium bg-white text-[#1a1a1a] px-4 py-2 rounded-full hover:bg-white/90 transition-colors tracking-wide shadow-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="lg:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a1a1a] shadow-sm active:scale-95 transition-transform"
              >
                <Menu size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop Dropdown ─────────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {dropdownOpen && (
            <motion.div
              key="desktop-dropdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden hidden lg:block w-[80%] mx-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white/95 rounded-2xl backdrop-blur-md border-t border-black/5 shadow-2xl">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40 font-medium mb-8">
                    Explore
                  </p>
                  <div className="grid grid-cols-4 gap-10">
                    {products.map((group) => (
                      <div key={group.category}>
                        <p className="text-[11px] tracking-[0.15em] uppercase text-black/40 mb-1">
                          {group.category}
                        </p>
                        <p className="text-base font-semibold text-black mb-5 leading-tight">
                          {group.accent}
                        </p>
                        <div className="flex flex-col gap-4">
                          {group.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center gap-3 group"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <div className="w-12 h-12 rounded-xl bg-[#f5f0ea] flex-shrink-0 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  fetchPriority="high"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-black group-hover:text-[#c9a87c] transition-colors leading-tight">
                                  {item.name}
                                </p>
                                <p className="text-xs text-black/45 mt-0.5 leading-snug">
                                  {item.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-6 border-t border-black/8 flex items-center justify-between">
                    <p className="text-xs text-black/40 tracking-wide">
                      Discover your perfect glow routine
                    </p>
                    <Link
                      href="/catalog"
                      className="text-xs font-semibold text-black tracking-[0.1em] uppercase border border-black/20 px-5 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Shop All Products →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Search bar ──────────────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              key="desktop-search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-white/95 backdrop-blur-md px-5 lg:px-12 py-4 max-w-[1400px] mx-auto">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for serums, cleansers, body care…"
                    className="w-full bg-transparent text-black placeholder:text-black/30 text-base lg:text-lg font-light border-b border-black/15 pb-3 outline-none focus:border-black/40 transition-colors"
                  />
                </form>

                {searchQuery.trim() && (
                  <div className="pt-4 pb-1">
                    {!searchProducts ? (
                      <p className="text-sm text-black/40 py-2">Loading…</p>
                    ) : searchResults.length === 0 ? (
                      <p className="text-sm text-black/40 py-2">
                        No products found for &ldquo;{searchQuery}&rdquo;.
                      </p>
                    ) : (
                      <div className="flex flex-col divide-y divide-black/[0.06]">
                        {searchResults.map((product) => (
                          <Link
                            key={product.slug}
                            href={`/products/${product.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 py-2.5 group"
                          >
                            <div className="w-11 h-11 rounded-lg bg-[#f5f0ea] flex-shrink-0 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-black group-hover:text-[#c9a87c] transition-colors truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-black/40 truncate">{product.category}</p>
                            </div>
                            <span className="text-sm font-semibold text-black flex-shrink-0">
                              {formatPrice(product.price)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ─────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div key="mobile-menu-root">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[99] bg-black/40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-up panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden rounded-t-[2rem] overflow-hidden flex flex-col"
              style={{
                height: "92dvh",
                background: "linear-gradient(160deg, #1c1c1c 0%, #111111 100%)",
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Top bar: logo + close */}
              <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                    <Image
                      src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381892/naya-glows/legacy/naya-logo.png"
                      alt="Naya Glows"
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white font-semibold tracking-wide text-sm">
                    Naya Glows
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 active:scale-90 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Gold divider */}
              <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#c9a87c]/35 to-transparent flex-shrink-0" />

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                <div className="flex flex-col">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.12 + i * 0.065,
                          duration: 0.38,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-4 border-b border-white/[0.07] group ${isActive ? "text-[#c9a87c]" : "text-white/75"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${isActive
                                ? "bg-[#c9a87c]/20"
                                : "bg-white/[0.07] group-active:bg-white/15"
                                }`}
                            >
                              <Icon
                                size={15}
                                className={
                                  isActive ? "text-[#c9a87c]" : "text-white/50"
                                }
                              />
                            </div>
                            <span className="text-[1.6rem] font-semibold tracking-tight leading-none">
                              {link.label}
                            </span>
                          </div>
                          <span
                            className={`text-lg transition-colors ${isActive
                              ? "text-[#c9a87c]"
                              : "text-white/15 group-active:text-white/40"
                              }`}
                          >
                            →
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Shop All CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.38 }}
                  className="pt-6 pb-2"
                >
                  <Link
                    href="/catalog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-[#c9a87c] text-black font-semibold text-sm tracking-[0.15em] uppercase py-4 rounded-2xl active:scale-[0.98] transition-transform"
                  >
                    Shop All Products
                  </Link>
                </motion.div>
              </div>

              {/* Bottom strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="px-6 pb-8 pt-3 flex-shrink-0"
              >
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1.5 border border-white/10 rounded-2xl py-3.5 active:scale-95 transition-transform"
                  >
                    <User size={18} className="text-white/50" />
                    <span className="text-xs text-white/50 font-medium">
                      Account
                    </span>
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex flex-col items-center gap-1.5 border border-white/10 rounded-2xl py-3.5 active:scale-95 transition-transform"
                  >
                    <ShoppingBag size={18} className="text-white/50" />
                    <span className="text-xs text-white/50 font-medium">
                      Cart
                    </span>
                    {itemCount > 0 && (
                      <span className="absolute top-2 right-4 w-4 h-4 bg-[#c9a87c] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </Link>
                  {user ? (
                    <Link
                      href="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center bg-white rounded-2xl py-3.5 active:scale-95 transition-transform"
                    >
                      <span className="text-sm font-semibold text-[#1a1a1a] leading-none truncate max-w-full px-2">
                        Hi, {user.firstName}
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center bg-white rounded-2xl py-3.5 active:scale-95 transition-transform"
                    >
                      <span className="text-sm font-semibold text-[#1a1a1a] leading-none">
                        Sign In
                      </span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
