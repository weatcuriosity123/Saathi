"use client";

import React from "react";

export default function VerificationPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
            Verify Your Profile
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Verified tutors build more trust and get more students. Gain access to exclusive badges and premium features.
          </p>
        </div>

        {/* Verification Status Horizontal Card */}
        <section className="bg-surface-container-low rounded-2xl p-6 flex items-center justify-between outline outline-1 outline-outline-variant/15">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                pending_actions
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-on-surface">Verification Status</span>
                <span className="px-3 py-1 bg-tertiary-fixed-dim text-on-tertiary-fixed-variant text-[11px] font-bold uppercase tracking-wider rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                Your profile is currently under review by our moderation team.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-outline uppercase tracking-widest">Expected by</p>
            <p className="text-sm font-bold text-on-surface">Oct 24, 2023</p>
          </div>
        </section>

        {/* Verification Options (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Selected */}
          <div className="group cursor-pointer bg-surface-container-lowest p-8 rounded-2xl shadow-sm border-2 border-primary transition-all duration-300 ring-4 ring-primary/5">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs">check</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Upload Certificates</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Provide academic degrees, professional certifications, or teaching licenses to validate your expertise.
            </p>
          </div>

          {/* Option 2 */}
          <div className="group cursor-pointer bg-surface-container-low p-8 rounded-2xl hover:bg-surface-container-lowest transition-all duration-300 outline outline-1 outline-outline-variant/15 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">reviews</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Add Testimonials</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Link your LinkedIn profile or upload screenshots of student feedback and professional recommendations.
            </p>
          </div>
        </section>

        {/* Dynamic Area: Upload Box */}
        <section className="bg-surface-container-lowest p-10 rounded-2xl shadow-sm border-2 border-dashed border-outline-variant hover:border-primary/50 transition-colors group">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary transition-colors">
                cloud_upload
              </span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-on-surface mb-2">Drag and drop your files here</h4>
              <p className="text-on-surface-variant text-sm">Support PDF, JPG, or PNG (Max size: 10MB per file)</p>
            </div>
            <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
              Browse Files
            </button>
          </div>

          {/* File List (Simulated) */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                <div>
                  <p className="text-sm font-bold">Physics_Masters_Degree.pdf</p>
                  <p className="text-[10px] text-outline font-medium">2.4 MB • Uploading...</p>
                </div>
              </div>
              <div className="w-24 h-1 bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Submit CTA */}
        <div className="flex flex-col items-center space-y-6 pt-4">
          <button className="w-full sm:w-80 h-16 bg-tertiary text-white rounded-2xl font-bold text-lg shadow-xl shadow-tertiary/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              task_alt
            </span>
            Submit for Verification
          </button>
          <p className="text-xs text-outline font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            Your data is encrypted and handled according to our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
