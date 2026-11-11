
import { z } from "zod";

const createDoctorValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),

    specialization: z
      .string()
      .min(2, "Specialization is required")
      .trim(),

    hospital: z
      .string()
      .min(2, "Hospital name is required")
      .trim(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number cannot exceed 15 characters")
      .trim(),

    email: z
      .string()
      .email("Please provide a valid email")
      .trim()
      .toLowerCase(),
  }),
});

const updateDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50).trim().optional(),

    specialization: z.string().min(2).trim().optional(),

    hospital: z.string().min(2).trim().optional(),

    phone: z.string().min(10).max(15).trim().optional(),

    email: z
      .string()
      .email("Please provide a valid email")
      .trim()
      .toLowerCase()
      .optional(),
  }),
});

export const DoctorValidation = {
  createDoctorValidationSchema,
  updateDoctorValidationSchema,
};

export type CreateDoctorInput = z.infer<
  typeof createDoctorValidationSchema
>;

export type UpdateDoctorInput = z.infer<
  typeof updateDoctorValidationSchema
>;
