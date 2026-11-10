import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(databaseUrl);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;