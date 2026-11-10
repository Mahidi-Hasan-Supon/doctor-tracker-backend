
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { DashboardService } from "./dashboard.service.js";

// Dashboard Overview
const getOverview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DashboardService.getOverview();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Dashboard overview retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Patients Per Doctor
const getPatientsPerDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DashboardService.getPatientsPerDoctor();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patients per doctor retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Doctor Patient Distribution
const getDoctorPatientDistribution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DashboardService.getDoctorPatientDistribution();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor patient distribution retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getPatientStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query as {
      startDate?: string;
      endDate?: string;
      period?: "daily" | "monthly" | "yearly";
    };

    const result = await DashboardService.getPatientStatistics(query);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patient statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getDoctorStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query as {
      startDate?: string;
      endDate?: string;
      period?: "daily" | "monthly" | "yearly";
    };

    const result = await DashboardService.getDoctorStatistics(query);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



export const DashboardController = {
  getOverview,
  getPatientsPerDoctor,
  getDoctorPatientDistribution,
  getPatientStatistics,
  getDoctorStatistics
};
