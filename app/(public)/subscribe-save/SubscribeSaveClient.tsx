"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Minus, Plus } from "lucide-react";
import { isInStock, type Product } from "@/lib/products";
import { useUserAuth } from "../../store/useUserAuth";
import { useSettings } from "../../store/useSettings";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import {
  useCreateSubscriptionPlanMutation,
  useInitializePaymentMutation,
} from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";
import { SHIPPING_STORAGE_KEY } from "../../store/userAuthSlice";
import PageHeader from "../helpers/PageHeader";
import GlassCard from "../helpers/glass/GlassCard";
import MyActivePlans from "./MyActivePlans";

declare global {
  interface Window {
    PaystackPop?: {
      setup(config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }): { openIframe: () => void };
    };
  }
}

type Term = "THREE_MONTH" | "SIX_MONTH" | "TWELVE_MONTH";

const TERMS: { key: Term; months: number; label: string }[] = [
  { key: "THREE_MONTH", months: 3, label: "3 Months" },
  { key: "SIX_MONTH", months: 6, label: "6 Months" },
  { key: "TWELVE_MONTH", months: 12, label: "12 Months" },
];

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

type ShippingForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

const emptyForm: ShippingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

export default function SubscribeSaveClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const { user, loading: authLoading } = useUserAuth();
  const {
    subscriptionB3MonthPercent,
    subscriptionB6MonthPercent,
    subscriptionB12MonthPercent,
    subscriptionBFulfillmentMode,
  } = useSettings();
  const { format: formatPrice } = useCurrencyDisplay();

  const percentByTerm: Record<Term, number> = {
    THREE_MONTH: subscriptionB3MonthPercent,
    SIX_MONTH: subscriptionB6MonthPercent,
    TWELVE_MONTH: subscriptionB12MonthPercent,
  };

  const [term, setTerm] = useState<Term>("THREE_MONTH");
  // slug -> quantity per month
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const [paystackReady, setPaystackReady] = useState(false);
  const [openingPopup, setOpeningPopup] = useState(false);
  const backendReady = isApiConfigured();

  const [createPlan, { isLoading: creatingPlan }] = useCreateSubscriptionPlanMutation();
  const [initializePayment, { isLoading: initializingPayment }] = useInitializePaymentMutation();
  const submitting = creatingPlan || initializingPayment || openingPopup;

  useEffect(() => {
    if (window.PaystackPop) setPaystackReady(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/signin?redirect=/subscribe-save");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const saved = localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (!saved) return;
    try {
      setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {
      // Malformed/old data — ignore and keep the empty form.
    }
  }, []);

  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: user.email }));
  }, [user?.email]);

  const months = TERMS.find((t) => t.key === term)!.months;
  const selectedItems = Object.entries(selected).map(([slug, qtyPerMonth]) => ({ slug, qtyPerMonth }));

  // Live estimate — the server (subscriptionPlans.service.ts's quotePlan)
  // recomputes this authoritatively at actual purchase time, this is only
  // ever a preview.
  const estimate = useMemo(() => {
    const percent = percentByTerm[term];
    let base = 0;
    selectedItems.forEach(({ slug, qtyPerMonth }) => {
      const product = products.find((p) => p.slug === slug);
      if (product) base += product.price * qtyPerMonth * months;
    });
    return { base, discounted: base * (1 - percent / 100), percent };
  }, [selected, term, products, months, percentByTerm]);

  const toggleProduct = (slug: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (slug in next) delete next[slug];
      else next[slug] = 1;
      return next;
    });
  };

  const setQtyPerMonth = (slug: string, qty: number) => {
    setSelected((prev) => ({ ...prev, [slug]: Math.max(1, qty) }));
  };

  const updateField = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error("Choose at least one product for your plan.");
      return;
    }
    if (!backendReady) {
      toast.error("Payments aren't connected yet (NEXT_PUBLIC_API_URL isn't set).");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim();
    if (!publicKey || !paystackReady || !window.PaystackPop) {
      toast.error("Payments are still loading — please wait a moment and try again.");
      return;
    }

    localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(form));

    try {
      const { order } = await createPlan({
        term,
        items: selectedItems,
        shippingDetails: form,
      }).unwrap();

      const { reference, email, amount, currency } = await initializePayment({
        orderId: order.id,
      }).unwrap();

      setOpeningPopup(true);
      window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: Math.round(amount * 100),
        currency,
        ref: reference,
        onClose: () => {
          setOpeningPopup(false);
          toast("Payment cancelled — nothing was charged.");
        },
        callback: (response) => {
          setOpeningPopup(false);
          router.push(`/checkout/verify?reference=${encodeURIComponent(response.reference)}`);
        },
      }).openIframe();
    } catch (err) {
      setOpeningPopup(false);
      toast.error(
        getApiErrorMessage(err, "Something went wrong setting up your plan. Please try again."),
      );
    }
  };

  if (authLoading || !user) {
    return <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />;
  }

  const inStockProducts = products.filter(isInStock);

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-16 px-5 sm:px-8 lg:px-12">
        <PageHeader
          eyebrow="Pay Once, Save More"
          heading="Subscribe & Save Big"
          subtitle="Commit to a 3, 6, or 12-month supply upfront and unlock a bigger discount than a one-off order — the longer you commit, the more you save."
        />
      </section>

      <MyActivePlans />

      <section className="px-5 sm:px-8 lg:px-12 pb-24">
        <form onSubmit={handleSubmit} className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Term picker — each option describes exactly what it means */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
                1. Choose Your Term
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TERMS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTerm(t.key)}
                    className={`text-left p-5 rounded-2xl border transition-colors ${
                      term === t.key
                        ? "bg-[#16241a] text-white border-[#16241a]"
                        : "bg-white/60 border-white/60 hover:border-[#8ab88e]"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">{t.label}</p>
                    <p className="text-2xl font-bold mb-2">{percentByTerm[t.key]}% off</p>
                    <p
                      className={`text-xs leading-relaxed ${
                        term === t.key ? "text-white/70" : "text-[#16241a]/50"
                      }`}
                    >
                      Pay once today for {t.months} months of product, at the biggest discount of
                      any Naya Glows option.{" "}
                      {subscriptionBFulfillmentMode === "recurring"
                        ? `Ships one month at a time, automatically, for all ${t.months} months — nothing more to do after today.`
                        : "Your full order ships all at once, right away."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Product picker */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
                2. Choose Your Products
              </h2>
              <div className="flex flex-col gap-3">
                {inStockProducts.map((product) => {
                  const isSelected = product.slug in selected;
                  return (
                    <GlassCard key={product.slug} className="p-4">
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(product.slug)}
                          className="w-4 h-4 accent-[#4f7957] flex-shrink-0"
                        />
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#d4e8d0] flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug line-clamp-1">{product.name}</p>
                          <p className="text-xs text-[#16241a]/50">{formatPrice(product.price)} / unit</p>
                        </div>
                        {isSelected && (
                          <div
                            className="flex items-center gap-3 bg-white/70 border border-white/60 rounded-full px-3 py-1.5 flex-shrink-0"
                            onClick={(e) => e.preventDefault()}
                          >
                            <button
                              type="button"
                              onClick={() => setQtyPerMonth(product.slug, selected[product.slug] - 1)}
                              aria-label="Decrease quantity per month"
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-semibold w-16 text-center">
                              {selected[product.slug]}/month
                            </span>
                            <button
                              type="button"
                              onClick={() => setQtyPerMonth(product.slug, selected[product.slug] + 1)}
                              aria-label="Increase quantity per month"
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        )}
                      </label>
                    </GlassCard>
                  );
                })}
              </div>
            </div>

            {/* Shipping form */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
                3. Shipping Details
              </h2>
              <GlassCard className="px-4 py-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input required placeholder="First name" value={form.firstName} onChange={updateField("firstName")} className={inputClass} />
                  <input required placeholder="Last name" value={form.lastName} onChange={updateField("lastName")} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input required type="email" placeholder="Email address" value={form.email} onChange={updateField("email")} className={inputClass} />
                  <input required type="tel" placeholder="Phone number" value={form.phone} onChange={updateField("phone")} className={inputClass} />
                </div>
                <input required placeholder="Street address" value={form.address} onChange={updateField("address")} className={`${inputClass} mb-4`} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input required placeholder="City" value={form.city} onChange={updateField("city")} className={inputClass} />
                  <input required placeholder="State" value={form.state} onChange={updateField("state")} className={inputClass} />
                  <input required placeholder="ZIP / Postal code" value={form.zip} onChange={updateField("zip")} className={inputClass} />
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Summary */}
          <div>
            <GlassCard className="px-4 py-6 sm:p-6 sticky top-28">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-5">
                Plan Summary
              </h2>

              {selectedItems.length === 0 ? (
                <p className="text-sm text-[#16241a]/50 mb-5">Choose at least one product to see your price.</p>
              ) : (
                <div className="flex flex-col gap-2 mb-5">
                  {selectedItems.map(({ slug, qtyPerMonth }) => {
                    const product = products.find((p) => p.slug === slug);
                    if (!product) return null;
                    return (
                      <div key={slug} className="flex items-center justify-between text-xs">
                        <span className="text-[#16241a]/70">
                          {product.name} × {qtyPerMonth}/mo × {months}mo
                        </span>
                        <span className="font-medium">{formatPrice(product.price * qtyPerMonth * months)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="w-full h-px bg-[#16241a]/10 mb-4" />
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#16241a]/60">{months}-month total</span>
                <span className="font-semibold">{formatPrice(estimate.base)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-5">
                <span className="text-[#16241a]/60">Your discount ({estimate.percent}%)</span>
                <span className="font-semibold text-[#4f7957]">
                  −{formatPrice(estimate.base - estimate.discounted)}
                </span>
              </div>
              <div className="w-full h-px bg-[#16241a]/10 mb-5" />
              <div className="flex items-center justify-between text-base font-bold mb-6">
                <span>Due Today</span>
                <span>{formatPrice(estimate.discounted)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting || selectedItems.length === 0}
                className="w-full text-center bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
              >
                {submitting ? "Preparing payment…" : "Pay with Paystack"}
              </button>
              <p className="text-xs text-[#16241a]/40 mt-3 text-center">
                One secure payment today covers your entire {months}-month plan.
              </p>
            </GlassCard>
          </div>
        </form>

        <div className="max-w-[1100px] mx-auto mt-10 text-center">
          <Link href="/catalog" className="text-sm text-[#16241a]/50 hover:text-[#16241a] transition-colors inline-flex items-center gap-1.5">
            <Check size={14} className="text-[#6a9a72]" />
            Just want a one-time discount instead? Check any product page for Subscribe &amp; Save.
          </Link>
        </div>
      </section>

      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="afterInteractive"
        onLoad={() => setTimeout(() => setPaystackReady(true), 300)}
      />
    </main>
  );
}
