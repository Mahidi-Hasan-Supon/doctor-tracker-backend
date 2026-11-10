import { Router } from "express";

import { PatientController } from "./patient.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PatientValidation } from "./patient.validation.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

// Create Patient
router.post(
  "/",
  authMiddleware,
  validateRequest(PatientValidation.createPatientValidationSchema),
  PatientController.createPatient,
);

// Get All Patients (Search, Filter, Pagination)
router.get("/", authMiddleware, PatientController.getAllPatients);

// Get Patients By Doctor
router.get(
  "/doctor/:doctorId",
  authMiddleware,
  PatientController.getPatientsByDoctor,
);

// Get Single Patient
router.get("/:patientId", authMiddleware, PatientController.getSinglePatient);

// Update Patient
router.patch(
  "/:patientId",
  authMiddleware,
  validateRequest(PatientValidation.updatePatientValidationSchema),
  PatientController.updatePatient,
);

// Delete Patient
router.delete("/:patientId", authMiddleware, PatientController.deletePatient);

// Remove Patient From Doctor
router.delete(
  "/doctor/:doctorId/patient/:patientId",
  authMiddleware,
  PatientController.deletePatientFromDoctor,
);

export const patientRoute = router;
