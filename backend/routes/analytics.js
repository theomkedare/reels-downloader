const express = require("express");
const DownloadLog = require("../models/DownloadLog");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [total, successful, platformStats, formatStats, recentLogs] = await Promise.all([
      DownloadLog.countDocuments(),
      DownloadLog.countDocuments({ success: true }),
      DownloadLog.aggregate([{ $group: { _id: "$platform", count: { $sum: 1 } } }]),
      DownloadLog.aggregate([{ $group: { _id: "$format", count: { $sum: 1 } } }]),
      DownloadLog.find().sort({ createdAt: -1 }).limit(10).select("-ip"),
    ]);

    res.json({
      success: true,
      data: {
        total, successful, failed: total - successful,
        successRate: total > 0 ? ((successful / total) * 100).toFixed(1) : "0",
        platformBreakdown: platformStats,
        formatBreakdown: formatStats,
        recentDownloads: recentLogs,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics." });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      DownloadLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-ip"),
      DownloadLog.countDocuments(),
    ]);

    res.json({
      success: true,
      data: { logs, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs." });
  }
});

module.exports = router;