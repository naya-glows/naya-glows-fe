"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  useListTreatmentKitsQuery,
  useCreateTreatmentKitMutation,
  useUpdateTreatmentKitMutation,
  useDeleteTreatmentKitMutation,
  useListKitEnrollmentsQuery,
  type TreatmentKitRow,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const emptyKit = {
  slug: "",
  name: "",
  durationMonths: 1,
  price: 0,
  benefits: "" as string, // newline-separated in the form, joined/split to/from benefits[] on submit
  isActive: true,
  sortOrder: 0,
};

export default function AdminKitsPage() {
  const [tab, setTab] = useState<"kits" | "enrollments">("kits");

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Treatment Kits</h1>
      <p className="text-sm text-[#16241a]/50 mb-6">
        Curated multi-month skincare programmes (Bronze/Silver/Gold/Premium) and who's currently enrolled.
      </p>
      <div className="flex items-center gap-1 bg-white/60 rounded-full p-1 w-fit mb-8">
        <button
          onClick={() => setTab("kits")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "kits" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Kits
        </button>
        <button
          onClick={() => setTab("enrollments")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "enrollments" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Enrollments
        </button>
      </div>
      {tab === "kits" ? <KitsTab /> : <EnrollmentsTab />}
    </div>
  );
}

function KitsTab() {
  const { data: kits, isLoading } = useListTreatmentKitsQuery();
  const [createKit, { isLoading: creating }] = useCreateTreatmentKitMutation();
  const [updateKit, { isLoading: updating }] = useUpdateTreatmentKitMutation();
  const [deleteKit] = useDeleteTreatmentKitMutation();
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

  const openEdit = (kit: TreatmentKitRow) => {
    setEditing(kit.slug);
    setForm({ ...kit, benefits: kit.benefits.join("\n") });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const benefits = form.benefits
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
    if (benefits.length === 0) {
      setError("Add at least one benefit.");
      return;
    }
    const payload = {
      ...form,
      benefits,
      durationMonths: Number(form.durationMonths),
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
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
          <p className="p-6 text-sm text-[#16241a]/50">No kits yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Kit</th>
                  <th className="p-4 font-medium">Duration</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {kits.map((k) => (
                  <tr key={k.id} className="border-b border-[#16241a]/5 last:border-0">
                    <td className="p-4 font-medium">{k.name}</td>
                    <td className="p-4 text-[#16241a]/60">{k.durationMonths} month(s)</td>
                    <td className="p-4 font-medium">₦{k.price.toLocaleString()}</td>
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
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium">{editing ? "Edit Kit" : "New Kit"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#16241a]/40 hover:text-[#16241a]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="text-sm text-[#c0574c]">{error}</p>}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Kit Name
                </label>
                <input
                  required
                  placeholder='e.g. "Premium"'
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: editing
                        ? f.slug
                        : name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                    }));
                  }}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Duration (months)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.durationMonths || ""}
                    onChange={(e) => setForm((f) => ({ ...f, durationMonths: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Price (₦)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.price || ""}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Benefits (one per line)
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={"12 Months of Skincare Supply: ...\n3 Months of Complimentary Spa Experiences: ..."}
                  value={form.benefits}
                  onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="kit-active"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="kit-active" className="text-sm">
                  Active (visible on /kits)
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3 rounded-full disabled:opacity-60"
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

function EnrollmentsTab() {
  const { data: enrollments, isLoading } = useListKitEnrollmentsQuery();

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
      {isLoading ? (
        <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
      ) : !enrollments || enrollments.length === 0 ? (
        <p className="p-6 text-sm text-[#16241a]/50">No enrollments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Kit</th>
                <th className="p-4 font-medium">Window</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{e.user.firstName} {e.user.lastName}</p>
                    <p className="text-xs text-[#16241a]/45">{e.user.email}</p>
                  </td>
                  <td className="p-4 text-[#16241a]/60">{e.kit.name}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(e.startDate).toLocaleDateString()} – {new Date(e.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                        e.status === "ACTIVE" ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#e5e5e5] text-[#666]"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
