const express = require("express");
const rateLimit = require("express-rate-limit");
const { validateUrl } = require("../utils/validateUrl");
const { fetchVideoInfo } = require("../utils/ytdlp");

const router = express.Router();

const infoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many info requests. Slow down!" },
});

router.post("/", infoLimiter, async (req, res) => {
  const { url } = req.body;
  const { valid, error } = validateUrl(url);
  if (!valid) return res.status(400).json({ error });

  try {
    const info = await fetchVideoInfo(url);
    return res.json({ success: true, data: info });
  } catch (err) {
    console.error("Info fetch error:", err.message);
    return res.status(500).json({
      error: "Failed to fetch video info. The URL may be private or unsupported.",
    });
  }
});

module.exports = router;