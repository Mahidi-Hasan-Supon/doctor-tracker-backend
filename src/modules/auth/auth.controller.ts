import { Request, Response } from "express";
import httpStatus from "http-status";

import { AuthService } from "./auth.service.js";

// Admin Registration
const registerAdmin = async (req: Request, res: Response) => {
  const result = await AuthService.registerAdmin(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Admin registered successfully",
    data: result,
  });
};

// Admin Login
const loginAdmin = async (req: Request, res: Response) => {
  const result = await AuthService.loginAdmin(req.body);

  const isProduction = process.env.NODE_ENV === "production";

  // Access Token Cookie
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  // Refresh Token Cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Admin logged in successfully",
    data: {
      user: result.user,
    },
  });
};


// Refresh Access Token
const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  const result = await AuthService.refreshAccessToken(refreshToken);

  const isProduction = process.env.NODE_ENV === "production";

  // Set New Access Token
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  // Set New Refresh Token
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Tokens refreshed successfully",
  });
};

// Admin Logout
const logoutAdmin = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  await AuthService.logoutAdmin(refreshToken);

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" as const : "lax" as const,
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Admin logged out successfully",
  });
};


// Get Logged In Admin
const getMe = async (req: Request, res: Response) => {
  const user = req.user;

  const result = await AuthService.getMe(user?.userId as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Admin profile retrieved successfully",
    data: {
      name: result.name,
      email: result.email,
      role: result.role,
      isActive: result.isActive,
    },
  });
};


export const AuthController = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getMe
};
