"use client";

import { useState } from "react";
import { formatDuration } from "@/utils/formatters";

/** @param {{ modules: object[] }} */
export default function CourseCurriculum({ modules = [] }) {
  // Keep track of which module accordions are open
  const [openId, setOpenId] = useState(modules[0]?._id ?? null);

  if (!modules.length) {
    return (
      <section className="flex flex-col gap-8">
        <h2 className="font-headline text-3xl font-bold">Course Curriculum</h2>
        <p className="text-on-surface-variant">No modules have been added yet.</p>
      </section>
    );
  }

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-end justify-between">
        <h2 className="font-headline text-3xl font-bold">Course Curriculum</h2>
        <p className="text-sm text-on-surface-variant font-medium">
          {modules.length} module{modules.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {modules.map((module, idx) => {
          const isOpen = openId === module._id;
          const duration = module.duration ? formatDuration(module.duration) : null;

          return (
            <div
              key={module._id}
              className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Header row */}
              <button
                onClick={() => toggle(module._id)}
                className={`w-full p-6 flex justify-between items-center text-left transition-colors ${
                  isOpen ? "bg-surface-container-low/50" : "hover:bg-surface-container-low/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`material-symbols-outlined transition-transform ${
                      isOpen
                        ? "text-primary bg-primary/10 p-1.5 rounded-lg rotate-0"
                        : "text-on-surface-variant p-1.5"
                    }`}
                  >
                    {isOpen ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                  </span>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">
                      {`Module ${idx + 1}: ${module.title}`}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      {duration ? `${duration}` : "Duration pending"}
                      {module.isFree && (
                        <span className="ml-2 text-secondary font-bold uppercase tracking-wider text-[9px]">
                          Free Preview
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status badge */}
                {module.vimeoStatus && module.vimeoStatus !== "ready" && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant uppercase tracking-wider">
                    {module.vimeoStatus === "uploading"
                      ? "Processing"
                      : module.vimeoStatus === "transcoding"
                      ? "Transcoding"
                      : "Error"}
                  </span>
                )}
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="p-6 flex flex-col gap-4 bg-white border-t border-outline-variant/20">
                  {module.description && (
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {module.description}
                    </p>
                  )}

                  {/* Main video lesson row */}
                  <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-4">
                      {module.isFree ? (
                        <span
                          className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          play_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant">
                          lock
                        </span>
                      )}
                      <span
                        className={`text-on-surface text-sm font-medium transition-colors ${
                          module.isFree ? "group-hover:text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {module.title}
                      </span>
                    </div>
                    {duration && (
                      <span className="text-xs font-mono text-on-surface-variant bg-surface-container rounded px-2 py-1">
                        {duration}
                      </span>
                    )}
                  </div>

                  {/* Downloadable resources */}
                  {module.resources?.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/10">
                      {module.resources.map((res, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            attach_file
                          </span>
                          <span>{res.title}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-outline">
                            {res.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
