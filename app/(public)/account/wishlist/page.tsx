"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import GlassCard from "../../helpers/glass/GlassCard";
import ProductGridCard from "../../helpers/ProductGridCard";
import { useUserAuth } from "../../../store/useUserAuth";
import { useCurrencyDisplay } from "../../../store/useCurrencyDisplay";
import { useCart } from "../../../store/cartSlice";
import { triggerCartFly } from "../../../store/cartFlyBus";
import { getApiErrorMessage } from "../../../store/apiError";
import {
  useListSavedProductsQuery,
  useToggleSavedProductMutation,
} from "../../../store/userApi";
import { isApiConfigured } from "@/lib/api";

export default function AccountWishlistPage() {
  const { user } = useUserAuth();
  const { format: formatPrice } = useCurrencyDisplay();
  const { data: savedProducts = [] } = useListSavedProductsQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const [toggleSavedProduct, { isLoading: togglingSaved, originalArgs: togglingSavedArgs }] =
    useToggleSavedProductMutation();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAddSavedToCart = (product: (typeof savedProducts)[number], e: MouseEvent<HTMLButtonElement>) => {
    addItem(product);
    triggerCartFly(product.image, e.currentTarget);
    setJustAdded(product.slug);
    setTimeout(() => setJustAdded(null), 1400);
  };

  // Optimistic — the item disappears from this list instantly (see
  // toggleSavedProduct's onQueryStarted in userApi.ts), rolled back
  // automatically if the request fails; unwrap() here only catches that
  // failure to toast it.
  const handleUnsave = async (slug: string) => {
    try {
      await toggleSavedProduct({ slug }).unwrap();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update your saved products. Please try again."));
    }
  };

  if (!user) return null;

  return (
    <GlassCard className="px-5 py-8 sm:p-8">
      <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mb-4">
        <Heart size={17} className="text-[#6a9a72]" />
      </div>
      <h2 className="text-base font-semibold mb-1">Saved Products</h2>
      {savedProducts.length === 0 ? (
        <>
          <p className="text-sm text-[#16241a]/50 mb-4">
            Your wishlist from the catalog will appear here.
          </p>
          <Link href="/catalog" className="text-sm font-semibold text-[#6a9a72] hover:underline">
            Browse catalog →
          </Link>
        </>
      ) : (
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:overflow-visible">
          {savedProducts.map((product) => (
            <ProductGridCard
              key={product.slug}
              product={product}
              formatPrice={formatPrice}
              wishlisted
              onToggleWishlist={() => handleUnsave(product.slug)}
              wishlistDisabled={togglingSaved && togglingSavedArgs?.slug === product.slug}
              onAddToCart={(e) => handleAddSavedToCart(product, e)}
              justAdded={justAdded === product.slug}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
}
