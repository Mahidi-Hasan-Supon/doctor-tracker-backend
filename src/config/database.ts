
import mongoose from "mongoose";
import config from "./index.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {
  if (!config.database_url) {
    throw new Error("DATABASE_URL is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(config.database_url)
      .catch((error) => {
        connectionPromise = null;
        console.error("MongoDB connection failed:", error);
        throw error;
      });
  }

  await connectionPromise;

  console.log("MongoDB connected successfully");
};

export default connectDB;
