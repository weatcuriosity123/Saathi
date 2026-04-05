"use client";

import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { formatPrice } from "@/utils/formatters";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function RecentEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient("/tutors/me/earnings");
        setData(res?.data ?? null);
      } catch {
        // silently fail — keep null
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enrollments = data?.enrollments ?? [];
  const totalRevenue = data?.totalRevenue ?? 0;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-on-surface">Recent Earnings</h3>
        {totalRevenue > 0 && (
          <span className="text-sm font-black text-secondary">{formatPrice(totalRevenue)} total</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-surface-container-high animate-pulse" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="py-10 text-center text-on-surface-variant/60 text-sm">
          No enrollments yet
        </div>
      ) : (
        <div className="space-y-5 mt-6">
          {enrollments.map((item) => (
            <div key={item._id} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                <span className="material-symbols-outlined">call_made</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{item.courseTitle}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {item.student?.name ?? "Student"} · {timeAgo(item.enrolledAt)}
                </p>
              </div>
              <div className="text-sm font-black text-secondary shrink-0">
                +{formatPrice(item.amount ?? 0)}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="w-full mt-8 py-3 rounded-xl border border-dashed border-outline-variant text-slate-500 text-sm font-bold hover:bg-slate-50 transition-colors">
        View Statement
      </button>
    </div>
  );
}
