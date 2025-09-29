import mongoose from "mongoose";
import config from "./environment_variables.js";

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

export default connectDB;
