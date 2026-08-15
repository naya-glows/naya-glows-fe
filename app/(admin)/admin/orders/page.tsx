"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import {
  useListOrdersQuery,
  useSetOrderTrackingStageMutation,
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
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useListOrdersQuery();
  const [selected, setSelected] = useState<AdminOrderRow | null>(null);
  const [setTrackingStage, { isLoading: settingStage }] = useSetOrderTrackingStageMutation();

  const handleStageChange = async (id: string, stage: string) => {
    try {
      await setTrackingStage({ id, stage: stage || null }).unwrap();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update the tracking stage."));
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
          <table className="w-full text-sm">
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
                const customerEmail = o.user?.email || o.shippingDetails?.email || "—";
                const itemCount = o.items.reduce((sum, i) => sum + i.qty, 0);
                const hasSubscription = o.items.some((i) => i.isSubscription);

                return (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
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
        )}
      </div>

      {selected && (
        <AdminDetailModal
          title={`Order ${selected.id.slice(0, 8)}`}
          subtitle={new Date(selected.createdAt).toLocaleString()}
          onClose={() => setSelected(null)}
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
              value={selected.user?.email || selected.shippingDetails?.email || "—"}
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
