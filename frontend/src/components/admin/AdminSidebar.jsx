"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard Overview", href: "/admin", icon: "dashboard" },
    { name: "Tutors Management", href: "/admin/tutors", icon: "school" },
    { name: "Courses Management", href: "/admin/courses", icon: "auto_stories" },
    { name: "Users Management", href: "/admin/users", icon: "group" },
    { name: "Activity Monitor", href: "/admin/activity", icon: "analytics" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/admin-login");
  };

  const avatarUrl =
    user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name ?? "A")}&backgroundColor=3525cd&textColor=ffffff`;

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40 w-72 bg-slate-50 border-r border-slate-200 font-headline text-sm font-medium tracking-tight">
      <div className="px-8 py-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_stories
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-primary tracking-tighter">SAATHI</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Admin Portal</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold border-r-4 border-primary bg-primary/5 shadow-sm"
                  : "text-slate-500 hover:text-primary hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-3">
        {/* Logged-in admin card */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <img
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
            src={avatarUrl}
          />
          <div className="overflow-hidden flex-1">
            <p className="text-on-surface font-bold truncate text-sm">{user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
