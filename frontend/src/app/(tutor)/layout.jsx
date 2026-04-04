import TutorSidebar from "@/components/layout/tutor/TutorSidebar";
import TutorHeader from "@/components/layout/tutor/TutorHeader";

export default function TutorLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <TutorSidebar />
      <TutorHeader />
      <div className="ml-64 pt-24 pb-12 px-10">
        <div className="max-w-[1440px] mx-auto">
          {children}
        </div>
      </div>
      
      {/* Background Accents */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
