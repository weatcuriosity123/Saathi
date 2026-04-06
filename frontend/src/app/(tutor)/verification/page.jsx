"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";

export default function VerificationPage() {
  const { user, login } = useAuth();

  const [form, setForm] = useState({ name: "", bio: "", expertise: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Populate form from current user ─────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name ?? "",
      bio: user.tutorProfile?.bio ?? "",
      expertise: user.tutorProfile?.expertise ?? "",
    });
  }, [user]);

  const isApproved = user?.tutorProfile?.isApproved ?? false;
  const hasBio = !!(user?.tutorProfile?.bio);
  const hasExpertise = !!(user?.tutorProfile?.expertise);
  const profileComplete = hasBio && hasExpertise && !!user?.name;

  const verificationStatus = isApproved
    ? "approved"
    : profileComplete
    ? "pending"
    : "incomplete";

  const STATUS_CONFIG = {
    approved: {
      icon: "verified",
      label: "Verified Tutor",
      badgeClass: "bg-secondary/10 text-secondary",
      cardClass: "border-secondary/20 bg-secondary/5",
      desc: "Your profile is verified. Students can trust your expertise.",
    },
    pending: {
      icon: "pending_actions",
      label: "Under Review",
      badgeClass: "bg-amber-100 text-amber-700",
      cardClass: "border-amber-200 bg-amber-50",
      desc: "Your profile is complete and under review by our moderation team.",
    },
    incomplete: {
      icon: "edit_note",
      label: "Profile Incomplete",
      badgeClass: "bg-surface-container text-on-surface-variant",
      cardClass: "border-outline-variant/20 bg-surface-container-lowest",
      desc: "Complete your bio and expertise to get reviewed.",
    },
  };

  const status = STATUS_CONFIG[verificationStatus];

  const updateForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await apiClient("/tutors/me/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          expertise: form.expertise,
        }),
      });

      // Update auth context with new user data
      const updatedUser = res?.data?.user;
      if (updatedUser) {
        // Re-use the existing access token — just refresh user object
        const { getAccessToken } = await import("@/services/apiClient");
        login(updatedUser, getAccessToken());
      }

      setSuccess("Profile updated! Admin will review it shortly.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
            Verify Your Profile
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Verified tutors build more trust and attract more students. Complete your profile to get reviewed.
          </p>
        </div>

        {/* Status card */}
        <section
          className={`rounded-2xl p-6 flex items-center justify-between border ${status.cardClass}`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                verificationStatus === "approved"
                  ? "bg-secondary/20 text-secondary"
                  : verificationStatus === "pending"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-surface-container text-outline"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  verificationStatus === "approved"
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {status.icon}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-on-surface">Verification Status</span>
                <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${status.badgeClass}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">{status.desc}</p>
            </div>
          </div>

          {/* Completeness indicator */}
          <div className="text-right shrink-0">
            <p className="text-xs font-bold text-outline uppercase tracking-widest">Profile</p>
            <p className="text-lg font-black text-on-surface">
              {[hasBio, hasExpertise, !!user?.name].filter(Boolean).length}/3
            </p>
          </div>
        </section>

        {/* Profile form */}
        <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
            <span className="material-symbols-outlined text-primary text-xl">person</span>
            <h3 className="text-xl font-bold text-on-surface">Your Profile</h3>
          </div>

          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary text-sm font-medium flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              {success}
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline flex items-center gap-2">
                Display Name
                {user?.name ? (
                  <span className="text-secondary">✓</span>
                ) : (
                  <span className="text-error">Required</span>
                )}
              </label>
              <input
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Your full name"
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>

            {/* Expertise */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline flex items-center gap-2">
                Area of Expertise
                {hasExpertise ? (
                  <span className="text-secondary">✓</span>
                ) : (
                  <span className="text-error">Required for verification</span>
                )}
              </label>
              <input
                value={form.expertise}
                onChange={(e) => updateForm("expertise", e.target.value)}
                placeholder="e.g. Full-Stack Development, Data Science, UI/UX Design"
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline flex items-center gap-2">
                Professional Bio
                {hasBio ? (
                  <span className="text-secondary">✓</span>
                ) : (
                  <span className="text-error">Required for verification</span>
                )}
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => updateForm("bio", e.target.value)}
                rows={5}
                placeholder="Tell students about your background, experience, and what you teach. Be specific — a strong bio increases enrollment."
                className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none resize-none"
              />
              <p className="text-[10px] text-outline">{form.bio.length} characters</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-lg">save</span>
            )}
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </section>

        {/* What happens next */}
        {!isApproved && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "edit_note",
                title: "Complete Your Profile",
                desc: "Fill in your bio and expertise area above.",
                done: profileComplete,
              },
              {
                step: "2",
                icon: "pending_actions",
                title: "Admin Review",
                desc: "Our team verifies your information within 2–3 business days.",
                done: verificationStatus === "approved",
              },
              {
                step: "3",
                icon: "verified",
                title: "Get Verified Badge",
                desc: "Your courses will show a verified badge, increasing trust.",
                done: false,
              },
            ].map(({ step, icon, title, desc, done }) => (
              <div
                key={step}
                className={`p-6 rounded-2xl border ${
                  done
                    ? "border-secondary/20 bg-secondary/5"
                    : "border-outline-variant/10 bg-surface-container-lowest"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                    done ? "bg-secondary text-white" : "bg-surface-container text-outline"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={done ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {done ? "check" : icon}
                  </span>
                </div>
                <h3 className="font-bold text-on-surface mb-1">{title}</h3>
                <p className="text-sm text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
