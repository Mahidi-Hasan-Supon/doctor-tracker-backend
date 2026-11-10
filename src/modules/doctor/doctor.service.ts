import httpStatus from "http-status";

import Doctor from "./doctor.model.js";
import AppError from "../../errors/appError.js";
import type {
  CreateDoctorInput,
  UpdateDoctorInput,
} from "./doctor.validation.js";
import mongoose from "mongoose";
import type { IDoctor } from "./doctor.model.js";

// Create Doctor
const createDoctor = async (payload: CreateDoctorInput["body"]) => {
  const existingDoctor = await Doctor.findOne({
    email: payload.email,
  });

  if (existingDoctor) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Doctor already exists with this email",
    );
  }

  const doctor = await Doctor.create(payload);

  return doctor;
};

const getAllDoctors = async (query: {
  search?: string;
  specialization?: string;
  isActive?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}) => {
  const {
    search,
    specialization,
    isActive,
    startDate,
    endDate,
    page = "1",
    limit = "10",
  } = query;

  //   const filter: mongoose.FilterQuery<IDoctor> = {};
  const filter: Record<string, any> = {};

  // Search by name, email, phone and specialization
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by specialization
  if (specialization) {
    filter.specialization = {
      $regex: specialization,
      $options: "i",
    };
  }

  // Filter by active status
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  // Date-wise filter
  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  // Pagination
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (pageNumber - 1) * limitNumber;

  // Database queries
  const [doctors, total] = await Promise.all([
    Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),

    Doctor.countDocuments(filter),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data: doctors,
  };
};

// Get Single Doctor
const getSingleDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  return doctor;
};

// Update Doctor
const updateDoctor = async (
  doctorId: string,
  payload: UpdateDoctorInput["body"],
) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  if (payload.email) {
    const existingDoctor = await Doctor.findOne({
      email: payload.email,
      _id: { $ne: doctorId },
    });

    if (existingDoctor) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Email already belongs to another doctor",
      );
    }
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedDoctor;
};

// Delete Doctor
const deleteDoctor = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor not found");
  }

  await Doctor.findByIdAndDelete(doctorId);

  return null;
};

export const DoctorService = {
  createDoctor,
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
};
