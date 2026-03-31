import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-surface-container-low bg-white font-headline text-on-surface text-sm">
      <div className="py-12 px-10 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto gap-12">
        <div className="flex flex-col items-center md:items-start gap-5">
          <span className="text-2xl font-black text-primary tracking-tighter">SAATHI</span>
          <p className="max-w-xs text-center md:text-left text-on-surface-variant font-medium leading-relaxed">
            © {new Date().getFullYear()} SAATHI. Built for the Editorial Architect. Empowering learners everywhere.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <Link href="#" className="text-on-surface-variant hover:text-primary hover:underline underline-offset-4 transition-colors font-semibold">Privacy Policy</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary hover:underline underline-offset-4 transition-colors font-semibold">Terms of Service</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary hover:underline underline-offset-4 transition-colors font-semibold">Security</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary hover:underline underline-offset-4 transition-colors font-semibold">Status</Link>
        </div>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-all p-2 bg-surface-container-lowest rounded-xl">language</span>
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-all p-2 bg-surface-container-lowest rounded-xl">share</span>
        </div>
      </div>
    </footer>
  );
}
