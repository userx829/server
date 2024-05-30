const mongoose = require("mongoose");
const mongoURI = "mongodb+srv://shubham1038921:Shubham%40299792.458@cluster0.sifmv4f.mongodb.net/userInfo"; // Add your database name here

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = connectToMongo;
