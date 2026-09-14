"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Wallet, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import {
  useGetBudgetSummaryQuery,
  useListBudgetEntriesQuery,
  useCreateBudgetEntryMutation,
  useDeleteBudgetEntryMutation,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

function StatTile({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "default" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive" ? "text-[#4f7957]" : tone === "negative" ? "text-[#c0574c]" : "text-[#16241a]";
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-5">
      <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-xs text-[#16241a]/50 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default function AdminBudgetPage() {
  const { data: summary, isLoading: summaryLoading } = useGetBudgetSummaryQuery();
  const { data: entries, isLoading: entriesLoading } = useListBudgetEntriesQuery();
  const [createEntry, { isLoading: creating }] = useCreateBudgetEntryMutation();
  const [deleteEntry, { isLoading: deleting, originalArgs: deletingId }] =
    useDeleteBudgetEntryMutation();

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [note, setNote] = useState("");

  const formatNaira = (n: number) => `₦${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createEntry({
        label,
        amount: Number(amount),
        type,
        note: note || undefined,
      }).unwrap();
      setLabel("");
      setAmount("");
      setNote("");
      toast.success("Entry added");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't add that entry."));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id).unwrap();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't remove that entry."));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Budget Tracker</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Revenue from paid orders, plus any manual income or expense lines you add below.
      </p>

      {summaryLoading || !summary ? (
        <p className="text-sm text-[#16241a]/50 mb-8">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatTile
            label={`Order Revenue (${summary.paidOrderCount} paid)`}
            value={formatNaira(summary.orderRevenue)}
            icon={<Wallet size={16} className="text-[#6a9a72]" />}
          />
          <StatTile
            label="Manual Income"
            value={formatNaira(summary.manualIncome)}
            icon={<TrendingUp size={16} className="text-[#4f7957]" />}
            tone="positive"
          />
          <StatTile
            label="Manual Expenses"
            value={formatNaira(summary.manualExpense)}
            icon={<TrendingDown size={16} className="text-[#c0574c]" />}
            tone="negative"
          />
          <StatTile
            label="Net"
            value={formatNaira(summary.net)}
            icon={<Wallet size={16} className="text-[#16241a]" />}
            tone={summary.net >= 0 ? "positive" : "negative"}
          />
        </div>
      )}

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-6 sm:p-6 mb-8 max-w-xl">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
          Add Manual Entry
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-1 bg-white/70 rounded-full p-1 w-fit">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                type === "income" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                type === "expense" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
              }`}
            >
              Expense
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Label (e.g. Packaging supplies)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={inputClass}
            />
            <input
              required
              type="number"
              step="0.01"
              min="0"
              placeholder="Amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={creating}
            className="self-start bg-[#16241a] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
          >
            {creating ? "Adding…" : "Add Entry"}
          </button>
        </form>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
        Manual Entries
      </h2>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {entriesLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !entries || entries.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No manual entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Label</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Note</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4 font-medium">{entry.label}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                        entry.type === "income"
                          ? "bg-[#d4e8d0] text-[#4f7957]"
                          : "bg-[#f5d9d5] text-[#c0574c]"
                      }`}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-4 text-[#16241a]/60">{formatNaira(entry.amount)}</td>
                  <td className="p-4 text-[#16241a]/60 max-w-xs truncate">{entry.note || "—"}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting && deletingId === entry.id}
                      aria-label="Delete entry"
                      className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={12} />
                    </button>
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
