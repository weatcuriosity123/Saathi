"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import { formatDuration } from "@/utils/formatters";

/**
 * CourseSidebar — shows all course modules with completion status.
 *
 * Props:
 *   modules[]         – full module list for this course
 *   progress          – { completedModules[], percentage, lastModuleId }
 *   currentModuleId   – currently playing module _id
 *   onModuleSelect    – (moduleId) => void
 *   onToggleComplete  – () => void  (mark/unmark current module)
 *   isCurrentCompleted – boolean
 *   marking           – boolean (API in-flight)
 *   loading           – boolean (initial module fetch)
 */
export default function CourseSidebar({
  modules,
  progress,
  currentModuleId,
  onModuleSelect,
  onToggleComplete,
  isCurrentCompleted,
  marking,
  loading,
}) {
  const pct = progress?.percentage ?? 0;
  const completedIds = new Set(
    (progress?.completedModules ?? []).map((id) => id.toString())
  );

  return (
    <aside className="w-full lg:w-[420px] shrink-0 bg-[#faf8ff] flex flex-col border-l border-slate-100 lg:h-[calc(100vh-80px)] lg:overflow-hidden">
      {/* ── Progress header ─────────────────────────────────────────────────── */}
      <div className="p-8 space-y-5 border-b border-slate-100 bg-[#faf8ff]/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-black text-lg text-on-surface uppercase tracking-tight">
            Course Content
          </h2>
          <span className="text-sm font-bold text-primary">{pct}% Complete</span>
        </div>

        <ProgressBar value={pct} />

        {/* Mark complete / incomplete */}
        <button
          onClick={onToggleComplete}
          disabled={marking || !currentModuleId}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isCurrentCompleted
              ? "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
              : "bg-secondary text-white shadow-lg shadow-secondary/20 hover:-translate-y-0.5 hover:shadow-secondary/40"
          }`}
        >
          {marking ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span
              className="material-symbols-outlined text-lg"
              style={isCurrentCompleted ? {} : { fontVariationSettings: "'FILL' 1" }}
            >
              {isCurrentCompleted ? "undo" : "check_circle"}
            </span>
          )}
          {isCurrentCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        </button>
      </div>

      {/* ── Module list ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <div className="space-y-2 px-2 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 bg-surface-container-high rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : modules.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12 text-sm">
            No modules available yet.
          </p>
        ) : (
          modules.map((mod, idx) => {
            const isActive = mod._id === currentModuleId;
            const isDone = completedIds.has(mod._id.toString());

            return (
              <button
                key={mod._id}
                onClick={() => onModuleSelect(mod._id)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-4 transition-all border-l-4 ${
                  isActive
                    ? "bg-primary/10 border-primary"
                    : "border-transparent hover:bg-white hover:shadow-sm"
                }`}
              >
                {/* Status icon */}
                <div className="shrink-0 w-6 flex items-center justify-center">
                  {isDone ? (
                    <span
                      className="material-symbols-outlined text-secondary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  ) : isActive ? (
                    <span
                      className="material-symbols-outlined text-primary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_circle
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <p
                    className={`text-sm font-semibold leading-snug truncate ${
                      isActive ? "text-primary font-bold" : "text-on-surface"
                    }`}
                  >
                    {mod.title}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-2">
                    {mod.duration ? formatDuration(mod.duration) : "—"}
                    {mod.isFree && (
                      <span className="text-secondary font-bold">FREE</span>
                    )}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
