import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
  title: "Shop All Products | Naya Glows",
  description:
    "Serums, creams, cleansers, and body care — clean, potent skincare formulated to brighten, hydrate, and renew.",
  alternates: { canonical: "/catalog" },
  openGraph: { title: "Shop All Products | Naya Glows", url: "/catalog" },
};

export default async function CatalogPage() {
  const products = await getProducts();
  return <CatalogClient products={products} />;
}
