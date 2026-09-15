"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Pencil, MapPin, Sparkles } from "lucide-react";
import GlassCard from "../../helpers/glass/GlassCard";
import { useUserAuth } from "../../../store/useUserAuth";
import { countries } from "@/lib/countries";
import EditProfileModal from "../EditProfileModal";

export default function AccountProfilePage() {
  const router = useRouter();
  const { user, logout } = useUserAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  if (!user) return null;

  const countryName = countries.find((c) => c.code === user.country)?.name ?? user.country;
  const memberSinceYear = new Date(user.createdAt).getFullYear();

  return (
    <>
      <GlassCard className="px-5 py-8 sm:p-8">
        <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center mb-4">
          <User size={17} className="text-[#6a9a72]" />
        </div>
        <h2 className="text-base font-semibold mb-4">Account</h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8ab88e] to-[#16241a] flex items-center justify-center flex-shrink-0 text-white text-xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-[#16241a]/50 truncate">{user.email}</p>
            {user.country && (
              <p className="text-xs text-[#6a9a72] flex items-center gap-1 mt-1 min-w-0">
                <MapPin size={11} className="flex-shrink-0" />
                <span className="truncate">
                  {countryName} · {user.currency}
                </span>
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-[#16241a]/45 flex items-center gap-1.5 mb-6">
          <Sparkles size={12} />
          Member since {memberSinceYear}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2.5 text-sm font-medium text-[#16241a]/70 hover:text-[#16241a] transition-colors px-4 py-3 rounded-xl bg-white/50 border border-white/60 hover:bg-white/70"
          >
            <Pencil size={15} />
            Edit Profile
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2.5 text-sm font-medium text-[#c0574c] hover:text-[#a84740] transition-colors px-4 py-3 rounded-xl bg-white/50 border border-white/60 hover:bg-white/70"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </GlassCard>

      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          currentFirstName={user.firstName}
          currentLastName={user.lastName}
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
    </>
  );
}
