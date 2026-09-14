"use client";

import { useState } from "react";
import { useListContactMessagesQuery, type ContactMessageRow } from "../../../store/adminApi";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

export default function AdminContactMessagesPage() {
  const { data: messages, isLoading } = useListContactMessagesQuery();
  const [selected, setSelected] = useState<ContactMessageRow | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Contact Messages</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Submissions from the Contact page. Click a row for full detail.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !messages || messages.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No messages yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="border-b border-[#16241a]/5 last:border-0 cursor-pointer hover:bg-white/50 transition-colors"
                >
                  <td className="p-4 font-medium">{m.name}</td>
                  <td className="p-4 text-[#16241a]/60">{m.email}</td>
                  <td className="p-4 text-[#16241a]/60 max-w-[160px] truncate">{m.subject || "—"}</td>
                  <td className="p-4 text-[#16241a]/60 max-w-xs truncate">{m.message}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(m.createdAt).toLocaleDateString()}
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
            <DetailRow label="Subject" value={selected.subject || "—"} />
            <DetailRow label="Message" value={selected.message} />
          </div>
        </AdminDetailModal>
      )}
    </div>
  );
}
