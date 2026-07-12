const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');

// ── GET /api/videos/stream/:courseId/:videoId ─────────────────────────────────
// Streams video with byte-range support (required for HTML5 <video> seeking)
// Protected by authMiddleware — only authenticated users can stream
const streamVideo = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    // Fetch course and find the specific video
    const course = await Course.findById(courseId).select('+videos.filePath');
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const video = course.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found.' });
    }

    // Resolve absolute path and validate it stays inside uploads/
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    const videoPath = path.resolve(uploadsDir, video.filePath);

    // Path traversal protection
    if (!videoPath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: 'Video file not found on server.' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse Range header — supports seeking in video player
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      if (start >= fileSize || end >= fileSize) {
        return res.status(416).json({ message: 'Range not satisfiable.' });
      }

      const fileStream = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-store', // Don't cache — prevent sharing
      });

      fileStream.pipe(res);
    } else {
      // No range — stream full file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Stream video error:', error);
    return res.status(500).json({ message: 'Server error while streaming video.' });
  }
};

module.exports = { streamVideo };
