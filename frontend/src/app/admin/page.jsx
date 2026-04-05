"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import StatCard from "@/components/admin/StatCard";
import ActivityMonitor from "@/components/admin/ActivityMonitor";
import { formatPrice, FALLBACK_THUMBNAIL } from "@/utils/formatters";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [reviewCourses, setReviewCourses] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingQueues, setLoadingQueues] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // tutorId or courseId

  // ── Fetch stats + queues on mount ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient("/admin/stats");
        setStats(res?.data?.stats ?? null);
      } finally {
        setLoadingStats(false);
      }
    })();

    (async () => {
      try {
        const [tutorsRes, coursesRes] = await Promise.allSettled([
          apiClient("/admin/tutors/pending"),
          apiClient("/admin/courses/under-review"),
        ]);
        if (tutorsRes.status === "fulfilled")
          setPendingTutors(tutorsRes.value?.data?.tutors ?? []);
        if (coursesRes.status === "fulfilled")
          setReviewCourses(coursesRes.value?.data?.courses ?? []);
      } finally {
        setLoadingQueues(false);
      }
    })();
  }, []);

  // ── Tutor actions ─────────────────────────────────────────────────────────
  const approveTutor = useCallback(async (tutorId) => {
    try {
      setActionLoading(tutorId);
      await apiClient(`/admin/tutors/${tutorId}/approve`, { method: "PATCH" });
      setPendingTutors((prev) => prev.filter((t) => t._id !== tutorId));
      setStats((s) =>
        s ? { ...s, users: { ...s.users, pendingTutors: s.users.pendingTutors - 1 } } : s
      );
    } finally {
      setActionLoading(null);
    }
  }, []);

  const rejectTutor = useCallback(async (tutorId) => {
    const note = prompt("Rejection reason (optional):", "Insufficient credentials. Please reapply with more details.");
    if (note === null) return; // cancelled

    try {
      setActionLoading(tutorId);
      await apiClient(`/admin/tutors/${tutorId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ note }),
      });
      setPendingTutors((prev) => prev.filter((t) => t._id !== tutorId));
      setStats((s) =>
        s ? { ...s, users: { ...s.users, pendingTutors: s.users.pendingTutors - 1 } } : s
      );
    } finally {
      setActionLoading(null);
    }
  }, []);

  // ── Course actions ────────────────────────────────────────────────────────
  const publishCourse = useCallback(async (courseId) => {
    try {
      setActionLoading(courseId);
      await apiClient(`/admin/courses/${courseId}/publish`, { method: "PATCH" });
      setReviewCourses((prev) => prev.filter((c) => c._id !== courseId));
      setStats((s) =>
        s
          ? {
              ...s,
              courses: {
                ...s.courses,
                pendingReview: s.courses.pendingReview - 1,
                published: s.courses.published + 1,
              },
            }
          : s
      );
    } finally {
      setActionLoading(null);
    }
  }, []);

  const rejectCourse = useCallback(async (courseId) => {
    const note = prompt("Rejection reason:", "Please improve course quality and resubmit.");
    if (note === null) return;

    try {
      setActionLoading(courseId);
      await apiClient(`/admin/courses/${courseId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ note }),
      });
      setReviewCourses((prev) => prev.filter((c) => c._id !== courseId));
      setStats((s) =>
        s
          ? { ...s, courses: { ...s.courses, pendingReview: s.courses.pendingReview - 1 } }
          : s
      );
    } finally {
      setActionLoading(null);
    }
  }, []);

  const adminName = user?.name?.split(" ")[0] ?? "Admin";

  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface">
            Dashboard Overview
          </h1>
          <p className="text-on-surface-variant font-medium">
            Welcome back, {adminName}. Here's your platform health snapshot.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Main Content ──────────────────────────────────────────────── */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          {/* KPI Stats Grid */}
          {loadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-surface-container-high rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon="person"
                label="Total Users"
                value={stats?.users?.total?.toLocaleString() ?? "—"}
                trend={`${stats?.users?.students ?? 0} students`}
                bgIconClass="bg-blue-50"
                IconColorClass="text-blue-600"
              />
              <StatCard
                icon="school"
                label="Active Tutors"
                value={stats?.users?.tutors?.toLocaleString() ?? "—"}
                trend={`${stats?.users?.pendingTutors ?? 0} pending`}
                trendColor={stats?.users?.pendingTutors > 0 ? "red" : "green"}
                bgIconClass="bg-purple-50"
                IconColorClass="text-purple-600"
              />
              <StatCard
                icon="menu_book"
                label="Total Courses"
                value={stats?.courses?.total?.toLocaleString() ?? "—"}
                trend={`${stats?.courses?.published ?? 0} published`}
                bgIconClass="bg-amber-50"
                IconColorClass="text-amber-600"
              />
              <StatCard
                icon="pending_actions"
                label="Pending Approvals"
                value={(
                  (stats?.users?.pendingTutors ?? 0) +
                  (stats?.courses?.pendingReview ?? 0)
                ).toString()}
                trend={`${stats?.enrollments?.total ?? 0} enrollments`}
                trendColor={
                  (stats?.users?.pendingTutors ?? 0) + (stats?.courses?.pendingReview ?? 0) > 0
                    ? "red"
                    : "green"
                }
                bgIconClass="bg-red-50"
                IconColorClass="text-red-600"
              />
            </div>
          )}

          {/* Charts (decorative) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-headline">
            <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] flex flex-col border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-lg font-black tracking-tight uppercase">User Growth Trend</h4>
                <span className="px-3 py-1 bg-slate-50 text-[10px] font-black rounded-full text-slate-400 uppercase tracking-widest">
                  6 Months
                </span>
              </div>
              <div className="h-48 w-full bg-slate-50/50 rounded-2xl relative overflow-hidden flex items-end px-2 pb-2">
                <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,35 Q10,32 20,25 T40,20 T60,15 T80,8 T100,2" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                  <path d="M0,35 Q10,32 20,25 T40,20 T60,15 T80,8 T100,2 V40 H0 Z" fill="currentColor" fillOpacity="0.08" stroke="none" />
                </svg>
                <div className="absolute bottom-4 left-0 w-full flex justify-between px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] flex flex-col border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-lg font-black tracking-tight uppercase">Enrollment Stats</h4>
                <span className="px-3 py-1 bg-slate-50 text-[10px] font-black rounded-full text-slate-400 uppercase tracking-widest">
                  Total
                </span>
              </div>
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-6xl font-black text-on-surface">
                    {stats?.enrollments?.total?.toLocaleString() ?? "—"}
                  </p>
                  <p className="text-on-surface-variant font-medium mt-2">Total Enrollments</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Pending Tutors Queue ──────────────────────────────────────── */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] border border-slate-50">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-lg font-black tracking-tight uppercase">
                Tutor Applications
                {pendingTutors.length > 0 && (
                  <span className="ml-3 px-2.5 py-1 bg-error/10 text-error text-[11px] font-black rounded-full">
                    {pendingTutors.length} pending
                  </span>
                )}
              </h4>
            </div>

            {loadingQueues ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-surface-container-high rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : pendingTutors.length === 0 ? (
              <div className="py-10 text-center text-on-surface-variant/60 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                <p className="text-sm font-medium">No pending tutor applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTutors.map((tutor) => (
                  <div
                    key={tutor._id}
                    className="group flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center font-black text-primary text-lg">
                        {tutor.name?.charAt(0)?.toUpperCase() ?? "T"}
                      </div>
                      <div>
                        <p className="font-black text-on-surface">{tutor.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {tutor.email} &nbsp;·&nbsp;
                          {tutor.tutorProfile?.expertise || "No expertise listed"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => rejectTutor(tutor._id)}
                        disabled={actionLoading === tutor._id}
                        className="px-5 py-2 bg-error/10 text-error text-xs font-black rounded-xl hover:bg-error/20 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveTutor(tutor._id)}
                        disabled={actionLoading === tutor._id}
                        className="px-5 py-2 bg-secondary/10 text-secondary text-xs font-black rounded-xl hover:bg-secondary/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {actionLoading === tutor._id ? (
                          <span className="w-3 h-3 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        ) : null}
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Courses Under Review ──────────────────────────────────────── */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(0,88,190,0.04)] border border-slate-50">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-lg font-black tracking-tight uppercase">
                Course Review Queue
                {reviewCourses.length > 0 && (
                  <span className="ml-3 px-2.5 py-1 bg-amber-100 text-amber-700 text-[11px] font-black rounded-full">
                    {reviewCourses.length} pending
                  </span>
                )}
              </h4>
            </div>

            {loadingQueues ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-surface-container-high rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : reviewCourses.length === 0 ? (
              <div className="py-10 text-center text-on-surface-variant/60 flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                <p className="text-sm font-medium">No courses pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewCourses.map((course) => (
                  <div
                    key={course._id}
                    className="group flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={course.thumbnail || FALLBACK_THUMBNAIL}
                        alt={course.title}
                        className="w-14 h-10 object-cover rounded-xl shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-black text-on-surface truncate">{course.title}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          By {course.tutorId?.name ?? "Unknown"} &nbsp;·&nbsp;
                          <span className="capitalize">{course.category}</span> &nbsp;·&nbsp;
                          {formatPrice(course.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => rejectCourse(course._id)}
                        disabled={actionLoading === course._id}
                        className="px-5 py-2 bg-error/10 text-error text-xs font-black rounded-xl hover:bg-error/20 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => publishCourse(course._id)}
                        disabled={actionLoading === course._id}
                        className="px-5 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md shadow-primary/20 flex items-center gap-1.5"
                      >
                        {actionLoading === course._id ? (
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : null}
                        Publish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Activity Monitor ───────────────────────────────────── */}
        <div className="col-span-12 xl:col-span-4">
          <ActivityMonitor />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
