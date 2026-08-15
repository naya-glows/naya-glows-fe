import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import SubscribeSaveClient from "./SubscribeSaveClient";

export const metadata: Metadata = {
  title: "Subscribe & Save Big | Naya Glows",
  description:
    "Commit to 3, 6, or 12 months upfront and unlock the biggest discount Naya Glows offers.",
  alternates: { canonical: "/subscribe-save" },
  openGraph: { title: "Subscribe & Save Big | Naya Glows", url: "/subscribe-save" },
};

export default async function SubscribeSavePage() {
  const products = await getProducts();
  return <SubscribeSaveClient products={products} />;
}
