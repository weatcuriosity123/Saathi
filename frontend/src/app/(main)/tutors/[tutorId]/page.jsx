"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import apiClient from "@/services/apiClient";
import { formatPrice, FALLBACK_THUMBNAIL } from "@/utils/formatters";

export default function TutorProfilePage() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tutorId) return;
    (async () => {
      try {
        const res = await apiClient(`/tutors/${tutorId}/profile`);
        setTutor(res?.data?.tutor ?? null);
        setCourses(res?.data?.courses ?? []);
      } catch (err) {
        setError(err.message || "Could not load tutor profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [tutorId]);

  const avatarUrl =
    tutor?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tutor?.name ?? "T")}&backgroundColor=4f46e5&textColor=ffffff`;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <div className="flex gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-surface-container-high animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-surface-container-high rounded-xl w-1/3 animate-pulse" />
            <div className="h-4 bg-surface-container-high rounded-xl w-1/2 animate-pulse" />
            <div className="h-4 bg-surface-container-high rounded-xl w-2/3 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-surface-container-high rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">person_off</span>
        <p className="mt-4 text-on-surface-variant">{error || "Tutor not found."}</p>
        <Link href="/courses" className="mt-6 inline-block text-primary font-semibold hover:underline">
          Browse Courses
        </Link>
      </div>
    );
  }

  const expertise = tutor?.tutorProfile?.expertise;
  const bio = tutor?.tutorProfile?.bio;
  const isVerified = tutor?.tutorProfile?.isApproved;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <img
          src={avatarUrl}
          alt={tutor.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/10 shrink-0"
        />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{tutor.name}</h1>
            {isVerified && (
              <span className="flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                Verified Tutor
              </span>
            )}
          </div>
          {expertise && (
            <p className="text-on-surface-variant font-medium">{expertise}</p>
          )}
          {bio && (
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">{bio}</p>
          )}
          <div className="flex items-center gap-6 pt-1 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">menu_book</span>
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">group</span>
              {courses.reduce((s, c) => s + (c.totalStudents ?? 0), 0).toLocaleString()} students
            </span>
          </div>
        </div>
      </div>

      {/* Courses */}
      <section>
        <h2 className="text-xl font-bold text-on-surface mb-6">Courses by {tutor.name}</h2>
        {courses.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant/60 border border-dashed border-outline-variant/30 rounded-2xl">
            <span className="material-symbols-outlined text-4xl mb-2 block">school</span>
            <p className="text-sm">No published courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course.slug ?? course._id}`}
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <img
                  src={course.thumbnail || FALLBACK_THUMBNAIL}
                  alt={course.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 space-y-2">
                  <p className="font-bold text-on-surface line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </p>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="capitalize">{course.level}</span>
                    <span className="font-bold text-on-surface">{formatPrice(course.price)}</span>
                  </div>
                  {course.rating?.average > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold">{course.rating.average.toFixed(1)}</span>
                      <span className="text-on-surface-variant">({course.totalStudents ?? 0})</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
