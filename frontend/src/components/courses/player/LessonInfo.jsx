"use client";

import React, { useState } from "react";

const LessonInfo = ({ moduleNum, lessonNum, title, description, points }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Resources", "Discussion", "Notes"];

  return (
    <div className="p-8 md:p-14 space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary font-bold tracking-[0.15em] text-xs uppercase font-headline">
            <span className="px-2 py-1 bg-primary/10 rounded">Module {moduleNum || "04"}</span>
            <span className="w-1.5 h-1.5 bg-outline-variant rounded-full"></span>
            <span>Lesson {lessonNum || "02"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight leading-tight max-w-3xl">
            {title || "Advanced State Management with Context API"}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="group px-8 py-4 rounded-2xl bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all duration-300 hover:bg-surface-container-highest hover:-translate-x-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1 font-['Material_Symbols_Outlined']">chevron_left</span>
            Previous
          </button>
          <button className="group px-8 py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-1 flex items-center gap-2">
            Next Lesson
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 font-['Material_Symbols_Outlined']">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Tabs/Description Area */}
      <div className="space-y-8">
        <div className="flex gap-10 border-b border-outline-variant/10 text-base font-bold font-label overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 transition-colors relative whitespace-nowrap ${
                activeTab === tab
                  ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-1 after:bg-primary after:rounded-full"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-4xl space-y-6">
          {activeTab === "Overview" && (
            <>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {description || "In this lesson, we dive deep into the world of React's Context API. We'll explore why state management is crucial for large-scale applications and how to effectively avoid \"prop drilling\" while maintaining high performance. By the end of this session, you'll be able to architect global state providers that are both scalable and clean."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(points || [
                  "Understanding limitations of local state",
                  "Creating Custom Provider Hooks",
                  "Optimizing re-renders"
                ]).map((point, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-secondary font-bold font-['Material_Symbols_Outlined']">check_circle</span>
                    <span className="text-sm font-medium text-on-surface-variant">{point}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab !== "Overview" && (
            <div className="py-20 text-center text-on-surface-variant/50 flex flex-col items-center gap-4">
               <span className="material-symbols-outlined text-6xl font-['Material_Symbols_Outlined']">construction</span>
               <p className="font-medium">{activeTab} content coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonInfo;
