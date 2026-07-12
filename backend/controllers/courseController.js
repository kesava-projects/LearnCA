const Course = require('../models/Course');

// ── GET /api/courses ──────────────────────────────────────────────────────────
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('-videos.filePath') // Never expose file paths
      .sort({ createdAt: -1 });

    return res.status(200).json({ courses });
  } catch (error) {
    console.error('GetAllCourses error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── GET /api/courses/:id ──────────────────────────────────────────────────────
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('-videos.filePath'); // Never expose file paths

    if (!course || !course.isPublished) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error('GetCourseById error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllCourses, getCourseById };
