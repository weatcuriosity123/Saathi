"use client";

import React, { useState } from "react";

const CourseSidebar = () => {
    const [openModule, setOpenModule] = useState(4); // Defaulting module 4 open

    const modules = [
        {
            id: 1,
            title: "01. Getting Started",
            status: "locked",
            lessons: []
        },
        {
            id: 2,
            title: "02. Modern JavaScript Essentials",
            status: "locked",
            lessons: []
        },
        {
            id: 3,
            title: "03. The React Mental Model",
            status: "completed",
            lessons: []
        },
        {
            id: 4,
            title: "04. Mastering State",
            status: "active",
            lessons: [
                { id: "L1", title: "State vs Props", duration: "12:05 mins", status: "completed" },
                { id: "L2", title: "Context API Deep Dive", duration: "34:20 mins", status: "playing" },
                { id: "L3", title: "External State Libraries", duration: "28:45 mins", status: "locked" }
            ]
        },
        {
            id: 5,
            title: "05. Performance Optimization",
            status: "locked",
            lessons: []
        }
    ];

    const toggleModule = (id) => {
        setOpenModule(openModule === id ? null : id);
    };

    return (
        <aside className="w-full lg:w-[440px] bg-[#fcf8ff] flex flex-col border-l border-slate-100">
            {/* Progress Header */}
            <div className="p-8 space-y-6 sticky top-0 z-10 bg-[#fcf8ff]/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <h2 className="font-headline font-black text-xl text-on-surface uppercase tracking-tight">Course Content</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary font-label">42% Complete</span>
                    </div>
                </div>
                <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: "42%" }}></div>
                </div>
                <button className="w-full py-5 bg-[#10B981] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95 group">
                    <span className="material-symbols-outlined font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                    Mark as Complete
                </button>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-3">
                {modules.map((module) => (
                    <div key={module.id} className="group">
                        {module.status === "active" || (module.lessons.length > 0 && openModule === module.id) ? (
                            <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden ring-4 transition-all duration-300 ${openModule === module.id ? 'ring-primary/5 border-primary/10' : 'border-transparent'}`}>
                                <div 
                                    onClick={() => toggleModule(module.id)}
                                    className={`px-6 py-5 flex items-center justify-between cursor-pointer transition-colors ${openModule === module.id ? 'bg-primary/5' : 'hover:bg-primary/5'}`}
                                >
                                    <span className={`font-headline font-black text-sm uppercase tracking-[0.1em] ${openModule === module.id ? 'text-primary' : 'text-on-surface'}`}>
                                        {module.title}
                                    </span>
                                    <span className={`material-symbols-outlined transition-transform duration-300 font-['Material_Symbols_Outlined'] ${openModule === module.id ? 'rotate-180 text-primary' : ''}`}>
                                        keyboard_arrow_down
                                    </span>
                                </div>
                                
                                {openModule === module.id && (
                                    <div className="p-3 space-y-1">
                                        {module.lessons.map((lesson) => (
                                            <div 
                                                key={lesson.id}
                                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group cursor-pointer ${
                                                    lesson.status === "playing" 
                                                    ? "bg-primary/10 border-l-4 border-primary" 
                                                    : lesson.status === "locked"
                                                    ? "opacity-50"
                                                    : "hover:bg-slate-50"
                                                }`}
                                            >
                                                {lesson.status === "completed" && (
                                                    <span className="material-symbols-outlined text-[#10B981] text-[20px] font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        check_circle
                                                    </span>
                                                )}
                                                {lesson.status === "playing" && (
                                                   <span className="material-symbols-outlined text-primary text-[22px] font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                       play_circle
                                                   </span>
                                                )}
                                                {lesson.status === "locked" && (
                                                    <span className="material-symbols-outlined text-slate-400 text-[20px] font-['Material_Symbols_Outlined']">
                                                        lock
                                                    </span>
                                                )}
                                                
                                                <div className="flex-1">
                                                    <p className={`text-sm ${lesson.status === "playing" ? "font-black text-primary" : "font-semibold text-on-surface-variant"}`}>
                                                        {lesson.id}: {lesson.title}
                                                    </p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${lesson.status === "playing" ? "text-primary/70" : "text-slate-400"}`}>
                                                        {lesson.duration}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div 
                                onClick={() => !['locked'].includes(module.status) && toggleModule(module.id)}
                                className={`px-5 py-4 flex items-center justify-between rounded-2xl transition-all border border-transparent ${
                                    module.status === "locked" 
                                    ? "opacity-50 cursor-not-allowed" 
                                    : "cursor-pointer hover:bg-white hover:border-slate-100"
                                }`}
                            >
                                <span className="font-headline font-bold text-sm text-on-surface">
                                    {module.title}
                                </span>
                                {module.status === "completed" ? (
                                    <span className="material-symbols-outlined text-[#10B981] text-[20px] font-['Material_Symbols_Outlined']" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        check_circle
                                    </span>
                                ) : (
                                    <span className="material-symbols-outlined text-on-surface-variant text-[20px] font-['Material_Symbols_Outlined']">
                                        {module.status === "locked" ? "lock" : "keyboard_arrow_down"}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default CourseSidebar;
