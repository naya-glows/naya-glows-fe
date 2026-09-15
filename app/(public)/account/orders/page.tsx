"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import GlassCard from "../../helpers/glass/GlassCard";
import { useUserAuth } from "../../../store/useUserAuth";
import { useListMyOrdersQuery } from "../../../store/userApi";
import { isApiConfigured } from "@/lib/api";

const statusStyles: Record<string, string> = {
  PAID: "bg-[#d4e8d0] text-[#4f7957]",
  PENDING: "bg-[#f4e8c9] text-[#8a6f1f]",
  FAILED: "bg-[#f5d9d5] text-[#c0574c]",
  CANCELLED: "bg-[#e5e5e5] text-[#666]",
};

export default function AccountOrdersPage() {
  const { user } = useUserAuth();
  const { data: myOrders = [] } = useListMyOrdersQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });

  if (!user) return null;

  return (
    <GlassCard className="px-5 py-8 sm:p-8">
      <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mb-4">
        <Package size={17} className="text-[#6a9a72]" />
      </div>
      <h2 className="text-base font-semibold mb-1">Order History</h2>
      {myOrders.length === 0 ? (
        <>
          <p className="text-sm text-[#16241a]/50 mb-4">You have no past orders yet.</p>
          <Link href="/catalog" className="text-sm font-semibold text-[#6a9a72] hover:underline">
            Start shopping →
          </Link>
        </>
      ) : (
        <div className="flex flex-col gap-1">
          {myOrders.map((order) => {
            const stackItems = order.items.slice(0, 3);
            const overflowCount = order.items.length - stackItems.length;
            return (
              <Link
                key={order.id}
                href={`/track-order?id=${encodeURIComponent(order.id)}&email=${encodeURIComponent(user.email)}`}
                className="flex items-center gap-3 py-2 max-[350px]:flex-col max-[350px]:items-start max-[350px]:gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center -space-x-3 flex-shrink-0">
                  {stackItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative w-9 h-9 rounded-full ring-2 ring-[#f4faf3] bg-white overflow-hidden"
                      style={{ zIndex: stackItems.length - idx }}
                    >
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                  ))}
                  {overflowCount > 0 && (
                    <div className="relative w-9 h-9 rounded-full ring-2 ring-[#f4faf3] bg-[#16241a] text-white text-[10px] font-semibold flex items-center justify-center">
                      +{overflowCount}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 min-w-0 flex-1 w-full">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">
                      {order.currency} {order.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#16241a]/45 truncate">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full flex-shrink-0 ${
                      statusStyles[order.status] ?? "bg-white/60 text-[#16241a]/60"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
