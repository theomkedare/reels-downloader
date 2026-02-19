import React from "react";
import DownloaderCard from "./components/DownloaderCard";

export default function App() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #052e16 0%, #042f2e 40%, #0c1a35 100%)" }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #22c55e, transparent 70%)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #14b8a6, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-lg">
        <DownloaderCard />
      </div>
    </div>
  );
}