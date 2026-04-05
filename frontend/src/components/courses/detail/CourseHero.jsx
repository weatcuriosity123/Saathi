import { formatRating, formatDuration } from "@/utils/formatters";

/** @param {{ course: object }} */
export default function CourseHero({ course }) {
  if (!course) return null;

  const {
    title,
    description,
    category,
    level,
    tags = [],
    rating,
    totalStudents,
    totalDuration,
    totalModules,
    language,
  } = course;

  const categoryLabel = category?.replace(/-/g, " ") ?? "";

  return (
    <section className="flex flex-col gap-8">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {category && (
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest capitalize">
            {categoryLabel}
          </span>
        )}
        {level && (
          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-widest capitalize">
            {level}
          </span>
        )}
        {tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-semibold rounded-full capitalize"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title & Description */}
      <div className="flex flex-col gap-4">
        <h1 className="font-headline text-5xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
          {title}
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-6">
        {rating?.count > 0 && (
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-bold text-on-surface">{formatRating(rating.average)}</span>
            <span className="text-on-surface-variant text-sm">
              ({rating.count.toLocaleString()} ratings)
            </span>
          </div>
        )}

        {totalStudents > 0 && (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-xl">group</span>
            <span className="text-sm font-medium">
              {totalStudents.toLocaleString()} students enrolled
            </span>
          </div>
        )}

        {totalModules > 0 && (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-xl">video_library</span>
            <span className="text-sm font-medium">{totalModules} modules</span>
          </div>
        )}

        {totalDuration > 0 && (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            <span className="text-sm font-medium">{formatDuration(totalDuration)}</span>
          </div>
        )}

        {language && language !== "English" && (
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-xl">translate</span>
            <span className="text-sm font-medium">{language}</span>
          </div>
        )}
      </div>
    </section>
  );
}
