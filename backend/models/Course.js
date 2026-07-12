const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    fileName: {
      type: String,
      required: [true, 'Video file name is required'],
    },
    filePath: {
      type: String,
      required: [true, 'Video file path is required'],
    },
    duration: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isDemo: {
      type: Boolean,
      default: false, // Demo videos can be watched without login
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      default: 'Faculty',
    },
    videos: [videoSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
