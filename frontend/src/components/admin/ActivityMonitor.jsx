"use client";

import React from "react";

const ActivityMonitor = () => {
    const activities = [
        { time: "10:45 AM", title: "New user registered", desc: "Marcus Miller joined the platform as a student.", color: "bg-primary", ring: "ring-primary/10" },
        { time: "09:12 AM", title: "Tutor profile approved", desc: "Dr. Elena Kostic's application for Advanced Physics finalized.", color: "bg-green-500", ring: "ring-green-50" },
        { time: "08:30 AM", title: "Course uploaded", desc: "Introduction to Quantum Computing is now live pending review.", color: "bg-amber-500", ring: "ring-amber-50" },
        { time: "Yesterday", title: "Maintenance Completed", desc: "Database optimization successful. No downtime recorded.", color: "bg-primary", ring: "ring-primary/10" },
        { time: "Yesterday", title: "Failed Login Attempt", desc: "Multiple attempts from IP: 192.168.1.4 flagging.", color: "bg-red-500", ring: "ring-red-50" },
    ];

    return (
        <aside className="sticky top-24 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] h-[calc(100vh-140px)] flex flex-col overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50">
                <h4 className="text-xl font-black font-headline mb-1 tracking-tight uppercase">Activity Monitor</h4>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest opacity-60">Real-time system updates</p>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-10 scrollbar-hide py-4">
                {activities.map((activity, index) => (
                    <div key={index} className="relative pl-8">
                        <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full ${activity.color} border-2 border-white ring-4 ${activity.ring}`}></div>
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[6.5px] top-6 w-[1px] h-20 bg-slate-100"></div>
                        )}
                        <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{activity.time}</p>
                        <div className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group">
                            <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{activity.title}</p>
                            <p className="text-xs text-on-surface-variant mt-2 font-medium leading-relaxed">{activity.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
                <button className="w-full py-4 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:text-primary hover:border-primary hover:shadow-lg transition-all uppercase tracking-widest active:scale-95">
                    Download System Logs
                </button>
            </div>
        </aside>
    );
};

export default ActivityMonitor;
