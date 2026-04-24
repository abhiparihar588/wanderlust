const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// INDEX ROUTE
module.exports.index = wrapAsync(async (req, res) => {
  const allList = await Listing.find({});
  res.status(200).json({ listings: allList });
});

// SHOW ROUTE
module.exports.showListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  res.status(200).json({ listing });
});

// CREATE ROUTE
module.exports.createListing = wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }
  newListing.owner = req.user._id;

  await newListing.save();

  res.status(201).json({ message: "New Listing Created!", listing: newListing });
});

// UPDATE ROUTE
module.exports.updateListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingUpdate = { ...req.body.listing };
  if (req.file) {
    listingUpdate.image = { url: req.file.path, filename: req.file.filename };
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, listingUpdate, { new: true });

  if (!updatedListing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.status(200).json({ message: "Listing Updated!", listing: updatedListing });
});

// DELETE ROUTE
module.exports.destroyListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    throw new ExpressError(404, "Listing not found");
  }

  res.status(200).json({ message: "Listing Deleted!", deletedListing });
});
