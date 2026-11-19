"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, Loader2 } from "lucide-react";
import GlassCard from "../../helpers/glass/GlassCard";
import PaymentSuccessAnimation from "../../helpers/PaymentSuccessAnimation";
import { useCart } from "../../../store/cartSlice";
import { useVerifyPaymentQuery } from "../../../store/userApi";
import { getApiErrorMessage } from "../../../store/apiError";

function VerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  const { data, error, isLoading } = useVerifyPaymentQuery(reference ?? "", {
    skip: !reference,
  });

  const paid = data?.order.status === "PAID";

  useEffect(() => {
    if (paid && !cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  if (!reference) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
          <XCircle size={28} className="text-[#c0574c]" />
        </div>
        <h1 className="text-2xl font-light mb-3">Payment not completed</h1>
        <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
          No payment reference was provided.
        </p>
        <Link
          href="/checkout"
          className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
        >
          Back to Checkout
        </Link>
      </GlassCard>
    );
  }

  if (isLoading) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <Loader2 size={28} className="text-[#6a9a72] mx-auto mb-6 animate-spin" />
        <h1 className="text-xl font-medium mb-2">Confirming your payment…</h1>
        <p className="text-sm text-[#16241a]/50">This only takes a moment.</p>
      </GlassCard>
    );
  }

  if (paid) {
    const email = data?.order.shippingDetails?.email ?? "";
    const trackHref = data?.order.id
      ? `/track-order?id=${encodeURIComponent(data.order.id)}&email=${encodeURIComponent(email)}`
      : "/track-order";

    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <PaymentSuccessAnimation />
        <h1 className="text-2xl font-light mb-3">Order confirmed</h1>
        <p className="text-sm text-[#16241a]/60 leading-relaxed mb-2">
          Thank you for shopping with Naya Glows. Your payment went through
          and your order is on its way. We&apos;ve emailed you a confirmation.
        </p>
        {data?.order.id && (
          <p className="text-xs text-[#16241a]/40 mb-8">Order #{data.order.id}</p>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/catalog"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
          >
            Continue Shopping
          </Link>
          <Link
            href={trackHref}
            className="inline-block text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-6 py-2.5 rounded-full hover:bg-[#16241a]/5 transition-colors"
          >
            Track this order
          </Link>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
      <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
        <XCircle size={28} className="text-[#c0574c]" />
      </div>
      <h1 className="text-2xl font-light mb-3">Payment not completed</h1>
      <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
        {error
          ? getApiErrorMessage(error, "Couldn't verify this payment.")
          : "Payment wasn't successful. You haven't been charged."}
      </p>
      <Link
        href="/checkout"
        className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
      >
        Back to Checkout
      </Link>
    </GlassCard>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5">
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
