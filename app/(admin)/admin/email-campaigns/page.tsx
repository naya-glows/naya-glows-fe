"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Send, Upload, X } from "lucide-react";
import {
  useListEmailCampaignsQuery,
  useListNewsletterSubscribersQuery,
  useListUsersQuery,
  useSendEmailCampaignMutation,
  useUploadImageMutation,
} from "../../../store/adminApi";
import { getApiErrorMessage } from "../../../store/apiError";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

type Audience = "subscribers" | "allUsers";

const audienceLabels: Record<Audience, string> = {
  subscribers: "Subscribers",
  allUsers: "All Users",
};

export default function AdminEmailCampaignsPage() {
  const { data: campaigns, isLoading } = useListEmailCampaignsQuery();
  const { data: subscribers } = useListNewsletterSubscribersQuery();
  const { data: users } = useListUsersQuery();
  const [sendCampaign, { isLoading: sending }] = useSendEmailCampaignMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [audience, setAudience] = useState<Audience>("subscribers");

  const recipientCounts: Record<Audience, number> = {
    subscribers: subscribers?.length ?? 0,
    allUsers: users?.length ?? 0,
  };
  const recipientCount = recipientCounts[audience];

  const handleUpload = async (file: File) => {
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await uploadImage(body).unwrap();
      setImageUrls((urls) => [...urls, res.url]);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Image upload failed."));
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((urls) => urls.filter((u) => u !== url));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { sentCount, failedCount } = await sendCampaign({
        subject,
        message,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        audience,
      }).unwrap();
      const audienceLabel = audienceLabels[audience].toLowerCase();
      if (failedCount === 0) {
        toast.success(`Campaign sent to ${sentCount} ${audienceLabel}.`);
      } else if (sentCount === 0) {
        toast.error(
          `Campaign failed to send to all ${failedCount} ${audienceLabel} — check the email provider configuration.`,
        );
      } else {
        toast.error(
          `Sent to ${sentCount} ${audienceLabel}, but failed for ${failedCount} — check server logs.`,
        );
      }
      setSubject("");
      setMessage("");
      setImageUrls([]);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't send the campaign."));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Email Campaigns</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        Compose a message and send it to every newsletter subscriber, or every registered user.
      </p>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 mb-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
              Send To
            </label>
            <div className="flex items-center gap-1 bg-white/70 rounded-full p-1 w-fit">
              {(Object.keys(audienceLabels) as Audience[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAudience(key)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                    audience === key ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
                  }`}
                >
                  {audienceLabels[key]} ({recipientCounts[key]})
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
              Subject
            </label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's new at Naya Glows"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
              Message
            </label>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your update — it'll be wrapped in our email template automatically."
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#16241a]/50 mb-2">
              <Upload size={12} />
              Images (optional, shown above the message)
            </label>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {imageUrls.map((url) => (
                  <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#d4e8d0]">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      aria-label="Remove image"
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
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
          <button
            type="submit"
            disabled={sending || uploading || recipientCount === 0}
            className="self-start flex items-center gap-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
          >
            <Send size={14} />
            {sending
              ? "Sending…"
              : recipientCount === 0
                ? `No ${audienceLabels[audience].toLowerCase()} yet`
                : `Send to ${recipientCount} ${audienceLabels[audience].toLowerCase()}`}
          </button>
        </form>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50 mb-4">
        Past Campaigns
      </h2>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-[#16241a]/50">Loading…</p>
        ) : !campaigns || campaigns.length === 0 ? (
          <p className="p-6 text-sm text-[#16241a]/50">No campaigns sent yet.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[#16241a]/45 border-b border-[#16241a]/10">
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Sent To</th>
                <th className="p-4 font-medium">Recipients</th>
                <th className="p-4 font-medium">Sent</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-[#16241a]/5 last:border-0">
                  <td className="p-4 font-medium">{c.subject}</td>
                  <td className="p-4 text-[#16241a]/60">{audienceLabels[c.audience] ?? c.audience}</td>
                  <td className="p-4 text-[#16241a]/60">{c.recipientCount}</td>
                  <td className="p-4 text-[#16241a]/60">
                    {new Date(c.createdAt).toLocaleString()}
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
