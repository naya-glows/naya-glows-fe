"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  useListConsultationsQuery,
  useRescheduleConsultationMutation,
  useCancelConsultationMutation,
  useListConsultationTypesAdminQuery,
  useUpdateConsultationTypeMutation,
  useListConsultationBlocksQuery,
  useCreateConsultationBlockMutation,
  useDeleteConsultationBlockMutation,
  type ConsultationRow,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";
import AdminDetailModal, { DetailRow } from "../_components/AdminDetailModal";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

export default function AdminConsultationsPage() {
  const { data: requests, isLoading } = useListConsultationsQuery();
  const [selected, setSelected] = useState<ConsultationRow | null>(null);
  const [reschedule, { isLoading: rescheduling }] = useRescheduleConsultationMutation();
  const [cancel, { isLoading: cancelling }] = useCancelConsultationMutation();
  const [newDateTime, setNewDateTime] = useState("");

  const handleReschedule = async (id: string) => {
    if (!newDateTime) {
      toast.error("Pick a new date and time first.");
      return;
    }
    try {
      await reschedule({ id, scheduledDate: new Date(newDateTime).toISOString() }).unwrap();
      toast.success("Rescheduled");
      setSelected(null);
      setNewDateTime("");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't reschedule."));
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this consultation?")) return;
    try {
      await cancel(id).unwrap();
      toast.success("Cancelled");
      setSelected(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't cancel."));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Consultations</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Bookings from the Online Consultation calendar. Click a row for full detail.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden mb-10">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !requests || requests.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">When</th>
                  <th className="p-4 font-medium">Payment</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="border-b border-[#16241a]/5 last:border-0 cursor-pointer hover:bg-white/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-[#16241a]/45">{r.email}{r.phone ? ` · ${r.phone}` : ""}</p>
                    </td>
                    <td className="p-4 text-[#16241a]/60">{r.consultationType?.name ?? "N/A"}</td>
                    <td className="p-4 text-[#16241a]/60">
                      {r.scheduledDate
                        ? new Date(r.scheduledDate).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          r.paid ? "bg-[#d4e8d0] text-[#4f7957]" : "bg-[#f4e8c9] text-[#8a6f1f]"
                        }`}
                      >
                        {r.paid ? `Paid ₦${r.feeNgn.toLocaleString()}` : "Unpaid"}
                      </span>
                    </td>
                    <td className="p-4 text-[#16241a]/60">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConsultationTypesSettings />
      <BlockedDates />

      {selected && (
        <AdminDetailModal
          title={selected.name}
          subtitle={new Date(selected.createdAt).toLocaleString()}
          onClose={() => {
            setSelected(null);
            setNewDateTime("");
          }}
        >
          <div className="flex flex-col">
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone || "N/A"} />
            <DetailRow label="Type" value={selected.consultationType?.name ?? "N/A"} />
            <DetailRow
              label="Scheduled"
              value={
                selected.scheduledDate
                  ? new Date(selected.scheduledDate).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
                  : "N/A"
              }
            />
            <DetailRow label="Booking Reference" value={selected.bookingReference || "N/A"} />
            <DetailRow label="Skin Concern" value={selected.skinConcern} />
            <DetailRow label="Payment" value={selected.paid ? `Paid ₦${selected.feeNgn.toLocaleString()}` : "Unpaid"} />
            <DetailRow label="Status" value={selected.status} />
            <DetailRow label="Message" value={selected.message || "N/A"} />
          </div>

          {selected.status !== "CANCELLED" && (
            <div className="mt-6 pt-5 border-t border-[#16241a]/8 flex flex-col gap-3">
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50">
                Reschedule
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  disabled={rescheduling}
                  onClick={() => handleReschedule(selected.id)}
                  className="flex-shrink-0 text-sm font-semibold bg-[#16241a] text-white px-4 py-2.5 rounded-full disabled:opacity-60"
                >
                  Save
                </button>
              </div>
              <button
                type="button"
                disabled={cancelling}
                onClick={() => handleCancel(selected.id)}
                className="self-start text-sm font-semibold text-[#c0574c] hover:text-[#a84740]"
              >
                Cancel this booking
              </button>
            </div>
          )}
        </AdminDetailModal>
      )}
    </div>
  );
}

function ConsultationTypesSettings() {
  const { data: types } = useListConsultationTypesAdminQuery();
  const [updateType] = useUpdateConsultationTypeMutation();

  const handleUpdate = async (slug: string, patch: { feeNgn?: number; durationMinutes?: number }) => {
    try {
      await updateType({ slug, ...patch }).unwrap();
      toast.success("Updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update."));
    }
  };

  if (!types || types.length === 0) return null;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-5 mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
        Consultation Types
      </h2>
      <div className="flex flex-col gap-3">
        {types.map((t) => (
          <div key={t.slug} className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium w-40">{t.name}</span>
            <label className="flex items-center gap-1.5 text-xs text-[#16241a]/50">
              Fee ₦
              <input
                type="number"
                defaultValue={t.feeNgn}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v !== t.feeNgn) handleUpdate(t.slug, { feeNgn: v });
                }}
                className="w-24 bg-white/70 border border-white/60 rounded-lg px-2 py-1"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-[#16241a]/50">
              Duration (min)
              <input
                type="number"
                defaultValue={t.durationMinutes}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v !== t.durationMinutes) handleUpdate(t.slug, { durationMinutes: v });
                }}
                className="w-20 bg-white/70 border border-white/60 rounded-lg px-2 py-1"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockedDates() {
  const { data: blocks } = useListConsultationBlocksQuery();
  const [createBlock, { isLoading: creating }] = useCreateConsultationBlockMutation();
  const [deleteBlock] = useDeleteConsultationBlockMutation();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!date) return;
    try {
      await createBlock({ date, reason: reason || undefined }).unwrap();
      setDate("");
      setReason("");
      toast.success("Date blocked");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't block this date."));
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
        Blocked Dates
      </h2>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4 flex-wrap">
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} w-auto`} />
        <input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${inputClass} flex-1 min-w-[160px]`}
        />
        <button
          type="submit"
          disabled={creating}
          className="text-sm font-semibold bg-[#16241a] text-white px-4 py-2.5 rounded-full disabled:opacity-60"
        >
          Block whole day
        </button>
      </form>
      <div className="flex flex-col gap-2">
        {(blocks ?? []).map((b) => (
          <div key={b.id} className="flex items-center justify-between text-sm bg-white/50 rounded-lg px-3 py-2">
            <span>
              {new Date(b.date).toLocaleDateString()}
              {b.startTime && b.endTime ? ` · ${b.startTime}–${b.endTime}` : " · Whole day"}
              {b.reason ? ` · ${b.reason}` : ""}
            </span>
            <button onClick={() => deleteBlock(b.id)} className="text-[#c0574c] hover:text-[#a84740]">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
