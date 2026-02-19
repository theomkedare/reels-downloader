import { useState, useCallback } from "react";
import { downloadVideo } from "../utils/api";

export function useDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const startDownload = useCallback(async ({ url, format, quality, title }) => {
    setDownloading(true); setProgress(0); setError(null);
    try {
      const response = await downloadVideo({ url, format, quality, title }, (pct) => setProgress(pct));
      const blob = new Blob([response.data], { type: format === "mp3" ? "audio/mpeg" : "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const disposition = response.headers["content-disposition"];
      let filename = `${title || "download"}.${format}`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setProgress(100);
      return true;
    } catch (err) {
      setError(err?.response?.data?.error || "Download failed. Please try again.");
      return false;
    } finally {
      setDownloading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  }, []);

  return { downloading, progress, error, startDownload };
}