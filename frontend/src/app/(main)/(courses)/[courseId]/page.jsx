import CourseHero from "@/components/courses/detail/CourseHero";
import CourseCurriculum from "@/components/courses/detail/CourseCurriculum";
import InstructorCard from "@/components/courses/detail/InstructorCard";
import CourseReviews from "@/components/courses/detail/CourseReviews";
import CourseSidebar from "@/components/courses/detail/CourseSidebar";

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;
  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-10 pt-32 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Course Details */}
        <div className="lg:col-span-8 flex flex-col gap-20">
          <CourseHero courseId={courseId} />
          <CourseCurriculum />
          <InstructorCard />
          <CourseReviews />
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-4">
          <CourseSidebar />
        </div>
      </div>
    </main>
  );
}
