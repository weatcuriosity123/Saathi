export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} SAATHI</p>
        <p>Learn smarter, grow faster.</p>
      </div>
    </footer>
  );
}
