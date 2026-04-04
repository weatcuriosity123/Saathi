"use client";

import Link from "next/link";

export default function TutorHeader() {
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
              <p className="text-sm font-bold leading-none text-on-surface">Prof. Elena Vance</p>
              <p className="text-[10px] text-outline font-medium mt-1">Physics & Astronomy</p>
            </div>
            <img
              alt="Tutor Profile Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-container/20 group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXYke9Mso0J0hp0o_lFKR1JiISxojDuH8MT3R9lWAobp9kR08mH3eKGr-qyLyHe60QhMSkkI_QLvriDLEjsS1W1T3k9UnRNYqngjBkcVd0vKe5NIUHo8o4T_lNAvW5lcKhHL4ickGwYmrif2hpO2RpSn5OW1fmScey_Bo_VpnzAouRQ_WGkEO9-v0Hk_Y4xfHIzPGtQoO7lKxfRAPn5Fi-0o6j-8tTDKBnHgoqhtu3AGEsITE8iBomD295Mx-ylzOqRYNDkhbEynfV"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
