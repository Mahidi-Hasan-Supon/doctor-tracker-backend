
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import config from "../config/index.js";
import User from "../modules/auth/user.model.js";
import AppError from "../errors/appError.js";

export interface RequestUser {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not logged in"
      );
    }

    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    ) as jwt.JwtPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Please login again"
      );
    }

    if (!user.isActive) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account is inactive"
      );
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
