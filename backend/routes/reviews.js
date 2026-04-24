const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviews.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

// CREATE ROUTE
router.post("/", isLoggedIn, validateReview, reviewController.createReview);

// DELETE ROUTE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);

module.exports = router;
