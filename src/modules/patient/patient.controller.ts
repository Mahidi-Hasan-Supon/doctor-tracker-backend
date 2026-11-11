import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { PatientService } from "./patient.service.js";

const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await PatientService.createPatient(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPatients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query as {
      search?: string;
      condition?: string;
      gender?: string;
      doctorId?: string;
      startDate?: string;
      endDate?: string;
      page?: string;
      limit?: string;
    };

    const result = await PatientService.getAllPatients(query);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patients retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getSinglePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { patientId } = req.params;

    const result = await PatientService.getSinglePatient(patientId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patient retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPatientsByDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await PatientService.getPatientsByDoctor(
      req.params.doctorId as string,
      req.query,
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor patients retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { patientId } = req.params;

    const result = await PatientService.updatePatient(patientId as string, req.body);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patient updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { patientId } = req.params;

    await PatientService.deletePatient(patientId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deletePatientFromDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { doctorId, patientId } = req.params;

    await PatientService.deletePatientFromDoctor(doctorId as string, patientId as string);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Patient removed from doctor successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const PatientController = {
  createPatient,
  getAllPatients,
  getSinglePatient,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
  deletePatientFromDoctor,
};
