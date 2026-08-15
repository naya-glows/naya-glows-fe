"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Copy, Plus, Users, Megaphone } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import { useUserAuth } from "../../store/useUserAuth";
import {
  useGetMyInfluencerProfileQuery,
  useListMyReferralCodesQuery,
  useGenerateReferralCodeMutation,
} from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";

export default function InfluencerDashboardPage() {
  const { user, loading: authLoading } = useUserAuth();
  const isInfluencer = user?.role === "INFLUENCER";

  const { data: profile } = useGetMyInfluencerProfileQuery(undefined, {
    skip: !isApiConfigured() || !isInfluencer,
  });
  const { data: codes = [], isLoading: codesLoading } = useListMyReferralCodesQuery(undefined, {
    skip: !isApiConfigured() || !isInfluencer,
  });
  const [generateCode, { isLoading: generating }] = useGenerateReferralCodeMutation();

  const totalSignups = codes.reduce((sum, c) => sum + c.signupCount, 0);

  const handleGenerate = async () => {
    try {
      await generateCode().unwrap();
      toast.success("New referral code generated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't generate a code. Please try again."));
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied");
  };

  if (authLoading) {
    return <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />;
  }

  if (!user || !isInfluencer) {
    return (
      <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5">
        <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
          <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-5">
            <Megaphone size={22} className="text-[#6a9a72]" />
          </div>
          <h1 className="text-xl font-medium mb-2">Influencer dashboard</h1>
          <p className="text-sm text-[#16241a]/50 mb-8">
            {user
              ? "This account isn't registered as an influencer yet."
              : "Sign in with your influencer account, or apply to join the program."}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/influencer/apply"
              className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
            >
              Apply Now
            </Link>
            {!user && (
              <Link
                href="/signin"
                className="inline-block text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-6 py-2.5 rounded-full hover:bg-[#16241a]/5 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[900px] mx-auto">
          <GlassCard className="px-5 py-8 sm:p-8 mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#6a9a72] mb-2 font-medium">
              Influencer Dashboard
            </p>
            <h1 className="text-2xl font-light mb-1">
              Welcome back, {profile?.name ?? `${user.firstName} ${user.lastName}`}
            </h1>
            {profile && (
              <p className="text-sm text-[#16241a]/50">
                Code name:{" "}
                <span className="font-mono font-semibold text-[#16241a]/70">{profile.codeName}</span>
                {[
                  profile.twitterHandle && `X: ${profile.twitterHandle}`,
                  profile.instagramHandle && `IG: ${profile.instagramHandle}`,
                  profile.tiktokHandle && `TikTok: ${profile.tiktokHandle}`,
                ]
                  .filter(Boolean)
                  .map((s) => ` · ${s}`)
                  .join("")}
              </p>
            )}
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <GlassCard className="px-5 py-6 sm:p-6">
              <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center mb-3">
                <Users size={16} className="text-[#6a9a72]" />
              </div>
              <p className="text-2xl font-semibold">{totalSignups}</p>
              <p className="text-sm text-[#16241a]/50">Total signups</p>
            </GlassCard>
            <GlassCard className="px-5 py-6 sm:p-6">
              <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center mb-3">
                <Megaphone size={16} className="text-[#6a9a72]" />
              </div>
              <p className="text-2xl font-semibold">{codes.length}</p>
              <p className="text-sm text-[#16241a]/50">Active referral codes</p>
            </GlassCard>
          </div>

          <GlassCard className="px-4 py-6 sm:p-8">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#16241a]/50">
                Your Referral Codes
              </h2>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 bg-[#16241a] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
              >
                <Plus size={14} />
                {generating ? "Generating…" : "Generate Code"}
              </button>
            </div>

            {codesLoading ? (
              <p className="text-sm text-[#16241a]/50">Loading…</p>
            ) : codes.length === 0 ? (
              <p className="text-sm text-[#16241a]/50">
                You don&apos;t have any referral codes yet — generate your first one above.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {codes.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 bg-white/50 rounded-2xl px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-mono font-semibold tracking-wide">{c.code}</p>
                      <p className="text-xs text-[#16241a]/45">
                        {new Date(c.createdAt).toLocaleDateString()} · {c.signupCount} signup(s)
                      </p>
                    </div>
                    <button
                      onClick={() => copyCode(c.code)}
                      aria-label="Copy code"
                      className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors flex-shrink-0"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
