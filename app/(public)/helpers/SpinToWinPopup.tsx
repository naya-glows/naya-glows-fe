"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Check } from "lucide-react";
import { useGetActiveCampaignQuery, useSubmitLeadMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";
import MissingDetailsPlaceholder from "./MissingDetailsPlaceholder";

type Stage = "closed" | "intro" | "spinning" | "result" | "form" | "confirmation";

function storageKey(campaignId: string, suffix: string) {
  return `naya-spin-${campaignId}-${suffix}`;
}

export default function SpinToWinPopup() {
  const { data } = useGetActiveCampaignQuery(undefined, { skip: !isApiConfigured() });
  const campaign = data?.campaign;
  const [stage, setStage] = useState<Stage>("closed");
  const [submitLead, { isLoading: submitting }] = useSubmitLeadMutation();
  const [reward, setReward] = useState<{ code: string; expiresAt: string } | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    socialHandle: "",
    consentGiven: false,
  });

  useEffect(() => {
    if (!campaign) return;
    try {
      // Only a completed claim permanently retires the popup — closing it
      // with the X (or just not finishing) is not a opt-out and must not
      // suppress it on the next visit; it should keep reappearing until
      // the visitor actually claims a reward.
      if (localStorage.getItem(storageKey(campaign.id, "completed")) === "true") return;
    } catch {
      // localStorage unavailable (private window, blocked site data) — fall
      // through and show the popup anyway.
    }
    const timer = setTimeout(() => setStage("intro"), 1200);
    return () => clearTimeout(timer);
  }, [campaign]);

  const dismiss = () => {
    setStage("closed");
  };

  const handleSpin = () => {
    setStage("spinning");
    setTimeout(() => setStage("result"), 2200);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    try {
      const { lead } = await submitLead({ campaignId: campaign.id, ...form }).unwrap();
      setReward({ code: lead.rewardCode, expiresAt: lead.rewardExpiresAt });
      try {
        localStorage.setItem(storageKey(campaign.id, "completed"), "true");
      } catch {
        // Best-effort only.
      }
      setStage("confirmation");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't save your details. Please try again."));
    }
  };

  if (stage === "closed" || !campaign) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden relative">
        {stage !== "spinning" && (
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        {stage === "intro" && (
          <div>
            {campaign.popupImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={campaign.popupImage} alt="" className="w-full h-36 object-cover" />
            ) : (
              <MissingDetailsPlaceholder className="w-full h-36" />
            )}
            <div className="p-6 text-center">
              <h2 className="text-xl font-light mb-2 text-[#16241a]">{campaign.popupHeadline}</h2>
              <p className="text-sm text-[#16241a]/60 mb-6 leading-relaxed">{campaign.popupCopy}</p>
              <button
                onClick={handleSpin}
                className="w-full bg-[#16241a] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#233324] transition-colors"
              >
                {campaign.ctaText}
              </button>
            </div>
          </div>
        )}

        {stage === "spinning" && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-[#d4e8d0] border-t-[#4f7957] animate-spin" />
            <p className="text-sm text-[#16241a]/60">Spinning…</p>
          </div>
        )}

        {stage === "result" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d4e8d0] flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🎉</span>
            </div>
            <h2 className="text-2xl font-light mb-2 text-[#16241a]">You won ₦{campaign.rewardValueNgn.toLocaleString()} off!</h2>
            <p className="text-sm text-[#16241a]/60 mb-6">
              Fill in your details below to claim your reward.
            </p>
            <button
              onClick={() => setStage("form")}
              className="w-full bg-[#16241a] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#233324] transition-colors"
            >
              Claim My Reward
            </button>
          </div>
        )}

        {stage === "form" && (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-1 text-[#16241a]">Claim Your ₦{campaign.rewardValueNgn.toLocaleString()} Off</h2>
            <input
              required
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="w-full bg-[#f4faf3] border border-[#16241a]/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e]"
            />
            <input
              required
              type="tel"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full bg-[#f4faf3] border border-[#16241a]/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e]"
            />
            <input
              required
              placeholder="Delivery address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full bg-[#f4faf3] border border-[#16241a]/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e]"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-[#f4faf3] border border-[#16241a]/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e]"
            />
            <input
              placeholder="Social media handle (optional)"
              value={form.socialHandle}
              onChange={(e) => setForm((f) => ({ ...f, socialHandle: e.target.value }))}
              className="w-full bg-[#f4faf3] border border-[#16241a]/10 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#8ab88e]"
            />
            <label className="flex items-start gap-2 text-xs text-[#16241a]/55 mt-1">
              <input
                required
                type="checkbox"
                checked={form.consentGiven}
                onChange={(e) => setForm((f) => ({ ...f, consentGiven: e.target.checked }))}
                className="mt-0.5"
              />
              {campaign.consentText}
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#16241a] text-white text-sm font-semibold py-3 rounded-full disabled:opacity-60 mt-1 hover:bg-[#233324] transition-colors"
            >
              {submitting ? "Submitting…" : "Get My Reward Code"}
            </button>
          </form>
        )}

        {stage === "confirmation" && reward && (
          <div className="p-7 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d4e8d0] flex items-center justify-center mx-auto mb-5">
              <Check size={26} className="text-[#4f7957]" />
            </div>
            <h2 className="text-xl font-light mb-2 text-[#16241a]">Your reward code</h2>
            <p className="text-2xl font-bold tracking-wide bg-[#f4faf3] text-[#16241a] rounded-xl py-3 mb-2">{reward.code}</p>
            <p className="text-xs text-[#16241a]/45 mb-5">
              Valid until {new Date(reward.expiresAt).toLocaleDateString()} — enter it at checkout.
            </p>
            <p className="text-sm text-[#16241a]/60 mb-3">Follow us so you don't miss the next one:</p>
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              {campaign.socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold bg-[#d4e8d0] text-[#4f7957] px-3.5 py-2 rounded-full hover:bg-[#c3ddbd] transition-colors"
                >
                  {s.platform}
                </a>
              ))}
            </div>
            <button
              onClick={() => {
                setStage("closed");
                router.push(campaign.landingPath);
              }}
              className="w-full bg-[#16241a] text-white text-sm font-semibold py-3 rounded-full hover:bg-[#233324] transition-colors"
            >
              Continue to Shop
            </button>
            <button
              onClick={() => {
                setStage("closed");
                router.push("/checkout");
              }}
              className="w-full mt-2 text-sm font-semibold text-[#4f7957] py-3 rounded-full hover:bg-[#d4e8d0] transition-colors"
            >
              Already have items in your cart? Use it at checkout
            </button>
            {(campaign.termsText || campaign.redemptionRules) && (
              <p className="text-[10px] text-[#16241a]/35 mt-4 leading-relaxed">
                {[campaign.redemptionRules, campaign.termsText].filter(Boolean).join(" ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
