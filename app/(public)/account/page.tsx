"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Package,
  Heart,
  LogOut,
  MapPin,
  X,
  Pencil,
  Repeat,
  Sparkles,
  Truck,
  ShoppingBag,
  Megaphone,
  ArrowUpRight,
  Leaf,
} from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import ProductGridCard from "../helpers/ProductGridCard";
import { useUserAuth } from "../../store/useUserAuth";
import { useCurrencyDisplay } from "../../store/useCurrencyDisplay";
import { useCart } from "../../store/cartSlice";
import { triggerCartFly } from "../../store/cartFlyBus";
import { getApiErrorMessage } from "../../store/apiError";
import { countries } from "@/lib/countries";
import {
  useListSavedProductsQuery,
  useToggleSavedProductMutation,
  useListMyOrdersQuery,
  useListMyProductSubscriptionsQuery,
} from "../../store/userApi";
import { isApiConfigured } from "@/lib/api";

const statusStyles: Record<string, string> = {
  PAID: "bg-[#d4e8d0] text-[#4f7957]",
  PENDING: "bg-[#f4e8c9] text-[#8a6f1f]",
  FAILED: "bg-[#f5d9d5] text-[#c0574c]",
  CANCELLED: "bg-[#e5e5e5] text-[#666]",
};

// The "Pay Once, Save More" promo gradient every stat tile now shares — a
// deliberately dark, single brand surface instead of one color per card.
const darkGradient = "bg-gradient-to-br from-[#16241a] to-[#2d4530]";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

