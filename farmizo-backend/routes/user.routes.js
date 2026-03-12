const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/user.controller");

const {  protect } = require("../middlewares/auth.middleware");

// ==========================
// User Routes
// ==========================

// GET /api/users/profile
router.get("/profile", protect, getProfile);

// PUT /api/users/profile
router.put("/profile", protect, updateProfile);

module.exports = router;
