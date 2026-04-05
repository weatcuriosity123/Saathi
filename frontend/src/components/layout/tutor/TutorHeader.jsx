"use client";

import { useAuth } from "@/context/AuthContext";

export default function TutorHeader() {
  const { user } = useAuth();

  const avatarUrl = user?.avatar
    || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name ?? "T")}&backgroundColor=4f46e5&textColor=ffffff`;

  return (
    <header className="fixed top-0 right-0 left-64 bg-surface/70 backdrop-blur-xl z-40 border-none shadow-sm">
      <div className="flex justify-between items-center w-full px-10 py-4 max-w-[1440px] mx-auto">
        {/* Search Bar */}
        <div className="flex items-center gap-4 bg-surface-container-high px-4 py-2 rounded-full w-96">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline/60 outline-none"
            placeholder="Search resources..."
            type="text"
          />
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-6">
          <button className="relative text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/30">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none text-on-surface">{user?.name ?? "Tutor"}</p>
              <p className="text-[10px] text-outline font-medium mt-1">
                {user?.tutorProfile?.expertise ?? "Tutor"}
              </p>
            </div>
            <img
              alt="Tutor Profile Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-container/20"
              src={avatarUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
