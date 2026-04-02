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
  ChevronRight,
  Settings,
  ShieldCheck,
  Save,
  Rocket
} from "lucide-react";

export default function CreateCoursePage() {
  const [publishStatus, setPublishStatus] = useState("draft");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState("https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop");

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-20">
      {/* Dynamic Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 mb-8 border-b border-outline-variant/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface font-headline">Course Editor</h1>
          <p className="text-on-surface-variant text-sm mt-1">Design your curriculum and manage course metadata.</p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all">
            <Save size={18} />
            Save Draft
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Rocket size={18} />
            Publish Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Curriculum Builder (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="bg-surface-container-low px-8 py-5 border-b border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <Layers size={20} />
                </div>
                <h2 className="text-lg font-bold text-on-surface font-headline">Curriculum Builder</h2>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all">
                <Plus size={18} />
                Add Module
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Module Item Compact */}
              <div className="bg-surface-container-low/30 rounded-2xl p-6 border border-outline-variant/10 relative group hover:border-primary/20 transition-all">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px]">01</span>
                    <div className="w-[1.5px] h-12 bg-gradient-to-b from-primary-fixed to-transparent opacity-40"></div>
                  </div>
                  
                  <div className="flex-1 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline">Module title</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-bold text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                          defaultValue="Fundamentals of Light & Shadows"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline">Video URL (Vimeo)</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm placeholder:text-outline/40 focus:bg-white transition-all outline-none" 
                          placeholder="https://vimeo..."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-outline">Reward Points</label>
                        <input 
                          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-bold text-sm focus:bg-white transition-all outline-none" 
                          defaultValue="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Interaction Area */}
              <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container-low/40 transition-all">
                <div className="w-12 h-12 rounded-full border-2 border-outline-variant/40 flex items-center justify-center text-outline-variant group-hover:bg-primary-fixed group-hover:text-primary transition-all mb-4">
                  <Plus size={24} />
                </div>
                <p className="text-on-surface font-bold">New Learning Block</p>
                <p className="text-on-surface-variant text-xs mt-1">Structure your knowledge into chapters</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Meta & Settings (4 Cols) */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {/* Basic Info Compact */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
              <Info className="text-primary" size={20} />
              <h3 className="font-bold text-on-surface">Course Context</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">Course Title</label>
                <input 
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white transition-all outline-none" 
                  placeholder="Masterpiece Art Study" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">Category</label>
                <select className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm outline-none appearance-none cursor-pointer">
                  <option>Design & Arts</option>
                  <option>Digital Painting</option>
                  <option>Concept Art</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">Price (₹)</label>
                  <input className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-bold text-sm outline-none" defaultValue="149" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">Level</label>
                  <select className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm outline-none">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Media & Publish Compact Panel */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden divide-y divide-outline-variant/10">
            {/* Media Row */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-secondary" size={18} />
                  <h3 className="font-bold text-sm text-on-surface">Course Media</h3>
                </div>
                {thumbnail && (
                  <button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-tight hover:bg-primary/5 px-2 py-1 rounded-md transition-colors"
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 group relative border-2 border-dashed border-outline-variant/30 rounded-xl py-3 flex flex-col items-center justify-center hover:bg-primary-fixed/5 transition-all cursor-pointer bg-surface-container-low/20">
                  <UploadCloud size={20} className="text-outline-variant group-hover:scale-110 transition-transform mb-1" />
                  <p className="text-[10px] font-bold text-on-surface-variant">Upload Thumbnail</p>
                </div>
                {/* Small indicator if uploaded */}
                {thumbnail && (
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden border border-outline-variant/20">
                    <img src={thumbnail} className="w-full h-full object-cover" alt="Thumb" />
                  </div>
                )}
              </div>
            </div>

            {/* Publish Control Row */}
            <div className="p-6 bg-surface-container-low/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-tertiary" size={18} />
                <h3 className="font-bold text-sm text-on-surface">Publish Control</h3>
              </div>
              
              <div className="flex bg-surface-container-high p-1 rounded-xl shadow-soft">
                <button 
                  onClick={() => setPublishStatus("draft")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    publishStatus === "draft" ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Draft
                </button>
                <button 
                  onClick={() => setPublishStatus("published")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    publishStatus === "published" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  Published
                </button>
              </div>
              <p className="text-[9px] text-outline mt-3 font-medium text-center italic">
                {publishStatus === "draft" ? "Visible only to you and moderators" : "Enrollment will be open to all students"}
              </p>
            </div>
          </section>

          {/* Quick Settings Short Card */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-on-surface">
              <Settings size={18} className="text-outline" />
              <h3 className="font-bold text-sm">Editor Settings</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-sm opacity-0 group-hover:opacity-40 transition-opacity"></div>
                </div>
                <span className="text-[11px] font-medium text-on-surface-variant">Auto-save progress</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
                </div>
                <span className="text-[11px] font-medium text-on-surface-variant">Email on publishing</span>
              </label>
            </div>
          </section>
        </div>
      </div>

      {/* Thumbnail Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
              <h4 className="font-bold text-on-surface">Thumbnail Preview</h4>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="p-2 aspect-video bg-surface-container-high">
              <img src={thumbnail} className="w-full h-full object-cover rounded-xl" alt="Full Preview" />
            </div>
            <div className="p-6 flex justify-end">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
