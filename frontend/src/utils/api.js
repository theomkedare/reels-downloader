import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 60000,
});

export const fetchVideoInfo = (url) =>
  api.post("/info", { url }).then((r) => r.data);

export const downloadVideo = async (payload, onProgress) => {
  const response = await api.post("/download", payload, {
    responseType: "blob",
    onDownloadProgress: (e) => {
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });
  return response;
};

export default api;