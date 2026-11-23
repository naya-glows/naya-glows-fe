"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart, itemUnitPrice } from "../../store/cartSlice";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { useUserAuth } from "../../store/useUserAuth";
import { useSettings } from "../../store/useSettings";
import { SHIPPING_STORAGE_KEY } from "../../store/userAuthSlice";
import GlassCard from "../helpers/glass/GlassCard";
import { useCreateOrderMutation, useInitializePaymentMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";
import { FREE_SHIPPING_THRESHOLD_NGN } from "@/lib/products";
import { countries } from "@/lib/countries";
import { NIGERIA_STATES } from "@/lib/nigeriaStates";

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
  country: string;
  zip: string;
};

// Defaults to Nigeria since the storefront is Naira-first and the vast
// majority of customers are Nigerian — the state dropdown only actually
// needs to be "disabled until a country is chosen" for the rarer case
// someone switches away from it, not on first load.
const emptyForm: ShippingForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "NG",
  zip: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountBySlug } = useCart();
  const { format: formatPrice } = useCurrencyDisplay();
  const { user, loading: authLoading } = useUserAuth();
  const { shippingFeeLagosNgn, shippingFeeOutsideLagosNgn } = useSettings();
  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const isLagos = form.country === "NG" && form.state.trim().toLowerCase() === "lagos";
  const locationShippingFee = isLagos ? shippingFeeLagosNgn : shippingFeeOutsideLagosNgn;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_NGN || subtotal === 0 ? 0 : locationShippingFee;
  const backendReady = isApiConfigured();
  const [redirecting, setRedirecting] = useState(false);

  // Payment now always requires a signed-in account (no guest checkout) —
  // enforced server-side too (POST /orders is requireAuth), this just gives
  // a same-page redirect instead of a failed order-creation call.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/signin?redirect=/checkout");
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

  // The remembered blob above is intentionally account-agnostic (it's just
  // "whatever was last typed in this browser"), which is exactly how a
  // stale email from a previous account ended up on someone else's order.
  // Checkout requires sign-in now, so the email is always the signed-in
  // account's — overriding whatever the remembered blob has, not merging.
  useEffect(() => {
    if (user?.email) setForm((f) => ({ ...f, email: user.email }));
  }, [user?.email]);

  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [initializePayment, { isLoading: initializingPayment }] = useInitializePaymentMutation();
  const submitting = creatingOrder || initializingPayment || redirecting;
  const [discountCode, setDiscountCode] = useState("");

  const updateField =
    (field: keyof ShippingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  // Switching country invalidates whatever was picked/typed for state (a
  // Nigerian state name means nothing once the country's no longer NG, and
  // vice versa) — same values on both frontend and backend for the
  // Lagos/outside-Lagos fee lookup only works if this never gets stale.
  const updateCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((f) => ({ ...f, country: e.target.value, state: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!backendReady) {
      toast.error("Payments aren't connected yet (NEXT_PUBLIC_API_URL isn't set).");
      return;
    }

    localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(form));

    try {
      const { order } = await createOrder({
        items: items.map((i) => ({
          slug: i.slug,
          qty: i.qty,
          isSubscription: i.isSubscription,
          variantName: i.variantName,
        })),
        shippingDetails: form,
        discountCode: discountCode.trim() || undefined,
      }).unwrap();

      const { authorizationUrl } = await initializePayment({ orderId: order.id }).unwrap();

      // A full redirect to Paystack's own hosted checkout page, not the
      // Inline JS popup this used to be — Inline's iframe is a documented
      // failure mode where it can hang indefinitely mid-3-D-Secure/OTP with
      // neither its success nor cancel callback ever firing, leaving the
      // customer stuck on a frozen "placing order" screen with no way to
      // tell whether they were charged. Paystack's own page redirects back
      // to /checkout/verify (set server-side, see payments.routes.ts)
      // regardless of what happens, so there's no equivalent stuck state.
      setRedirecting(true);
      window.location.href = authorizationUrl;
    } catch (err) {
      setRedirecting(false);
      toast.error(
        getApiErrorMessage(err, "Something went wrong starting your payment. Please try again."),
      );
    }
  };

  if (authLoading || !user) {
    return <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />;
  }

  if (items.length === 0) {
    return (
      <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5">
        <GlassCard className="max-w-md w-full text-center py-16 px-8">
          <h1 className="text-2xl font-light mb-3">Nothing to check out</h1>
          <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
            Your cart is empty. Add a few favorites first.
          </p>
          <Link
            href="/catalog"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
          >
            Browse Catalog
          </Link>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1100px] mx-auto">
          <h1 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-light mb-10">
            Checkout
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Shipping form */}
            <GlassCard className="lg:col-span-2 px-4 py-6 sm:p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-6">
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={updateField("firstName")}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={updateField("lastName")}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={updateField("email")}
                  className={inputClass}
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className={inputClass}
                />
              </div>
              <input
                required
                placeholder="Street address"
                value={form.address}
                onChange={updateField("address")}
                className={`${inputClass} mb-4`}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <select required value={form.country} onChange={updateCountry} className={inputClass}>
                  <option value="" disabled>
                    Select country
                  </option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={updateField("city")}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                {form.country === "NG" ? (
                  <select
                    required
                    disabled={!form.country}
                    value={form.state}
                    onChange={updateField("state")}
                    className={`${inputClass} disabled:opacity-50`}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {NIGERIA_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    disabled={!form.country}
                    placeholder="State / Province"
                    value={form.state}
                    onChange={updateField("state")}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                )}
                <input
                  required
                  placeholder="ZIP / Postal code"
                  value={form.zip}
                  onChange={updateField("zip")}
                  className={inputClass}
                />
              </div>

              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-3 mt-8">
                Payment
              </h2>
              <p className="text-xs text-[#16241a]/45 leading-relaxed">
                A secure Paystack payment window opens right here on the page,
                so you never leave the site. Amounts are charged in Nigerian
                Naira (₦).
              </p>
            </GlassCard>

            {/* Order summary */}
            <div>
              <GlassCard className="px-4 py-6 sm:p-6 sticky top-28">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-5">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 mb-5">
                  {items.map((item) => (
                    <div key={item.slug + (item.variantName ?? "")} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#16241a] text-white text-[9px] flex items-center justify-center">
                          {item.qty}
                        </span>
                      </div>
                      <p className="text-xs flex-1 line-clamp-2">
                        {item.name}
                        {item.variantName && (
                          <span className="text-[#16241a]/45"> · {item.variantName}</span>
                        )}
                        {discountBySlug.has(item.slug) ? (
                          <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#4f7957]">
                            (Discount applied)
                          </span>
                        ) : (
                          item.isSubscription && (
                            <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wide text-[#6a9a72]">
                              (Unlocks discount next time)
                            </span>
                          )
                        )}
                      </p>
                      <p className="text-xs font-semibold flex-shrink-0">
                        {formatPrice(itemUnitPrice(item, discountBySlug) * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="w-full h-px bg-[#16241a]/10 mb-4" />

                <div className="flex items-center gap-2 mb-4">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-xs outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors"
                  />
                </div>
                {discountCode.trim() && (
                  <p className="text-[11px] text-[#16241a]/45 -mt-3 mb-4">
                    Applied when you pay. If it's not valid for this order, you'll see why before anything is charged.
                  </p>
                )}

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#16241a]/60">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-5">
                  <span className="text-[#16241a]/60">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="w-full h-px bg-[#16241a]/10 mb-5" />
                <div className="flex items-center justify-between text-base font-bold mb-6">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + shipping)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-center bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
                >
                  {redirecting
                    ? "Redirecting to Paystack…"
                    : submitting
                      ? "Preparing payment…"
                      : "Pay with Paystack"}
                </button>
              </GlassCard>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
