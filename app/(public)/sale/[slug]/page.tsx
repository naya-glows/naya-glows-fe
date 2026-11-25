import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import SaleClient from "./SaleClient";

async function fetchSale(slug: string) {
  const { api, isApiConfigured } = await import("@/lib/api");
  if (!isApiConfigured()) return null;
  try {
    const res = await api.get<{
      sale: {
        id: string;
        slug: string;
        name: string;
        discountPercent: number;
        productSlugs: string[];
        startDate: string;
        endDate: string;
        bannerHeadline: string;
        bannerCopy: string;
        bannerImage: string | null;
      };
    }>(`/sales/${slug}`);
    return res.sale;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sale = await fetchSale(slug);
  if (!sale) return {};
  return {
    title: `${sale.name} | Naya Glows`,
    description: sale.bannerCopy,
  };
}

export default async function SalePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sale = await fetchSale(slug);
  if (!sale) notFound();

  const allProducts = await getProducts();
  const saleProducts =
    sale.productSlugs.length === 0
      ? allProducts // storewide
      : allProducts.filter((p) => sale.productSlugs.includes(p.slug));

  // Combos aren't tied to any one campaign (they're always-on bundle deals,
  // see Combo in schema.prisma) — shown alongside whichever seasonal sale is
  // currently live since that's the natural "browse and buy" destination the
  // brief describes.
  const comboSlugs = new Set(allProducts.filter((p) => p.isCombo).map((p) => p.slug));
  const comboProducts = allProducts.filter((p) => comboSlugs.has(p.slug));

  return <SaleClient sale={sale} products={saleProducts} combos={comboProducts} />;
}
