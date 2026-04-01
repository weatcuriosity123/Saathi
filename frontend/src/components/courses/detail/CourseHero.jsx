export default function CourseHero() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-widest">
          Bestseller
        </span>
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
          Design Strategy
        </span>
      </div>
      
      <div className="flex flex-col gap-4">
        <h1 className="font-headline text-5xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
          Mastering Neural Interface Design:<br />
          The Future of Human-AI Synergy
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          Transition from traditional UX to neuro-centric design. Learn how to architect seamless cognitive flows between digital systems and the human mind using modern interface paradigms.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span className="font-bold text-on-surface">4.9</span>
          <span className="text-on-surface-variant text-sm">(2,450 ratings)</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-xl">group</span>
          <span className="text-sm font-medium">12,403 students enrolled</span>
        </div>
      </div>
    </section>
  );
}
