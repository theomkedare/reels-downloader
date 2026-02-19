const mongoose = require("mongoose");

const downloadLogSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    platform: { type: String, enum: ["youtube", "instagram", "unknown"], default: "unknown" },
    format: { type: String, enum: ["mp4", "mp3"], required: true },
    quality: { type: String, default: "auto" },
    title: { type: String, default: "Unknown" },
    success: { type: Boolean, default: true },
    errorMessage: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DownloadLog", downloadLogSchema);