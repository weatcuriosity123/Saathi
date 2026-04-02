"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mocking logged in state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Browse", href: "/list" },
    { name: "My Courses", href: "/dashboard" },
    { name: "Mentors", href: "/mentors" }, // Placeholder routes
    { name: "Resources", href: "/resources" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-glass border-b border-outline-variant/10">
      <div className="flex justify-between items-center h-20 px-6 md:px-10 max-w-[1440px] mx-auto font-headline antialiased tracking-tight">
        
        {/* Logo & Desktop Search */}
        <div className="flex items-center gap-4 lg:gap-10">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
            SAATHI
          </Link>
          <div className="hidden lg:flex items-center bg-surface border border-outline-variant px-4 py-2.5 rounded-xl w-80 group focus-within:ring-2 ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px] font-['Material_Symbols_Outlined']">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline outline-none" 
              placeholder="Search courses, mentors..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="material-symbols-outlined text-outline hover:text-primary text-[18px] font-['Material_Symbols_Outlined']">
                close
              </button>
            )}
          </div>
        </div>

        {/* Desktop Nav Links & CTA */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-all duration-300 relative py-1 ${
                  isActive(link.href)
                    ? "text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-outline-variant/30">
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="text-primary font-bold px-4 py-2 hover:bg-primary/5 rounded-xl transition-all active:scale-95">
                  Sign In
                </Link>
                <Link href="/signup">
                  <button className="bg-primary-gradient text-white px-6 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-ambient transition-all active:scale-95">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-variant/20 transition-all border border-transparent hover:border-outline-variant/30 active:scale-95"
                >
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kalash" 
                    alt="User" 
                    className="w-9 h-9 rounded-full bg-primary/10 p-0.5"
                  />
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] font-['Material_Symbols_Outlined']">
                    keyboard_arrow_down
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-ambient border border-outline-variant/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-5 border-b border-outline-variant/10 bg-surface-container-low/30 text-center">
                      <p className="font-bold text-on-surface truncate">Kalash Sharma</p>
                      <p className="text-xs text-on-surface-variant truncate font-medium">kalash@example.com</p>
                    </div>
                    <div className="p-2">
                       <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px] font-['Material_Symbols_Outlined']">dashboard</span>
                        Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px] font-['Material_Symbols_Outlined']">person</span>
                        My Profile
                      </Link>
                      <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px] font-['Material_Symbols_Outlined']">settings</span>
                        Account Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-outline-variant/10">
                      <button 
                        onClick={() => { setIsLoggedIn(false); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-error hover:bg-error/5 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-[20px] font-['Material_Symbols_Outlined']">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="flex md:hidden items-center gap-4">
           {isLoggedIn && (
             <img 
               src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kalash" 
               alt="User" 
               className="w-8 h-8 rounded-full border border-outline-variant"
             />
           )}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-on-surface-variant p-2 focus:outline-none hover:bg-surface-variant/20 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[28px] font-['Material_Symbols_Outlined']">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-white z-[60] flex flex-col p-6 gap-8 animate-in slide-in-from-right duration-300">
          {/* Mobile Search */}
          <div className="flex items-center bg-surface border border-outline-variant px-4 py-3 rounded-xl w-full group focus-within:ring-2 ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px] font-['Material_Symbols_Outlined']">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline outline-none" 
              placeholder="Search courses, mentors..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-2">Navigation</p>
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                onClick={() => setIsOpen(false)} 
                href={link.href} 
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                  isActive(link.href) ? "bg-primary/10 text-primary font-black" : "text-on-surface-variant font-bold hover:bg-surface"
                }`}
              >
                {link.name}
                {isActive(link.href) && <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>}
              </Link>
            ))}
          </div>
          
          <hr className="border-outline-variant/30" />

          {/* Mobile Actions */}
          <div className="mt-auto flex flex-col gap-3">
            {!isLoggedIn ? (
              <>
                <Link onClick={() => setIsOpen(false)} href="/login" className="text-primary font-bold text-center py-4 bg-primary/5 rounded-2xl transition-all">
                  Sign In
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/signup">
                  <button className="w-full bg-primary-gradient text-white py-4 rounded-2xl font-black shadow-soft transition-all">
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <button 
                onClick={() => { setIsLoggedIn(false); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-3 py-4 text-error font-black bg-error/5 rounded-2xl transition-all"
              >
                <span className="material-symbols-outlined font-['Material_Symbols_Outlined']">logout</span>
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
