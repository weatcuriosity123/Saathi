import { notFound } from "next/navigation";
import CourseHero from "@/components/courses/detail/CourseHero";
import CourseCurriculum from "@/components/courses/detail/CourseCurriculum";
import InstructorCard from "@/components/courses/detail/InstructorCard";
import CourseReviews from "@/components/courses/detail/CourseReviews";
import CourseSidebar from "@/components/courses/detail/CourseSidebar";
import { serverFetch } from "@/services/serverApi";

export async function generateMetadata({ params }) {
  const { courseId } = await params;
  const data = await serverFetch(`/courses/${courseId}`, { revalidate: 120 });
  if (!data?.course) return { title: "Course Not Found | SAATHI" };
  return {
    title: `${data.course.title} | SAATHI`,
    description: data.course.shortDescription || data.course.description?.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;

  // Fetch course + modules
  const data = await serverFetch(`/courses/${courseId}`, { revalidate: 120 });

  if (!data?.course) notFound();

  const { course, modules = [], isEnrolled = false } = data;

  // Fetch tutor profile separately (tutorId is not populated in course query)
  const tutorData = course.tutorId
    ? await serverFetch(`/tutors/${course.tutorId}/profile`, { revalidate: 300 })
    : null;

  // Fetch first page of reviews
  const reviewData = await serverFetch(`/courses/${courseId}/reviews?limit=4`, {
    revalidate: 60,
  });

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-10 pt-32 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-20">
          <CourseHero course={course} />
          <CourseCurriculum modules={modules} />
          <InstructorCard tutor={tutorData?.tutor ?? null} />
          <CourseReviews
            reviews={reviewData?.reviews ?? []}
            rating={course.rating}
            courseId={course._id}
          />
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-4">
          <CourseSidebar course={course} isEnrolled={isEnrolled} />
        </div>
      </div>
    </main>
  );
}
