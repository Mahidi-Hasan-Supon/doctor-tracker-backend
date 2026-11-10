// src/app.ts

import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { doctorRoute } from "./modules/doctor/doctor.route";
import { patientRoute } from "./modules/patient/patient.route";
import { dashboardRoute } from "./modules/dashboard/dashboard.route";

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


app.use("/api/auth", authRoute);
app.use("/api/doctors", doctorRoute);
app.use("/api/patients", patientRoute);
app.use("/api/dashboard", dashboardRoute);



app.use(notFound)

app.use(globalErrorHandler)


export default app;

