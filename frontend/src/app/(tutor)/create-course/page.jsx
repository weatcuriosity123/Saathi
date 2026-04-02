"use client";

import React, { useState } from "react";
import { 
  Info, 
  ImageIcon, 
  Layers, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Eye, 
  ChevronRight 
} from "lucide-react";

export default function CreateCoursePage() {
  const [publishStatus, setPublishStatus] = useState("draft");

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-display-md font-black tracking-tight text-on-surface mb-3 font-headline">
          Course Editor
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Bring your expertise to life. Draft, design, and deploy your curriculum on SAATHI's global stage.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1: Basic Info */}
        <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">info</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Basic Information</h2>
              <p className="text-sm text-on-surface-variant">Core details that will define your course identity.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2 space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Course Title</label>
              <input 
                className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface font-medium placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                placeholder="e.g. Masterclass in Modern Architecture" 
                type="text"
              />
            </div>
            
            <div className="col-span-2 space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Description</label>
              <textarea 
                className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface font-medium placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none" 
                placeholder="Describe what students will achieve in this course..." 
                rows={4}
              ></textarea>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Category</label>
              <div className="relative group">
                <select className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface font-medium focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none appearance-none cursor-pointer">
                  <option>Design & Arts</option>
                  <option>Programming</option>
                  <option>Business & Finance</option>
                  <option>Health & Wellness</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/60 material-symbols-outlined">expand_more</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Price (USD)</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black">$</span>
                <input 
                  className="w-full bg-surface-container-high border-none rounded-xl pl-10 pr-5 py-4 text-on-surface font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                  placeholder="49.99" 
                  type="number"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Course Thumbnail */}
        <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-2xl">image</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Course Thumbnail</h2>
              <p className="text-sm text-on-surface-variant">Attract students with a high-fidelity cover image.</p>
            </div>
          </div>
          
          <div className="group relative border-2 border-dashed border-outline-variant hover:border-primary/40 hover:bg-primary-fixed/10 transition-all duration-300 cursor-pointer rounded-3xl h-64 flex flex-col items-center justify-center text-center p-8 overflow-hidden bg-surface-container-low/30">
            <div className="w-20 h-20 rounded-full bg-white shadow-ambient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'wght' 300" }}>cloud_upload</span>
            </div>
            <p className="text-on-surface text-lg font-bold">Drag & drop your thumbnail here</p>
            <p className="text-on-surface-variant/60 text-sm mt-1 font-medium">Supports JPG, PNG • High Resolution Recommended (16:9)</p>
          </div>
        </section>

        {/* Section 3: Curriculum Builder */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-surface-container-highest pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">layers</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface font-headline">Curriculum Builder</h2>
                <p className="text-sm text-on-surface-variant">Structure your course into digestible learning modules.</p>
              </div>
            </div>
            <button className="flex items-center gap-2.5 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-sm">
              <span className="material-symbols-outlined text-xl">add</span>
              Add Module
            </button>
          </div>

          {/* Module Item */}
          <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10 relative group">
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors">
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
            
            <div className="flex items-start gap-8">
              <div className="flex flex-col items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shadow-ambient-indigo">01</span>
                <div className="w-[1.5px] h-24 bg-gradient-to-b from-primary-fixed to-transparent"></div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-8 pt-1">
                <div className="col-span-2 space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Module Title</label>
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                    type="text" 
                    defaultValue="Introduction to Spatial Design"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Video URL (Vimeo)</label>
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 text-on-surface font-medium placeholder:text-on-surface-variant/40 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none italic" 
                    placeholder="https://vimeo.com/..." 
                    type="text"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.15em] text-outline">Reward Points</label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-600 material-symbols-outlined text-lg">stars</span>
                    <input 
                      className="w-full bg-surface-container-high border-none rounded-xl pl-12 pr-5 py-3.5 text-on-surface font-bold focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                      type="number" 
                      defaultValue="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Module Placeholder */}
          <div className="bg-surface-container-low/40 rounded-2xl p-10 border-2 border-dashed border-outline-variant/30 flex items-center justify-between group cursor-pointer hover:bg-surface-container-low transition-all">
            <div className="flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full border-2 border-outline-variant/60 flex items-center justify-center font-black text-xs text-outline">02</div>
              <div>
                <p className="text-on-surface font-black text-lg">Add New Learning Block</p>
                <p className="text-on-surface-variant text-sm font-medium">Define clear objectives and resources for this module.</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant transition-transform group-hover:translate-x-2">chevron_right</span>
          </div>
        </section>

        {/* Section 4: Publish Settings */}
        <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10 flex items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-tertiary"></div>
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm">
              <span className="material-symbols-outlined text-2xl">visibility</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Publish Status</h2>
              <p className="text-sm text-on-surface-variant font-medium">Choose between drafting and public deployment.</p>
            </div>
          </div>
          
          <div className="flex bg-surface-container-high p-1.5 rounded-[20px] w-72 relative shadow-soft">
            <button 
              onClick={() => setPublishStatus("draft")}
              className={`flex-1 py-3 rounded-[14px] text-sm font-extrabold transition-all duration-300 ${
                publishStatus === "draft" ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Draft
            </button>
            <button 
              onClick={() => setPublishStatus("published")}
              className={`flex-1 py-3 rounded-[14px] text-sm font-extrabold transition-all duration-300 ${
                publishStatus === "published" ? "bg-white text-primary shadow-sm ring-1 ring-black/5" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Published
            </button>
          </div>
        </section>

        {/* Final Actions */}
        <div className="flex items-center justify-end gap-6 pt-12 border-t border-surface-container-highest">
          <button className="px-10 py-5 rounded-2xl text-on-surface-variant/80 font-black text-lg hover:text-primary hover:bg-primary-fixed/30 transition-all active:scale-95">
            Save as Draft
          </button>
          <button className="px-14 py-5 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white rounded-3xl font-black text-xl shadow-2xl shadow-indigo-200/50 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-3">
             Publish Course
             <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
