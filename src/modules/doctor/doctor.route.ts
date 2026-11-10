import { Router } from "express";

import { DoctorController } from "./doctor.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { DoctorValidation } from "./doctor.validation.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = Router();

// Create Doctor
router.post(
  "/",
  authMiddleware,
  validateRequest(DoctorValidation.createDoctorValidationSchema),
  DoctorController.createDoctor,
);

// Get All Doctors (Search, Filter, Pagination)
router.get("/", authMiddleware, DoctorController.getAllDoctors);

// Get Single Doctor
router.get("/:doctorId", authMiddleware, DoctorController.getSingleDoctor);

// Update Doctor
router.patch(
  "/:doctorId",
  authMiddleware,
  validateRequest(DoctorValidation.updateDoctorValidationSchema),
  DoctorController.updateDoctor,
);

// Delete Doctor
router.delete("/:doctorId", authMiddleware, DoctorController.deleteDoctor);

export const doctorRoute = router;
