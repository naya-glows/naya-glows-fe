"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { XCircle, Loader2, Check } from "lucide-react";
import GlassCard from "../../helpers/glass/GlassCard";
import {
  useVerifyReservationPaymentQuery,
  usePayReservationMutation,
} from "../../../store/userApi";
import { getApiErrorMessage } from "../../../store/apiError";

function VerifyContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId") || "";
  const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
  const [payReservation, { isLoading: paying }] = usePayReservationMutation();

  const { data, error, isLoading } = useVerifyReservationPaymentQuery(
    { id: reservationId, reference },
    { skip: !reservationId || !reference },
  );

  const handlePayBalance = async () => {
    try {
      const { authorizationUrl } = await payReservation(reservationId).unwrap();
      window.location.href = authorizationUrl;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't start the balance payment."));
    }
  };

  if (!reservationId || !reference) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
          <XCircle size={28} className="text-[#c0574c]" />
        </div>
        <h1 className="text-2xl font-light mb-3 text-[#16241a]">Payment not completed</h1>
        <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
          No reservation reference was provided.
        </p>
        <Link
          href="/black-friday"
          className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
        >
          Back to Reservations
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

  const reservation = data?.reservation;
  if (!reservation) {
    return (
      <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
        <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-6">
          <XCircle size={28} className="text-[#c0574c]" />
        </div>
        <h1 className="text-2xl font-light mb-3 text-[#16241a]">Payment not completed</h1>
        <p className="text-sm text-[#16241a]/60 leading-relaxed mb-8">
          {error ? getApiErrorMessage(error, "Couldn't verify this payment.") : "You haven't been charged."}
        </p>
        <Link
          href="/black-friday"
          className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
        >
          Back to Reservations
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
      <div className="w-16 h-16 rounded-full bg-[#d4e8d0] flex items-center justify-center mx-auto mb-6">
        <Check size={28} className="text-[#4f7957]" />
      </div>
      <h1 className="text-2xl font-light mb-3 text-[#16241a]">
        {reservation.balancePaid ? "Fully paid" : "Reservation confirmed"}
      </h1>
      <div className="text-left bg-white/60 rounded-xl p-5 text-sm flex flex-col gap-2 mb-6">
        <div className="flex justify-between"><span className="text-[#16241a]/50">Kit</span><span className="font-medium">{reservation.kit.name}</span></div>
        <div className="flex justify-between"><span className="text-[#16241a]/50">Total price</span><span>₦{reservation.kit.totalPrice.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-[#16241a]/50">Deposit paid</span><span className="text-[#4f7957] font-medium">₦{reservation.depositAmount.toLocaleString()}</span></div>
        {!reservation.balancePaid && (
          <>
            <div className="flex justify-between"><span className="text-[#16241a]/50">Balance due</span><span className="font-medium">₦{reservation.balanceAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-[#16241a]/50">Due by</span><span>{new Date(reservation.balanceDueDate).toLocaleDateString()}</span></div>
          </>
        )}
      </div>
      {!reservation.balancePaid && (
        <button
          type="button"
          onClick={handlePayBalance}
          disabled={paying}
          className="w-full bg-[#16241a] text-white text-sm font-semibold py-3 rounded-full disabled:opacity-60 mb-3"
        >
          {paying ? "Redirecting…" : "Pay Balance Now"}
        </button>
      )}
      <Link
        href="/catalog"
        className="inline-block text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-6 py-2.5 rounded-full hover:bg-[#16241a]/5 transition-colors"
      >
        Continue Shopping
      </Link>
    </GlassCard>
  );
}

export default function BlackFridayVerifyPage() {
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
