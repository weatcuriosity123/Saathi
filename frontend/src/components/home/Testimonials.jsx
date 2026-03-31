const TESTIMONIALS = [
  {
    name: "Arjun Patel",
    role: "Front-end Developer",
    quote: '"I couldn\'t afford expensive bootcamps, but SAATHI gave me the exact same knowledge for just ₹199. I just landed my first dev job!"',
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
  },
  {
    name: "Meera Singh",
    role: "Marketing Associate",
    quote: '"The quality of the instructors is insane. They actually care about your progress and the community is very supportive."',
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
  },
  {
    name: "Karthik R.",
    role: "Business Analyst",
    quote: '"Verified tutors make such a difference. You know you\'re not just watching a random video, but learning from a master."',
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik",
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="text-center mb-24">
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">Student Success Stories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-surface-container-low/50 p-12 rounded-[2.5rem] space-y-8 border border-surface-container-low hover:shadow-2xl hover:bg-white transition-all duration-500 group">
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-[24px] fill-1">star</span>
                ))}
              </div>
              <p className="text-on-surface italic text-xl leading-relaxed font-medium">
                {t.quote}
              </p>
              <div className="flex items-center gap-5 pt-4">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-md bg-white" 
                />
                <div>
                  <p className="font-black text-on-surface font-headline">{t.name}</p>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest font-headline">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
