"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/services/apiClient";
import { formatPrice, formatDuration, FALLBACK_THUMBNAIL } from "@/utils/formatters";

// ── Razorpay script loader ─────────────────────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// ── Page component ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch course + enrollment status ──────────────────────────────────────
  useEffect(() => {
    if (!courseId) {
      setError("No course specified.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes] = await Promise.allSettled([
          apiClient(`/courses/${courseId}`),
          apiClient(`/enrollments/check/${courseId}`),
        ]);

        if (courseRes.status === "fulfilled") {
          setCourse(courseRes.value?.data?.course ?? null);
        } else {
          setError("Course not found.");
        }

        if (enrollRes.status === "fulfilled") {
          setIsEnrolled(enrollRes.value?.data?.isEnrolled ?? false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  // ── Redirect to login if unauthenticated ─────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/checkout?courseId=${courseId}`);
    }
  }, [authLoading, user, courseId, router]);

  // ── Free course enrollment ────────────────────────────────────────────────
  const handleFreeEnroll = useCallback(async () => {
    try {
      setProcessing(true);
      setError("");
      await apiClient(`/enrollments/${courseId}/initiate`, { method: "POST" });
      router.replace(`/${courseId}/player`);
    } catch (err) {
      if (err.status === 409) {
        // Already enrolled
        router.replace(`/${courseId}/player`);
      } else {
        setError(err.message || "Enrollment failed. Please try again.");
        setProcessing(false);
      }
    }
  }, [courseId, router]);

  // ── Paid course — Razorpay flow ───────────────────────────────────────────
  const handlePay = useCallback(async () => {
    try {
      setProcessing(true);
      setError("");

      // Step 1: Create Razorpay order on backend
      const orderRes = await apiClient(`/enrollments/${courseId}/initiate`, {
        method: "POST",
      });
      const data = orderRes?.data;

      // If course became free or was already enrolled
      if (data?.free || data?.enrollment?.status === "completed") {
        router.replace(`/${courseId}/player`);
        return;
      }

      const { order } = data;

      // Step 2: Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Payment gateway failed to load. Please refresh and try again.");
        setProcessing(false);
        return;
      }

      // Step 3: Open Razorpay modal
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.id,
        name: "Saathi Learning",
        description: course?.title || "Course Enrollment",
        image: course?.thumbnail || FALLBACK_THUMBNAIL,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#6366F1" },
        handler: async function (response) {
          // Step 4: Verify payment on backend
          try {
            await apiClient("/enrollments/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            router.replace(`/${courseId}/player`);
          } catch (verifyErr) {
            setError(verifyErr.message || "Payment verification failed. Contact support.");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error?.description || "Unknown error"}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      if (err.status === 409) {
        router.replace(`/${courseId}/player`);
      } else {
        setError(err.message || "Failed to initiate payment. Please try again.");
        setProcessing(false);
      }
    }
  }, [courseId, course, user, router]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-error">error</span>
          <p className="text-on-surface font-semibold">{error}</p>
          <Link href="/list" className="text-primary font-bold text-sm hover:underline">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const isFree = course.price === 0;
  const tutor = course.tutorId;

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href={`/${courseId}`} className="hover:text-primary transition-colors">
            ← Back to course
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Order Summary ─────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">
                {isEnrolled ? "You're Already Enrolled" : "Complete Your Enrollment"}
              </h1>
              <p className="mt-2 text-on-surface-variant">
                {isEnrolled
                  ? "You have access to this course. Jump in whenever you're ready."
                  : isFree
                  ? "This course is completely free — enroll with one click."
                  : "Secure checkout powered by Razorpay."}
              </p>
            </div>

            {/* Course card */}
            <div className="bg-white rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
              <div className="flex gap-6 p-6">
                <img
                  src={course.thumbnail || FALLBACK_THUMBNAIL}
                  alt={course.title}
                  className="w-28 h-20 object-cover rounded-2xl shrink-0 bg-surface-container"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                    {course.category || "Course"}
                  </p>
                  <h2 className="font-bold font-headline text-on-surface text-base leading-snug line-clamp-2">
                    {course.title}
                  </h2>
                  {tutor?.name && (
                    <p className="mt-1.5 text-xs text-on-surface-variant">
                      By {tutor.name}
                    </p>
                  )}
                </div>
              </div>

              {/* What you get */}
              <div className="border-t border-outline-variant/10 px-6 py-5 grid grid-cols-2 gap-4">
                {[
                  {
                    icon: "play_circle",
                    label: `${course.totalModules ?? 0} modules`,
                  },
                  {
                    icon: "schedule",
                    label: course.totalDuration
                      ? formatDuration(course.totalDuration)
                      : "Self-paced",
                  },
                  { icon: "workspace_premium", label: "Certificate of completion" },
                  { icon: "all_inclusive", label: "Lifetime access" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-lg">
                      {icon}
                    </span>
                    <span className="text-sm text-on-surface-variant font-medium">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">error</span>
                {error}
              </div>
            )}
          </div>

          {/* ── Right: Payment Panel ──────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-outline-variant/20 shadow-sm p-8 space-y-6 sticky top-24">
              {/* Price */}
              <div className="text-center space-y-1">
                <p className="text-4xl font-black font-headline text-on-surface">
                  {isFree ? "Free" : `₹${course.price}`}
                </p>
                {!isFree && (
                  <p className="text-xs text-on-surface-variant">One-time payment · No subscription</p>
                )}
              </div>

              {/* Divider */}
              <hr className="border-outline-variant/10" />

              {/* CTA */}
              {isEnrolled ? (
                <Link
                  href={`/${courseId}/player`}
                  className="block w-full py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest text-center shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all"
                >
                  Continue Learning
                </Link>
              ) : isFree ? (
                <button
                  onClick={handleFreeEnroll}
                  disabled={processing}
                  className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bolt
                    </span>
                  )}
                  {processing ? "Enrolling…" : "Enroll for Free"}
                </button>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">lock</span>
                  )}
                  {processing ? "Processing…" : `Pay ${formatPrice(course.price)}`}
                </button>
              )}

              {/* Trust signals */}
              {!isEnrolled && (
                <div className="space-y-3 pt-2">
                  {[
                    { icon: "lock", text: "Secure payment via Razorpay" },
                    { icon: "replay", text: "7-day money-back guarantee" },
                    { icon: "all_inclusive", text: "Lifetime access to course" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        {icon}
                      </span>
                      <span className="text-xs font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
