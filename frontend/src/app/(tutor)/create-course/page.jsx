"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";
import { FALLBACK_THUMBNAIL } from "@/utils/formatters";

const CATEGORIES = [
  { value: "programming", label: "Programming" },
  { value: "design", label: "Design" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "data-science", label: "Data Science" },
  { value: "personal-development", label: "Personal Development" },
  { value: "language", label: "Language" },
  { value: "other", label: "Other" },
];

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

// ── Minimal TUS upload ─────────────────────────────────────────────────────────
// For production use tus-js-client for resumable uploads.
async function tusUpload(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", uploadUrl);
    xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
    xhr.setRequestHeader("Tus-Resumable", "1.0.0");
    xhr.setRequestHeader("Upload-Offset", "0");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
    xhr.onerror = () => reject(new Error("Upload network error"));
    xhr.send(file);
  });
}

export default function CreateCoursePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCourseId = searchParams.get("courseId");

  // ── Course state ───────────────────────────────────────────────────────────
  const [courseId, setCourseId] = useState(initialCourseId ?? null);
  const [courseStatus, setCourseStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: 0,
    category: "programming",
    level: "beginner",
    language: "English",
  });

  // ── Thumbnail state ────────────────────────────────────────────────────────
  const [thumbnail, setThumbnail] = useState(null); // URL after upload
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const thumbnailInputRef = useRef(null);

  // ── Modules state ──────────────────────────────────────────────────────────
  const [modules, setModules] = useState([]);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", points: 10, isFree: false });
  const [moduleFile, setModuleFile] = useState(null); // video file
  const [addingModule, setAddingModule] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // 0-100

  // ── Load existing course if editing ───────────────────────────────────────
  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        const [courseRes, modulesRes] = await Promise.allSettled([
          apiClient(`/courses/${courseId}`),
          apiClient(`/courses/${courseId}/modules`),
        ]);

        if (courseRes.status === "fulfilled") {
          const c = courseRes.value?.data?.course;
          if (c) {
            setForm({
              title: c.title ?? "",
              description: c.description ?? "",
              shortDescription: c.shortDescription ?? "",
              price: c.price ?? 0,
              category: c.category ?? "programming",
              level: c.level ?? "beginner",
              language: c.language ?? "English",
            });
            setThumbnail(c.thumbnail ?? null);
            setCourseStatus(c.status ?? "draft");
          }
        }

        if (modulesRes.status === "fulfilled") {
          setModules(modulesRes.value?.data?.modules ?? []);
        }
      } catch {
        // Ignore — form stays empty for new course
      }
    })();
  }, [courseId]);

  // ── Form helpers ───────────────────────────────────────────────────────────
  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── Save / Create course draft ─────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setError("");
      setSaving(true);

      const payload = {
        ...form,
        price: Number(form.price),
      };

      let res;
      if (courseId) {
        res = await apiClient(`/courses/${courseId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        flash("Course saved.");
        setCourseStatus(res?.data?.course?.status ?? courseStatus);
      } else {
        res = await apiClient("/courses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const newId = res?.data?.course?._id;
        setCourseId(newId);
        setCourseStatus("draft");
        // Update URL without reload
        window.history.replaceState(null, "", `/create-course?courseId=${newId}`);
        flash("Course created as draft!");
      }
    } catch (err) {
      setError(err.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  // ── Thumbnail upload ───────────────────────────────────────────────────────
  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !courseId) return;

    try {
      setThumbnailUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("thumbnail", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/courses/${courseId}/thumbnail`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${(await import("@/services/apiClient")).getAccessToken() || ""}`,
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Thumbnail upload failed");
      const json = await res.json();
      setThumbnail(json?.data?.thumbnail ?? null);
      flash("Thumbnail uploaded!");
    } catch (err) {
      setError(err.message || "Thumbnail upload failed.");
    } finally {
      setThumbnailUploading(false);
    }
  };

  // ── Add module ─────────────────────────────────────────────────────────────
  const handleAddModule = async () => {
    if (!courseId) {
      setError("Save the course first before adding modules.");
      return;
    }
    if (!moduleForm.title.trim()) {
      setError("Module title is required.");
      return;
    }
    if (!moduleFile) {
      setError("Please select a video file for this module.");
      return;
    }

    try {
      setError("");
      setAddingModule(true);
      setUploadProgress(0);

      // Step 1: Create module + get Vimeo upload URL
      const res = await apiClient(`/courses/${courseId}/modules`, {
        method: "POST",
        body: JSON.stringify({
          ...moduleForm,
          points: Number(moduleForm.points),
          fileSize: moduleFile.size,
        }),
      });

      const { module, uploadUrl } = res?.data ?? {};

      // Step 2: Upload video to Vimeo via TUS
      if (uploadUrl) {
        await tusUpload(uploadUrl, moduleFile, setUploadProgress);
      }

      setModules((prev) => [...prev, module]);
      setModuleForm({ title: "", description: "", points: 10, isFree: false });
      setModuleFile(null);
      setUploadProgress(null);
      flash("Module added! Video uploading to Vimeo…");
    } catch (err) {
      setError(err.message || "Failed to add module.");
      setUploadProgress(null);
    } finally {
      setAddingModule(false);
    }
  };

  // ── Delete module ──────────────────────────────────────────────────────────
  const handleDeleteModule = async (moduleId) => {
    if (!confirm("Delete this module and its video?")) return;
    try {
      await apiClient(`/courses/${courseId}/modules/${moduleId}`, { method: "DELETE" });
      setModules((prev) => prev.filter((m) => m._id !== moduleId));
    } catch (err) {
      setError(err.message || "Failed to delete module.");
    }
  };

  // ── Submit for review ──────────────────────────────────────────────────────
  const handleSubmitForReview = async () => {
    if (!courseId) return;
    if (!confirm("Submit this course for admin review? You won't be able to edit it until reviewed.")) return;

    try {
      setSubmitting(true);
      setError("");
      const res = await apiClient(`/courses/${courseId}/submit-review`, { method: "POST" });
      setCourseStatus(res?.data?.course?.status ?? "under_review");
      flash("Submitted for review! Admin will review it shortly.");
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const isUnderReview = courseStatus === "under_review" || courseStatus === "published";

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 mb-8 border-b border-outline-variant/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface font-headline">
            {courseId ? "Edit Course" : "Create Course"}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {courseId
              ? `Status: ${courseStatus.replace("_", " ").toUpperCase()} · ID: ${courseId}`
              : "Fill in the details and save as a draft first."}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <button
            onClick={handleSave}
            disabled={saving || isUnderReview}
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-lg">save</span>
            )}
            {saving ? "Saving…" : "Save Draft"}
          </button>

          {courseId && !isUnderReview && (
            <button
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
              )}
              Submit for Review
            </button>
          )}

          {courseStatus === "under_review" && (
            <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold">
              Under Review
            </span>
          )}
          {courseStatus === "published" && (
            <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-sm font-bold">
              Published
            </span>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
          <button onClick={() => setError("")} className="ml-auto">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary text-sm font-medium flex items-center gap-3">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ── Left: Curriculum Builder ──────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="bg-surface-container-low px-8 py-5 border-b border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">layers</span>
                </div>
                <h2 className="text-lg font-bold text-on-surface font-headline">Curriculum Builder</h2>
              </div>
              <span className="text-sm text-on-surface-variant">
                {modules.length} module{modules.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="p-8 space-y-4">
              {/* Existing modules */}
              {modules.map((mod, idx) => (
                <div
                  key={mod._id}
                  className="bg-surface-container-low/30 rounded-2xl p-5 border border-outline-variant/10 flex items-center gap-4 group"
                >
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[11px] shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-on-surface text-sm">{mod.title}</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          mod.vimeoStatus === "ready"
                            ? "text-secondary"
                            : mod.vimeoStatus === "error"
                            ? "text-error"
                            : "text-amber-600"
                        }`}
                      >
                        {mod.vimeoStatus?.toUpperCase() ?? "UPLOADING"}
                      </span>
                      {mod.isFree && <span className="text-primary">· Free Preview</span>}
                      <span>· {mod.points} XP</span>
                    </p>
                  </div>
                  {!isUnderReview && (
                    <button
                      onClick={() => handleDeleteModule(mod._id)}
                      className="p-2 opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">delete_outline</span>
                    </button>
                  )}
                </div>
              ))}

              {/* Add module form */}
              {!isUnderReview && (
                <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 space-y-4">
                  <p className="text-sm font-bold text-on-surface">Add New Module</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                        Module Title *
                      </label>
                      <input
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Introduction to React Hooks"
                        className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                        Description
                      </label>
                      <textarea
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm((f) => ({ ...f, description: e.target.value }))}
                        rows={2}
                        placeholder="Brief description of this lesson"
                        className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white transition-all outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                        XP Points (0–100)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={moduleForm.points}
                        onChange={(e) => setModuleForm((f) => ({ ...f, points: e.target.value }))}
                        className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-bold text-sm outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                        Video File *
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setModuleFile(e.target.files?.[0] ?? null)}
                        className="w-full bg-surface-container-high rounded-xl px-4 py-2.5 text-sm outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:font-bold file:bg-primary-fixed file:text-primary cursor-pointer"
                      />
                      {moduleFile && (
                        <p className="text-[11px] text-on-surface-variant">
                          {moduleFile.name} ({(moduleFile.size / 1024 / 1024).toFixed(1)} MB)
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 md:col-span-2">
                      <input
                        type="checkbox"
                        id="isFree"
                        checked={moduleForm.isFree}
                        onChange={(e) => setModuleForm((f) => ({ ...f, isFree: e.target.checked }))}
                        className="w-4 h-4 accent-primary"
                      />
                      <label htmlFor="isFree" className="text-sm font-medium text-on-surface-variant cursor-pointer">
                        Free Preview (non-enrolled users can watch this module)
                      </label>
                    </div>
                  </div>

                  {/* Upload progress */}
                  {uploadProgress !== null && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-on-surface-variant">
                        <span>Uploading to Vimeo…</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddModule}
                    disabled={addingModule}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {addingModule ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                    )}
                    {addingModule ? "Adding…" : "Add Module"}
                  </button>

                  {!courseId && (
                    <p className="text-[11px] text-outline italic">
                      Save the course first to enable module management.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── Right: Metadata + Media ───────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {/* Course info */}
          <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <h3 className="font-bold text-on-surface">Course Details</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  disabled={isUnderReview}
                  placeholder="e.g. Complete React Developer Course"
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white transition-all outline-none disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                  Description * (min 50 chars)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  disabled={isUnderReview}
                  rows={4}
                  placeholder="Describe what students will learn…"
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm focus:bg-white transition-all outline-none resize-none disabled:opacity-60"
                />
                <p className="text-[10px] text-outline">{form.description.length} / 5000</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  disabled={isUnderReview}
                  className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm outline-none disabled:opacity-60"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    disabled={isUnderReview}
                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-bold text-sm outline-none disabled:opacity-60"
                  />
                  <p className="text-[10px] text-outline">0 = Free</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">
                    Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => updateForm("level", e.target.value)}
                    disabled={isUnderReview}
                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface font-medium text-sm outline-none disabled:opacity-60"
                  >
                    {LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Thumbnail */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">image</span>
                <h3 className="font-bold text-sm text-on-surface">Course Thumbnail</h3>
              </div>

              {thumbnail ? (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-container-high">
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  {!isUnderReview && (
                    <button
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm"
                    >
                      <span className="material-symbols-outlined mr-2">edit</span> Change
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!courseId) {
                      setError("Save the course first before uploading a thumbnail.");
                      return;
                    }
                    thumbnailInputRef.current?.click();
                  }}
                  disabled={thumbnailUploading}
                  className="w-full border-2 border-dashed border-outline-variant/30 rounded-xl py-8 flex flex-col items-center gap-3 hover:bg-primary-fixed/5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {thumbnailUploading ? (
                    <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-outline-variant">cloud_upload</span>
                  )}
                  <p className="text-sm font-bold text-on-surface-variant">
                    {thumbnailUploading ? "Uploading…" : "Upload Thumbnail (16:9)"}
                  </p>
                  <p className="text-[11px] text-outline">JPG, PNG, WebP · Max 5MB</p>
                </button>
              )}

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
