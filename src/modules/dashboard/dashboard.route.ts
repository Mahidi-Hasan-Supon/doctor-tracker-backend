
import { Router } from "express";

import { DashboardController } from "./dashboard.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { DashboardValidation } from "./dashboard.validation.js";

const router = Router();

// Dashboard Overview
router.get(
  "/overview",
  authMiddleware,
  DashboardController.getOverview,
);

// Patients Per Doctor
router.get(
  "/patients-per-doctor",
  authMiddleware,
  DashboardController.getPatientsPerDoctor,
);

// Doctor Patient Distribution
router.get(
  "/doctor-patient-distribution",
  authMiddleware,
  DashboardController.getDoctorPatientDistribution,
);


// Patient Date-based Statistics
router.get(
  "/patient-statistics",
  authMiddleware,
  validateRequest(
    DashboardValidation.patientStatisticsValidationSchema,
  ),
  DashboardController.getPatientStatistics,
);


router.get(
  "/doctor-statistics",
  authMiddleware,
  validateRequest(
    DashboardValidation.patientStatisticsValidationSchema,
  ),
  DashboardController.getDoctorStatistics,
);




export const dashboardRoute = router;
