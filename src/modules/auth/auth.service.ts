import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";

import User from "./user.model.js";
import config from "../../config/index.js";
import { RegisterInput, LoginInput } from "./auth.validation.js";
import AppError from "../../errors/appError.js";

// Admin Registration
const registerAdmin = async (payload: RegisterInput["body"]) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Admin already exists with this email",
    );
  }

  const admin = new User({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: "ADMIN",
  });

  await admin.save();

  const adminObject = admin.toObject();
  const { password, ...adminData } = adminObject;

  return adminData;
};

// Generate Access Token
const generateAccessToken = (admin: any): string => {
  const jwtPayload = {
    userId: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  };

  return jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as SignOptions["expiresIn"],
  });
};

// Generate Refresh Token
const generateRefreshToken = (admin: any): string => {
  const jwtPayload = {
    userId: admin._id.toString(),
    role: admin.role,
  };

  return jwt.sign(jwtPayload, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in as SignOptions["expiresIn"],
  });
};

// Admin Login
const loginAdmin = async (payload: LoginInput["body"]) => {
  const admin = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (!admin.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is inactive");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    admin.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);

  // Hash refresh token before saving
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  admin.refreshToken = hashedRefreshToken;
  await admin.save();

  const adminObject = admin.toObject();
  const { password, refreshToken: storedToken, ...adminData } = adminObject;

  return {
    user: adminData,
    accessToken,
    refreshToken,
  };
};

// Admin Logout
const logoutAdmin = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  // Verify Refresh Token
  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string,
    ) as jwt.JwtPayload;
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  // Find Admin
  const admin = await User.findById(decoded.userId).select("+refreshToken");

  if (!admin || !admin.refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  // Compare stored hashed token
  const isTokenMatched = await bcrypt.compare(refreshToken, admin.refreshToken);

  if (!isTokenMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  // Remove Refresh Token from database
  admin.refreshToken = null;
  await admin.save();

  return null;
};

// Refresh Access Token
const refreshAccessToken = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is required");
  }

  let decoded: jwt.JwtPayload;

  // Verify Refresh Token
  try {
    decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret as string,
    ) as jwt.JwtPayload;
  } catch {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  // Find Admin with stored refresh token
  const admin = await User.findById(decoded.userId).select("+refreshToken");

  if (!admin || !admin.isActive || !admin.refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }

  // Compare Refresh Token
  const isTokenMatched = await bcrypt.compare(refreshToken, admin.refreshToken);

  if (!isTokenMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token does not match");
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(admin);
  const newRefreshToken = generateRefreshToken(admin);

  // Hash new Refresh Token
  admin.refreshToken = await bcrypt.hash(newRefreshToken, 10);

  await admin.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Get Logged In Admin
const getMe = async (userId: string) => {
  const admin = await User.findById(userId);

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  }

  if (!admin.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "Your account is inactive");
  }

  return admin;
};

export const AuthService = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getMe
};
