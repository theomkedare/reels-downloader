const { URL } = require("url");

const ALLOWED_DOMAINS = new Set([
  "youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com",
  "instagram.com", "www.instagram.com",
]);

function validateUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, platform: null, error: "URL is required." };
  }
  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, platform: null, error: "Invalid URL format." };
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, platform: null, error: "Only HTTP/HTTPS URLs are allowed." };
  }
  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_DOMAINS.has(hostname)) {
    return { valid: false, platform: null, error: "Only YouTube and Instagram URLs are supported." };
  }
  const platform = hostname.includes("instagram") ? "instagram" : "youtube";
  return { valid: true, platform, error: null };
}

module.exports = { validateUrl };