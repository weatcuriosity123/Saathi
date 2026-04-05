import Link from "next/link";
import { formatPrice, formatRating, FALLBACK_THUMBNAIL } from "@/utils/formatters";

const STATUS_STYLES = {
  published: "bg-white/90 text-secondary",
  draft: "bg-slate-900/10 text-on-surface-variant",
  under_review: "bg-amber-100 text-amber-700",
  removed: "bg-error/10 text-error",
};

const STATUS_LABELS = {
  published: "Published",
  draft: "Draft",
  under_review: "Under Review",
  removed: "Removed",
};

/**
 * CourseList — tutor's courses with edit / review actions.
 * Props: courses[] (from GET /courses/tutor/my-courses), loading
 */
export default function CourseList({ courses = [], loading = false }) {
  if (loading) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">My Courses</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface-container-high h-72 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-on-surface">My Courses</h3>
        <Link
          href="/create-course"
          className="text-sm font-bold text-primary hover:underline"
        >
          + Create New
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="col-span-2 py-20 text-center flex flex-col items-center gap-4 text-on-surface-variant/60">
          <span className="material-symbols-outlined text-5xl">video_library</span>
          <p className="font-medium text-sm">No courses yet. Create your first one!</p>
          <Link
            href="/create-course"
            className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
          >
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-indigo-100 group"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={course.thumbnail || FALLBACK_THUMBNAIL}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[course.status] || "bg-slate-100 text-slate-600"}`}
                >
                  {STATUS_LABELS[course.status] || course.status}
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-base font-bold text-on-surface mb-2 line-clamp-2 leading-snug">
                  {course.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">person</span>
                    {course.totalStudents ?? 0} Students
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      {course.status === "published" ? "star" : "schedule"}
                    </span>
                    {course.status === "published"
                      ? formatRating(course.rating?.average ?? 0)
                      : `${course.totalModules ?? 0} modules`}
                  </span>
                  <span className="font-semibold text-on-surface">
                    {formatPrice(course.price)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/create-course?courseId=${course._id}`}
                    className="flex-1 text-center bg-surface-container-high py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
                  >
                    {course.status === "published" ? "Edit Course" : "Resume Editing"}
                  </Link>
                  {course.status === "published" && (
                    <Link
                      href={`/${course._id}`}
                      className="p-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-secondary-container transition-colors"
                      title="View Course"
                    >
                      <span className="material-symbols-outlined text-xl">open_in_new</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Skeleton for visual padding when few courses */}
          {courses.length < 2 && (
            <div className="bg-surface-container-high h-72 rounded-2xl opacity-30 select-none" />
          )}
        </div>
      )}
    </div>
  );
}
