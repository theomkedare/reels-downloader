import React from "react";

export default function SkeletonPreview() {
  return (
    <div className="mt-6 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-32 h-20 rounded-xl shimmer" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded-lg shimmer w-3/4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="h-3 rounded-lg shimmer w-1/3" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>
    </div>
  );
}