import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminGuard from "@/components/guards/AdminGuard";

export const metadata = {
  title: "SAATHI | Admin Portal",
  description: "Manage SAATHI platform analytics, users, and content.",
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-surface selection:bg-primary/10">
        <AdminSidebar />
        <div className="pl-72 flex flex-col min-h-screen">
          <AdminTopBar />
          <main className="flex-1 pt-24 pb-20 px-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-700">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
