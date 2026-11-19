"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useListMyPlansQuery, useCancelSubscriptionPlanMutation } from "../../store/userApi";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { getApiErrorMessage } from "../../store/apiError";
import GlassCard from "../helpers/glass/GlassCard";

const TERM_LABELS: Record<string, string> = {
  THREE_MONTH: "3-Month",
  SIX_MONTH: "6-Month",
  TWELVE_MONTH: "12-Month",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-[#d4e8d0] text-[#4f7957]",
  CANCELLED: "bg-[#e5e5e5] text-[#666]",
  COMPLETED: "bg-[#f3f4fb] text-[#5a5a7a]",
};

// Standalone from SubscribeSaveClient's plan *builder* on purpose — this is
// about managing plans the customer already has, not creating a new one.
// Renders nothing for a user with no plans at all, so it never clutters the
// page for a first-time visitor.
export default function MyActivePlans() {
  const { data: plans, isLoading } = useListMyPlansQuery();
  const [cancelPlan, { isLoading: cancelling }] = useCancelSubscriptionPlanMutation();
  const { format: formatPrice } = useCurrencyDisplay();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (isLoading || !plans || plans.length === 0) return null;

  const handleCancel = async (id: string) => {
    try {
      const result = await cancelPlan(id).unwrap();
      toast.success(
        result.refundAmount > 0
          ? `Plan cancelled. ₦${result.refundAmount.toLocaleString()} refunded for the months you hadn't received yet.`
          : "Plan cancelled.",
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't cancel this plan. Please try again."));
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <section className="px-5 sm:px-8 lg:px-12 pb-10">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
          Your Subscribe &amp; Save Plans
        </h2>
        <div className="flex flex-col gap-3">
          {plans.map((plan) => {
            const items = plan.items as { name: string; qtyPerMonth: number }[];
            return (
              <GlassCard key={plan.id} className="px-5 py-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-sm font-semibold">{TERM_LABELS[plan.term]} plan</p>
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          STATUS_STYLES[plan.status] ?? "bg-white/60 text-[#16241a]/60"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#16241a]/50 mb-1">
                      {items.map((i) => `${i.qtyPerMonth}× ${i.name}`).join(", ")} per month
                    </p>
                    <p className="text-xs text-[#16241a]/50">
                      Paid {formatPrice(plan.totalPaid)} upfront ({plan.discountPercent}% off)
                      {plan.status === "ACTIVE" && plan.fulfillmentMode === "recurring" && plan.nextShipmentDate && (
                        <> · Next shipment {new Date(plan.nextShipmentDate).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>

                  {plan.status === "ACTIVE" && (
                    <div className="flex-shrink-0">
                      {confirmingId === plan.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={cancelling}
                            onClick={() => handleCancel(plan.id)}
                            className="text-xs font-semibold bg-[#c0574c] text-white px-4 py-2 rounded-full hover:bg-[#a84740] transition-colors disabled:opacity-60"
                          >
                            {cancelling ? "Cancelling…" : "Confirm Cancel"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            className="text-xs font-medium text-[#16241a]/50 hover:text-[#16241a] transition-colors"
                          >
                            Keep plan
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingId(plan.id)}
                          className="text-xs font-semibold text-[#c0574c] hover:text-[#a84740] transition-colors"
                        >
                          Cancel plan
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {plan.status === "ACTIVE" && plan.fulfillmentMode === "recurring" && confirmingId === plan.id && (
                  <p className="text-[11px] text-[#16241a]/45 mt-3 pt-3 border-t border-[#16241a]/8">
                    Future shipments stop immediately, and you&apos;ll be refunded for whichever of the{" "}
                    {plan.remainingShipments} remaining month(s) you haven&apos;t received yet.
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
