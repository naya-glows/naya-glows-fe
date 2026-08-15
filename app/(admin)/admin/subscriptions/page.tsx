"use client";

import { useListAdminSubscriptionsQuery } from "../../../store/adminApi";

const termLabels: Record<string, string> = {
  THREE_MONTH: "3 Months",
  SIX_MONTH: "6 Months",
  TWELVE_MONTH: "12 Months",
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#d4e8d0] text-[#4f7957]",
  CANCELLED: "bg-[#f5d9d5] text-[#c0574c]",
  COMPLETED: "bg-[#e5e5e5] text-[#666]",
};

export default function AdminSubscriptionsPage() {
  const { data, isLoading } = useListAdminSubscriptionsQuery();

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Subscriptions</h1>
      <p className="text-sm text-[#16241a]/50 mb-8 max-w-2xl">
        Subscription A: standing reorder discounts, unlocked automatically after a customer's
        first full-price purchase of a product. Subscription B: prepaid 3/6/12-month plans, paid
        upfront at a bigger discount.
      </p>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
        Subscription A — Reorder Discounts
      </h2>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden mb-10">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !data || data.productSubscriptions.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No reorder discounts unlocked yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Discount</th>
                <th className="p-4 font-medium">Unlocked</th>
              </tr>
            </thead>
            <tbody>
              {data.productSubscriptions.map((s) => (
                <tr key={s.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{s.user.firstName} {s.user.lastName}</p>
                    <p className="text-xs text-[#16241a]/45">{s.user.email}</p>
                  </td>
                  <td className="p-4 text-[#16241a]/70">{s.product.name}</td>
                  <td className="p-4 font-mono text-xs font-semibold tracking-wide">{s.code}</td>
                  <td className="p-4 text-[#16241a]/70">{s.discountPercent}%</td>
                  <td className="p-4 text-[#16241a]/60">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
        Subscription B — Prepaid Plans
      </h2>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !data || data.plans.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No prepaid plans purchased yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Term</th>
                <th className="p-4 font-medium">Mode</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total Paid</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Next Shipment</th>
              </tr>
            </thead>
            <tbody>
              {data.plans.map((p) => (
                <tr key={p.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{p.user.firstName} {p.user.lastName}</p>
                    <p className="text-xs text-[#16241a]/45">{p.user.email}</p>
                  </td>
                  <td className="p-4 text-[#16241a]/70">{termLabels[p.term] ?? p.term}</td>
                  <td className="p-4 text-[#16241a]/70 capitalize">{p.fulfillmentMode}</td>
                  <td className="p-4 text-[#16241a]/60 max-w-xs">
                    {p.items.map((i) => `${i.name} (${i.qtyPerMonth}/mo)`).join(", ")}
                  </td>
                  <td className="p-4 text-[#16241a]/70">₦{p.totalPaid.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#16241a]/60">
                    {p.nextShipmentDate ? new Date(p.nextShipmentDate).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
