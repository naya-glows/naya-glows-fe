"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../../store/cartSlice";
import { useCurrencyDisplay } from "../../../store/useCurrencyDisplay";
import { isInStock, type Product } from "@/lib/products";

function SaleCard({
  product,
  discountPercent,
}: {
  product: Product;
  discountPercent?: number;
}) {
  const { addItem } = useCart();
  const { format: formatPrice } = useCurrencyDisplay();
  const inStock = isInStock(product);
  const displayPrice = discountPercent
    ? Math.round(product.price * (1 - discountPercent / 100))
    : product.price;

  return (
    <div className="bg-white/70 rounded-2xl overflow-hidden flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative aspect-square block">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
        {discountPercent ? (
          <span className="absolute top-3 left-3 bg-[#c0574c] text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
            {discountPercent}% off
          </span>
        ) : null}
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-base font-bold">{formatPrice(displayPrice)}</span>
          {(discountPercent || product.originalPrice > product.price) && (
            <span className="text-xs line-through text-[#16241a]/35">
              {formatPrice(product.originalPrice > product.price ? product.originalPrice : product.price)}
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => {
            addItem(product, 1);
            toast.success(`${product.name} added to cart`);
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#16241a] text-white text-xs font-semibold py-2.5 rounded-full disabled:opacity-50"
        >
          <ShoppingBag size={13} />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

export default function SaleClient({
  sale,
  products,
  combos,
}: {
  sale: {
    name: string;
    discountPercent: number;
    bannerHeadline: string;
    bannerCopy: string;
    bannerImage: string | null;
    endDate: string;
  };
  products: Product[];
  combos: Product[];
}) {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="relative px-5 sm:px-8 lg:px-12 py-16 sm:py-24 overflow-hidden">
        {sale.bannerImage ? (
          <div className="absolute inset-0 -z-10">
            <Image src={sale.bannerImage} alt="" fill className="object-cover opacity-20" />
          </div>
        ) : null}
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7957] mb-3">
            {sale.name}
          </p>
          <h1 className="text-3xl sm:text-5xl font-light mb-4">{sale.bannerHeadline}</h1>
          <p className="text-sm sm:text-base text-[#16241a]/60 max-w-xl mx-auto">{sale.bannerCopy}</p>
          <p className="text-xs text-[#16241a]/40 mt-4">
            Ends {new Date(sale.endDate).toLocaleDateString()}
          </p>
        </div>
      </section>

      {combos.length > 0 && (
        <section className="px-5 sm:px-8 lg:px-12 pb-12">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
              Combo Deals
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {combos.map((c) => (
                <SaleCard key={c.slug} product={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 sm:px-8 lg:px-12 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
            On Sale
          </h2>
          {products.length === 0 ? (
            <p className="text-sm text-[#16241a]/50">No products in this campaign yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <SaleCard key={p.slug} product={p} discountPercent={sale.discountPercent} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
