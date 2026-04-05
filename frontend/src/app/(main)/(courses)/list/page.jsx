"use client";

import { useState, useEffect, useCallback } from "react";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseGrid from "@/components/courses/CourseGrid";
import apiClient from "@/services/apiClient";

const DEFAULT_FILTERS = {
  category: "",
  level: "",
  priceMin: "",
  priceMax: "",
  rating: "",
  search: "",
  sort: "newest",
  page: 1,
};

export default function CoursesListingPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = useCallback(async (activeFilters) => {
    setLoading(true);
    setError("");
    try {
      // Build query string from active filters (skip empty values)
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, val]) => {
        if (val !== "" && val !== null && val !== undefined) {
          params.set(key, val);
        }
      });
      params.set("limit", "12");

      const res = await apiClient(`/courses?${params.toString()}`);
      setCourses(res.data.courses || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      setError(err.message || "Failed to load courses.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchCourses(filters);
  }, [filters, fetchCourses]);

  const handleFilterChange = (updates) => {
    // Any filter change resets to page 1
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-10 pt-32 pb-20 flex flex-col md:flex-row gap-16">
      <CourseFilters filters={filters} onFilterChange={handleFilterChange} />
      <CourseGrid
        courses={courses}
        pagination={pagination}
        loading={loading}
        error={error}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
