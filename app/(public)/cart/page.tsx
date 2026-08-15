"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart, itemUnitPrice } from "../../store/cartSlice";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { useSettings } from "../../store/useSettings";
import { FREE_SHIPPING_THRESHOLD_NGN } from "@/lib/products";
import GlassCard from "../helpers/glass/GlassCard";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, discountBySlug } = useCart();
  const { format: formatPrice } = useCurrencyDisplay();
  const { shippingFeeLagosNgn, shippingFeeOutsideLagosNgn } = useSettings();
  // No address yet at this point in the flow — the real fee (Lagos vs.
  // outside-Lagos) is only known once shipping details are entered at
  // checkout, so this is an optimistic "from" estimate using the lower of
  // the two admin-set rates.
  const estimatedShippingFee = Math.min(shippingFeeLagosNgn, shippingFeeOutsideLagosNgn);

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-light mb-10">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <GlassCard className="text-center py-20 px-6">
              <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-5">
                <ShoppingBag size={22} className="text-[#6a9a72]" />
              </div>
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-[#16241a]/50 mb-6">
                Discover formulas made for your glow.
              </p>
              <Link
                href="/catalog"
                className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
              >
                Browse Catalog
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Line items */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map((item) => (
                  <GlassCard
                    key={item.slug + (item.variantName ?? "")}
                    className="flex items-center gap-4 p-4"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug}`}>
                        <p className="text-sm font-semibold leading-snug mb-1 line-clamp-1 hover:text-[#6a9a72] transition-colors">
                          {item.name}
                          {item.variantName && (
                            <span className="text-[#16241a]/45 font-normal"> — {item.variantName}</span>
                          )}
                        </p>
                      </Link>
                      <p className="text-sm text-[#16241a]/60 flex items-center gap-2">
                        {formatPrice(itemUnitPrice(item, discountBySlug))}
                        {discountBySlug.has(item.slug) ? (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-[#4f7957] bg-[#d4e8d0] px-2 py-0.5 rounded-full">
                            Reorder discount applied
                          </span>
                        ) : (
                          item.isSubscription && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#6a9a72] bg-[#eafbf0] px-2 py-0.5 rounded-full">
                              Unlocks a discount next time
                            </span>
                          )
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/70 border border-white/60 rounded-full px-3 py-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(item.slug, item.qty - 1, item.variantName)}
                        aria-label="Decrease quantity"
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.slug, item.qty + 1, item.variantName)}
                        aria-label="Increase quantity"
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.slug, item.variantName)}
                      aria-label="Remove item"
                      className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0 hover:bg-white transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </GlassCard>
                ))}
              </div>

              {/* Summary */}
              <div>
                <GlassCard className="px-4 py-6 sm:p-6 sticky top-28">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-5">
                    Order Summary
                  </h2>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#16241a]/60">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[#16241a]/60">Shipping</span>
                    <span className="font-semibold">
                      {subtotal >= FREE_SHIPPING_THRESHOLD_NGN
                        ? "Free"
                        : `From ${formatPrice(estimatedShippingFee)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#16241a]/40 mb-4">
                    Exact fee depends on delivery location, calculated at checkout.
                  </p>
                  <div className="w-full h-px bg-[#16241a]/10 mb-5" />
                  <div className="flex items-center justify-between text-base font-bold mb-6">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        subtotal +
                          (subtotal >= FREE_SHIPPING_THRESHOLD_NGN || subtotal === 0
                            ? 0
                            : estimatedShippingFee),
                      )}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    className="block text-center bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
