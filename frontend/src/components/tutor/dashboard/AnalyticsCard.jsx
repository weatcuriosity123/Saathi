export default function AnalyticsCard() {
  const BARS = [
    { height: "40%" },
    { height: "65%" },
    { height: "90%" },
    { height: "75%", active: true },
    { height: "55%" },
    { height: "80%" },
  ];

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl">
      <h3 className="text-lg font-bold mb-6 text-on-surface">Student Engagement</h3>
      <div className="flex items-end gap-3 h-32 mb-6">
        {BARS.map((bar, idx) => (
          <div 
            key={idx} 
            style={{ height: bar.height }}
            className={`flex-1 rounded-t-lg transition-colors ${
              bar.active ? 'bg-primary' : 'bg-primary/20 hover:bg-primary'
            }`}
          ></div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Daily Active Students</span>
          <span className="font-bold text-on-surface">342</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-secondary h-full w-[68%]"></div>
        </div>
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
          Engagement is up by 4% compared to last week
        </p>
      </div>
    </div>
  );
}
