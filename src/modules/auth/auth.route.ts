import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";
import validateRequest from "../../middlewares/validateRequest.js";

const router = Router();

// Admin Registration
router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerAdmin,
);

// Admin Login
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginAdmin,
);

// Refresh Access Token
router.post("/refresh-token", AuthController.refreshAccessToken);

// Admin Logout
router.post("/logout", AuthController.logoutAdmin);

export const authRoute = router;
