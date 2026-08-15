"use client";

import { useListUsersQuery } from "../../../store/adminApi";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useListUsersQuery();

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Users</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Everyone who has created a Naya Glows account.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !users || users.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Country</th>
                <th className="p-4 font-medium">Currency</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4 font-medium">{u.firstName} {u.lastName}</td>
                  <td className="p-4 text-[#16241a]/60">{u.email}</td>
                  <td className="p-4 text-[#16241a]/60">{u.country ?? "—"}</td>
                  <td className="p-4 text-[#16241a]/60">{u.currency}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-[#16241a] text-white"
                          : "bg-[#d4e8d0] text-[#4f7957]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(u.createdAt).toLocaleDateString()}
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