function EditProfileModal({
  onClose,
  currentName,
  currentEmail,
  currentCountry,
}: {
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  currentCountry: string | null;
}) {
  const { updateProfile, updatingProfile: saving } = useUserAuth();
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [country, setCountry] = useState(currentCountry ?? "NG");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email, country });
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update your profile. Please try again."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
      <GlassCard className="max-w-sm w-full py-8 px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useUserAuth();
  const { format: formatPrice } = useCurrencyDisplay();
  const { data: savedProducts = [] } = useListSavedProductsQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const [toggleSavedProduct, { isLoading: togglingSaved, originalArgs: togglingSavedArgs }] =
    useToggleSavedProductMutation();
  const { data: myOrders = [] } = useListMyOrdersQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const { data: mySubscriptions = [] } = useListMyProductSubscriptionsQuery(undefined, {
    skip: !isApiConfigured() || !user,
  });
  const { addItem } = useCart();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAddSavedToCart = (product: (typeof savedProducts)[number], e: MouseEvent<HTMLButtonElement>) => {
    addItem(product);
    triggerCartFly(product.image, e.currentTarget);
    setJustAdded(product.slug);
    setTimeout(() => setJustAdded(null), 1400);
  };

  // Optimistic — the item disappears from this list instantly (see
  // toggleSavedProduct's onQueryStarted in userApi.ts), rolled back
  // automatically if the request fails; unwrap() here only catches that
  // failure to toast it.
  const handleUnsave = async (slug: string) => {
    try {
      await toggleSavedProduct({ slug }).unwrap();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Couldn't update your saved products. Please try again."));
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />
    );
  }

  if (!user) {
    return (
      <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen flex items-center justify-center px-5">
        <GlassCard className="max-w-md w-full text-center py-16 px-6 sm:px-8">
          <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-5">
            <User size={22} className="text-[#6a9a72]" />
          </div>
          <h1 className="text-xl font-medium mb-2">Sign in to view your account</h1>
          <p className="text-sm text-[#16241a]/50 mb-8">
            Track orders, save favorites, and manage your details.
          </p>
          <Link
            href="/signin"
            className="inline-block text-sm font-semibold bg-[#16241a] text-white px-6 py-2.5 rounded-full"
          >
            Sign In
          </Link>
        </GlassCard>
      </main>
    );
  }

  const countryName = countries.find((c) => c.code === user.country)?.name ?? user.country;
  const memberSinceYear = new Date(user.createdAt).getFullYear();

  const quickLinks = [
    { label: "Track Order", icon: Truck, href: "/track-order" },
    { label: "Shop Catalog", icon: ShoppingBag, href: "/catalog" },
    { label: "Subscribe & Save Big", icon: Repeat, href: "/subscribe-save" },
    user.role === "INFLUENCER"
      ? { label: "Influencer Dashboard", icon: Megaphone, href: "/influencer" }
      : { label: "Become an Influencer", icon: Megaphone, href: "/influencer/apply" },
  ];

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[900px] mx-auto">
          {/* Greeting header */}
          <GlassCard className="px-5 py-8 sm:p-8 flex items-center gap-5 mb-6 flex-wrap">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8ab88e] to-[#16241a] flex items-center justify-center flex-shrink-0 text-white text-xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold">Hey, {user.name.split(" ")[0]}</p>
              <p className="text-sm text-[#16241a]/50">{user.email}</p>
              {user.country && (
                <p className="text-xs text-[#6a9a72] flex items-center gap-1 mt-1">
                  <MapPin size={11} />
                  {countryName} · {user.currency}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center gap-2 text-sm font-medium text-[#16241a]/60 hover:text-[#16241a] transition-colors"
              >
                <Pencil size={14} />
                Edit Profile
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 text-sm font-medium text-[#16241a]/60 hover:text-[#16241a] transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </GlassCard>

          {/* Stat tiles — same dark brand gradient as the promo banner below */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { label: "Orders", value: myOrders.length, icon: Package },
              { label: "Saved Products", value: savedProducts.length, icon: Heart },
              { label: "Reorder Discounts", value: mySubscriptions.length, icon: Repeat },
              { label: "Member Since", value: memberSinceYear, icon: Sparkles },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`${darkGradient} rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[110px]`}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <stat.icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-1.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe & Save Big promo banner — abstract leaf motif is what
              sets this card apart from the stat tiles sharing its gradient */}
          <Link
            href="/subscribe-save"
            className={`group relative overflow-hidden rounded-2xl ${darkGradient} px-6 py-7 sm:px-8 sm:py-8 mb-8 flex items-center justify-between gap-6 flex-wrap`}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl bg-[#aed4b4]" />
            <Leaf
              size={150}
              strokeWidth={1}
              className="absolute -bottom-10 -left-8 text-white/10 rotate-[25deg] pointer-events-none"
            />
            <Leaf
              size={80}
              strokeWidth={1}
              className="absolute top-4 right-28 text-white/10 -rotate-[15deg] pointer-events-none hidden sm:block"
            />
            <div className="relative z-10 max-w-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8ab88e] mb-2">
                Pay Once, Save More
              </p>
              <h2 className="text-white text-lg sm:text-xl font-semibold mb-1.5">
                Subscribe &amp; Save Big
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Commit to 3, 6, or 12 months upfront and unlock the biggest discount we offer.
              </p>
            </div>
            <span className="relative z-10 flex items-center gap-2 bg-white text-[#16241a] text-sm font-semibold px-5 py-2.5 rounded-full flex-shrink-0 group-hover:gap-3 transition-all">
              Explore Plans
              <ArrowUpRight size={15} />
            </span>
          </Link>

          {/* Quick links — glass pills, no per-item color */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 -mx-5 px-5 sm:mx-0 sm:px-0">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-2.5 rounded-full pl-2 pr-4 py-2 flex-shrink-0 bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(22,36,26,0.1)] hover:bg-white/70 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
                  <link.icon size={13} className="text-[#4f7957]" />
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassCard className="px-5 py-8 sm:p-8">
              <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mb-4">
                <Package size={17} className="text-[#6a9a72]" />
              </div>
              <h2 className="text-base font-semibold mb-1">Order History</h2>
              {myOrders.length === 0 ? (
                <>
                  <p className="text-sm text-[#16241a]/50 mb-4">
                    You have no past orders yet.
                  </p>
                  <Link
                    href="/catalog"
                    className="text-sm font-semibold text-[#6a9a72] hover:underline"
                  >
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
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
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

            <GlassCard className="px-5 py-8 sm:p-8">
              <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mb-4">
                <Heart size={17} className="text-[#6a9a72]" />
              </div>
              <h2 className="text-base font-semibold mb-1">Saved Products</h2>
              {savedProducts.length === 0 ? (
                <>
                  <p className="text-sm text-[#16241a]/50 mb-4">
                    Your wishlist from the catalog will appear here.
                  </p>
                  <Link
                    href="/catalog"
                    className="text-sm font-semibold text-[#6a9a72] hover:underline"
                  >
                    Browse catalog →
                  </Link>
                </>
              ) : (
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1 sm:pb-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible">
                  {savedProducts.map((product) => (
                    <ProductGridCard
                      key={product.slug}
                      product={product}
                      formatPrice={formatPrice}
                      wishlisted
                      onToggleWishlist={() => handleUnsave(product.slug)}
                      wishlistDisabled={togglingSaved && togglingSavedArgs?.slug === product.slug}
                      onAddToCart={(e) => handleAddSavedToCart(product, e)}
                      justAdded={justAdded === product.slug}
                    />
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </section>

      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          currentName={user.name}
          currentEmail={user.email}
          currentCountry={user.country}
        />
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <GlassCard className="max-w-sm w-full text-center py-8 px-6">
            <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-4">
              <LogOut size={18} className="text-[#c0574c]" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Sign out?</h2>
            <p className="text-sm text-[#16241a]/50 mb-6">
              You&apos;ll need to sign in again to view your orders and saved products.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-sm font-semibold border border-[#16241a]/20 text-[#16241a] px-6 py-2.5 rounded-full hover:bg-[#16241a]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="text-sm font-semibold bg-[#c0574c] text-white px-6 py-2.5 rounded-full hover:bg-[#a84740] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </main>
  );
}
