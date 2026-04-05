"use client";

/**
 * VideoPlayer — renders a Vimeo iframe embed.
 *
 * Props:
 *   vimeoId    – Vimeo video ID (string)
 *   embedToken – Signed embed token for private videos (may be null → public embed)
 *   loading    – True while fetching player data from backend
 */
export default function VideoPlayer({ vimeoId, embedToken, loading }) {
  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full bg-black aspect-video flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/60">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading video…</p>
        </div>
      </div>
    );
  }

  // ── No video yet (transcoding / not uploaded) ──────────────────────────────
  if (!vimeoId) {
    return (
      <div className="w-full bg-neutral-900 aspect-video flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/40 text-center px-8">
          <span className="material-symbols-outlined text-5xl">videocam_off</span>
          <p className="text-sm font-medium">
            Video not available yet. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  // ── Vimeo embed ────────────────────────────────────────────────────────────
  const params = new URLSearchParams({
    autoplay: "1",
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
    ...(embedToken ? { token: embedToken } : {}),
  });

  return (
    <div className="w-full bg-black aspect-video">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?${params.toString()}`}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Course Video"
      />
    </div>
  );
}
