
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import httpStatus from "http-status";

import AppError from "../errors/appError.js";

const validateRequest = <T extends z.ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return next(
        new AppError(httpStatus.BAD_REQUEST, errorMessages)
      );
    }

    req.body = (validationResult.data as { body: unknown }).body;

    next();
  };
};

export default validateRequest;
