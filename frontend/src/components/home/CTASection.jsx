export default function CTASection() {
  const STATS = [
    { label: "Success Rate", value: "98%" },
    { label: "Expert Tutors", value: "500+" },
    { label: "Courses", value: "1k+" },
    { label: "Support", value: "24/7" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="bg-primary rounded-[3rem] p-16 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl text-on-primary space-y-10">
            <h2 className="font-headline text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">Ready to unlock your potential?</h2>
            <p className="text-on-primary-container text-xl font-medium leading-relaxed">
              Join 500,000+ students already learning on the SAATHI platform. No credit card required to browse our premium catalog.
            </p>
            <div className="flex flex-wrap gap-6">
              <button className="bg-white text-primary px-12 py-5 rounded-[1.25rem] font-black text-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95">
                Create Free Account
              </button>
              <button className="border-2 border-on-primary/30 text-on-primary px-12 py-5 rounded-[1.25rem] font-black text-lg hover:bg-white/10 transition-all active:scale-95">
                Browse Catalog
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full lg:w-auto">
            <div className="grid grid-cols-2 gap-6">
              {STATS.map((stat, i) => (
                <div 
                  key={stat.label} 
                  className={`bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-xl ${i % 2 !== 0 ? 'translate-y-10' : ''}`}
                >
                  <p className="text-white font-black text-4xl mb-1">{stat.value}</p>
                  <p className="text-on-primary-container/60 text-xs font-bold uppercase tracking-[0.2em] font-headline">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 blur-[120px] rounded-full -z-0 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[80px] rounded-full -z-0 -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
}
