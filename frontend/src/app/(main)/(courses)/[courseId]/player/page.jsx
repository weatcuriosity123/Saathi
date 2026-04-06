"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/courses/player/VideoPlayer";
import LessonInfo from "@/components/courses/player/LessonInfo";
import CourseSidebar from "@/components/courses/player/CourseSidebar";
import apiClient from "@/services/apiClient";

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [playerData, setPlayerData] = useState(null); // { vimeoId, embedToken }
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");

  const currentModuleId = searchParams.get("module");

  // ── Load modules + progress on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoadingModules(true);
        setError("");

        const [modulesRes, progressRes] = await Promise.allSettled([
          apiClient(`/courses/${courseId}/modules/all`),
          apiClient(`/progress/${courseId}`),
        ]);

        const mods =
          modulesRes.status === "fulfilled"
            ? (modulesRes.value?.data?.modules ?? [])
            : [];
        const prog =
          progressRes.status === "fulfilled"
            ? (progressRes.value?.data?.progress ?? null)
            : null;

        setModules(mods);
        setProgress(prog);

        // Default to lastModuleId or first module if no ?module= in URL
        if (!searchParams.get("module") && mods.length > 0) {
          const defaultId = prog?.lastModuleId ?? mods[0]?._id;
          if (defaultId) {
            router.replace(`/${courseId}/player?module=${defaultId}`);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load course content.");
      } finally {
        setLoadingModules(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // ── Fetch Vimeo player data whenever module changes ────────────────────────
  useEffect(() => {
    if (!currentModuleId) return;

    (async () => {
      try {
        setLoadingPlayer(true);
        setPlayerData(null);
        const res = await apiClient(
          `/courses/${courseId}/modules/${currentModuleId}/player`
        );
        setPlayerData(res?.data ?? null);
      } catch (err) {
        setPlayerData(null);
        // 409 = video not ready (transcoding); show generic placeholder, not error
        if (err.status !== 409) {
          setError(err.message || "Failed to load video.");
        }
      } finally {
        setLoadingPlayer(false);
      }
    })();
  }, [courseId, currentModuleId]);

  // ── Navigate to a module ──────────────────────────────────────────────────
  const handleModuleSelect = useCallback(
    (moduleId) => {
      router.push(`/${courseId}/player?module=${moduleId}`);
    },
    [courseId, router]
  );

  // ── Mark / unmark complete ────────────────────────────────────────────────
  const isCurrentCompleted = !!(
    currentModuleId &&
    progress?.completedModules?.some((id) => id.toString() === currentModuleId)
  );

  const handleToggleComplete = useCallback(async () => {
    if (!currentModuleId || marking) return;

    try {
      setMarking(true);
      const method = isCurrentCompleted ? "DELETE" : "POST";
      const res = await apiClient(
        `/progress/${courseId}/modules/${currentModuleId}/complete`,
        { method }
      );
      setProgress(res?.data?.progress ?? null);
    } catch {
      // Silently fail — progress will sync on next visit
    } finally {
      setMarking(false);
    }
  }, [courseId, currentModuleId, isCurrentCompleted, marking]);

  // ── Derived: current module + prev/next ───────────────────────────────────
  const currentIdx = modules.findIndex((m) => m._id === currentModuleId);
  const currentModule = currentIdx >= 0 ? modules[currentIdx] : null;
  const prevModule = currentIdx > 0 ? modules[currentIdx - 1] : null;
  const nextModule = currentIdx < modules.length - 1 ? modules[currentIdx + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] max-w-[1440px] mx-auto bg-white pt-20">
      {/* Left: Video + Lesson Info */}
      <div className="flex-1 lg:h-[calc(100vh-80px)] overflow-y-auto">
        <VideoPlayer
          vimeoId={playerData?.vimeoId}
          embedToken={playerData?.embedToken}
          loading={loadingPlayer}
        />

        {error && (
          <div className="mx-8 mt-4 p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-sm font-medium">
            {error}
          </div>
        )}

        <LessonInfo
          module={currentModule}
          onPrev={prevModule ? () => handleModuleSelect(prevModule._id) : null}
          onNext={nextModule ? () => handleModuleSelect(nextModule._id) : null}
        />
      </div>

      {/* Right: Sidebar */}
      <CourseSidebar
        modules={modules}
        progress={progress}
        currentModuleId={currentModuleId}
        onModuleSelect={handleModuleSelect}
        onToggleComplete={handleToggleComplete}
        isCurrentCompleted={isCurrentCompleted}
        marking={marking}
        loading={loadingModules}
      />
    </div>
  );
}
