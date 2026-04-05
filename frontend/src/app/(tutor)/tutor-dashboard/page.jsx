"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import StatsGrid from "@/components/tutor/dashboard/StatsGrid";
import CourseList from "@/components/tutor/dashboard/CourseList";
import AnalyticsCard from "@/components/tutor/dashboard/AnalyticsCard";
import RecentEarnings from "@/components/tutor/dashboard/RecentEarnings";

export default function TutorDashboardPage() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient("/courses/tutor/my-courses");
        setCourses(res?.data?.courses ?? []);
      } catch {
        // Silently fail — empty state handles it
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Compute stats from real course data ─────────────────────────────────
  const totalCourses = courses.length;
  const totalPublished = courses.filter((c) => c.status === "published").length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents ?? 0), 0);
  const publishedCourses = courses.filter(
    (c) => c.status === "published" && c.rating?.average > 0
  );
  const avgRating =
    publishedCourses.length > 0
      ? publishedCourses.reduce((sum, c) => sum + c.rating.average, 0) /
        publishedCourses.length
      : 0;

  return (
    <>
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Welcome back, {user?.name?.split(" ")[0] ?? "Tutor"}
          </h2>
          <p className="text-on-surface-variant mt-1">
            Here's what's happening with your courses today.
          </p>
        </div>
        <Link
          href="/create-course"
          className="group flex items-center gap-3 bg-[#F97316] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Create New Course</span>
        </Link>
      </section>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-container-high rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <StatsGrid
          totalCourses={totalCourses}
          totalStudents={totalStudents}
          totalPublished={totalPublished}
          avgRating={avgRating}
        />
      )}

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <CourseList courses={courses} loading={loading} />

        <div className="space-y-6">
          <AnalyticsCard courses={courses} />
          <RecentEarnings />
        </div>
      </div>
    </>
  );
}
