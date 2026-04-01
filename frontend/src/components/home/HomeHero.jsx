import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-white">
      <div className="max-w-[1440px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-5 py-2 rounded-full border border-primary/10">
            <span className="material-symbols-outlined text-[18px] fill-1">verified</span>
            <span className="text-xs font-bold uppercase tracking-widest font-headline">Education for everyone</span>
          </div>
          <h1 className="font-headline text-7xl md:text-8xl font-extrabold text-on-surface tracking-tight leading-[0.95]">
            Affordable Learning for <br />
            <span className="text-primary italic">Every Student</span>
          </h1>
          <p className="text-on-surface-variant text-xl leading-relaxed max-w-2xl font-medium">
            Access world-class education from verified experts starting at just ₹100. 
            High-quality modules designed for the next generation of achievers.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <Link href="/courses">
              <button className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95">
                Start Learning
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </Link>
            <Link href="/courses">
              <button className="bg-surface-container-low text-on-surface px-10 py-5 rounded-2xl font-bold text-lg hover:-translate-y-1 hover:bg-surface-container-high transition-all active:scale-95">
                View All Courses
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-6 pt-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  alt="Student"
                  className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm bg-surface-container"
                />
              ))}
            </div>
            <p className="text-sm text-on-surface-variant font-semibold">
              Joined by <span className="text-on-surface font-extrabold">12,000+</span> students this month
            </p>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="relative z-10 p-4 rounded-[2rem] bg-gradient-to-br from-primary/5 to-white shadow-2xl rotate-2 border border-primary/10">
            <img
              src="/images/dashboard-preview.png"
              alt="Platform dashboard"
              className="rounded-2xl w-full aspect-[4/3] object-cover shadow-inner"
            />
            <div className="absolute -bottom-8 -left-8 bg-primary text-on-primary p-7 rounded-3xl shadow-2xl -rotate-6 border-4 border-white">
              <p className="text-4xl font-black">₹100</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 leading-none">Starting Price</p>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        </div>
      </div>
    </section>
  );
}
