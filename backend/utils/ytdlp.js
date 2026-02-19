const fs = require("fs");
const os = require("os");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");
process.env.FFMPEG_BINARY = ffmpegPath;
const { spawn } = require("child_process");

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", args);
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0) reject(new Error(stderr || `yt-dlp exited with code ${code}`));
      else resolve(stdout.trim());
    });
    proc.on("error", (err) => {
      if (err.code === "ENOENT") reject(new Error("yt-dlp is not installed or not in PATH."));
      else reject(err);
    });
  });
}

async function fetchVideoInfo(url) {
  const args = ["--dump-json", "--no-playlist"];
  
  if (process.env.YT_COOKIES) {
    const cookiePath = path.join(os.tmpdir(), "yt-cookies.txt");
    fs.writeFileSync(cookiePath, process.env.YT_COOKIES);
    args.push("--cookies", cookiePath);
  }
  
  args.push(url);
  const raw = await runYtDlp(["--dump-json", "--no-playlist", url]);
  const info = JSON.parse(raw);

  const formatsMap = new Map();
  (info.formats || []).forEach((f) => {
    if (!f.height || f.vcodec === "none") return;
    const label = `${f.height}p`;
    if (!formatsMap.has(label) || f.tbr > (formatsMap.get(label).tbr || 0)) {
      formatsMap.set(label, {
        formatId: f.format_id,
        label,
        height: f.height,
        ext: f.ext,
        tbr: f.tbr || 0,
        filesize: f.filesize || f.filesize_approx || null,
      });
    }
  });

  const formats = Array.from(formatsMap.values()).sort((a, b) => b.height - a.height);

  return {
    title: info.title || "Unknown Title",
    thumbnail: info.thumbnail || null,
    duration: info.duration || 0,
    uploader: info.uploader || info.channel || "Unknown",
    platform: info.extractor_key || "Unknown",
    formats,
  };
}

module.exports = { runYtDlp, fetchVideoInfo };