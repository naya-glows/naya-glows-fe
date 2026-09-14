"use client";

import { useState } from "react";
import { useListConsultationsQuery, type ConsultationRow } from "../../../store/adminApi";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

export default function AdminConsultationsPage() {
  const { data: requests, isLoading } = useListConsultationsQuery();
  const [selected, setSelected] = useState<ConsultationRow | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Consultations</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Requests submitted through the Online Consultation page. Click a row for full detail.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !requests || requests.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Skin Concern</th>
                <th className="p-4 font-medium">Preferred Date</th>
                <th className="p-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="border-b border-[#16241a]/5 last:border-0 cursor-pointer hover:bg-white/50 transition-colors"
                >
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {r.email}
                    {r.phone ? ` · ${r.phone}` : ""}
                  </td>
                  <td className="p-4 text-[#16241a]/60">{r.skinConcern}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {r.preferredDate ? new Date(r.preferredDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(r.createdAt).toLocaleDateString()}
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
          title={selected.name}
          subtitle={new Date(selected.createdAt).toLocaleString()}
          onClose={() => setSelected(null)}
        >
          <div className="flex flex-col">
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone || "—"} />
            <DetailRow label="Skin Concern" value={selected.skinConcern} />
            <DetailRow
              label="Preferred Date"
              value={
                selected.preferredDate ? new Date(selected.preferredDate).toLocaleDateString() : "—"
              }
            />
            <DetailRow label="Status" value={selected.status} />
            <DetailRow label="Message" value={selected.message || "—"} />
          </div>
        </AdminDetailModal>
      )}
    </div>
  );
}
