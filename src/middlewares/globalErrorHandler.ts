
import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong";

  // Mongoose Cast Error
  if (error.name === "CastError") {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid ID";
  }

  // MongoDB Duplicate Key Error
  if (error.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    message = "Duplicate value already exists";
  }

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    statusCode = httpStatus.BAD_REQUEST;
    message = error.message;
  }

  // JWT Error
  if (error.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid token";
  }

  // JWT Expired Error
  if (error.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Token has expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default globalErrorHandler;
