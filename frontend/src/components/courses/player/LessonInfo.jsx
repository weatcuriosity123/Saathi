"use client";

import { useState } from "react";
import { formatDuration } from "@/utils/formatters";

/**
 * LessonInfo — shows title, description, resources, and prev/next navigation.
 *
 * Props:
 *   module  – current module object ({ title, description, duration, points, isFree, resources[] })
 *   onPrev  – () => void | null
 *   onNext  – () => void | null
 */
export default function LessonInfo({ module, onPrev, onNext }) {
  const [activeTab, setActiveTab] = useState("Overview");

  if (!module) {
    return (
      <div className="p-14 flex items-center justify-center">
        <p className="text-on-surface-variant text-sm">Select a module to begin.</p>
      </div>
    );
  }

  const tabs = ["Overview", "Resources"];

  return (
    <div className="p-8 md:p-14 space-y-10">
      {/* ── Title + navigation ─────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
        <div className="space-y-4 flex-grow">
          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.12em]">
            {module.isFree && (
              <span className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-full">
                Free Preview
              </span>
            )}
            {module.duration > 0 && (
              <span className="px-2.5 py-1 bg-primary/10 rounded-full">
                {formatDuration(module.duration)}
              </span>
            )}
            {module.points > 0 && (
              <span className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container rounded-full">
                +{module.points} XP
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface tracking-tight leading-tight max-w-3xl">
            {module.title}
          </h1>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className="group px-6 py-3.5 rounded-2xl bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all hover:bg-surface-container-highest hover:-translate-x-0.5 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1 group-disabled:translate-x-0">
              chevron_left
            </span>
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={!onNext}
            className="group px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 group-disabled:translate-x-0">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex gap-8 border-b border-outline-variant/10 text-base font-bold overflow-x-auto pb-1">
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
              {tab === "Resources" && module.resources?.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary text-white rounded-full px-1.5 py-0.5 font-black">
                  {module.resources.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "Overview" && (
          <div className="max-w-4xl">
            {module.description ? (
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {module.description}
              </p>
            ) : (
              <p className="text-on-surface-variant/50 italic text-sm">
                No description provided for this module.
              </p>
            )}
          </div>
        )}

        {/* Resources */}
        {activeTab === "Resources" && (
          <div className="max-w-4xl space-y-3">
            {module.resources?.length > 0 ? (
              module.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                >
                  <span className="material-symbols-outlined text-primary text-2xl shrink-0">
                    download
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                      {resource.title}
                    </p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                      {resource.type}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm shrink-0 group-hover:text-primary transition-colors">
                    open_in_new
                  </span>
                </a>
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-outline">
                  folder_open
                </span>
                <p className="text-on-surface-variant/60 text-sm">
                  No downloadable resources for this module.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
