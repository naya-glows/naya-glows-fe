"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, Loader2, Check } from "lucide-react";
import GlassCard from "../../helpers/glass/GlassCard";
import { useVerifyWholesaleInquiryPaymentQuery } from "../../../store/userApi";
import { getApiErrorMessage } from "../../../store/apiError";

function VerifyContent() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiryId") || "";
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";

  const { data, error, isLoading } = useVerifyWholesaleInquiryPaymentQuery(
    { id: inquiryId, reference },
    { skip: !inquiryId || !reference },
  );

  if (!inquiryId || !reference) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
          <XCircle size={28} className="text-[#c0574c]" />
        </div>
        <h1 className="text-2xl font-light mb-3 text-[#16241a]">Payment not completed</h1>
        <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">No payment reference was provided.</p>
        <Link href="/white-label" className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full">
          Back to White-Label
        </Link>
      </GlassCard>
    );
  }

  if (isLoading) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <Loader2 size={28} className="text-[#6a9a72] mx-auto mb-6 animate-spin" />
        <h1 className="text-xl font-medium mb-2 text-[#16241a]">Confirming your payment…</h1>
        <p className="text-sm text-[#16241a]/50">This only takes a moment.</p>
      </GlassCard>
    );
  }

  const inquiry = data?.inquiry;
  if (!inquiry || !inquiry.paid) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
          <XCircle size={28} className="text-[#c0574c]" />
        </div>
        <h1 className="text-2xl font-light mb-3 text-[#16241a]">Payment not completed</h1>
        <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
          {error ? getApiErrorMessage(error, "Couldn't verify this payment.") : "You haven't been charged."}
        </p>
        <Link href="/white-label" className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full">
          Back to White-Label
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
      <div className="w-16 h-16 rounded-full bg-[#d4e8d0] flex items-center justify-center mx-auto mb-6">
        <Check size={28} className="text-[#4f7957]" />
      </div>
      <h1 className="text-2xl font-light mb-3 text-[#16241a]">Consultation booked</h1>
      <div className="text-left bg-white/60 rounded-xl p-5 text-sm flex flex-col gap-2 mb-8">
        <div className="flex justify-between"><span className="text-[#16241a]/50">Business</span><span className="font-medium">{inquiry.businessName}</span></div>
        <div className="flex justify-between"><span className="text-[#16241a]/50">Fee paid</span><span className="text-[#4f7957] font-medium">₦{(inquiry.feeNgn ?? 0).toLocaleString()}</span></div>
      </div>
      <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
        We'll be in touch shortly to schedule your product development consultation.
      </p>
      <Link href="/" className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full">
        Back Home
      </Link>
    </GlassCard>
  );
}

export default function WhiteLabelVerifyPage() {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5 py-16">
      <Suspense
        fallback={
          <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
            <Loader2 size={28} className="text-[#6a9a72] mx-auto mb-6 animate-spin" />
            <p className="text-sm text-[#16241a]/50">Loading…</p>
          </GlassCard>
        }
      >
        <VerifyContent />
      </Suspense>
    </main>
  );
}
