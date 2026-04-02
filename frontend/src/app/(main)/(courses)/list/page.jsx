import CourseFilters from "@/components/courses/CourseFilters";
import CourseGrid from "@/components/courses/CourseGrid";

export default function CoursesListingPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-10 pt-32 pb-20 flex flex-col md:flex-row gap-16">
      <CourseFilters />
      <CourseGrid />
    </div>
  );
}
