"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/tutor-dashboard" },
  { icon: "school", label: "My Courses", href: "/tutor-dashboard" },
  { icon: "cloud_upload", label: "Upload Course", href: "/create-course" },
  { icon: "verified_user", label: "Verification", href: "/verification" },
];

export default function TutorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/tutor-login");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-6 space-y-8 z-50 border-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
        </div>
        <div>
          <h1 className="text-lg font-black text-primary tracking-tight">SAATHI</h1>
          <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Tutor Portal</p>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "text-primary font-bold bg-surface-container-lowest shadow-sm translate-x-1"
                  : "text-on-surface-variant hover:bg-white/50 hover:translate-x-1"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation & Support */}
      <div className="pt-6 mt-6 border-t border-outline-variant/20 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-white/50 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-white/50 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>

        <button className="w-full mt-4 bg-primary text-on-primary py-3 px-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          Get Support
        </button>
      </div>
    </aside>
  );
}
