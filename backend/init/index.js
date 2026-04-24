const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("server connected to db");

  await initDB(); // ✅ Call the function to insert data
}

const initDB = async () => {
  try {
    await Listing.deleteMany({}); // ✅ fixed typo: deletMany -> deleteMany
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Error initializing DB:", error);
  }
};

main().catch((err) => {
  console.error("Connection error:", err);
});
