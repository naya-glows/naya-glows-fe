"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import {
  useListReservationKitsQuery,
  useCreateReservationMutation,
  usePayReservationMutation,
} from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";
import GlassCard from "../helpers/glass/GlassCard";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

export default function BlackFridayPage() {
  const backendReady = isApiConfigured();
  const { data, isLoading } = useListReservationKitsQuery(undefined, { skip: !backendReady });
  const [createReservation, { isLoading: creating }] = useCreateReservationMutation();
  const [payReservation, { isLoading: paying }] = usePayReservationMutation();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const submitting = creating || paying;

  const kits = data?.kits ?? [];
  const selectedKit = kits.find((k) => k.slug === selectedSlug);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedKit) {
      toast.error("Choose a kit first.");
      return;
    }
    try {
      const { reservation } = await createReservation({ kitSlug: selectedKit.slug, ...form }).unwrap();
      const { authorizationUrl } = await payReservation(reservation.id).unwrap();
      window.location.href = authorizationUrl;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't start your reservation. Please try again."));
    }
  };

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="max-w-[700px] mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7957] mb-3">
            Black Friday Early Reservation
          </p>
          <h1 className="text-2xl sm:text-4xl font-light mb-4 leading-snug">
            Black Friday never reach, but you fit enter now! 😉 Reserve your kit with just a ₦5,000 deposit.
          </h1>
          <p className="text-sm text-[#16241a]/60">
            Remaining balances are paid on Black Friday itself, November 27, 2026.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-[#16241a]/50">Loading kits…</p>
        ) : (
          <div className="max-w-[1000px] mx-auto grid sm:grid-cols-3 gap-5 mb-14">
            {kits.map((kit) => {
              const balance = kit.totalPrice - kit.depositAmount;
              const selected = selectedSlug === kit.slug;
              return (
                <button
                  key={kit.slug}
                  type="button"
                  onClick={() => setSelectedSlug(kit.slug)}
                  className={`text-left rounded-2xl border-2 p-5 transition-colors bg-white/70 ${
                    selected ? "border-[#6a9a72]" : "border-transparent hover:border-[#6a9a72]/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">{kit.name}</h3>
                    {selected && (
                      <span className="w-5 h-5 rounded-full bg-[#6a9a72] flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold mb-1">₦{kit.totalPrice.toLocaleString()}</p>
                  {kit.publicPrice && kit.publicPrice > kit.totalPrice && (
                    <p className="text-xs text-[#16241a]/40 mb-2">
                      <span className="line-through">₦{kit.publicPrice.toLocaleString()}</span>{" "}
                      public Black Friday price — ₦{(kit.publicPrice - kit.totalPrice).toLocaleString()} off
                      for reserving early
                    </p>
                  )}
                  <div className="text-xs text-[#16241a]/55 flex flex-col gap-0.5 mt-2">
                    <span>Deposit today: <strong>₦{kit.depositAmount.toLocaleString()}</strong></span>
                    <span>Balance on Black Friday: ₦{balance.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedKit && (
          <GlassCard className="max-w-md mx-auto p-6 sm:p-8">
            <h2 className="text-lg font-medium mb-1">Reserve the {selectedKit.name}</h2>
            <p className="text-xs text-[#16241a]/50 mb-5">
              Pay ₦{selectedKit.depositAmount.toLocaleString()} now to secure it.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className={inputClass}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
              <input
                required
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold py-3 rounded-full disabled:opacity-60"
              >
                {submitting
                  ? "Redirecting to Paystack…"
                  : `Pay ₦${selectedKit.depositAmount.toLocaleString()} Deposit`}
              </button>
            </form>
          </GlassCard>
        )}
      </section>
    </main>
  );
}
