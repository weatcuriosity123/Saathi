"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";

export default function TutorLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const user = res?.data?.user;
      const token = res?.data?.accessToken;

      if (!user || !token) throw new Error("Login failed. Please try again.");

      // Role guard — wrong portal
      if (user.role !== "tutor" && user.role !== "admin") {
        throw new Error(
          "This portal is for tutors only. Please use the student login."
        );
      }

      login(user, token);

      const redirectTo = searchParams.get("redirect") || "/tutor-dashboard";
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row min-h-[600px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/10">

      {/* Left — Tutor Brand Panel */}
      <div className="hidden md:flex md:w-[45%] relative bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#c2410c] flex-col justify-between p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-black/10 rounded-full blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">SAATHI</span>
          </div>
          <p className="text-orange-100 text-xs font-bold uppercase tracking-widest">Tutor Portal</p>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Shape the next generation of learners.
            </h2>
            <p className="text-orange-100 mt-3 leading-relaxed text-sm">
              Upload courses, track student progress, and grow your teaching career — all from one place.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "group", label: "Active Students", value: "12,000+" },
              { icon: "menu_book", label: "Courses Live", value: "240+" },
              { icon: "star", label: "Avg Rating", value: "4.8 / 5" },
              { icon: "payments", label: "Avg Earnings", value: "₹45K/mo" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <span className="material-symbols-outlined text-orange-200 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <p className="text-white font-black text-lg mt-1">{value}</p>
                <p className="text-orange-200 text-[10px] font-bold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom link */}
        <div className="relative z-10">
          <p className="text-orange-200 text-xs">
            Not a tutor yet?{" "}
            <Link href="/signup" className="text-white font-bold underline underline-offset-2 hover:no-underline">
              Apply to teach
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full md:w-[55%] bg-white flex flex-col justify-center px-8 md:px-14 py-12">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <span className="text-[#f97316] font-black tracking-tight">SAATHI Tutor</span>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Tutor Portal</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to manage your courses and students.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
            <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 focus:bg-white transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Password
              </label>
              <button type="button" className="text-xs text-orange-500 font-semibold hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 focus:bg-white transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-black rounded-2xl text-sm shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:shadow-orange-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
            )}
            {loading ? "Signing in…" : "Sign In to Tutor Portal"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Other portals */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 text-center mb-3">Other portals</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Student Login
            </Link>
            <Link
              href="/admin-login"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
