"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Droplet } from "lucide-react";
import { isInStock, skincareCategories, type Product, type ProductCategory } from "@/lib/products";
import { useCart } from "../../store/cartSlice";
import { triggerCartFly } from "../../store/cartFlyBus";
import { useUserAuth } from "../../store/useUserAuth";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { useListSavedProductsQuery, useToggleSavedProductMutation } from "../../store/userApi";
import { isApiConfigured } from "@/lib/api";
import { useSectionContent } from "../../store/useSectionContent";
import { defaultCatalogHeroContent } from "@/lib/content/catalogHero";
import GlassCard from "../helpers/glass/GlassCard";
import ProductGridCard from "../helpers/ProductGridCard";
import PhoneMockup from "../helpers/glass/PhoneMockup";
import { AppHomeScreen, ProductDetailScreen } from "../helpers/glass/PhoneScreens";
import ScentDiscoveryHint from "./ScentDiscoveryHint";

type FilterValue = "All" | ProductCategory;
type Collection = "Skincare" | "Scent";

// Matches the short slugs already linked from Footer.tsx (?category=serums
// etc.) plus "scent" for the top-level Scent collection — the single source
// of truth for every /catalog?category=... link anywhere in the app.
const CATEGORY_PARAM_TO_STATE: Record<string, { collection: Collection; filter: FilterValue }> = {
  serums: { collection: "Skincare", filter: "Face Serums" },
  creams: { collection: "Skincare", filter: "Face Creams" },
  cleansers: { collection: "Skincare", filter: "Cleanse & Tone" },
  body: { collection: "Skincare", filter: "Body Care" },
  scent: { collection: "Scent", filter: "All" },
};

const FILTER_TO_CATEGORY_PARAM: Partial<Record<FilterValue, string>> = {
  "Face Serums": "serums",
  "Face Creams": "creams",
  "Cleanse & Tone": "cleansers",
  "Body Care": "body",
};

