import type { Request, Response } from "express";
import mongoose from "mongoose";
import connectDB from "../config/database";
import app from "../app";


let connectionPromise: Promise<void> | null = null;

export default async function handler(req: Request, res: Response) {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (mongoose.connection.readyState === 0) {
        connectionPromise = null;
      }

      connectionPromise ??= connectDB().catch((error) => {
        connectionPromise = null;
        throw error;
      });

      await connectionPromise;
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
