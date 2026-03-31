import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(79,70,229,0.08)]">
      <div className="flex justify-between items-center h-20 px-10 max-w-[1440px] mx-auto font-headline antialiased tracking-tight">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
            SAATHI
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-primary font-bold border-b-2 border-primary pb-1 hover:text-primary/80 transition-colors duration-200">
              Platform
            </Link>
            <Link href="/courses" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">
              Solutions
            </Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">
              Resources
            </Link>
            <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-200">
              Pricing
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-on-surface-variant font-semibold hover:text-primary transition-colors duration-200 active:scale-95 duration-150">
            Sign In
          </Link>
          <Link href="/signup">
            <button className="bg-primary text-on-primary px-7 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:bg-primary/90 transition-all active:scale-95 duration-150">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
