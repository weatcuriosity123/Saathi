import Sidebar from "@/components/layout/Sidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
