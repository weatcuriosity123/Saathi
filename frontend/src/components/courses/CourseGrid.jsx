import Link from "next/link";
import { formatPrice, formatRating, avatarUrl, FALLBACK_THUMBNAIL } from "@/utils/formatters";

/** Skeleton card shown while loading */
function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant animate-pulse flex flex-col">
      <div className="h-48 bg-surface-container-high" />
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="h-3 w-24 bg-surface-container-high rounded-full" />
        <div className="h-5 w-full bg-surface-container-high rounded-full" />
        <div className="h-5 w-3/4 bg-surface-container-high rounded-full" />
        <div className="h-3 w-full bg-surface-container-high rounded-full mt-1" />
        <div className="mt-auto pt-4 border-t border-outline-variant/10 flex justify-between">
          <div className="h-6 w-16 bg-surface-container-high rounded-full" />
          <div className="h-6 w-6 bg-surface-container-high rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Single course card */
function CourseCard({ course }) {
  const thumbnail = course.thumbnail || FALLBACK_THUMBNAIL;
  const rating = course.rating?.average ?? null;
  const ratingCount = course.rating?.count ?? 0;
  // tutorId is not populated in the listing — show category as secondary info instead
  const categoryLabel = course.category?.replace(/-/g, " ") ?? "";

  return (
    <Link href={`/${course._id}`} className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-soft hover:shadow-ambient flex flex-col border border-outline-variant">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-surface-container"
        />
        {course.level && (
          <div className="absolute top-4 left-4 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm bg-primary/80 backdrop-blur-sm">
            {course.level}
          </div>
        )}
        {course.price === 0 && (
          <div className="absolute top-4 right-4 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm bg-secondary">
            Free
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] font-extrabold text-primary tracking-widest uppercase truncate capitalize">
            {categoryLabel}
          </span>
          {rating !== null && (
            <div className="flex items-center text-tertiary flex-shrink-0">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-xs font-bold ml-1 text-slate-900">{formatRating(rating)}</span>
              {ratingCount > 0 && (
                <span className="text-[10px] text-slate-400 ml-1">({ratingCount})</span>
              )}
            </div>
          )}
        </div>

        <h3 className="font-headline font-extrabold text-[18px] leading-snug mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>

        {course.shortDescription || course.description ? (
          <p className="text-[13px] text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
            {course.shortDescription || course.description}
          </p>
        ) : null}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-auto mb-4">
          {course.totalModules > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">video_library</span>
              {course.totalModules} modules
            </span>
          )}
          {course.totalStudents > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">group</span>
              {course.totalStudents.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <span className="text-2xl font-black text-slate-900 font-headline tracking-tight">
            {formatPrice(course.price)}
          </span>
          <span className="material-symbols-outlined text-outline hover:text-primary transition-colors p-1">
            bookmark
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Pagination controls */
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;

  const pages = [];
  // Show at most 5 page buttons
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-20 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            1
          </button>
          {start > 2 && <span className="px-2 text-slate-400 font-bold">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
            p === page
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-slate-400 font-bold">…</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  );
}

/**
 * CourseGrid
 * @param {{ courses, pagination, loading, error, onPageChange }} props
 */
export default function CourseGrid({ courses = [], pagination, loading, error, onPageChange }) {
  const total = pagination?.total ?? 0;

  return (
    <section className="flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4 mb-12">
        <div>
          <h1 className="font-headline text-4xl font-black tracking-tight text-slate-900">
            Explore Courses
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {loading
              ? "Loading courses…"
              : error
              ? "Could not load courses."
              : `${total} course${total !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="py-20 text-center text-error font-medium">{error}</div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : !error && courses.length === 0 ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
            search_off
          </span>
          <p className="text-on-surface-variant font-medium">
            No courses match your filters. Try adjusting or clearing them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </section>
  );
}
