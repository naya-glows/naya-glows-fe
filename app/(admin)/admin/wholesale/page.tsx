"use client";

import { useState } from "react";
import { useListWholesaleInquiriesQuery, type WholesaleInquiryRow } from "../../../store/adminApi";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

const TYPE_LABELS: Record<WholesaleInquiryRow["type"], string> = {
  WHOLESALE: "Wholesale",
  CORPORATE_GIFTING: "Corporate Gifting",
  WHITE_LABEL: "White-Label",
};

const TABS = ["ALL", "WHOLESALE", "CORPORATE_GIFTING", "WHITE_LABEL"] as const;

export default function AdminWholesalePage() {
  const { data: inquiries, isLoading } = useListWholesaleInquiriesQuery();
  const [selected, setSelected] = useState<WholesaleInquiryRow | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");

  const filtered = (inquiries ?? []).filter((i) => tab === "ALL" || i.type === tab);

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Business Inquiries</h1>
      <p className="text-sm text-[#16241a]/50 mb-6">
        Wholesale, Corporate Gifting and White-Label enquiries. Click a row for full detail.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-full transition-colors ${
              tab === t ? "bg-[#16241a] text-white" : "bg-white/60 text-[#16241a]/60 hover:bg-white/80"
            }`}
          >
            {t === "ALL" ? "All" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Business</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => setSelected(i)}
                  className="border-b border-[#16241a]/5 last:border-0 cursor-pointer hover:bg-white/50 transition-colors"
                >
                  <td className="p-4 font-medium">{i.businessName}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {i.contactName} · {i.email}
                    {i.phone ? ` · ${i.phone}` : ""}
                  </td>
                  <td className="p-4 text-[#16241a]/60">{TYPE_LABELS[i.type]}</td>
                  <td className="p-4">
                    {i.type === "WHITE_LABEL" ? (
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          i.paid ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#f4e8c9] text-[#8a6f1f]"
                        }`}
                      >
                        {i.paid ? `Paid ₦${(i.feeNgn ?? 0).toLocaleString()}` : "Unpaid"}
                      </span>
                    ) : (
                      <span className="text-[#16241a]/35 text-xs">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(i.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {selected && (
        <AdminDetailModal
          title={selected.businessName}
          subtitle={new Date(selected.createdAt).toLocaleString()}
          onClose={() => setSelected(null)}
        >
          <div className="flex flex-col">
            <DetailRow label="Type" value={TYPE_LABELS[selected.type]} />
            <DetailRow label="Contact Name" value={selected.contactName} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone || "N/A"} />
            <DetailRow label="Estimated Quantity" value={selected.estimatedQuantity || "N/A"} />
            <DetailRow label="Budget" value={selected.budget || "N/A"} />
            <DetailRow
              label="Deadline"
              value={selected.deadline ? new Date(selected.deadline).toLocaleDateString() : "N/A"}
            />
            {selected.type === "WHITE_LABEL" && (
              <DetailRow
                label="Consultation Fee"
                value={selected.paid ? `Paid ₦${(selected.feeNgn ?? 0).toLocaleString()}` : "Unpaid"}
              />
            )}
            <DetailRow label="Status" value={selected.status} />
            <DetailRow label="Message" value={selected.message || "N/A"} />
          </div>
        </AdminDetailModal>
      )}
    </div>
  );
}
