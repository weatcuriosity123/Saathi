import VideoPlayer from "@/components/courses/player/VideoPlayer";
import LessonInfo from "@/components/courses/player/LessonInfo";
import CourseSidebar from "@/components/courses/player/CourseSidebar";

export default function CoursePlayerPage({ params }) {
  const { courseId } = params;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] max-w-[1440px] mx-auto bg-white pt-26">
      {/* Left Content Area: Video + Lesson Info */}
      <div className="flex-1 lg:h-[calc(100vh-80px)] overflow-y-auto">
        <VideoPlayer />
        <LessonInfo />
      </div>

      {/* Right Sidebar Area: Curriculum */}
      <CourseSidebar />
    </div>
  );
}
