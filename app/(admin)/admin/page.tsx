"use client";

import Link from "next/link";
import { Package, Users, FileText, ShoppingCart, Wallet } from "lucide-react";
import {
  useListProductsQuery,
  useListUsersQuery,
  useListContentQuery,
  useListOrdersQuery,
  useGetBudgetSummaryQuery,
} from "../../store/adminApi";

export default function AdminOverviewPage() {
  const { data: products } = useListProductsQuery();
  const { data: users } = useListUsersQuery();
  const { data: content } = useListContentQuery();
  const { data: orders } = useListOrdersQuery();
  const { data: budget } = useGetBudgetSummaryQuery();

  const stats = [
    { label: "Products", value: products?.length ?? null, icon: Package, href: "/admin/products" },
    { label: "Orders", value: orders?.length ?? null, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Users", value: users?.length ?? null, icon: Users, href: "/admin/users" },
    {
      label: "Content overrides",
      value: content?.length ?? null,
      icon: FileText,
      href: "/admin/content",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Overview</h1>
      <p className="text-sm text-[#16241a]/50 mb-8">
        A quick snapshot of what&apos;s live on the site.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6"
            >
              <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center mb-4">
                <Icon size={16} className="text-[#6a9a72]" />
              </div>
              <p className="text-2xl font-semibold">{s.value ?? "N/A"}</p>
              <p className="text-sm text-[#16241a]/50">{s.label}</p>
            </div>
          );
        })}
      </div>

      <Link
        href="/admin/budget"
        className="mt-10 block bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 hover:bg-white/80 transition-colors"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className="text-[#6a9a72]" />
              <h2 className="text-base font-semibold">Budget Snapshot</h2>
            </div>
            <p className="text-sm text-[#16241a]/50">
              {budget
                ? `${budget.paidOrderCount} paid order(s), plus any manual entries.`
                : "Revenue and manual expense tracking for the business."}
            </p>
          </div>
          {budget && (
            <p className="text-2xl font-semibold">
              ₦{budget.net.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
