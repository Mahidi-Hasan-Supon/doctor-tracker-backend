import httpStatus from "http-status";
import mongoose from "mongoose";
import Patient from "./patient.model.js";
import Doctor from "../doctor/doctor.model.js";
import AppError from "../../errors/appError.js";

import type {
  CreatePatientInput,
  UpdatePatientInput,
} from "./patient.validation.js";

// Create Patient
const createPatient = async (payload: CreatePatientInput["body"]) => {
  // Check Doctor exists
  const doctor = await Doctor.findById(payload.doctorId);

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  // if (!doctor.isActive) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Cannot add patient to an inactive doctor",
  //   );
  // }

  const patient = await Patient.create(payload);

  return patient;
};

const getAllPatients = async (query: {
  search?: string;
  condition?: string;
  gender?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}) => {
  const filter: Record<string, any> = {};

  // Search by name, email and phone
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { phone: { $regex: query.search, $options: "i" } },
    ];
  }

  // Filter by patient condition
  if (query.condition) {
    filter.condition = {
      $regex: query.condition,
      $options: "i",
    };
  }

  // Filter by gender
  if (query.gender) {
    filter.gender = query.gender.toUpperCase();
  }

  // Filter by doctor
  if (query.doctorId) {
    filter.doctorId = query.doctorId;
  }

  // Date-wise filtering
  if (query.startDate || query.endDate) {
    const createdAt: Record<string, Date> = {};

    if (query.startDate) {
      const startDate = new Date(query.startDate);

      if (isNaN(startDate.getTime())) {
        throw new AppError(400, "Invalid start date");
      }

      createdAt.$gte = startDate;
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);

      if (isNaN(endDate.getTime())) {
        throw new AppError(400, "Invalid end date");
      }

      endDate.setHours(23, 59, 59, 999);
      createdAt.$lte = endDate;
    }

    filter.createdAt = createdAt;
  }

  // Pagination
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Patient.countDocuments(filter),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: patients,
  };
};

// Get Single Patient
const getSinglePatient = async (patientId: string) => {
  const patient = await Patient.findById(patientId).populate(
    "doctorId",
    "name specialization",
  );

  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient not found");
  }

  return patient;
};

// Get Patients By Doctor
const getPatientsByDoctor = async (
  doctorId: string,
  query: {
    search?: string;
    condition?: string;
    gender?: string;
    page?: string;
    limit?: string;
  },
) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const filter: Record<string, any> = { doctorId };

  // Search
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { phone: { $regex: query.search, $options: "i" } },
    ];
  }

  // Condition Filter
  if (query.condition) {
    filter.condition = {
      $regex: query.condition,
      $options: "i",
    };
  }

  // Gender Filter
  if (query.gender) {
    filter.gender = query.gender.toUpperCase();
  }

  // Pagination
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Patient.countDocuments(filter),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: patients,
  };
};

// Update Patient
const updatePatient = async (
  patientId: string,
  payload: UpdatePatientInput["body"],
) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient not found");
  }

  // Check new Doctor if doctorId is provided
  if (payload.doctorId) {
    const doctor = await Doctor.findById(payload.doctorId);

    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
    }

    // if (!doctor.isActive) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     "Cannot assign patient to an inactive doctor",
    //   );
    // }
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  ).populate("doctorId", "name specialization");

  return updatedPatient;
};

// Delete Patient
const deletePatient = async (patientId: string) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, "Patient not found");
  }

  await Patient.findByIdAndDelete(patientId);

  return null;
};

// Delete Patient From Doctor
// Remove Patient From Doctor
const deletePatientFromDoctor = async (
  doctorId: string,
  patientId: string,
) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  const patient = await Patient.findById(patientId);

  if (!patient || patient.doctorId?.toString() !== doctorId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Patient not found under this doctor",
    );
  }

  patient.doctorId = null as unknown as mongoose.Types.ObjectId;

  await patient.save();

  return patient;
};

export const PatientService = {
  createPatient,
  getAllPatients,
  getSinglePatient,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
  deletePatientFromDoctor,
};
