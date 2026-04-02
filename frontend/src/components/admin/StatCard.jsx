import React from "react";

const StatCard = ({ icon, label, value, trend, trendColor = "green", IconColorClass = "text-blue-600", bgIconClass = "bg-blue-50" }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-[0_12px_32px_rgba(0,88,190,0.04)] flex flex-col justify-between group hover:translate-y-[-4px] transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${bgIconClass} rounded-xl ${IconColorClass}`}>
          <span className="material-symbols-outlined font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
        {trend && (
          <span className={`${trendColor === 'green' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1`}>
            <span className="material-symbols-outlined text-xs font-['Material_Symbols_Outlined']">
              {trendColor === 'green' ? 'trending_up' : 'trending_down'}
            </span> 
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-1">{label}</p>
        <h3 className="text-3xl font-bold font-headline tracking-tighter">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
