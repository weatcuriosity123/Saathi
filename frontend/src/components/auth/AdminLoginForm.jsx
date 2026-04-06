"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
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

      // Role guard — admin only
      if (user.role !== "admin") {
        throw new Error(
          "Access denied. This portal is for administrators only."
        );
      }

      login(user, token);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row min-h-[600px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20">

      {/* Left — Admin Brand Panel */}
      <div className="hidden md:flex md:w-[45%] relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12 overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 backdrop-blur flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">SAATHI</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Admin Console</p>
        </div>

        {/* Middle */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Platform control at your fingertips.
            </h2>
            <p className="text-slate-400 mt-3 leading-relaxed text-sm">
              Manage users, review courses, monitor platform health, and keep the learning ecosystem running smoothly.
            </p>
          </div>

          {/* Access level indicators */}
          <div className="space-y-3">
            {[
              { icon: "manage_accounts", label: "User Management", desc: "Approve tutors, manage accounts" },
              { icon: "fact_check", label: "Course Moderation", desc: "Review & publish course submissions" },
              { icon: "analytics", label: "Platform Analytics", desc: "Real-time stats and insights" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-blue-400 text-base">{icon}</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">{label}</p>
                  <p className="text-slate-500 text-[10px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
          <p className="text-slate-400 text-xs font-medium">System Online · All services operational</p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full md:w-[55%] bg-[#0f1117] flex flex-col justify-center px-8 md:px-14 py-12">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          <span className="text-slate-200 font-black tracking-tight">SAATHI Admin</span>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full mb-4">
            <span className="material-symbols-outlined text-blue-400 text-sm">lock</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Restricted Access</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Sign In</h1>
          <p className="text-slate-500 mt-1 text-sm">Authorised personnel only. All access is logged.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-950/50 border border-red-900/50 rounded-2xl text-sm text-red-400">
            <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">gpp_bad</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-600">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@saathi.dev"
              required
              disabled={loading}
              className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600/50 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <span className="material-symbols-outlined text-slate-500 text-base">info</span>
            <p className="text-slate-500 text-[11px]">
              This session will be logged with your IP address and timestamp.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-sm shadow-lg shadow-blue-900/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                admin_panel_settings
              </span>
            )}
            {loading ? "Authenticating…" : "Access Admin Console"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">other portals</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 bg-slate-800/50 text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-base">person</span>
            Student Login
          </Link>
          <Link
            href="/tutor-login"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 bg-slate-800/50 text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-base">school</span>
            Tutor Login
          </Link>
        </div>
      </div>
    </div>
  );
}
