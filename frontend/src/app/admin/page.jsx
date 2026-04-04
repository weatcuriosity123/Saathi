"use client";

import React from "react";
import StatCard from "@/components/admin/StatCard";
import ActivityMonitor from "@/components/admin/ActivityMonitor";

const AdminDashboard = () => {
  const recentApplications = [
    { name: "Daniel Richardson", role: "Mathematics • Stanford Alumni", time: "2 hours ago", initial: "DR", color: "text-blue-600" },
    { name: "Sarah Chen", role: "Digital Design • Senior Instructor", time: "4 hours ago", initial: "SC", color: "text-purple-600" },
  ];

  return (
    <div className="space-y-10">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface">Dashboard Overview</h1>
          <p className="text-on-surface-variant font-medium">Welcome back, Alex. Here's your platform health snapshot.</p>
        </div>
        <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary transition-all">
                Export Data
            </button>
            <button className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                Generate Report
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Analytics Section */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon="person" label="Total Users" value="24,500" trend="12%" bgIconClass="bg-blue-50" IconColorClass="text-blue-600" />
            <StatCard icon="school" label="Active Tutors" value="1,240" trend="8%" bgIconClass="bg-purple-50" IconColorClass="text-purple-600" />
            <StatCard icon="menu_book" label="Total Courses" value="850" trend="5.4%" bgIconClass="bg-amber-50" IconColorClass="text-amber-600" />
            <StatCard icon="pending_actions" label="Pending Approvals" value="12" trendColor="red" bgIconClass="bg-red-50" IconColorClass="text-red-600" />
          </div>

          {/* Growth Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-headline">
            {/* User Growth Trend Chart */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] flex flex-col border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-lg font-black tracking-tight uppercase">User Growth Trend</h4>
                <span className="px-3 py-1 bg-slate-50 text-[10px] font-black rounded-full text-slate-400 uppercase tracking-widest leading-loose">Last 6 Months</span>
              </div>
              <div className="h-64 w-full bg-slate-50/50 rounded-2xl relative overflow-hidden flex items-end px-2 pb-2 group">
                <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,35 Q10,32 20,25 T40,20 T60,15 T80,8 T100,2" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  <path d="M0,35 Q10,32 20,25 T40,20 T60,15 T80,8 T100,2 V40 H0 Z" fill="currentColor" fillOpacity="0.08" stroke="none" />
                </svg>
                <div className="absolute inset-0 flex justify-between px-6 pt-10 pointer-events-none opacity-20">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-full w-[1px] bg-slate-400 border-dashed border-l"></div>)}
                </div>
                <div className="absolute bottom-4 left-0 w-full flex justify-between px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>

            {/* Engagement by Category Bar Chart */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] flex flex-col border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-lg font-black tracking-tight uppercase">Engagement by Category</h4>
                <span className="px-3 py-1 bg-slate-50 text-[10px] font-black rounded-full text-slate-400 uppercase tracking-widest leading-loose">Live Sessions</span>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-2">
                {[
                  { label: "STEM", height: "80%", color: "bg-primary" },
                  { label: "ARTS", height: "50%", color: "bg-primary/60" },
                  { label: "BUSI", height: "95%", color: "bg-primary" },
                  { label: "LANG", height: "40%", color: "bg-primary/40" },
                  { label: "CODE", height: "65%", color: "bg-primary/80" },
                ].map((bar, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-4 group">
                    <div className={`w-full ${bar.color} rounded-t-xl transition-all duration-700 hover:opacity-80 cursor-pointer shadow-sm`} style={{ height: bar.height }}></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Applications Table List */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] border border-slate-50">
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-lg font-black tracking-tight uppercase">Recent Applications</h4>
              <button className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View All Members</button>
            </div>
            <div className="space-y-4">
              {recentApplications.map((app, i) => (
                <div key={i} className="group flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black ${app.color} text-lg shadow-sm border border-slate-100`}>
                      {app.initial}
                    </div>
                    <div>
                      <p className="font-black text-on-surface group-hover:text-primary transition-colors">{app.name}</p>
                      <p className="text-xs text-on-surface-variant font-semibold mt-0.5">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{app.time}</span>
                    <button className="px-6 py-2.5 bg-primary text-on-primary text-[10px] font-black rounded-xl shadow-md shadow-primary/10 hover:shadow-primary/30 uppercase tracking-widest transition-all">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Monitor Right Panel */}
        <div className="col-span-12 xl:col-span-4">
          <ActivityMonitor />
        </div>
      </div>
      
      {/* Floating Action Button */}
      <button className="fixed bottom-10 right-10 bg-primary h-16 px-8 rounded-full text-on-primary shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all z-50 flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl font-['Material_Symbols_Outlined']">add</span>
        <span className="font-black text-xs uppercase tracking-widest">Add New Resource</span>
      </button>
    </div>
  );
};

export default AdminDashboard;
