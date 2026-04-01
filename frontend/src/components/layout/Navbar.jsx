"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-glass">
      <div className="flex justify-between items-center h-20 px-6 md:px-10 max-w-[1440px] mx-auto font-headline antialiased tracking-tight">
        
        {/* Logo & Desktop Search */}
        <div className="flex items-center gap-4 lg:gap-10">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
            SAATHI
          </Link>
          <div className="hidden lg:flex items-center bg-surface border border-outline-variant px-4 py-2.5 rounded-xl w-80 group focus-within:ring-2 ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline outline-none" 
              placeholder="Search courses, mentors..." 
              type="text"
            />
          </div>
        </div>

        {/* Desktop Nav Links & CTA */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link href="/list" className="text-primary font-bold border-b-2 border-primary pb-1">Browse</Link>
            <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors duration-200">My Courses</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200">Mentors</Link>
            <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200">Resources</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-primary font-semibold px-4 py-2 hover:bg-primary/5 rounded-xl transition-all active:scale-95">
              Sign In
            </Link>
            <Link href="/signup">
              <button className="bg-primary-gradient text-white px-6 py-2.5 rounded-xl font-bold shadow-soft hover:shadow-ambient transition-all active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-on-surface-variant p-2 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-outline-variant shadow-ambient flex flex-col p-6 gap-6 transition-all">
          {/* Mobile Search */}
          <div className="flex items-center bg-surface border border-outline-variant px-4 py-3 rounded-xl w-full group focus-within:ring-2 ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline outline-none" 
              placeholder="Search courses, mentors..." 
              type="text"
            />
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-4 text-sm font-medium">
            <Link onClick={() => setIsOpen(false)} href="/list" className="text-primary font-bold">Browse</Link>
            <Link onClick={() => setIsOpen(false)} href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors">My Courses</Link>
            <Link onClick={() => setIsOpen(false)} href="#" className="text-on-surface-variant hover:text-primary transition-colors">Mentors</Link>
            <Link onClick={() => setIsOpen(false)} href="#" className="text-on-surface-variant hover:text-primary transition-colors">Resources</Link>
          </div>
          
          <hr className="border-outline-variant" />

          {/* Mobile Actions */}
          <div className="flex flex-col gap-3">
            <Link onClick={() => setIsOpen(false)} href="/login" className="text-primary font-semibold text-center py-3 bg-primary/5 rounded-xl transition-all active:scale-95">
              Sign In
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/signup">
              <button className="w-full bg-primary-gradient text-white py-3 rounded-xl font-bold shadow-soft transition-all active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
