export default function WhySaathi() {
  const BENEFITS = [
    {
      title: "True Affordability",
      description: "No subscriptions, no hidden fees. Buy only what you need, with courses starting lower than the price of a coffee.",
      icon: "payments",
      color: "emerald",
      bg: "bg-emerald-50/50",
      iconColor: "text-emerald-500",
      shadow: "shadow-emerald-100",
    },
    {
      title: "Verified Tutors",
      description: "Every instructor undergoes a rigorous verification process to ensure you learn from real-world experts and academicians.",
      icon: "verified_user",
      color: "indigo",
      bg: "bg-primary/5",
      iconColor: "text-primary",
      shadow: "shadow-primary/10",
    },
    {
      title: "Total Flexibility",
      description: "Learn at your own pace. Once purchased, the content is yours forever. Study on mobile, tablet, or web.",
      icon: "schedule",
      color: "amber",
      bg: "bg-amber-50/50",
      iconColor: "text-amber-500",
      shadow: "shadow-amber-100",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">Why SAATHI?</h2>
          <p className="text-on-surface-variant text-xl font-medium">
            We're reimagining education by removing the price barrier while maintaining world-class quality through verified mentorship.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {BENEFITS.map((benefit) => (
            <div 
              key={benefit.title} 
              className={`p-12 rounded-[2.5rem] ${benefit.bg} space-y-8 flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-300`}
            >
              <div className={`w-20 h-20 bg-white shadow-xl ${benefit.shadow} ${benefit.iconColor} flex items-center justify-center rounded-3xl group-hover:rotate-6 transition-transform`}>
                <span className="material-symbols-outlined text-4xl">{benefit.icon}</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold font-headline text-on-surface">{benefit.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
