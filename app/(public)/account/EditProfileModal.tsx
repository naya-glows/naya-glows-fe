"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import GlassCard from "../helpers/glass/GlassCard";
import { useUserAuth } from "../../store/useUserAuth";
import { getApiErrorMessage } from "../../store/apiError";
import { countries } from "@/lib/countries";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

export default function EditProfileModal({
  onClose,
  currentFirstName,
  currentLastName,
  currentEmail,
  currentCountry,
}: {
  onClose: () => void;
  currentFirstName: string;
  currentLastName: string;
  currentEmail: string;
  currentCountry: string | null;
}) {
  const { updateProfile, updatingProfile: saving } = useUserAuth();
  const [firstName, setFirstName] = useState(currentFirstName);
  const [lastName, setLastName] = useState(currentLastName);
  const [email, setEmail] = useState(currentEmail);
  const [country, setCountry] = useState(currentCountry ?? "NG");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ firstName, lastName, email, country });
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
            />
            <input
              required
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
            />
          </div>
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
