"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthForm({ initialView = "login" }) {
  const [view, setView] = useState(initialView);
  const isLogin = view === "login";
  const router = useRouter();

  const toggleView = (newView) => {
    setView(newView);
    // Optionally update the URL without full refresh to match the active tab
    router.replace(`/${newView}`, { scroll: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: implement auth flow here
  };  

  return (
    <div className="w-full max-w-5xl flex flex-col md:flex-row bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(77,68,227,0.08)] min-h-[640px] md:h-[640px]">
      {/* Left Side: Visual Illustration/Brand Area */}
      <div className="hidden md:flex md:w-1/2 relative bg-primary-container items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            alt="Abstract flowing gradients of indigo and emerald"
            className="w-full h-full object-cover"
            data-alt="Soft flowing abstract gradient background with deep indigo, electric purple and emerald green highlights with a grainy paper texture"
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
          {/* Floating Glass Card for "The Breathable Offset" */}
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
        {/* Decorative Emerald Accent */}
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-secondary rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Right Side: Auth Form Content */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface-container-lowest relative">
        {/* Logo for Mobile Only */}
        <div className="md:hidden mt-8 mb-8">
          <h2 className="font-headline font-extrabold text-2xl text-primary tracking-tighter">
            SAATHI
          </h2>
        </div>

        <div className="mb-10 text-left">
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-on-surface-variant text-sm">
            {isLogin
              ? "Please enter your details to access your dashboard."
              : "Register as a learner and begin exploring courses."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-2 relative">
              <label
                className="font-label text-xs font-semibold text-on-surface uppercase tracking-wider"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="w-full px-5 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                id="name"
                placeholder="Jane Doe"
                type="text"
                required
              />
            </div>
          )}
          {/* Email Input */}
          <div className="flex flex-col gap-2 relative">
            <label
              className="font-label text-xs font-semibold text-on-surface uppercase tracking-wider"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full px-5 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
              id="email"
              placeholder="name@example.com"
              type="email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label
                className="font-label text-xs font-semibold text-on-surface uppercase tracking-wider"
                htmlFor="password"
              >
                Password
              </label>
              {isLogin && (
                <a
                  className="text-xs text-primary font-medium hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                className="w-full px-5 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/30 transition-all outline-none"
                id="password"
                placeholder="••••••••"
                type="password"
                required
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">
                  visibility
                </span>
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="bg-primary-gradient text-white py-4 rounded-xl font-headline font-bold text-lg hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-primary/20 mt-2"
            type="submit"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          <div className="text-center md:mt-1">
            <button
              onClick={() => toggleView(isLogin ? "signup" : "login")}
              className="text-sm text-primary font-semibold hover:underline transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              type="button"
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

          {/* Social Login */}
          <div className="w-full mb-2 flex flex-col items-center">
            <button
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-semibold text-sm text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
              type="button"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5"
                data-alt="Official Google G colorful icon logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCmSqEQ4W9sEkXgzQJUP_HTk0uP9BIfqxxQ4gOAlSr-vSxMLq-JLvhk5wZvyWszcW_oxHNkeJeUyqrq97sNsY9DNRVrKH7Np1fBXvY9VzGwF2K-y0g8t-voVGjNvWtukHN4-4smbGygN10FEQg58aaBCgJq7Ak9nHxq0BqIQ16MGXa4DavrriOSy9HKb9CyrNOtSkh3LgAq5ZG1Ut8t0u8TadvFAbi91-oBdcTOGhMSLQZmB0fWcOKVFixQHD_G2lQnPF-VweB2l8"
              />
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
