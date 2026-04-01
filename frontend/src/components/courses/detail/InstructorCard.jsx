export default function InstructorCard() {
  return (
    <section className="bg-primary/5 p-12 rounded-3xl flex flex-col md:flex-row gap-10 items-start border border-primary/10">
      <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-white">
        <img 
          className="w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" 
          alt="Instructor Portrait" 
        />
      </div>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">Lead Instructor</span>
          <h3 className="font-headline text-3xl font-extrabold text-on-surface">Dr. Aris Thorne</h3>
          <p className="text-on-surface-variant font-medium">PhD in Cognitive Neuroscience, Lead Designer at Synapse-X</p>
        </div>
        
        <p className="text-on-surface leading-relaxed text-base opacity-90">
          With over 15 years of experience in human-computer interaction, Dr. Thorne has pioneered several patents in non-invasive neural telemetry. He has taught over 50,000 students globally and is a frequent keynote speaker at MIT and Stanford.
        </p>

        <div className="flex flex-wrap gap-6 items-center pt-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-secondary">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span>Verified Instructor</span>
          </div>
          <div className="w-1.5 h-1.5 bg-outline-variant/40 rounded-full hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">school</span>
            <span>42 Courses Published</span>
          </div>
        </div>
      </div>
    </section>
  );
}
