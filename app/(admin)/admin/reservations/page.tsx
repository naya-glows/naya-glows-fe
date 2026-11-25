"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  useListKitReservationsQuery,
  useListReservationKitsQuery,
  useCreateReservationKitMutation,
  useUpdateReservationKitMutation,
  useDeleteReservationKitMutation,
  type ReservationKitRow,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const emptyKit = {
  slug: "",
  name: "",
  totalPrice: 0,
  depositAmount: 5000,
  publicPrice: null as number | null,
  isActive: true,
  sortOrder: 0,
};

export default function AdminReservationsPage() {
  const [tab, setTab] = useState<"reservations" | "kits">("reservations");

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Black Friday Reservations</h1>
      <p className="text-sm text-[#16241a]/50 mb-6">
        Deposit-now, balance-on-Black-Friday kit reservations.
      </p>
      <div className="flex items-center gap-1 bg-white/60 rounded-full p-1 w-fit mb-8">
        <button
          onClick={() => setTab("reservations")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "reservations" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Reservations
        </button>
        <button
          onClick={() => setTab("kits")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "kits" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Kits
        </button>
      </div>
      {tab === "reservations" ? <ReservationsTab /> : <KitsTab />}
    </div>
  );
}

function ReservationsTab() {
  const { data: reservations, isLoading } = useListKitReservationsQuery();

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
      {isLoading ? (
        <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
      ) : !reservations || reservations.length === 0 ? (
        <p className="p-6 text-sm text-[#16241a]/50">No reservations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Kit</th>
                <th className="p-4 font-medium">Deposit</th>
                <th className="p-4 font-medium">Balance</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Reserved</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{r.fullName}</p>
                    <p className="text-xs text-[#16241a]/45">{r.email} · {r.phone}</p>
                  </td>
                  <td className="p-4 text-[#16241a]/60">{r.kit.name}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                        r.depositPaid ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#f4e8c9] text-[#8a6f1f]"
                      }`}
                    >
                      {r.depositPaid ? `Paid ₦${r.depositAmount.toLocaleString()}` : "Unpaid"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                        r.balancePaid ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#e5e5e5] text-[#666]"
                      }`}
                    >
                      {r.balancePaid ? `Paid ₦${r.balanceAmount.toLocaleString()}` : `Owing ₦${r.balanceAmount.toLocaleString()}`}
                    </span>
                  </td>
                  <td className="p-4 text-[#16241a]/60">{r.status}</td>
                  <td className="p-4 text-[#16241a]/60">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KitsTab() {
  const { data: kits, isLoading } = useListReservationKitsQuery();
  const [createKit, { isLoading: creating }] = useCreateReservationKitMutation();
  const [updateKit, { isLoading: updating }] = useUpdateReservationKitMutation();
  const [deleteKit] = useDeleteReservationKitMutation();
  const saving = creating || updating;

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyKit);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyKit);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (kit: ReservationKitRow) => {
    setEditing(kit.slug);
    setForm({ ...kit });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      totalPrice: Number(form.totalPrice),
      depositAmount: Number(form.depositAmount),
      publicPrice: form.publicPrice ? Number(form.publicPrice) : null,
    };
    try {
      if (editing) {
        await updateKit({ ...payload, slug: editing }).unwrap();
        toast.success("Kit updated");
      } else {
        await createKit(payload).unwrap();
        toast.success("Kit created");
      }
      setShowForm(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete kit "${slug}"? This can't be undone.`)) return;
    try {
      await deleteKit(slug).unwrap();
      toast.success("Kit deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Delete failed."));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#16241a] text-white text-sm font-semibold px-5 py-2.5 rounded-full"
        >
          <Plus size={15} />
          New Kit
        </button>
      </div>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !kits || kits.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No reservation kits yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Kit</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Deposit</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {kits.map((k) => (
                  <tr key={k.id} className="border-b border-[#16241a]/5 last:border-0">
                    <td className="p-4 font-medium">{k.name}</td>
                    <td className="p-4">₦{k.totalPrice.toLocaleString()}</td>
                    <td className="p-4 text-[#16241a]/60">₦{k.depositAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          k.isActive ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#e5e5e5] text-[#666]"
                        }`}
                      >
                        {k.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openEdit(k)} className="text-[#16241a]/50 hover:text-[#16241a]">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(k.slug)} className="text-[#c0574c] hover:text-[#a84740]">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium">{editing ? "Edit Kit" : "New Kit"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#16241a]/40 hover:text-[#16241a]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="text-sm text-[#c0574c]">{error}</p>}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: editing ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    }));
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">Total Price (₦)</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.totalPrice || ""}
                  onChange={(e) => setForm((f) => ({ ...f, totalPrice: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">Deposit Amount (₦)</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.depositAmount || ""}
                  onChange={(e) => setForm((f) => ({ ...f, depositAmount: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Public Price (₦, optional — shown struck through if higher)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.publicPrice || ""}
                  onChange={(e) => setForm((f) => ({ ...f, publicPrice: e.target.value ? Number(e.target.value) : null }))}
                  className={inputClass}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active
              </label>
              <button
                type="submit"
                disabled={saving}
                className="self-start bg-[#16241a] text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Kit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
