const express = require('express');
const { streamVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stream video — MUST be authenticated (JWT + sessionToken check)
router.get('/stream/:courseId/:videoId', protect, streamVideo);

module.exports = router;
