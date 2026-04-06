import Link from "next/link";
import { serverFetch } from "@/services/serverApi";
import { formatPrice, formatRating, FALLBACK_THUMBNAIL } from "@/utils/formatters";

export default async function FeaturedCourses() {
  const data = await serverFetch("/courses?limit=4&sort=rating", { revalidate: 300 });
  const courses = data?.courses ?? [];

  // If backend is down or returns nothing, render nothing
  // (home page still works; this section just disappears)
  if (!courses.length) return null;

  return (
    <section className="py-32 bg-surface-container-low/50">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl space-y-6">
            <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">
              Featured Courses
            </h2>
            <p className="text-on-surface-variant text-xl font-medium">
              Pick up a new skill today from our top-rated collections. Affordable prices,
              high-quality content.
            </p>
          </div>
          <Link
            href="/list"
            className="text-primary font-bold text-lg flex items-center gap-3 group px-6 py-3 bg-white rounded-2xl shadow-sm border border-surface-container-low hover:shadow-md transition-all"
          >
            Explore all courses
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {courses.map((course) => {
            const rating = course.rating?.average ?? null;
            const ratingCount = course.rating?.count ?? 0;
            const thumbnail = course.thumbnail || FALLBACK_THUMBNAIL;
            const categoryLabel = course.category?.replace(/-/g, " ") ?? "";

            return (
              <Link
                key={course._id}
                href={`/${course._id}`}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group border border-surface-container-low block"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {course.level && (
                    <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-primary shadow-sm capitalize">
                      {course.level}
                    </div>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <p className="text-[11px] font-extrabold text-primary tracking-widest uppercase capitalize">
                      {categoryLabel}
                    </p>
                    <h3 className="font-bold text-xl leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    {rating !== null && (
                      <div className="flex items-center gap-2 text-amber-500">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-sm font-black text-on-surface-variant">
                          {formatRating(rating)}
                          {ratingCount > 0 && ` (${ratingCount.toLocaleString()})`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                    <span className="text-3xl font-black text-on-surface">
                      {formatPrice(course.price)}
                    </span>
                    <span className="material-symbols-outlined bg-primary/5 text-primary hover:bg-primary hover:text-on-primary p-3 rounded-2xl transition-all text-2xl">
                      shopping_cart
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
