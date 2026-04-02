import ProgressBar from "@/components/ui/ProgressBar";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboardPage() {
  return (
    <div className="bg-surface text-on-surface">
      {/* Header & Points Badge */}
      <header className="flex flex-col md:flex-row pt-25 justify-between items-end mb-16 gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-3">
            My Learning Dashboard
          </h1>
          <p className="text-on-surface-variant leading-relaxed text-lg">
            You've completed 75% of your weekly goals. Keep going to unlock the Advanced UI Certification!
          </p>
        </div>
        <div className="flex items-center gap-4 bg-tertiary-container text-on-tertiary-container px-8 py-4 rounded-2xl shadow-sm border border-tertiary-container/10">
          <span
            className="material-symbols-outlined text-tertiary text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Learner Points</p>
            <p className="text-2xl font-extrabold font-headline">1,240 XP</p>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-10">
        {/* Hero Feature: Continue Learning */}
        <section className="col-span-12 lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline text-on-surface">Continue Learning</h2>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Schedule{" "}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid gap-8">
            {/* Progress Card 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant transition-all hover:-translate-y-1 hover:shadow-ambient">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden shrink-0 relative bg-primary/10">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPp04SOpYbiFSmtQlmV10SkEOgI62wbw1cW3OW_1kmLhcLWi9k6qsaZ8E7IRMJ3sw47VWO0ghxaOCZ9QnjT59bQTedc6-KmzP2SaibpkTnrBJlvHsmKm9s_G0yTm9V92vOevqLXdxTG65lIPNp3GZJ5wsKYux_jwJbCIaE5kHqnCaOjBtWooQED-yRHGsFeqsAjGpMSQEbuiDKQrem1jdXo9CgT5YZlQq2rXuraTTWMjMtbmSDTyqtoLFynu4q4oT8bFeXiEgi1Sg"
                    alt="Advanced UI Design"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold py-1.5 px-4 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                      Advanced UI Design
                    </span>
                    <span className="text-sm font-bold text-secondary">82% Complete</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-5">Module 4: Advanced Prototyping & Motion</h3>
                  <div className="mb-6">
                    <ProgressBar value={82} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">timer</span>{" "}
                      12 mins left in this lesson
                    </span>
                    <button className="bg-primary-gradient text-white px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-soft">
                      Resume Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant transition-all hover:-translate-y-1 hover:shadow-ambient">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden shrink-0 relative bg-secondary/10">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdGA9OL2bLEiQQw36fUWu8e6SmcuRdJ7EYVLlR9--SoL8VlRxMdme7ei1Dp8CzY8Qg7Ck7_ofbGERBzieVbBt_EEsp5fnBEpgNmFnNy2xFz1s0D3vrSJZm8mhDnQr2y4Y3zPvi7Rg1WcM6awlMZsL7TGoKkegKwZLlhqZ0sz5xbaF-4-6N0F7JQU07ahh6eYDp3qwlOU2uAfx8lyeB6x7wCNBhnWlfvqNxsExw3UGnbGb3iepuiyASdcr469fX4cZ0bKwsfT0KmMg"
                    alt="Frontend Mastery"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold py-1.5 px-4 bg-secondary-container text-on-secondary-container rounded-full uppercase tracking-widest">
                      Frontend Mastery
                    </span>
                    <span className="text-sm font-bold text-secondary">45% Complete</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-5">React Framework: State Management Hooks</h3>
                  <div className="mb-6">
                    <ProgressBar value={45} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">timer</span>{" "}
                      45 mins left in this lesson
                    </span>
                    <button className="bg-surface-container-high text-primary px-8 py-3 rounded-xl font-bold text-sm transition-all hover:bg-surface-container active:scale-95">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar Content: Recommended & Stats */}
        <aside className="col-span-12 lg:col-span-4 space-y-10">
          {/* Quick Stats Widget */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant">
            <h2 className="text-lg font-bold font-headline mb-8">Learning Activity</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface p-5 rounded-2xl">
                <p className="text-xs text-on-surface-variant mb-2">Courses Joined</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">12</p>
              </div>
              <div className="bg-surface p-5 rounded-2xl">
                <p className="text-xs text-on-surface-variant mb-2">Certificates</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">04</p>
              </div>
              <div className="bg-surface p-5 rounded-2xl">
                <p className="text-xs text-on-surface-variant mb-2">Hours Learnt</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">128</p>
              </div>
              <div className="bg-surface p-5 rounded-2xl">
                <p className="text-xs text-on-surface-variant mb-2">Current Streak</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-extrabold font-headline text-on-surface">07</p>
                  <span
                    className="material-symbols-outlined text-tertiary text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Mentorship Session */}
          <div className="bg-primary-gradient text-white p-8 rounded-3xl relative overflow-hidden shadow-soft">
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-md mb-6 inline-block">
                Next Up
              </span>
              <h3 className="text-2xl font-bold font-headline mb-2">Mentor Session</h3>
              <p className="text-white/80 text-base mb-8">with Sarah Drasner</p>
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-white/50">calendar_today</span>
                <span className="text-sm font-medium">Today, 5:00 PM</span>
              </div>
              <button className="w-full py-4 bg-white text-primary font-bold rounded-2xl text-sm transition-all hover:bg-surface active:scale-95 shadow-soft">
                Join Waiting Room
              </button>
            </div>
            {/* Decorative Background Element */}
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <span className="material-symbols-outlined text-[120px]">videocam</span>
            </div>
          </div>

          {/* Enrolled Courses Mini List */}
          <div>
            <h2 className="text-lg font-bold font-headline mb-6 px-2">Other Courses</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-5 px-3 py-3 rounded-2xl hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">brush</span>
                </div>
                <div className="flex-grow">
                  <p className="text-base font-bold text-on-surface">Design Systems 101</p>
                  <p className="text-xs text-on-surface-variant">4 / 12 lessons complete</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>

              <div className="flex items-center gap-5 px-3 py-3 rounded-2xl hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                </div>
                <div className="flex-grow">
                  <p className="text-base font-bold text-on-surface">Data Structures & Algo</p>
                  <p className="text-xs text-on-surface-variant">Not started</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>

              <div className="flex items-center gap-5 px-3 py-3 rounded-2xl hover:bg-surface-container-lowest transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-2xl">psychology</span>
                </div>
                <div className="flex-grow">
                  <p className="text-base font-bold text-on-surface">Product Strategy</p>
                  <p className="text-xs text-on-surface-variant">Completed</p>
                </div>
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Featured Resource / Call to Action */}
      <section className="mt-20 bg-primary/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-16 border border-primary/10">
        <div className="flex-grow space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <span
              className="material-symbols-outlined text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            Personalized Path
          </div>
          <h2 className="text-4xl font-extrabold font-headline leading-tight max-w-xl text-on-surface">
            Accelerate your career with a customized blueprint.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-md">
            Our AI analyzes your progress and market trends to suggest the most impactful skills for your journey.
          </p>
          <div className="pt-6 flex flex-wrap items-center gap-8">
            <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold transition-all hover:bg-primary-container hover:shadow-ambient active:scale-95">
              Explore Blueprint
            </button>
            <button className="text-primary font-bold hover:underline">Learn how it works</button>
          </div>
        </div>
        <div className="shrink-0 w-full md:w-2/5 aspect-video rounded-3xl overflow-hidden shadow-soft relative group">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6p8XeNqJRFn-uzZudLHSWJcVVL9RTuvG9Tp_hJCJcyoBVNB2n54Q54hBZUa0xw4Cn0l2sf1y0LoLunkEpj7RW_WkD1BwZdrzGlnhmyAXV9xnPofaFXxa3SFtfjuwHuMnAKscXJ1QE9s8kpFQHqHTJqa0-nVoO7VHH2NE-LrqnCDyEp95zVMKbtHndwICutLxF4qvIszQf7iO94jj2b-7lM8yoWtle4IGfYSNMozPHMvhbBG14EXHK3CZNilQxL8kpOjtLUczgF-A"
            alt="Custom blueprint"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-surface/90 backdrop-blur-md p-5 rounded-full shadow-soft">
              <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
