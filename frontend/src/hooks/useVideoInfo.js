import { useState, useCallback, useRef } from "react";
import { fetchVideoInfo } from "../utils/api";

const URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com|m\.youtube\.com)\/.+/i;

export function useVideoInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const fetchInfo = useCallback(async (url) => {
    if (!url || !URL_REGEX.test(url.trim())) { setInfo(null); setError(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true); setError(null); setInfo(null);
      try {
        const result = await fetchVideoInfo(url.trim());
        if (result.success) setInfo(result.data);
        else setError(result.error || "Failed to fetch video info.");
      } catch (err) {
        setError(err?.response?.data?.error || "Could not fetch video info. Check the URL.");
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  const clearInfo = useCallback(() => { setInfo(null); setError(null); }, []);

  return { info, loading, error, fetchInfo, clearInfo };
}