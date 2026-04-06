const express = require('express');
const router = express.Router();

const asyncHandler = require('../../utils/asyncHandler');
const { protect, restrictTo } = require('../../middleware/auth.middleware');
const adminController = require('./admin.controller');

// All admin routes require authentication + admin role
router.use(protect, restrictTo('admin'));

// Dashboard
router.get('/stats', asyncHandler(adminController.getDashboardStats));

// Users
router.get('/users', asyncHandler(adminController.getAllUsers));
router.patch('/users/:userId/toggle-active', asyncHandler(adminController.toggleUserActive));

// Tutor review queue
router.get('/tutors/pending', asyncHandler(adminController.getPendingTutors));
router.get('/tutors', asyncHandler(adminController.getAllTutors));
router.patch('/tutors/:tutorId/approve', asyncHandler(adminController.approveTutor));
router.patch('/tutors/:tutorId/reject', asyncHandler(adminController.rejectTutor));

// Course review queue
router.get('/courses/under-review', asyncHandler(adminController.getCoursesUnderReview));
router.patch('/courses/:courseId/publish', asyncHandler(adminController.publishCourse));
router.patch('/courses/:courseId/reject', asyncHandler(adminController.rejectCourse));
router.patch('/courses/:courseId/unpublish', asyncHandler(adminController.unpublishCourse));

module.exports = router;
