import { avatarUrl } from "@/utils/formatters";

/** @param {{ tutor: object | null }} */
export default function InstructorCard({ tutor }) {
  // If tutor fetch failed or not yet available, show a graceful fallback
  if (!tutor) {
    return (
      <section className="bg-primary/5 p-12 rounded-3xl border border-primary/10">
        <p className="text-on-surface-variant font-medium">Instructor information not available.</p>
      </section>
    );
  }

  const {
    name,
    avatar,
    tutorProfile,
  } = tutor;

  const bio = tutorProfile?.bio ?? "No bio provided.";
  const expertise = tutorProfile?.expertise ?? [];

  return (
    <section className="bg-primary/5 p-12 rounded-3xl flex flex-col md:flex-row gap-10 items-start border border-primary/10">
      {/* Avatar */}
      <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-white">
        <img
          className="w-full h-full object-cover"
          src={avatar || avatarUrl(name)}
          alt={name}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
            Lead Instructor
          </span>
          <h3 className="font-headline text-3xl font-extrabold text-on-surface">{name}</h3>
          {expertise.length > 0 && (
            <p className="text-on-surface-variant font-medium capitalize">
              {expertise.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>

        <p className="text-on-surface leading-relaxed text-base opacity-90">{bio}</p>

        <div className="flex flex-wrap gap-6 items-center pt-2">
          {tutorProfile?.isApproved && (
            <div className="flex items-center gap-1.5 text-sm font-bold text-secondary">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span>Verified Instructor</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
