const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, userSchema, reviewSchema } = require("./schema.js");
const jwt = require("jsonwebtoken");
const ExpressError = require("./utils/ExpressError");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    if (req.user.role !== "admin" && (!listing.owner || !listing.owner.equals(req.user._id))) {
        return res.status(403).json({ error: "Forbidden: You are not the owner!" });
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (req.user.role !== "admin" && (!review.author || !review.author.equals(req.user._id))) {
        return res.status(403).json({ error: "Forbidden: You didn't create this review" });
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Token is not valid!" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ error: "You are not authenticated!" });
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ error: "Forbidden: Admins only!" });
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};