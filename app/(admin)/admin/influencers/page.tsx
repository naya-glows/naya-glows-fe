"use client";

import { useState } from "react";
import { useListInfluencersQuery, type AdminInfluencerRow } from "../../../store/adminApi";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

export default function AdminInfluencersPage() {
  const { data: influencers, isLoading } = useListInfluencersQuery();
  const [selected, setSelected] = useState<AdminInfluencerRow | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Influencers</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Everyone registered through the influencer program, and how many signups each has garnered. Click a row for full detail.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !influencers || influencers.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No influencers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Code Name</th>
                <th className="p-4 font-medium">Socials</th>
                <th className="p-4 font-medium">Codes</th>
                <th className="p-4 font-medium">Signups</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {influencers.map((inf) => (
                <tr
                  key={inf.id}
                  onClick={() => setSelected(inf)}
                  className="border-b border-[#16241a]/5 last:border-0 cursor-pointer hover:bg-white/50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium">{inf.name}</p>
                    <p className="text-xs text-[#16241a]/45">{inf.email}</p>
                  </td>
                  <td className="p-4 text-[#16241a]/60 font-mono">{inf.codeName}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {[
                      inf.twitterHandle && `X: ${inf.twitterHandle}`,
                      inf.instagramHandle && `IG: ${inf.instagramHandle}`,
                      inf.tiktokHandle && `TikTok: ${inf.tiktokHandle}`,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </td>
                  <td className="p-4 text-[#16241a]/60">{inf.codes.length}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-semibold uppercase px-2 py-1 rounded-full bg-[#d4e8d0] text-[#4f7957]">
                      {inf.totalSignups} signup(s)
                    </span>
                  </td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(inf.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <AdminDetailModal
          title={selected.name}
          subtitle={`Joined ${new Date(selected.createdAt).toLocaleDateString()}`}
          onClose={() => setSelected(null)}
        >
          <div className="flex flex-col">
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Code Name" value={selected.codeName} />
            <DetailRow label="X (Twitter)" value={selected.twitterHandle || "—"} />
            <DetailRow label="Instagram" value={selected.instagramHandle || "—"} />
            <DetailRow label="TikTok" value={selected.tiktokHandle || "—"} />
            <DetailRow label="Bio" value={selected.bio || "—"} />
            <DetailRow label="Total Signups" value={selected.totalSignups} />
            <DetailRow
              label="Referral Codes"
              value={
                selected.codes.length === 0 ? (
                  "No codes generated yet"
                ) : (
                  <div className="flex flex-col gap-1 text-right">
                    {selected.codes.map((c) => (
                      <span key={c.code} className="font-mono">
                        {c.code} — {c.signupCount} signup(s)
                      </span>
                    ))}
                  </div>
                )
              }
            />
          </div>
        </AdminDetailModal>
      )}
    </div>
  );
}
