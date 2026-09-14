"use client";

import { useListNewsletterSubscribersQuery } from "../../../store/adminApi";

export default function AdminNewsletterPage() {
  const { data: subscribers, isLoading } = useListNewsletterSubscribersQuery();

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Newsletter Subscribers</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Everyone who signed up via the footer&apos;s &quot;Join the glow&quot; box.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !subscribers || subscribers.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4 font-medium">{s.email}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
