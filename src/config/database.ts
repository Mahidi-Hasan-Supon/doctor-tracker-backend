import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async (): Promise<void> => {
  try {
    if (!config.database_url) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(config.database_url);

    console.log("MongoDB connected successfully");
    console.log("Database Name:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;
   