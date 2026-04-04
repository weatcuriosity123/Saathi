export default function CourseSidebar() {
  const INCLUSIONS = [
    { icon: "smart_display", text: "24 hours on-demand video" },
    { icon: "description", text: "15 downloadable resources" },
    { icon: "devices", text: "Access on mobile and TV" },
    { icon: "workspace_premium", text: "Certificate of completion" },
  ];

  return (
    <div className="flex flex-col gap-6 sticky top-32">
      <div className="bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden flex flex-col border border-outline-variant/10">
        {/* Course Preview */}
        <div className="aspect-video w-full bg-slate-200 relative group overflow-hidden">
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" 
            alt="Course Preview" 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform group-active:scale-95">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </div>
          </div>
        </div>

        {/* Purchase Details */}
        <div className="p-8 flex flex-col gap-8">
          <div className="flex items-end gap-3">
            <span className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">₹14,999</span>
            <span className="text-on-surface-variant line-through text-lg mb-1">₹29,999</span>
            <span className="text-tertiary font-bold text-[10px] bg-tertiary/10 px-2 py-1 rounded-lg mb-1.5 uppercase tracking-wide">
              50% OFF
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <button className="w-full py-5 bg-primary-gradient text-white font-extrabold text-lg rounded-2xl shadow-soft hover:-translate-y-1 hover:shadow-ambient transition-all active:scale-[0.98]">
              Buy Now
            </button>
            <button className="w-full py-4 bg-surface-container-high text-primary font-bold rounded-2xl hover:bg-surface-container-highest transition-colors active:scale-[0.98]">
              Add to Cart
            </button>
          </div>
          
          <p className="text-[10px] text-center text-on-surface-variant font-medium tracking-wide uppercase">
            30-Day Money-Back Guarantee • Lifetime Access
          </p>

          <div className="flex flex-col gap-5 pt-6 border-t border-outline-variant/10">
            <p className="font-bold text-sm text-on-surface">This course includes:</p>
            <ul className="flex flex-col gap-4">
              {INCLUSIONS.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3.5 text-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Special Offer */}
      <div className="bg-primary p-8 rounded-3xl flex flex-col gap-4 shadow-lg">
        <p className="text-white font-extrabold text-lg">Special Offer for Teams</p>
        <p className="text-on-primary text-sm leading-relaxed opacity-90">
          Enroll 5+ members and get an additional 20% discount on total billing.
        </p>
        <a className="text-on-primary font-bold text-sm flex items-center gap-2 group mt-2" href="#">
          Contact Sales 
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1.5 transition-transform">
            arrow_forward
          </span>
        </a>
      </div>
    </div>
  );
}
