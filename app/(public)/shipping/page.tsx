"use client";

import Link from "next/link";
import { Truck, RotateCcw, PackageCheck } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import PageHeader from "../helpers/PageHeader";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { useSettings } from "../../store/useSettings";
import { FREE_SHIPPING_THRESHOLD_NGN } from "@/lib/products";

function buildSections(shippingFree: string, shippingLagos: string, shippingOutsideLagos: string) {
  return [
    {
      icon: Truck,
      title: "Shipping",
      body: [
        `Orders ship within 1–2 business days of being placed. Shipping is free on orders over ${shippingFree} — orders below that ship for ${shippingLagos} within Lagos, or ${shippingOutsideLagos} outside Lagos.`,
        "Domestic (Nigeria) orders typically arrive in 2–5 business days. International orders usually take 7–14 business days, depending on destination and customs processing.",
        "You'll receive a confirmation email with a tracking link as soon as your order ships — you can also check status anytime on our Track Order page.",
      ],
    },
    {
      icon: RotateCcw,
      title: "Returns",
      body: [
        "Unopened, unused products in their original packaging can be returned within 14 days of delivery for a full refund.",
        "Opened or used products aren't eligible for return, in line with standard cosmetics and skincare hygiene practices — but if your order arrived damaged, incorrect, or faulty, contact us within 7 days and we'll replace it or refund you at no extra cost.",
        "To start a return, email hello@nayaglows.com with your order ID and reason for return — a member of our team will get back to you with next steps.",
      ],
    },
    {
      icon: PackageCheck,
      title: "Exchanges",
      body: [
        "We currently don't offer direct exchanges — if you'd like a different product or size, return your eligible item for a refund and place a new order.",
        "Subscribe & Save orders can be changed or cancelled anytime from your account before the next order is placed, so you're never locked into a size or product that isn't working for you.",
      ],
    },
  ];
}

export default function ShippingPage() {
  const { format: formatPrice } = useCurrencyDisplay();
  const { shippingFeeLagosNgn, shippingFeeOutsideLagosNgn } = useSettings();
  const sections = buildSections(
    formatPrice(FREE_SHIPPING_THRESHOLD_NGN),
    formatPrice(shippingFeeLagosNgn),
    formatPrice(shippingFeeOutsideLagosNgn),
  );

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Orders & Delivery"
          heading="Shipping & Returns"
          subtitle="Everything you need to know about getting your order, and what to do if something's not right."
        />
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[800px] mx-auto flex flex-col gap-6">
          {sections.map((section) => (
            <GlassCard key={section.title} className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0">
                  <section.icon size={17} className="text-[#6a9a72]" />
                </div>
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {section.body.map((p, i) => (
                  <p key={i} className="text-sm text-[#16241a]/65 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </GlassCard>
          ))}

          <div className="text-center mt-6">
            <p className="text-sm text-[#16241a]/50 mb-4">Need help with an existing order?</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="/track-order"
                className="inline-block text-sm font-semibold bg-[#16241a] text-white px-7 py-3 rounded-full hover:bg-[#233324] transition-colors"
              >
                Track Your Order
              </Link>
              <Link
                href="/contact"
                className="inline-block text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-7 py-3 rounded-full hover:bg-[#16241a]/5 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
