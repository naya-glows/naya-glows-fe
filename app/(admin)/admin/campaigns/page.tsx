"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, Download } from "lucide-react";
import Image from "next/image";
import {
  useListCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useListLeadsQuery,
  useLazyExportLeadsCsvQuery,
  useUploadImageMutation,
  type CampaignRow,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

const emptyCampaign = {
  name: "",
  isActive: false,
  startDate: "",
  endDate: "",
  popupHeadline: "",
  popupCopy: "",
  popupImage: "" as string | null,
  ctaText: "Spin to Win",
  landingPath: "/catalog",
  rewardValueNgn: 1000,
  codeValidDays: 14,
  redemptionRules: "" as string | null,
  termsText: "" as string | null,
  socialLinks: [] as { platform: string; url: string }[],
  popupFrequencyDays: 7,
  consentText: "",
};

function toDateInput(iso: string) {
  return iso ? iso.slice(0, 10) : "";
}

export default function AdminCampaignsPage() {
  const [tab, setTab] = useState<"campaigns" | "leads">("campaigns");

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Campaigns &amp; Leads</h1>
      <p className="text-sm text-[#16241a]/50 mb-6">
        Manage the spin-to-win popup and review leads it's captured.
      </p>
      <div className="flex items-center gap-1 bg-white/60 rounded-full p-1 w-fit mb-8">
        <button
          onClick={() => setTab("campaigns")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "campaigns" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setTab("leads")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            tab === "leads" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
          }`}
        >
          Leads
        </button>
      </div>
      {tab === "campaigns" ? <CampaignsTab /> : <LeadsTab />}
    </div>
  );
}

function CampaignsTab() {
  const { data: campaigns, isLoading } = useListCampaignsQuery();
  const [createCampaign, { isLoading: creating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: updating }] = useUpdateCampaignMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const saving = creating || updating;

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCampaign);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCampaign);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (c: CampaignRow) => {
    setEditing(c.id);
    setForm({
      ...c,
      startDate: toDateInput(c.startDate),
      endDate: toDateInput(c.endDate),
      popupImage: c.popupImage ?? "",
      redemptionRules: c.redemptionRules ?? "",
      termsText: c.termsText ?? "",
    });
    setError(null);
    setShowForm(true);
  };

  const handleUpload = async (file: File) => {
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await uploadImage(body).unwrap();
      setForm((f) => ({ ...f, popupImage: res.url }));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Image upload failed."));
    }
  };

  const addSocialLink = () => {
    setForm((f) => ({ ...f, socialLinks: [...f.socialLinks, { platform: "", url: "" }] }));
  };
  const updateSocialLink = (i: number, patch: Partial<{ platform: string; url: string }>) => {
    setForm((f) => ({
      ...f,
      socialLinks: f.socialLinks.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  };
  const removeSocialLink = (i: number) => {
    setForm((f) => ({ ...f, socialLinks: f.socialLinks.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      rewardValueNgn: Number(form.rewardValueNgn),
      codeValidDays: Number(form.codeValidDays),
      popupFrequencyDays: Number(form.popupFrequencyDays),
      socialLinks: form.socialLinks.filter((s) => s.platform && s.url),
    };
    try {
      if (editing) {
        await updateCampaign({ ...payload, id: editing }).unwrap();
        toast.success("Campaign updated");
      } else {
        await createCampaign(payload).unwrap();
        toast.success("Campaign created");
      }
      setShowForm(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign? This can't be undone.")) return;
    try {
      await deleteCampaign(id).unwrap();
      toast.success("Campaign deleted");
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
          New Campaign
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !campaigns || campaigns.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No campaigns yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Window</th>
                  <th className="p-4 font-medium">Reward</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-b border-[#16241a]/5 last:border-0">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-[#16241a]/60">
                      {new Date(c.startDate).toLocaleDateString()} – {new Date(c.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">₦{c.rewardValueNgn.toLocaleString()}</td>
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
                        <button onClick={() => handleDelete(c.id)} className="text-[#c0574c] hover:text-[#a84740]">
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
              <h2 className="text-lg font-medium">{editing ? "Edit Campaign" : "New Campaign"}</h2>
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
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
                  Popup Headline
                </label>
                <input
                  required
                  value={form.popupHeadline}
                  onChange={(e) => setForm((f) => ({ ...f, popupHeadline: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Popup Copy
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.popupCopy}
                  onChange={(e) => setForm((f) => ({ ...f, popupCopy: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Popup Image
                </label>
                {form.popupImage && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#d4e8d0] mb-2">
                    <Image src={form.popupImage} alt="" fill className="object-cover" />
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    CTA Text
                  </label>
                  <input
                    required
                    value={form.ctaText}
                    onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Landing Path
                  </label>
                  <input
                    required
                    placeholder="/sale/black-friday"
                    value={form.landingPath}
                    onChange={(e) => setForm((f) => ({ ...f, landingPath: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Reward (₦)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.rewardValueNgn || ""}
                    onChange={(e) => setForm((f) => ({ ...f, rewardValueNgn: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Code Valid (days)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.codeValidDays || ""}
                    onChange={(e) => setForm((f) => ({ ...f, codeValidDays: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                    Popup Frequency (days)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.popupFrequencyDays || ""}
                    onChange={(e) => setForm((f) => ({ ...f, popupFrequencyDays: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Redemption Rules
                </label>
                <textarea
                  rows={2}
                  value={form.redemptionRules ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, redemptionRules: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Campaign Terms
                </label>
                <textarea
                  rows={2}
                  value={form.termsText ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, termsText: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Consent Text
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.consentText}
                  onChange={(e) => setForm((f) => ({ ...f, consentText: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-1.5">
                  Social Links
                </label>
                <div className="flex flex-col gap-2">
                  {form.socialLinks.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        placeholder="Platform"
                        value={s.platform}
                        onChange={(e) => updateSocialLink(i, { platform: e.target.value })}
                        className={`${inputClass} w-28`}
                      />
                      <input
                        placeholder="URL"
                        value={s.url}
                        onChange={(e) => updateSocialLink(i, { url: e.target.value })}
                        className={`${inputClass} flex-1`}
                      />
                      <button type="button" onClick={() => removeSocialLink(i)} className="text-[#c0574c]">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="self-start text-xs font-semibold text-[#4f7957] hover:text-[#3d5f43]"
                  >
                    + Add social link
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="campaign-active"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="campaign-active" className="text-sm">
                  Active (only one campaign should be active at a time)
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3 rounded-full disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Campaign"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadsTab() {
  const { data: leads, isLoading } = useListLeadsQuery();
  const [exportCsv, { isFetching: exporting }] = useLazyExportLeadsCsvQuery();

  const handleExport = async () => {
    try {
      const csv = await exportCsv().unwrap();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Export failed."));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-[#16241a] text-white text-sm font-semibold px-5 py-2.5 rounded-full disabled:opacity-60"
        >
          <Download size={15} />
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !leads || leads.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium">Reward Code</th>
                  <th className="p-4 font-medium">Redeemed</th>
                  <th className="p-4 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-[#16241a]/5 last:border-0">
                    <td className="p-4">
                      <p className="font-medium">{l.fullName}</p>
                      <p className="text-xs text-[#16241a]/45">
                        {l.phone}
                        {l.email ? ` · ${l.email}` : ""}
                      </p>
                    </td>
                    <td className="p-4 text-[#16241a]/60">{l.campaign.name}</td>
                    <td className="p-4 font-mono text-xs">{l.rewardCode}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          l.rewardRedeemed ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#f4e8c9] text-[#8a6f1f]"
                        }`}
                      >
                        {l.rewardRedeemed ? "Redeemed" : "Unused"}
                      </span>
                    </td>
                    <td className="p-4 text-[#16241a]/60">{new Date(l.createdAt).toLocaleDateString()}</td>
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
