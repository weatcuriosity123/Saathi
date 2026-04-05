"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * TutorGuard — client-side role protection for tutor routes.
 *
 * Allows: tutor, admin
 * Redirects students → /dashboard
 * Redirects unauthenticated → /login (middleware handles this first, but
 * this is a second line of defence for stale cookies)
 */
export default function TutorGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "student") {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // While session is loading, show a minimal full-screen spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Block render until user is confirmed as tutor/admin
  if (!user || user.role === "student") return null;

  return <>{children}</>;
}
