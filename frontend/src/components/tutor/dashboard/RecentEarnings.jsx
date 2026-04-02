const EARNINGS = [
  { id: 1, title: "Course Sale: React", time: "2 hours ago", amount: "+₹1,499" },
  { id: 2, title: "Course Sale: JS", time: "5 hours ago", amount: "+₹999" },
  { id: 3, title: "Bundle Pack x3", time: "Yesterday", amount: "+₹3,299" },
];

export default function RecentEarnings() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-on-surface">Recent Earnings</h3>
        <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">more_horiz</span>
      </div>
      
      <div className="space-y-5">
        {EARNINGS.map((item) => (
          <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">call_made</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">{item.title}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.time}</p>
            </div>
            <div className="text-sm font-black text-secondary">{item.amount}</div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-outline-variant text-slate-500 text-sm font-bold hover:bg-slate-50 transition-colors">
        View Statement
      </button>
    </div>
  );
}
