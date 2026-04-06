"use client";

import { useAuth } from "@/context/AuthContext";

const AdminTopBar = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-18rem)] flex justify-between items-center px-10 py-5 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 w-96 group focus-within:ring-2 ring-primary/20 transition-all">
        <span className="material-symbols-outlined text-slate-400 mr-2 font-['Material_Symbols_Outlined']">search</span>
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full font-body placeholder:text-slate-400 outline-none" 
          placeholder="Search analytics, student IDs, transactions..." 
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-full transition-all">
          <span className="material-symbols-outlined font-['Material_Symbols_Outlined']">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-100"></div>
        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full">
          <span className="text-xs font-black text-green-700 uppercase tracking-widest font-label">System Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        </div>
        {user?.name && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-on-surface hidden lg:block">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminTopBar;
