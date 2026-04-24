const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");

// Dashboard Stats Route
router.get("/stats", isLoggedIn, isAdmin, adminController.getStats);

module.exports = router;
