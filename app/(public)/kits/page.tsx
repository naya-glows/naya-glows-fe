import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import KitsClient from "./KitsClient";

export const metadata: Metadata = {
  title: "Skincare Treatment Kits | Naya Glows",
  description:
    "Curated, multi-month skincare programmes — Bronze, Silver, Gold and Premium — with ongoing specialist support.",
};

export default async function KitsPage() {
  const allProducts = await getProducts();
  const kits = allProducts.filter((p) => p.isKit).sort((a, b) => a.price - b.price);

  return <KitsClient kits={kits} />;
}
