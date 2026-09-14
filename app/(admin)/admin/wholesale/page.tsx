"use client";

import { useState } from "react";
import { useListWholesaleInquiriesQuery, type WholesaleInquiryRow } from "../../../store/adminApi";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

export default function AdminWholesalePage() {
  const { data: inquiries, isLoading } = useListWholesaleInquiriesQuery();
  const [selected, setSelected] = useState<WholesaleInquiryRow | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Wholesale Inquiries</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Businesses interested in stocking Naya Glows. Click a row for full detail.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !inquiries || inquiries.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Business</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((i) => (
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
                  <td className="p-4 text-[#16241a]/60 max-w-xs truncate">{i.message || "—"}</td>
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
            <DetailRow label="Contact Name" value={selected.contactName} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone || "—"} />
            <DetailRow label="Status" value={selected.status} />
            <DetailRow label="Message" value={selected.message || "—"} />
          </div>
        </AdminDetailModal>
      )}
    </div>
  );
}
