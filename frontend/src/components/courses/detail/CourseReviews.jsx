import { formatRating } from "@/utils/formatters";

function StarRow({ count, filled = true }) {
  return (
    <div className="flex text-tertiary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-xs"
          style={i < count && filled ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          star
        </span>
      ))}
    </div>
  );
}

/**
 * @param {{
 *   reviews: object[],
 *   rating: { average: number, count: number } | null,
 *   courseId: string
 * }}
 */
export default function CourseReviews({ reviews = [], rating, courseId }) {
  if (!reviews.length && !rating?.count) return null;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-3xl font-bold">Student Reviews</h2>
          {rating?.count > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-5xl font-headline font-black text-on-surface">
                {formatRating(rating.average)}
              </span>
              <div className="flex flex-col gap-1">
                <StarRow count={Math.round(rating.average)} />
                <span className="text-sm text-on-surface-variant">
                  {rating.count.toLocaleString()} ratings
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-on-surface-variant font-medium">
          No reviews yet. Be the first to review this course!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => {
            const initials = review.userId?.name
              ? review.userId.name.slice(0, 2).toUpperCase()
              : "??";
            const name = review.userId?.name ?? "Student";

            return (
              <div
                key={review._id}
                className="bg-white p-8 rounded-2xl flex flex-col gap-5 shadow-sm border border-outline-variant/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{name}</p>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRow count={review.rating} />
                </div>
                {review.comment && (
                  <p className="text-sm text-on-surface-variant italic leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
