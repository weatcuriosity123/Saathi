export default function HowItWorks() {
  const STEPS = [
    {
      num: 1,
      title: "Discover",
      description: "Browse our library of high-impact courses across any category using intelligent search.",
    },
    {
      num: 2,
      title: "Enroll",
      description: "Pay a one-time minimal fee and get lifetime access immediately to all materials.",
    },
    {
      num: 3,
      title: "Achieve",
      description: "Learn from experts, earn your certificate, and level up your career with proof of skills.",
    },
  ];

  return (
    <section className="py-32 bg-surface-container-low/30 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="text-center mb-24">
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Dotted line connector */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-outline-variant/30 -z-0"></div>
          
          {STEPS.map((step) => (
            <div key={step.num} className="relative p-10 text-center space-y-6 group z-10 bg-white rounded-3xl shadow-sm border border-surface-container-low hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                {step.num}
              </div>
              <h4 className="text-2xl font-extrabold text-on-surface font-headline">{step.title}</h4>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
