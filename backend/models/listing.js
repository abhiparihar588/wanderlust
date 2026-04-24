const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://unsplash.com/photos/a-scenic-view-of-a-city-from-above-U-L34qzYBHI"
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   index: true
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;