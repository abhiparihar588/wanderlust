const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.status(201).json({ message: "New Review Created!", review: newReview });
});

module.exports.destroyReview = wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review Deleted!" });
});
