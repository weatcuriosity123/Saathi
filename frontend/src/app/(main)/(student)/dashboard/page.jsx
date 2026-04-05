"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import { formatPrice, FALLBACK_THUMBNAIL } from "@/utils/formatters";

// ─── Skeleton ────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="w-full md:w-56 h-40 rounded-2xl bg-surface-container-high shrink-0" />
        <div className="flex-grow space-y-4">
          <div className="h-3 w-32 bg-surface-container-high rounded-full" />
          <div className="h-5 w-3/4 bg-surface-container-high rounded-full" />
          <div className="h-2 w-full bg-surface-container-high rounded-full" />
          <div className="h-8 w-32 bg-surface-container-high rounded-xl ml-auto" />
        </div>
      </div>
    </div>
  );
}

// ─── Progress card ────────────────────────────────────────────────────────────
function CourseProgressCard({ item, isPrimary }) {
  const { course, progress } = item;
  const pct = progress?.percentage ?? 0;
  const lastModuleId = progress?.lastModuleId;
  const resumeHref = lastModuleId
    ? `/${course._id}/player?module=${lastModuleId}`
    : `/${course._id}/player`;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant transition-all hover:-translate-y-1 hover:shadow-ambient">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Thumbnail */}
        <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden shrink-0 relative bg-primary/10">
          <Image
            src={course.thumbnail || FALLBACK_THUMBNAIL}
            alt={course.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold py-1.5 px-4 bg-primary/10 text-primary rounded-full uppercase tracking-widest capitalize">
              {course.category?.replace(/-/g, " ")}
            </span>
            <span className={`text-sm font-bold ${pct === 100 ? "text-secondary" : "text-primary"}`}>
              {pct === 100 ? "Completed!" : `${pct}% Complete`}
            </span>
          </div>

          <h3 className="text-xl font-bold font-headline mb-5 line-clamp-2">{course.title}</h3>

          <div className="mb-6">
            <ProgressBar value={pct} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-base">video_library</span>
              {progress?.completedModules?.length ?? 0} / {course.totalModules ?? "?"} modules
            </span>
            {pct === 100 ? (
              <Link
                href={`/${course._id}/player`}
                className="bg-secondary text-white px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-soft"
              >
                Review Course
              </Link>
            ) : (
              <Link
                href={resumeHref}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  isPrimary
                    ? "bg-primary-gradient text-white shadow-soft hover:opacity-90"
                    : "bg-surface-container-high text-primary hover:bg-surface-container"
                }`}
              >
                {pct === 0 ? "Start Learning" : "Resume"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mini course row in sidebar ───────────────────────────────────────────────
function MiniCourseRow({ item }) {
  const { course, progress } = item;
  const pct = progress?.percentage ?? 0;
  const done = pct === 100;

  return (
    <Link
      href={`/${course._id}/player`}
      className="flex items-center gap-5 px-3 py-3 rounded-2xl hover:bg-surface-container-lowest transition-colors cursor-pointer group"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden relative">
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" unoptimized />
        ) : (
          <span className="material-symbols-outlined text-primary text-2xl">school</span>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-base font-bold text-on-surface truncate">{course.title}</p>
        <p className="text-xs text-on-surface-variant">
          {done ? "Completed" : pct === 0 ? "Not started" : `${pct}% complete`}
        </p>
      </div>
      {done ? (
        <span
          className="material-symbols-outlined text-secondary shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      ) : (
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform shrink-0">
          chevron_right
        </span>
      )}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient("/progress/my-learning");
        setItems(res.data ?? []);
      } catch (err) {
        setError(err.message || "Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalEnrolled = items.length;
  const totalCompleted = items.filter((i) => (i.progress?.percentage ?? 0) === 100).length;
  const totalPoints = items.reduce((sum, i) => sum + (i.progress?.totalPoints ?? 0), 0);

  // Split: first two in-progress go to hero "Continue Learning" cards
  const inProgress = items.filter(
    (i) => (i.progress?.percentage ?? 0) > 0 && (i.progress?.percentage ?? 0) < 100
  );
  const notStarted = items.filter((i) => (i.progress?.percentage ?? 0) === 0);
  const completed = items.filter((i) => (i.progress?.percentage ?? 0) === 100);

  // Hero cards: prioritise in-progress, fallback to not-started
  const heroItems = [...inProgress, ...notStarted].slice(0, 2);
  // Sidebar mini-list: the rest
  const sidebarItems = [...inProgress, ...notStarted, ...completed].filter(
    (i) => !heroItems.includes(i)
  );

  return (
    <div className="bg-surface text-on-surface">
      {/* Header */}
      <header className="flex flex-col md:flex-row pt-25 justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-3">
            My Learning Dashboard
          </h1>
          <p className="text-on-surface-variant leading-relaxed text-lg">
            {user?.name
              ? `Welcome back, ${user.name.split(" ")[0]}. Keep up the momentum!`
              : "Track your learning progress and pick up where you left off."}
          </p>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-4 bg-tertiary-container text-on-tertiary-container px-8 py-4 rounded-2xl shadow-sm border border-tertiary-container/10">
          <span
            className="material-symbols-outlined text-tertiary text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Learner Points</p>
            <p className="text-2xl font-extrabold font-headline">
              {totalPoints.toLocaleString()} XP
            </p>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 bg-error/10 border border-error/20 rounded-2xl text-error font-medium text-sm">
          {error}
        </div>
      )}

      {/* Empty state — no enrolled courses */}
      {!loading && !error && items.length === 0 && (
        <div className="py-32 text-center flex flex-col items-center gap-6">
          <span className="material-symbols-outlined text-7xl text-outline">school</span>
          <div>
            <p className="text-2xl font-bold font-headline text-on-surface mb-2">No courses yet</p>
            <p className="text-on-surface-variant mb-8">Enroll in your first course to get started.</p>
            <Link
              href="/list"
              className="bg-primary-gradient text-white px-10 py-4 rounded-2xl font-bold shadow-soft hover:-translate-y-0.5 transition-all"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      )}

      {/* Main content */}
      {(loading || items.length > 0) && (
        <div className="grid grid-cols-12 gap-10">
          {/* Hero: Continue Learning */}
          <section className="col-span-12 lg:col-span-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold font-headline text-on-surface">Continue Learning</h2>
              <Link
                href="/list"
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Browse more
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid gap-8">
              {loading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : heroItems.length === 0 ? (
                <div className="p-12 rounded-3xl border border-outline-variant text-center text-on-surface-variant">
                  All caught up! Browse more courses to keep learning.
                </div>
              ) : (
                heroItems.map((item, idx) => (
                  <CourseProgressCard key={item.course._id} item={item} isPrimary={idx === 0} />
                ))
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-10">
            {/* Stats */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant">
              <h2 className="text-lg font-bold font-headline mb-8">Learning Activity</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface p-5 rounded-2xl">
                  <p className="text-xs text-on-surface-variant mb-2">Courses Joined</p>
                  <p className="text-3xl font-extrabold font-headline text-on-surface">
                    {loading ? "—" : totalEnrolled}
                  </p>
                </div>
                <div className="bg-surface p-5 rounded-2xl">
                  <p className="text-xs text-on-surface-variant mb-2">Completed</p>
                  <p className="text-3xl font-extrabold font-headline text-on-surface">
                    {loading ? "—" : totalCompleted}
                  </p>
                </div>
                <div className="bg-surface p-5 rounded-2xl">
                  <p className="text-xs text-on-surface-variant mb-2">Total Points</p>
                  <p className="text-3xl font-extrabold font-headline text-on-surface">
                    {loading ? "—" : totalPoints.toLocaleString()}
                  </p>
                </div>
                <div className="bg-surface p-5 rounded-2xl">
                  <p className="text-xs text-on-surface-variant mb-2">In Progress</p>
                  <p className="text-3xl font-extrabold font-headline text-on-surface">
                    {loading ? "—" : inProgress.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Other Courses mini-list */}
            {!loading && sidebarItems.length > 0 && (
              <div>
                <h2 className="text-lg font-bold font-headline mb-6 px-2">Other Courses</h2>
                <div className="space-y-4">
                  {sidebarItems.slice(0, 5).map((item) => (
                    <MiniCourseRow key={item.course._id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Bottom CTA */}
      {!loading && (
        <section className="mt-20 bg-primary/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-16 border border-primary/10">
          <div className="flex-grow space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <span
                className="material-symbols-outlined text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              Discover More
            </div>
            <h2 className="text-4xl font-extrabold font-headline leading-tight max-w-xl text-on-surface">
              Keep building your skills.
            </h2>
            <p className="text-on-surface-variant text-lg max-w-md">
              Explore hundreds of courses across programming, design, business and more — all at
              affordable prices.
            </p>
            <div className="pt-6 flex flex-wrap items-center gap-8">
              <Link
                href="/list"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-bold transition-all hover:bg-primary-container hover:shadow-ambient active:scale-95"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