function CatalogClientInner({ products }: { products: Product[] }) {
  const heroContent = useSectionContent("catalog.hero", defaultCatalogHeroContent);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collection, setCollection] = useState<Collection>("Skincare");
  const [filter, setFilter] = useState<FilterValue>("All");
  const [justAdded, setJustAdded] = useState<string | null>(null);

  // Reacts to both the initial load AND any later client-side navigation to
  // /catalog?category=... (e.g. a Footer link clicked while already here) —
  // useSearchParams' value changes without a full remount in that case.
  useEffect(() => {
    const categoryParam = searchParams.get("category")?.toLowerCase();
    if (!categoryParam) return;
    const mapped = CATEGORY_PARAM_TO_STATE[categoryParam];
    if (mapped) {
      setCollection(mapped.collection);
      setFilter(mapped.filter);
    }
  }, [searchParams]);

  // Keeps the URL in sync with whatever's selected so every /catalog
  // collection/filter state is a real, shareable, back-button-friendly link
  // — not just an incoming-link concern.
  const syncCategoryParam = (nextCollection: Collection, nextFilter: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    const slug =
      nextCollection === "Scent" ? "scent" : FILTER_TO_CATEGORY_PARAM[nextFilter];
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    const qs = params.toString();
    router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  };

  const handleSetCollection = (next: Collection) => {
    const nextFilter: FilterValue = next === "Scent" ? "All" : filter;
    setCollection(next);
    if (next === "Scent") setFilter("All");
    syncCategoryParam(next, nextFilter);
  };

  const handleSetFilter = (next: FilterValue) => {
    setFilter(next);
    syncCategoryParam(collection, next);
  };
  const { addItem } = useCart();
  const { user, loading: authLoading } = useUserAuth();
  const { format: formatPrice } = useCurrencyDisplay();
  const { data: savedProducts } = useListSavedProductsQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const [toggleSavedProduct, { isLoading: togglingWishlist, originalArgs: wishlistArgs }] =
    useToggleSavedProductMutation();
  const wishlist = useMemo(
    () => new Set((savedProducts ?? []).map((p) => p.slug)),
    [savedProducts],
  );

  const isScent = collection === "Scent";

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCollection = isScent ? p.category === "Scent" : p.category !== "Scent";
      const matchesCategory = isScent || filter === "All" || p.category === filter;
      return matchesCollection && matchesCategory;
    });
  }, [products, filter, isScent]);

  const toggleWishlist = async (product: Product) => {
    // Auth is still resolving on first load (token hydration + the /me
    // request) — a real "not signed in" is only knowable once that settles,
    // otherwise an actually-signed-in visitor can get a false "sign in
    // first" toast if they click within that first moment.
    if (authLoading) return;
    if (!user) {
      toast.error("Sign in to save favorites.");
      return;
    }
    // Optimistic — the heart/saved-list flips instantly (see
    // toggleSavedProduct's onQueryStarted in userApi.ts), and unwraps here
    // only to catch a real failure and toast it; the cache patch itself is
    // already rolled back automatically in that case.
    try {
      await toggleSavedProduct({ slug: product.slug, product }).unwrap();
    } catch {
      toast.error("Couldn't update your saved products. Please try again.");
    }
  };

  const handleAddToCart = (product: Product, sourceEl: HTMLElement) => {
    if (!isInStock(product)) return;
    addItem(product);
    triggerCartFly(product.image, sourceEl);
    setJustAdded(product.slug);
    setTimeout(() => setJustAdded(null), 1400);
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${isScent
          ? "bg-gradient-to-b from-[#0e0e0e] to-[#1a1a1a] text-white"
          : "bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a]"
        }`}
    >
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="pt-36 sm:pt-40 pb-16 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Skincare / Scent toggle */}
            <div
              className={`inline-flex items-center gap-1 rounded-full p-1 mb-6 ${isScent ? "bg-white/10" : "bg-white/70"
                }`}
            >
              <button
                onClick={() => handleSetCollection("Skincare")}
                className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${!isScent
                    ? "bg-[#16241a] text-white"
                    : isScent
                      ? "text-white/60 hover:text-white"
                      : "text-[#16241a]/60"
                  }`}
              >
                <Droplet size={13} />
                {heroContent.skincareToggleLabel}
              </button>
              <div className="relative">
                <button
                  onClick={() => handleSetCollection("Scent")}
                  className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer ${isScent ? "bg-white text-[#0e0e0e]" : "text-[#16241a]/60 hover:text-[#16241a]"
                    }`}
                >
                  <Sparkles size={13} />
                  {heroContent.scentToggleLabel}
                </button>
                <ScentDiscoveryHint active={!isScent} />
              </div>
            </div>

            <p
              className={`text-xs tracking-[0.35em] uppercase mb-4 font-medium ${isScent ? "text-white/50" : "text-[#6a9a72]"
                }`}
            >
              {isScent ? heroContent.scentEyebrow : heroContent.skincareEyebrow}
            </p>
            <h1 className="text-[clamp(2.4rem,5.5vw,4rem)] font-light leading-[1.05] mb-6">
              {isScent ? (
                <>
                  {heroContent.scentHeadlineLine1}
                  <br />
                  <span className="font-semibold">{heroContent.scentHeadlineLine2}</span>
                </>
              ) : (
                <>
                  {heroContent.skincareHeadlineLine1}
                  <br />
                  <span className="font-semibold">{heroContent.skincareHeadlineLine2}</span>
                </>
              )}
            </h1>
            <p
              className={`text-sm sm:text-base max-w-md mb-8 leading-relaxed ${isScent ? "text-white/60" : "text-[#16241a]/60"
                }`}
            >
              {isScent ? heroContent.scentSubheading : heroContent.skincareSubheading}
            </p>

            {/* Setch search — replaces the old in-page-filter search field */}
            {!isScent && (
              <div className="max-w-md">
                <div data-setch-search=""></div>
              </div>
            )}
          </div>

          {/* Phone mockups */}
          {!isScent && (
            <div className="hidden lg:flex items-center justify-center gap-6 relative">
              <PhoneMockup tilt={-6} className="mt-10">
                <AppHomeScreen />
              </PhoneMockup>
              <PhoneMockup tilt={5}>
                <ProductDetailScreen />
              </PhoneMockup>
            </div>
          )}
        </div>
      </section>

      {/* ── FILTER BAR (Skincare only) ──────────────────────────── */}
      {!isScent && (
        <section className="px-5 sm:px-8 lg:px-12 mb-10">
          <div className="max-w-[1300px] mx-auto flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {(["All", ...skincareCategories] as FilterValue[]).map((c) => (
              <button
                key={c}
                onClick={() => handleSetFilter(c)}
                className={`flex-shrink-0 text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap ${filter === c
                    ? "bg-[#16241a] text-white"
                    : "bg-white/60 text-[#16241a]/70 hover:bg-white/90"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── PRODUCT GRID ────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[1300px] mx-auto">
          {filtered.length === 0 ? (
            isScent ? (
              <div className="text-center py-24 px-6 rounded-3xl bg-white/5 border border-white/10">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                  <Sparkles size={22} className="text-white/60" />
                </div>
                <p className="text-lg font-medium mb-2">New fragrances coming soon</p>
                <p className="text-sm text-white/50 max-w-sm mx-auto">
                  We&apos;re crafting our first signature scents. Switch back
                  to Skincare to shop what&apos;s available now.
                </p>
              </div>
            ) : (
              <GlassCard className="text-center py-20 px-6">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm text-[#16241a]/50 mb-6">
                  Try a different category.
                </p>
                <button
                  onClick={() => setFilter("All")}
                  className="text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
                >
                  Clear filters
                </button>
              </GlassCard>
            )
          ) : (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 sm:overflow-visible -mx-5 px-5 sm:mx-0 sm:px-0">
              {filtered.map((product) => (
                <ProductGridCard
                  key={product.slug}
                  product={product}
                  formatPrice={formatPrice}
                  wishlisted={wishlist.has(product.slug)}
                  onToggleWishlist={() => toggleWishlist(product)}
                  wishlistDisabled={togglingWishlist && wishlistArgs?.slug === product.slug}
                  onAddToCart={(e) => handleAddToCart(product, e.currentTarget)}
                  justAdded={justAdded === product.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function CatalogClient({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={null}>
      <CatalogClientInner products={products} />
    </Suspense>
  );
}
