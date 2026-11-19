"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import {
  useListOrdersQuery,
  useSetOrderTrackingStageMutation,
  useRefundOrderMutation,
  TRACKING_STAGES,
  type AdminOrderRow,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

const statusStyles: Record<string, string> = {
  PAID: "bg-[#d4e8d0] text-[#4f7957]",
  PENDING: "bg-[#f4e8c9] text-[#8a6f1f]",
  FAILED: "bg-[#f5d9d5] text-[#c0574c]",
  CANCELLED: "bg-[#e5e5e5] text-[#666]",
  REFUNDED: "bg-[#f0e5f9] text-[#8a5fb8]",
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useListOrdersQuery();
  const [selected, setSelected] = useState<AdminOrderRow | null>(null);
  const [setTrackingStage, { isLoading: settingStage }] = useSetOrderTrackingStageMutation();
  const [refundOrder, { isLoading: refunding }] = useRefundOrderMutation();
  const [refundAmountInput, setRefundAmountInput] = useState("");
  const [confirmingRefund, setConfirmingRefund] = useState(false);

  const handleStageChange = async (id: string, stage: string) => {
    try {
      await setTrackingStage({ id, stage: stage || null }).unwrap();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update the tracking stage."));
    }
  };

  const handleRefund = async (order: AdminOrderRow) => {
    const amount = refundAmountInput.trim() ? Number(refundAmountInput) : undefined;
    if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0)) {
      toast.error("Enter a valid refund amount, or leave it blank for a full refund.");
      return;
    }
    try {
      const result = await refundOrder({ id: order.id, amount }).unwrap();
      toast.success(`Refunded ${order.currency} ${result.refundAmount.toLocaleString()}`);
      setConfirmingRefund(false);
      setRefundAmountInput("");
      setSelected(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't process the refund."));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Orders</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Every order placed through Checkout, most recent first. Click a row for full detail.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !orders || orders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={20} className="text-[#6a9a72]" />
            </div>
            <p className="font-medium mb-1">No orders yet</p>
            <p className="text-sm text-[#16241a]/50 max-w-sm mx-auto">
              Orders will appear here as soon as a customer checks out.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const customerName =
                  (o.user && `${o.user.firstName} ${o.user.lastName}`.trim()) ||
                  [o.shippingDetails?.firstName, o.shippingDetails?.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                  "Guest";
                const customerEmail = o.user?.email || o.shippingDetails?.email || "N/A";
                const itemCount = o.items.reduce((sum, i) => sum + i.qty, 0);
                const hasSubscription = o.items.some((i) => i.isSubscription);

                return (
                  <tr
                    key={o.id}
                    onClick={() => {
                      setSelected(o);
                      setConfirmingRefund(false);
                      setRefundAmountInput("");
                    }}
                    className="border-b border-[#16241a]/5 last:border-0 cursor-pointer hover:bg-white/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{customerName}</p>
                      <p className="text-xs text-[#16241a]/45">{customerEmail}</p>
                    </td>
                    <td className="p-4 text-[#16241a]/60">
                      {itemCount} item(s)
                      {hasSubscription && (
                        <span className="ml-2 text-[9px] font-semibold uppercase tracking-wide text-[#4f7957] bg-[#d4e8d0] px-2 py-0.5 rounded-full">
                          Subscription
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {o.currency} {o.total.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          statusStyles[o.status] ?? "bg-white/60 text-[#16241a]/60"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-[#16241a]/60">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {selected && (
        <AdminDetailModal
          title={`Order ${selected.id.slice(0, 8)}`}
          subtitle={new Date(selected.createdAt).toLocaleString()}
          onClose={() => {
            setSelected(null);
            setConfirmingRefund(false);
            setRefundAmountInput("");
          }}
        >
          <div className="flex flex-col">
            <DetailRow
              label="Customer"
              value={
                (selected.user && `${selected.user.firstName} ${selected.user.lastName}`.trim()) ||
                [selected.shippingDetails?.firstName, selected.shippingDetails?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                "Guest"
              }
            />
            <DetailRow
              label="Email"
              value={selected.user?.email || selected.shippingDetails?.email || "N/A"}
            />
            {selected.shippingDetails && (
              <DetailRow
                label="Shipping Address"
                value={[
                  selected.shippingDetails.address,
                  selected.shippingDetails.city,
                  selected.shippingDetails.state,
                  selected.shippingDetails.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            )}
            <DetailRow
              label="Items"
              value={
                <div className="flex flex-col gap-1 text-right">
                  {selected.items.map((it, i) => (
                    <span key={i}>
                      {it.qty}× {it.product.name}
                      {it.isSubscription ? " (sub)" : ""}
                    </span>
                  ))}
                </div>
              }
            />
            <DetailRow label="Total" value={`${selected.currency} ${selected.total.toLocaleString()}`} />
            {selected.discountCode && (
              <DetailRow
                label="Discount"
                value={`${selected.discountCode} (-${selected.currency} ${selected.discountAmount.toLocaleString()})`}
              />
            )}
            <DetailRow
              label="Status"
              value={
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                    statusStyles[selected.status] ?? "bg-white/60 text-[#16241a]/60"
                  }`}
                >
                  {selected.status}
                </span>
              }
            />
          </div>

          {(() => {
            const payment = selected.payments.find((p) => p.status === "SUCCESS" || p.status === "REFUNDED");
            const remaining = payment ? Math.round((payment.amount - payment.refundedAmount) * 100) / 100 : 0;
            if (selected.status !== "PAID" || !payment || remaining <= 0) return null;
            return (
              <div className="mt-6 pt-5 border-t border-[#16241a]/8">
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
                  Refund
                </label>
                {!confirmingRefund ? (
                  <button
                    type="button"
                    onClick={() => setConfirmingRefund(true)}
                    className="text-sm font-semibold text-[#c0574c] hover:text-[#a84740] transition-colors"
                  >
                    Refund this order
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-[#16241a]/50">
                      Up to {selected.currency} {remaining.toLocaleString()} can still be refunded. Leave
                      the amount blank for a full refund.
                    </p>
                    <input
                      type="number"
                      min={0}
                      max={remaining}
                      step="0.01"
                      value={refundAmountInput}
                      onChange={(e) => setRefundAmountInput(e.target.value)}
                      placeholder={`Full refund (${remaining.toLocaleString()})`}
                      className="w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e] transition-colors"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={refunding}
                        onClick={() => handleRefund(selected)}
                        className="text-sm font-semibold bg-[#c0574c] text-white px-5 py-2.5 rounded-full hover:bg-[#a84740] transition-colors disabled:opacity-60"
                      >
                        {refunding ? "Processing…" : "Confirm Refund"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmingRefund(false);
                          setRefundAmountInput("");
                        }}
                        className="text-sm font-medium text-[#16241a]/50 hover:text-[#16241a] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="mt-6 pt-5 border-t border-[#16241a]/8">
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
              Manual Tracking Stage Override
            </label>
            <select
              defaultValue={selected.manualStage ?? ""}
              disabled={settingStage}
              onChange={(e) => handleStageChange(selected.id, e.target.value)}
              className="w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e] transition-colors"
            >
              <option value="">Automatic (time-based)</option>
              {TRACKING_STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#16241a]/45 mt-2">
              Overrides the automatic 1-week delivery simulation shown on /track-order.
            </p>
          </div>
        </AdminDetailModal>
      )}
    </div>
  );
}
