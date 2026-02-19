const express = require("express");
const rateLimit = require("express-rate-limit");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");
const { validateUrl } = require("../utils/validateUrl");
const DownloadLog = require("../models/DownloadLog");

const router = express.Router();

const downloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many download requests. Please wait a minute." },
});

router.post("/", downloadLimiter, async (req, res) => {
  const { url, format = "mp4", quality = "720", title = "download" } = req.body;

  const { valid, platform, error } = validateUrl(url);
  if (!valid) return res.status(400).json({ error });
  if (!["mp4", "mp3"].includes(format)) return res.status(400).json({ error: "Invalid format." });

  const height = String(quality).replace(/[^0-9]/g, "") || "720";
  const tempDir = os.tmpdir();
  const tempId = uuidv4();
  const outTemplate = path.join(tempDir, `${tempId}.%(ext)s`);

  let ytArgs;
  if (format === "mp3") {
    ytArgs = ["--no-playlist", "-f", "bestaudio/best", "--extract-audio",
      "--audio-format", "mp3", "--audio-quality", "192K", "-o", outTemplate, url];
  } else {
    ytArgs = ["--no-playlist", "-f",
      `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`,
      "--merge-output-format", "mp4", "-o", outTemplate, url];
  }

  let tempFilePath = null;

  const cleanup = () => {
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlink(tempFilePath, () => {});
    fs.readdir(tempDir, (err, files) => {
      if (err) return;
      files.filter((f) => f.startsWith(tempId)).forEach((f) =>
        fs.unlink(path.join(tempDir, f), () => {}));
    });
  };

  try {
    await new Promise((resolve, reject) => {
      const proc = spawn("yt-dlp", ytArgs);
      proc.on("close", (code) => {
        if (code !== 0) reject(new Error(`yt-dlp exited with code ${code}`));
        else resolve();
      });
      proc.on("error", (err) => {
        if (err.code === "ENOENT") reject(new Error("yt-dlp not found."));
        else reject(err);
      });
    });

    const files = fs.readdirSync(tempDir).filter((f) => f.startsWith(tempId));
    if (files.length === 0) throw new Error("Output file not found after download.");

    tempFilePath = path.join(tempDir, files[0]);
    const ext = path.extname(files[0]).replace(".", "") || format;
    const safeTitle = title.replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().slice(0, 80) || "download";

    DownloadLog.create({ url, platform, format, quality: height + "p", title, success: true, ip: req.ip }).catch(() => {});

    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${ext}"`);
    res.setHeader("Content-Type", format === "mp3" ? "audio/mpeg" : "video/mp4");
    res.setHeader("Content-Length", fs.statSync(tempFilePath).size);

    const readStream = fs.createReadStream(tempFilePath);
    readStream.on("end", cleanup);
    readStream.on("error", cleanup);
    req.on("close", cleanup);
    readStream.pipe(res);

  } catch (err) {
    cleanup();
    console.error("Download error:", err.message);
    DownloadLog.create({ url, platform, format, quality: height + "p", title, success: false, errorMessage: err.message, ip: req.ip }).catch(() => {});
    if (!res.headersSent) res.status(500).json({ error: "Download failed. " + err.message });
  }
});

module.exports = router;