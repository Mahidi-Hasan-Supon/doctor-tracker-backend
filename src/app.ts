// src/app.ts

import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import config from "./config";

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      config.client_url
    ],
    credentials: true,
  })
);

// Security and body parsers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Doctor Tracker API",
  });
});

export default app;

