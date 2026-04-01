import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// A template file serves as a layout that remounts on every navigation switch,
// fulfilling the requirement for components that need to re-render on route changes.
export default function MainTemplate({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
