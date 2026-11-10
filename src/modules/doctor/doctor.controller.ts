import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { DoctorService } from "./doctor.service.js";

// Create Doctor
const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DoctorService.createDoctor(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Doctors
const getAllDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DoctorService.getAllDoctors(
      req.query as unknown as {
        search?: string;
        specialization?: string;
        isActive?: string;
        startDate?: string;
        endDate?: string;
        page?: string;
        limit?: string;
      },
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctors retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Doctor
const getSingleDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DoctorService.getSingleDoctor(
      req.params.doctorId as string,
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Update Doctor
const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DoctorService.updateDoctor(
      req.params.doctorId as string,
      req.body,
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Doctor
const deleteDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await DoctorService.deleteDoctor(req.params.doctorId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const DoctorController = {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
};
