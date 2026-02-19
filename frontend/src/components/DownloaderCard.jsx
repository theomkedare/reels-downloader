import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import VideoPreview from "./VideoPreview";
import SkeletonPreview from "./SkeletonPreview";
import ProgressBar from "./ProgressBar";
import { useVideoInfo } from "../hooks/useVideoInfo";
import { useDownload } from "../hooks/useDownload";

const STATIC_QUALITIES = ["2160p", "1440p", "1080p", "720p", "480p", "360p"];

export default function DownloaderCard() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("720p");
  const { info, loading: infoLoading, error: infoError, fetchInfo, clearInfo } = useVideoInfo();
  const { downloading, progress, error: dlError, startDownload } = useDownload();

  useEffect(() => { if (url.trim()) fetchInfo(url); else clearInfo(); }, [url]);

  const availableQualities = info?.formats?.length > 0
    ? info.formats.map((f) => f.label)
    : format === "mp3" ? ["192kbps"] : STATIC_QUALITIES;

  useEffect(() => { if (format === "mp3") setQuality("192kbps"); else setQuality("720p"); }, [format]);
  useEffect(() => { if (dlError) toast.error(dlError); }, [dlError]);

  const handleDownload = async () => {
    if (!url.trim()) { toast.error("Please enter a URL first!"); return; }
    const ok = await startDownload({ url: url.trim(), format, quality, title: info?.title || "download" });
    if (ok) toast.success("Download complete! 🎉");
  };

  const handlePaste = async () => {
    try { const text = await navigator.clipboard.readText(); setUrl(text); }
    catch { toast.error("Clipboard access denied. Please paste manually."); }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: "#1a2e1a", color: "#fff", border: "1px solid rgba(34,197,94,0.3)", fontFamily: "DM Sans, sans-serif" },
        success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }} />

      <div className="w-full max-w-lg mx-auto rounded-3xl card-glow"
        style={{ background: "linear-gradient(145deg, #141f14 0%, #0f1a1a 50%, #0a1520 100%)", border: "1px solid rgba(34,197,94,0.15)" }}>

        <div className="px-8 pt-8 pb-2 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium tracking-wider uppercase">Free · Fast · No Watermark</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display leading-tight">
            <span className="gradient-text">Reels / Shorts</span><br />
            <span className="text-white">Downloader</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">YouTube Shorts & Instagram Reels — MP4 or MP3</p>
        </div>

        <div className="mx-8 my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="px-8 pb-8 space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Video URL</label>
            <div className="relative flex items-center">
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/shorts/... or instagram.com/reel/..."
                className="w-full rounded-xl px-4 py-3 pr-20 text-sm text-white placeholder-white/25 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(34,197,94,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
              <div className="absolute right-2">
                {url ? (
                  <button onClick={() => { setUrl(""); clearInfo(); }} className="text-white/30 hover:text-white/60 text-lg px-2">✕</button>
                ) : (
                  <button onClick={handlePaste} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-lg"
                    style={{ background: "rgba(34,197,94,0.1)" }}>Paste</button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <option value="mp4">🎬 MP4 Video</option>
                <option value="mp3">🎵 MP3 Audio</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Quality</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)} disabled={format === "mp3"}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer disabled:opacity-40"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {availableQualities.map((q) => <option key={q} value={q}>{format === "mp3" ? "192 kbps" : q}</option>)}
              </select>
            </div>
          </div>

          {infoLoading && <SkeletonPreview />}
          {!infoLoading && info && <VideoPreview info={info} />}
          {!infoLoading && infoError && url && (
            <div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              ⚠️ {infoError}
            </div>
          )}

          <ProgressBar progress={progress} visible={downloading} />

          <button onClick={handleDownload} disabled={downloading || infoLoading}
            className="w-full py-4 rounded-2xl text-white font-bold text-base tracking-wide mt-2"
            style={{
              background: downloading ? "rgba(239,68,68,0.4)" : "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: downloading ? "none" : "0 4px 20px rgba(239,68,68,0.4)",
              opacity: infoLoading ? 0.5 : 1,
            }}>
            {downloading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Downloading...
              </span>
            ) : "⬇ Download Now"}
          </button>

          <p className="text-center text-white/25 text-xs pt-2">
            All rights reserved · Made by{" "}
            <a href="https://instagram.com/omkedare.dev" target="_blank" rel="noopener noreferrer"
              className="text-emerald-400/70 hover:text-emerald-400 transition-colors">
              OM (@omkedare.dev)
            </a>
          </p>
        </div>
      </div>
    </>
  );
}