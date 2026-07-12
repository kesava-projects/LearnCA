const express = require('express');
const { getAllCourses, getCourseById } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All course routes require authentication
router.get('/',    protect, getAllCourses);
router.get('/:id', protect, getCourseById);

module.exports = router;
