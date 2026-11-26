"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Check, ShoppingBag } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import { useCart } from "../../store/cartSlice";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { isInStock, type Product } from "@/lib/products";

export default function KitsClient({ kits }: { kits: Product[] }) {
  const { addItem } = useCart();
  const { format: formatPrice } = useCurrencyDisplay();

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1100px] mx-auto">
          <PageHeader
            eyebrow="Curated Programmes"
            heading="Skincare Treatment Kits"
            subtitle="Multi-month skincare programmes built around your goals, with ongoing support built in. Not sure which tier fits? Book a consultation first."
            className="mb-10"
          />

          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f7957] bg-[#d4e8d0] px-4 py-2.5 rounded-full mb-10 hover:bg-[#c3ddbd] transition-colors"
          >
            Not sure where to start? Book a consultation
          </Link>

          {kits.length === 0 ? (
            <p className="text-sm text-[#16241a]/50">Kits aren't available right now — check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {kits.map((kit) => {
                const inStock = isInStock(kit);
                return (
                  <GlassCard key={kit.slug} className="p-6 flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#4f7957] mb-1">
                      {kit.tagline}
                    </p>
                    <h2 className="text-xl font-light mb-3 text-[#16241a]">{kit.name}</h2>
                    <p className="text-2xl font-semibold mb-4 text-[#16241a]">{formatPrice(kit.price)}</p>
                    <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                      {kit.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-[#16241a]/60 leading-relaxed">
                          <Check size={13} className="text-[#4f7957] flex-shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => {
                        addItem(kit, 1);
                        toast.success(`${kit.name} added to cart`);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#16241a] text-white text-xs font-semibold py-3 rounded-full disabled:opacity-50 hover:bg-[#233324] transition-colors"
                    >
                      <ShoppingBag size={13} />
                      {inStock ? "Choose This Plan" : "Unavailable"}
                    </button>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
