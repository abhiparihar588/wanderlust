const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const constructListing = (req, res, next) => {
  if (req.body.title && !req.body.listing) {
    req.body.listing = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      country: req.body.country,
      price: Number(req.body.price),
    };
  }
  next();
};

// INDEX ROUTE
router.get("/", listingController.index);

// SHOW ROUTE
router.get("/:id", listingController.showListing);

// CREATE ROUTE
router.post("/", isLoggedIn, upload.single("image"), constructListing, validateListing, listingController.createListing);

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), constructListing, validateListing, listingController.updateListing);

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;
