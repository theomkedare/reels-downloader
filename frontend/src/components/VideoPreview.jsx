import React from "react";

function formatDuration(secs) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoPreview({ info }) {
  if (!info) return null;
  return (
    <div className="mt-6 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex gap-4 p-4">
        {info.thumbnail && (
          <div className="flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-snug line-clamp-2">{info.title}</p>
          <p className="text-white/50 text-xs mt-1">{info.uploader}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {info.duration > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>⏱ {formatDuration(info.duration)}</span>}
            <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80" }}>{info.platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
}