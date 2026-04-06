import Link from "next/link";
import { formatPrice, formatDuration, FALLBACK_THUMBNAIL } from "@/utils/formatters";

const INCLUSIONS = [
  { icon: "smart_display", text: (d) => (d ? `${d} on-demand video` : "On-demand video") },
  { icon: "devices", text: () => "Access on mobile and desktop" },
  { icon: "workspace_premium", text: () => "Certificate of completion" },
];

/**
 * @param {{
 *   course: object,
 *   isEnrolled: boolean
 * }}
 */
export default function CourseSidebar({ course, isEnrolled }) {
  if (!course) return null;

  const {
    _id,
    price,
    thumbnail,
    totalDuration,
    totalModules,
    resources,
  } = course;

  const isFree = price === 0;
  const durationStr = totalDuration ? formatDuration(totalDuration) : null;

  return (
    <div className="flex flex-col gap-6 sticky top-32">
      <div className="bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden flex flex-col border border-outline-variant/10">
        {/* Thumbnail preview */}
        <div className="aspect-video w-full bg-slate-200 relative group overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={thumbnail || FALLBACK_THUMBNAIL}
            alt={course.title}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform group-active:scale-95">
              <span
                className="material-symbols-outlined text-white text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
            </div>
          </div>
        </div>

        {/* Purchase / access section */}
        <div className="p-8 flex flex-col gap-8">
          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
              {formatPrice(price)}
            </span>
          </div>

          {/* CTA buttons */}
          {isEnrolled ? (
            <Link
              href={`/${_id}/player`}
              className="w-full py-5 bg-secondary text-white font-extrabold text-lg rounded-2xl shadow-soft hover:-translate-y-1 hover:shadow-ambient transition-all active:scale-[0.98] text-center block"
            >
              Continue Learning
            </Link>
          ) : isFree ? (
            <Link
              href={`/checkout?courseId=${_id}`}
              className="w-full py-5 bg-primary-gradient text-white font-extrabold text-lg rounded-2xl shadow-soft hover:-translate-y-1 hover:shadow-ambient transition-all active:scale-[0.98] text-center block"
            >
              Enroll for Free
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                href={`/checkout?courseId=${_id}`}
                className="w-full py-5 bg-primary-gradient text-white font-extrabold text-lg rounded-2xl shadow-soft hover:-translate-y-1 hover:shadow-ambient transition-all active:scale-[0.98] text-center block"
              >
                Buy Now — {formatPrice(price)}
              </Link>
            </div>
          )}

          <p className="text-[10px] text-center text-on-surface-variant font-medium tracking-wide uppercase">
            30-Day Money-Back Guarantee · Lifetime Access
          </p>

          {/* Course inclusions */}
          <div className="flex flex-col gap-5 pt-6 border-t border-outline-variant/10">
            <p className="font-bold text-sm text-on-surface">This course includes:</p>
            <ul className="flex flex-col gap-4">
              {INCLUSIONS.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3.5 text-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                  <span>{item.text(durationStr)}</span>
                </li>
              ))}
              {totalModules > 0 && (
                <li className="flex items-center gap-3.5 text-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-primary text-xl">video_library</span>
                  <span>{totalModules} video module{totalModules !== 1 ? "s" : ""}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Team offer */}
      <div className="bg-primary p-8 rounded-3xl flex flex-col gap-4 shadow-lg">
        <p className="text-white font-extrabold text-lg">Special Offer for Teams</p>
        <p className="text-on-primary text-sm leading-relaxed opacity-90">
          Enroll 5+ members and get an additional 20% discount on total billing.
        </p>
        <a
          className="text-on-primary font-bold text-sm flex items-center gap-2 group mt-2"
          href="#"
        >
          Contact Sales
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1.5 transition-transform">
            arrow_forward
          </span>
        </a>
      </div>
    </div>
  );
}
