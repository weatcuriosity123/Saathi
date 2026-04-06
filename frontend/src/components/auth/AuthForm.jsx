"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";

/** Maps role → default landing page after login */
const ROLE_REDIRECT = {
  student: "/dashboard",
  tutor: "/tutor-dashboard",
  admin: "/admin",
};

export default function AuthForm({ initialView = "login" }) {
  const [view, setView] = useState(initialView);
  const isLogin = view === "login";
  const [registerAsTutor, setRegisterAsTutor] = useState(false);

  // Form field state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Request state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // top-level error message
  const [fieldErrors, setFieldErrors] = useState({}); // { email: "...", password: "..." }

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const toggleView = (newView) => {
    setView(newView);
    setError("");
    setFieldErrors({});
    router.replace(`/${newView}`, { scroll: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { email, password }
        : { name, email, password, role: registerAsTutor ? "tutor" : "student" };

      const res = await apiClient(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      // Store user + token in AuthContext
      login(res.data.user, res.data.accessToken);

      // Redirect: honour ?redirect param first, then fall back to role default
      const redirectTo =
        searchParams.get("redirect") || ROLE_REDIRECT[res.data.user.role] || "/dashboard";

      router.push(redirectTo);
    } catch (err) {
      // Field-level errors from Zod validation (e.g. weak password)
      if (err.errors?.length) {
        const map = {};
        err.errors.forEach(({ field, message }) => {
          map[field] = message;
        });
        setFieldErrors(map);
      }
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(77,68,227,0.08)] min-h-[640px] md:h-[640px]">

      {/* Left Side: Visual Illustration/Brand Area */}
      <div className="hidden md:flex md:w-1/2 relative bg-primary-container items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            alt="Abstract flowing gradients of indigo and emerald"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeMVbusSTdB3aPa7j8hhHoK2JtG0oYlLmVx2ROiVRTke1_I-9H6H_BDmd1U06Zy59WZE4xpxNdgfkufV4bA1AhJLjczAdpOmnoYP_6Ee35DazyQnH24yraLtLTB6kxEwVvQzooALnD0oPEVFLRest7pDDp3NzwmivLm_lRbtGODTMVcP2nUTx79xzU2wzYlNgtXi5G8Sk6Zek89dkR8eRI4e06_YoMxPpKhr-oQL9oWqtK5qPm6QQ3ieYjwBb95cIFfsGuAetlLVc"
          />
        </div>
        <div className="relative z-10 flex flex-col gap-8">
          <div className="text-white">
            <h1 className="font-headline font-extrabold text-5xl tracking-tighter mb-4">
              SAATHI
            </h1>
            <p className="text-primary-fixed font-body text-lg leading-relaxed max-w-xs text-primary-fixed-dim">
              Step into your sanctuary of knowledge. Where learning feels like
              progress, not pressure.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-[20px] backdrop-filter border-t border-white/20 p-6 rounded-2xl shadow-glass max-w-xs transform translate-x-12 translate-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
              </div>
              <div>
                <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest font-semibold">
                  Global Reach
                </p>
                <p className="font-headline font-bold text-on-surface">
                  1.2M+ Students
                </p>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-snug">
              Join the world's most supportive community of lifelong learners.
            </p>
          </div>
        </div>
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-secondary rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface-container-lowest relative">
        <div className="md:hidden mt-8 mb-8">
          <h2 className="font-headline font-extrabold text-2xl text-primary tracking-tighter">
            SAATHI
          </h2>
        </div>

        <div className="mb-8 text-left">
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-on-surface-variant text-sm">
            {isLogin
              ? "Please enter your details to access your dashboard."
              : "Register as a learner and begin exploring courses."}
          </p>
        </div>

        {/* Top-level error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-error/10 border border-error/20 rounded-xl text-sm text-error font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name — signup only */}
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label
                className="font-label text-xs font-semibold text-on-surface uppercase tracking-wider"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className={`w-full px-5 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 transition-all outline-none ${
                  fieldErrors.name ? "ring-2 ring-error/50" : "focus:ring-primary/30"
                }`}
                id="name"
                placeholder="Jane Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
              {fieldErrors.name && (
                <p className="text-xs text-error">{fieldErrors.name}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              className="font-label text-xs font-semibold text-on-surface uppercase tracking-wider"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className={`w-full px-5 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 transition-all outline-none ${
                fieldErrors.email ? "ring-2 ring-error/50" : "focus:ring-primary/30"
              }`}
              id="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-xs text-error">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label
                className="font-label text-xs font-semibold text-on-surface uppercase tracking-wider"
                htmlFor="password"
              >
                Password
              </label>
              {isLogin && (
                <a className="text-xs text-primary font-medium hover:underline" href="#">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                className={`w-full px-5 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 transition-all outline-none ${
                  fieldErrors.password ? "ring-2 ring-error/50" : "focus:ring-primary/30"
                }`}
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-error">{fieldErrors.password}</p>
            )}
            {!isLogin && !fieldErrors.password && (
              <p className="text-xs text-on-surface-variant">
                8+ characters with uppercase, lowercase, and a number.
              </p>
            )}
          </div>

          {/* Tutor registration toggle — signup only */}
          {!isLogin && (
            <button
              type="button"
              onClick={() => setRegisterAsTutor((v) => !v)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
                registerAsTutor
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-outline-variant/30 bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl shrink-0"
                style={{ fontVariationSettings: registerAsTutor ? "'FILL' 1" : "'FILL' 0" }}
              >
                {registerAsTutor ? "check_box" : "check_box_outline_blank"}
              </span>
              <span className="text-sm font-semibold">
                Register as a Tutor{" "}
                <span className="text-xs font-normal text-on-surface-variant">
                  (requires admin approval)
                </span>
              </span>
            </button>
          )}

          {/* Submit */}
          <button
            className="bg-primary-gradient text-white py-4 rounded-xl font-headline font-bold text-lg hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-primary/20 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Please wait…" : isLogin ? "Login" : "Create Account"}
          </button>

          <div className="text-center md:mt-1">
            <button
              onClick={() => toggleView(isLogin ? "signup" : "login")}
              className="text-sm text-primary font-semibold hover:underline transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              type="button"
              disabled={loading}
            >
              {isLogin ? "Create new account" : "Already have an account?"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-2">
            <div className="h-[1px] flex-grow bg-outline-variant"></div>
            <span className="text-xs font-label text-outline uppercase tracking-widest">
              Or continue with
            </span>
            <div className="h-[1px] flex-grow bg-outline-variant"></div>
          </div>

          {/* Google (UI only — OAuth not implemented) */}
          <div className="w-full flex flex-col items-center">
            <button
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-semibold text-sm text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 disabled:opacity-50"
              type="button"
              disabled
            >
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCmSqEQ4W9sEkXgzQJUP_HTk0uP9BIfqxxQ4gOAlSr-vSxMLq-JLvhk5wZvyWszcW_oxHNkeJeUyqrq97sNsY9DNRVrKH7Np1fBXvY9VzGwF2K-y0g8t-voVGjNvWtukHN4-4smbGygN10FEQg58aaBCgJq7Ak9nHxq0BqIQ16MGXa4DavrriOSy9HKb9CyrNOtSkh3LgAq5ZG1Ut8t0u8TadvFAbi91-oBdcTOGhMSLQZmB0fWcOKVFixQHD_G2lQnPF-VweB2l8"
              />
              Continue with Google
            </button>
          </div>

          {/* Other portals — login view only */}
          {isLogin && (
            <div className="pt-1">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest text-center mb-3">
                Other portals
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/tutor-login"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface-variant text-xs font-bold hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-base">school</span>
                  Tutor Login
                </Link>
                <Link
                  href="/admin-login"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface-variant text-xs font-bold hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  Admin Login
                </Link>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
