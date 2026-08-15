"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateSettingMutation } from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSetting, { isLoading: saving }] = useUpdateSettingMutation();
  const [usdToNgnRate, setUsdToNgnRate] = useState("");
  const [subscriptionDiscountPercent, setSubscriptionDiscountPercent] = useState("");
  const [subscriptionB3MonthPercent, setSubscriptionB3MonthPercent] = useState("");
  const [subscriptionB6MonthPercent, setSubscriptionB6MonthPercent] = useState("");
  const [subscriptionB12MonthPercent, setSubscriptionB12MonthPercent] = useState("");
  const [fulfillmentMode, setFulfillmentMode] = useState<"immediate" | "recurring">("immediate");
  const [shippingFeeLagosNgn, setShippingFeeLagosNgn] = useState("");
  const [shippingFeeOutsideLagosNgn, setShippingFeeOutsideLagosNgn] = useState("");

  useEffect(() => {
    if (!settings) return;
    setUsdToNgnRate(String(settings.usdToNgnRate));
    setSubscriptionDiscountPercent(String(settings.subscriptionDiscountPercent));
    setSubscriptionB3MonthPercent(String(settings.subscriptionB3MonthPercent));
    setSubscriptionB6MonthPercent(String(settings.subscriptionB6MonthPercent));
    setSubscriptionB12MonthPercent(String(settings.subscriptionB12MonthPercent));
    setFulfillmentMode(settings.subscriptionBFulfillmentMode);
    setShippingFeeLagosNgn(String(settings.shippingFeeLagosNgn));
    setShippingFeeOutsideLagosNgn(String(settings.shippingFeeOutsideLagosNgn));
  }, [settings]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all([
        updateSetting({ key: "usdToNgnRate", value: Number(usdToNgnRate) }).unwrap(),
        updateSetting({
          key: "subscriptionDiscountPercent",
          value: Number(subscriptionDiscountPercent),
        }).unwrap(),
        updateSetting({
          key: "subscriptionB3MonthPercent",
          value: Number(subscriptionB3MonthPercent),
        }).unwrap(),
        updateSetting({
          key: "subscriptionB6MonthPercent",
          value: Number(subscriptionB6MonthPercent),
        }).unwrap(),
        updateSetting({
          key: "subscriptionB12MonthPercent",
          value: Number(subscriptionB12MonthPercent),
        }).unwrap(),
        updateSetting({ key: "subscriptionBFulfillmentMode", value: fulfillmentMode }).unwrap(),
        updateSetting({ key: "shippingFeeLagosNgn", value: Number(shippingFeeLagosNgn) }).unwrap(),
        updateSetting({
          key: "shippingFeeOutsideLagosNgn",
          value: Number(shippingFeeOutsideLagosNgn),
        }).unwrap(),
      ]);
      toast.success("Settings saved.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save settings."));
    }
  };

  if (isLoading) {
    return <p className="text-sm text-[#16241a]/50">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Settings</h1>
      <p className="text-sm text-[#16241a]/50 mb-8 max-w-xl">
        Operational config — changes here affect what customers are charged on their next order.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 max-w-md flex flex-col gap-6"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
            USD → NGN Rate
          </label>
          <input
            type="number"
            step="1"
            min="1"
            required
            value={usdToNgnRate}
            onChange={(e) => setUsdToNgnRate(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-[#16241a]/45 mt-1.5">
            Every price is stored and charged in Naira — this rate is only used to show a USD
            estimate to non-Nigeria visitors. Synced automatically from a live exchange-rate feed
            once a day; editing it here holds until the next automatic sync.
          </p>
        </div>

        <div className="pt-1 border-t border-[#16241a]/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/60 mb-3">
            Subscription A — Repeat Purchase Discount
          </p>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
            Discount (%)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            max="99"
            required
            value={subscriptionDiscountPercent}
            onChange={(e) => setSubscriptionDiscountPercent(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-[#16241a]/45 mt-1.5">
            Applied automatically to every reorder of a product once a customer has already bought
            it once at full price — never on that first, qualifying purchase.
          </p>
        </div>

        <div className="pt-1 border-t border-[#16241a]/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/60 mb-3">
            Subscription B — Prepaid Plan Discounts
          </p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                3-Month (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="99"
                required
                value={subscriptionB3MonthPercent}
                onChange={(e) => setSubscriptionB3MonthPercent(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                6-Month (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="99"
                required
                value={subscriptionB6MonthPercent}
                onChange={(e) => setSubscriptionB6MonthPercent(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                12-Month (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="99"
                required
                value={subscriptionB12MonthPercent}
                onChange={(e) => setSubscriptionB12MonthPercent(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-[#16241a]/45 mb-4">
            Bigger discount for a longer upfront commitment — charged as one payment when the
            customer sets up their plan.
          </p>

          <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
            Fulfillment Mode
          </label>
          <div className="flex items-center gap-1 bg-white/70 rounded-full p-1 w-fit">
            <button
              type="button"
              onClick={() => setFulfillmentMode("immediate")}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                fulfillmentMode === "immediate" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
              }`}
            >
              Immediate
            </button>
            <button
              type="button"
              onClick={() => setFulfillmentMode("recurring")}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                fulfillmentMode === "recurring" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
              }`}
            >
              Recurring
            </button>
          </div>
          <p className="text-xs text-[#16241a]/45 mt-1.5">
            {fulfillmentMode === "immediate"
              ? "Immediate: the customer's full plan quantity ships in one order right away."
              : "Recurring: only the first month ships now; the rest ship automatically, one month at a time, for the rest of the plan."}
            {" "}Only applies to new plans — already-active plans keep whatever mode was in effect
            when they were purchased.
          </p>
        </div>

        <div className="pt-1 border-t border-[#16241a]/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/60 mb-3">
            Shipping Fee
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                Within Lagos (₦)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={shippingFeeLagosNgn}
                onChange={(e) => setShippingFeeLagosNgn(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                Outside Lagos (₦)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={shippingFeeOutsideLagosNgn}
                onChange={(e) => setShippingFeeOutsideLagosNgn(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-[#16241a]/45 mt-1.5">
            Charged based on the state the customer enters at checkout — only exact matches to
            &ldquo;Lagos&rdquo; get the Lagos rate, every other state and country gets the outside
            rate. Waived above the free-shipping threshold either way.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start bg-[#16241a] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
