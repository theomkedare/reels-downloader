import React from "react";

export default function ProgressBar({ progress, visible }) {
  if (!visible) return null;
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
        <span>Downloading...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div className="h-full rounded-full transition-all duration-300 progress-pulse"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg, #22c55e, #14b8a6)" }} />
      </div>
    </div>
  );
}