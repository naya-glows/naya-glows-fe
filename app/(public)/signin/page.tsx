"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GlassCard from "../helpers/glass/GlassCard";
import { useUserAuth } from "../../store/useUserAuth";
import { getApiErrorMessage } from "../../store/apiError";
import { countries } from "@/lib/countries";

const inputClass =
  "w-full bg-white/70 border border-white/60 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-[#16241a]/35 focus:border-[#8ab88e] transition-colors";

type Mode = "signin" | "create";
// "form" collects the account details (or just an email, for signin) and
// requests an OTP; "otp" verifies it and actually signs in / creates the
// account — nothing changes server-side until then.
type Step = "form" | "otp";

// Split out from SignInForm and mounted with key={mode} below — this is
// what actually fixes the shared-loading-state bug: useUserAuth()'s
// loginWithOtp/register/requestSignupOtp/requestLoginOtp mutations each
// track isLoading locally to the *hook instance* that called them, not
// globally. With one shared SignInForm instance calling all of them
// unconditionally, submitting the Create Account tab left
// `registering`/`requestingSignupOtp` sitting at true, and switching to
// Sign In showed that same stale flag on an unrelated button. Remounting
// this component on every mode switch (via the `key` on its usage below)
// throws that whole hook subscription away and starts a brand new one at
// isLoading:false, regardless of whatever the previous mode's request is
// still doing in the background.
function AuthSubmitForm({
  mode,
  step,
  setStep,
  name,
  setName,
  email,
  setEmail,
  country,
  setCountry,
  referralCode,
  setReferralCode,
  signupAsInfluencer,
  setSignupAsInfluencer,
  otpCode,
  setOtpCode,
  error,
  setError,
  redirectAfterAuth,
}: {
  mode: Mode;
  step: Step;
  setStep: (step: Step) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  referralCode: string;
  setReferralCode: (v: string) => void;
  signupAsInfluencer: boolean;
  setSignupAsInfluencer: (v: boolean) => void;
  otpCode: string;
  setOtpCode: (v: string) => void;
  error: string | null;
  setError: (v: string | null) => void;
  redirectAfterAuth: (role: string) => void;
}) {
  const router = useRouter();
  const {
    requestLoginOtp,
    requestingLoginOtp,
    loginWithOtp,
    loggingIn,
    register,
    registering,
    requestSignupOtp,
    requestingSignupOtp,
  } = useUserAuth();
  const requestingOtp = mode === "signin" ? requestingLoginOtp : requestingSignupOtp;
  const submitting = mode === "signin" ? requestingOtp || loggingIn : requestingOtp || registering;
  const showingOtpStep = step === "otp";

  const handleResend = async () => {
    setError(null);
    try {
      if (mode === "signin") {
        await requestLoginOtp(email);
      } else {
        await requestSignupOtp(email);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "signin") {
        if (step === "form") {
          await requestLoginOtp(email);
          setStep("otp");
          return;
        }
        const user = await loginWithOtp(email, otpCode);
        redirectAfterAuth(user.role);
        return;
      }

      if (step === "form") {
        await requestSignupOtp(email);
        setStep("otp");
        return;
      }

      const user = await register({
        email,
        name,
        country,
        referralCode: referralCode || undefined,
        otpCode,
      });
      if (signupAsInfluencer) {
        router.push("/influencer/apply");
      } else {
        redirectAfterAuth(user.role);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {showingOtpStep ? (
        <>
          <input
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="6-digit code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            className={`${inputClass} text-center text-lg tracking-[0.5em] font-semibold`}
          />
          <div className="flex items-center justify-between text-xs text-[#16241a]/50">
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtpCode("");
                setError(null);
              }}
              className="font-medium hover:text-[#16241a] transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={requestingOtp}
              className="font-medium hover:text-[#16241a] transition-colors disabled:opacity-50"
            >
              {requestingOtp ? "Sending…" : "Resend code"}
            </button>
          </div>
        </>
      ) : (
        <>
          {mode === "create" && (
            <input
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoComplete="name"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
          {mode === "create" && (
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {mode === "create" && (
            <input
              placeholder="Referral code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className={inputClass}
            />
          )}
          {mode === "create" && (
            <label className="flex items-center gap-2.5 text-sm text-[#16241a]/70 -mt-1">
              <input
                type="checkbox"
                checked={signupAsInfluencer}
                onChange={(e) => setSignupAsInfluencer(e.target.checked)}
                className="w-4 h-4 rounded border-[#16241a]/30 accent-[#4f7957]"
              />
              Sign up as an influencer
            </label>
          )}
        </>
      )}

      {error && <p className="text-xs text-[#c0574c]">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-[#16241a] text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-[#233324] transition-colors disabled:opacity-60"
      >
        {submitting
          ? "Please wait…"
          : showingOtpStep
            ? mode === "signin"
              ? "Verify & Sign In"
              : "Verify & Create Account"
            : "Send Verification Code"}
      </button>
    </form>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("NG");
  const [referralCode, setReferralCode] = useState("");
  const [signupAsInfluencer, setSignupAsInfluencer] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useUserAuth();
  const router = useRouter();

  // Already signed in — this page has nothing to offer, and letting a
  // signed-in visitor sit on the sign-in/create-account form is confusing.
  useEffect(() => {
    if (authLoading || !user) return;
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith("/")) {
      router.replace(redirect);
    } else {
      router.replace(user.role === "INFLUENCER" ? "/influencer" : "/account");
    }
  }, [authLoading, user, router, searchParams]);

  // A referral link (e.g. shared by an influencer) looks like /signin?ref=CODE
  // — prefill it and default straight to the Create Account tab.
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setMode("create");
    }
  }, [searchParams]);

  // Switching tabs starts that flow fresh — an error (or a half-finished
  // OTP step) from the other tab has no business following you here.
  const switchMode = (next: Mode) => {
    setMode(next);
    setStep("form");
    setOtpCode("");
    setError(null);
  };

  const redirectAfterAuth = (role: string) => {
    // A same-origin path the caller was bounced from (e.g. checkout,
    // influencer/apply) takes priority over the default role-based landing
    // page — only ever a relative path, never an external URL.
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith("/")) {
      router.push(redirect);
    } else {
      router.push(role === "INFLUENCER" ? "/influencer" : "/account");
    }
  };

  const showingOtpStep = step === "otp";

  // Loading (auth still resolving) or already signed in (the effect above
  // is about to redirect away) — either way, the form has nothing useful
  // to show right now.
  if (authLoading || user) {
    return <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />;
  }

  return (
    <main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] text-[#16241a] min-h-screen">
      <section className="pt-32 sm:pt-36 pb-24 px-0 sm:px-8 lg:px-12">
        <div className="max-w-[1100px] mx-auto">
          <GlassCard className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden !rounded-none sm:!rounded-[2rem]">
            {/* Image side */}
            <div className="relative hidden lg:block min-h-[560px]">
              <Image
                src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381916/naya-glows/legacy/new/img_7419.jpg"
                alt="Naya Glows"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10160f]/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#c7ecc9] mb-2">
                  Naya Glows
                </p>
                <p className="text-white text-lg font-light leading-snug">
                  Clean, potent skincare — made for your glow.
                </p>
              </div>
            </div>

            {/* Form side */}
            <div className="px-5 py-10 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-1 bg-white/70 rounded-full p-1 mb-8 w-fit">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`text-sm font-medium px-5 py-2 rounded-full transition-colors ${
                    mode === "signin" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("create")}
                  className={`text-sm font-medium px-5 py-2 rounded-full transition-colors ${
                    mode === "create" ? "bg-[#16241a] text-white" : "text-[#16241a]/60"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h1 className="text-2xl font-light mb-2">
                {showingOtpStep
                  ? "Check your email"
                  : mode === "signin"
                    ? "Welcome back"
                    : "Join Naya Glows"}
              </h1>
              <p className="text-sm text-[#16241a]/50 mb-8">
                {showingOtpStep
                  ? `We sent a 6-digit code to ${email}. Enter it below to ${
                      mode === "signin" ? "sign in" : "finish creating your account"
                    }.`
                  : mode === "signin"
                    ? "Enter your email and we'll send you a sign-in code."
                    : "Create an account to track orders and save favorites."}
              </p>

              <AuthSubmitForm
                key={mode}
                mode={mode}
                step={step}
                setStep={setStep}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                country={country}
                setCountry={setCountry}
                referralCode={referralCode}
                setReferralCode={setReferralCode}
                signupAsInfluencer={signupAsInfluencer}
                setSignupAsInfluencer={setSignupAsInfluencer}
                otpCode={otpCode}
                setOtpCode={setOtpCode}
                error={error}
                setError={setError}
                redirectAfterAuth={redirectAfterAuth}
              />
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="bg-gradient-to-b from-[#eafbf0] to-[#f4faf3] min-h-screen" />}>
      <SignInForm />
    </Suspense>
  );
}
