"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import {
  useListProductsQuery,
  useListCombosQuery,
  useCreateComboMutation,
  useUpdateComboMutation,
  useDeleteComboMutation,
  useListSalesQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useUploadImageMutation,
  type ComboRow,
  type SeasonalSaleRow,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const emptyCombo = {
  slug: "",
  name: "",
  description: "",
  coverImage: "" as string | null,
  price: 0,
  productSlugs: [] as string[],
  isActive: true,
};

const emptySale = {
  slug: "",
  name: "",
  discountPercent: 0,
  productSlugs: [] as string[],
  startDate: "",
  endDate: "",
  isActive: true,
  bannerHeadline: "",
  bannerCopy: "",
  bannerImage: "" as string | null,
};

function toDateInput(iso: string) {
  return iso ? iso.slice(0, 10) : "";
}

export default function AdminSalesPage() {
  const [tab, setTab] = useState<"combos" | "sales">("combos");

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Sales &amp; Combos</h1>
      <p className="text-sm text-[#16241a]/50 mb-6">
        Run seasonal sales (Black Friday, etc.) and product combos (e.g. &quot;Ambrosia combo&quot;).
      </p>
      <div className="flex items-center gap-1 bg-white/60 rounded-full p-1 w-fit mb-8">
        <button
          onClick={() => setTab("combos")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "combos" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Combos
        </button>
        <button
          onClick={() => setTab("sales")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "sales" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Seasonal Sales
        </button>
      </div>
      {tab === "combos" ? <CombosTab /> : <SalesTab />}
    </div>
  );
}

function CombosTab() {
  const { data: combos, isLoading } = useListCombosQuery();
  const { data: products } = useListProductsQuery();
  const [createCombo, { isLoading: creating }] = useCreateComboMutation();
  const [updateCombo, { isLoading: updating }] = useUpdateComboMutation();
  const [deleteCombo] = useDeleteComboMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const saving = creating || updating;

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCombo);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCombo);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (combo: ComboRow) => {
    setEditing(combo.slug);
    setForm({ ...combo, coverImage: combo.coverImage ?? "" });
    setError(null);
    setShowForm(true);
  };

  const toggleProduct = (slug: string) => {
    setForm((f) => ({
      ...f,
      productSlugs: f.productSlugs.includes(slug)
        ? f.productSlugs.filter((s) => s !== slug)
        : [...f.productSlugs, slug],
    }));
  };

  const handleUpload = async (file: File) => {
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await uploadImage(body).unwrap();
      setForm((f) => ({ ...f, coverImage: res.url }));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Image upload failed."));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.productSlugs.length < 2) {
      setError("Select at least 2 products for this combo.");
      return;
    }
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editing) {
        await updateCombo({ ...payload, slug: editing }).unwrap();
        toast.success("Combo updated");
      } else {
        await createCombo(payload).unwrap();
        toast.success("Combo created");
      }
      setShowForm(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete combo "${slug}"? This can't be undone.`)) return;
    try {
      await deleteCombo(slug).unwrap();
      toast.success("Combo deleted");
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
          New Combo
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !combos || combos.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No combos yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Combo</th>
                  <th className="p-4 font-medium">Products</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {combos.map((c) => (
                  <tr key={c.id} className="border-b border-[#16241a]/5 last:border-0">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-[#16241a]/60">{c.productSlugs.length} product(s)</td>
                    <td className="p-4 font-medium">₦{c.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          c.isActive ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#e5e5e5] text-[#666]"
                        }`}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openEdit(c)} className="text-[#16241a]/50 hover:text-[#16241a]">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(c.slug)} className="text-[#c0574c] hover:text-[#a84740]">
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
              <h2 className="text-lg font-medium">{editing ? "Edit Combo" : "New Combo"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#16241a]/40 hover:text-[#16241a]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="text-sm text-[#c0574c]">{error}</p>}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Combo Name
                </label>
                <input
                  required
                  placeholder='e.g. "Ambrosia combo"'
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={`${inputClass} resize-none`}
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Cover Image
                </label>
                {form.coverImage && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#d4e8d0] mb-2">
                    <Image src={form.coverImage} alt="" fill className="object-cover" />
                  </div>
                )}
                <label
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all active:scale-95 ${
                    uploading
                      ? "bg-white/40 border-white/60 text-[#16241a]/40 cursor-not-allowed"
                      : "bg-white/70 border-white/60 text-[#16241a] cursor-pointer hover:bg-white hover:border-[#8ab88e]"
                  }`}
                >
                  <Upload size={12} />
                  {uploading ? "Uploading…" : "Choose image"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Products in this combo (pick 2+)
                </label>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5 bg-white/50 rounded-xl p-3">
                  {(products ?? []).map((p) => (
                    <label key={p.slug} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.productSlugs.includes(p.slug)}
                        onChange={() => toggleProduct(p.slug)}
                      />
                      {p.name} — ₦{p.price.toLocaleString()}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active (visible &amp; purchasable on the storefront)
              </label>
              <button
                type="submit"
                disabled={saving}
                className="self-start bg-[#16241a] text-white text-sm font-semibold px-6 py-2.5 rounded-full disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Combo"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SalesTab() {
  const { data: sales, isLoading } = useListSalesQuery();
  const { data: products } = useListProductsQuery();
  const [createSale, { isLoading: creating }] = useCreateSaleMutation();
  const [updateSale, { isLoading: updating }] = useUpdateSaleMutation();
  const [deleteSale] = useDeleteSaleMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const saving = creating || updating;

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptySale);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptySale);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (sale: SeasonalSaleRow) => {
    setEditing(sale.slug);
    setForm({
      ...sale,
      bannerImage: sale.bannerImage ?? "",
      startDate: toDateInput(sale.startDate),
      endDate: toDateInput(sale.endDate),
    });
    setError(null);
    setShowForm(true);
  };

  const toggleProduct = (slug: string) => {
    setForm((f) => ({
      ...f,
      productSlugs: f.productSlugs.includes(slug)
        ? f.productSlugs.filter((s) => s !== slug)
        : [...f.productSlugs, slug],
    }));
  };

  const handleUpload = async (file: File) => {
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await uploadImage(body).unwrap();
      setForm((f) => ({ ...f, bannerImage: res.url }));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Image upload failed."));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = { ...form, discountPercent: Number(form.discountPercent) };
    try {
      if (editing) {
        await updateSale({ ...payload, slug: editing }).unwrap();
        toast.success("Sale updated");
      } else {
        await createSale(payload).unwrap();
        toast.success("Sale created");
      }
      setShowForm(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete sale "${slug}"? This can't be undone.`)) return;
    try {
      await deleteSale(slug).unwrap();
      toast.success("Sale deleted");
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
          New Sale
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !sales || sales.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No seasonal sales yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Sale</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Dates</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Landing page</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b border-[#16241a]/5 last:border-0">
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-[#16241a]/60">{s.discountPercent}% off</td>
                    <td className="p-4 text-[#16241a]/60">
                      {new Date(s.startDate).toLocaleDateString()} – {new Date(s.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          s.isActive ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#e5e5e5] text-[#666]"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-[#16241a]/60 font-mono text-xs">/sale/{s.slug}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 justify-end">
                        <button onClick={() => openEdit(s)} className="text-[#16241a]/50 hover:text-[#16241a]">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(s.slug)} className="text-[#c0574c] hover:text-[#a84740]">
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
              <h2 className="text-lg font-medium">{editing ? "Edit Sale" : "New Sale"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#16241a]/40 hover:text-[#16241a]">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <p className="text-sm text-[#c0574c]">{error}</p>}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Campaign Name
                </label>
                <input
                  required
                  placeholder='e.g. "Black Friday 2026"'
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
              <p className="text-[11px] text-[#16241a]/45 -mt-2">
                Landing page will be at /sale/{form.slug || "…"}
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Discount Percent
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercent || ""}
                  onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    End Date
                  </label>
                  <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Banner Headline
                </label>
                <input
                  required
                  value={form.bannerHeadline}
                  onChange={(e) => setForm((f) => ({ ...f, bannerHeadline: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Banner Copy
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.bannerCopy}
                  onChange={(e) => setForm((f) => ({ ...f, bannerCopy: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Banner Image
                </label>
                {form.bannerImage && (
                  <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#d4e8d0] mb-2">
                    <Image src={form.bannerImage} alt="" fill className="object-cover" />
                  </div>
                )}
                <label
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all active:scale-95 ${
                    uploading
                      ? "bg-white/40 border-white/60 text-[#16241a]/40 cursor-not-allowed"
                      : "bg-white/70 border-white/60 text-[#16241a] cursor-pointer hover:bg-white hover:border-[#8ab88e]"
                  }`}
                >
                  <Upload size={12} />
                  {uploading ? "Uploading…" : "Choose image"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Products on sale (empty = storewide discount)
                </label>
                <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 bg-white/50 rounded-xl p-3">
                  {(products ?? []).map((p) => (
                    <label key={p.slug} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.productSlugs.includes(p.slug)}
                        onChange={() => toggleProduct(p.slug)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
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
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Sale"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
