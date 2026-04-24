const Listing = require("../models/listing");
const User = require("../models/user");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

module.exports.getStats = wrapAsync(async (req, res) => {
    const listingCount = await Listing.countDocuments();
    const userCount = await User.countDocuments();
    const reviewCount = await Review.countDocuments();

    res.status(200).json({
        stats: {
            listings: listingCount,
            users: userCount,
            reviews: reviewCount
        }
    });
});
