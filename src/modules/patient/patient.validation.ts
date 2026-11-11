import { z } from "zod";

// Create Patient Validation
const createPatientValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),

    email: z
      .string()
      .email("Please provide a valid email")
      .trim()
      .toLowerCase(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .max(15, "Phone number cannot exceed 15 characters")
      .trim(),

    age: z
      .number()
      .min(0, "Age cannot be negative")
      .max(120, "Please provide a valid age"),

    gender: z.enum(["MALE", "FEMALE"], {
      message: "Gender must be MALE or FEMALE",
    }),

    address: z.string().min(5, "Address must be at least 5 characters").trim(),
    condition: z
      .string()
      .min(2, "Patient condition must be at least 2 characters")
      .trim(),

    medicalHistory: z.string().trim().optional(),

    doctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID"),
  }),
});

// Update Patient Validation
const updatePatientValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50).trim().optional(),

    email: z
      .string()
      .email("Please provide a valid email")
      .trim()
      .toLowerCase()
      .optional(),

    phone: z.string().min(10).max(15).trim().optional(),

    age: z.number().min(0).max(120).optional(),

    gender: z.enum(["MALE", "FEMALE"]).optional(),

    address: z.string().min(5).trim().optional(),

    condition: z
      .string()
      .min(2, "Patient condition must be at least 2 characters")
      .trim()
      .optional(),

    medicalHistory: z.string().trim().optional(),

    doctorId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID")
      .optional(),
  }),
});

const getPatientsByDoctorValidationSchema = z.object({
  params: z.object({
    doctorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid doctor ID"),
  }),
  query: z.object({
    search: z.string().optional(),
    condition: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "male", "female"]).optional(),
    page: z.string().regex(/^[1-9]\d*$/).optional(),
    limit: z.string().regex(/^[1-9]\d*$/).optional(),
  }),
});

export const PatientValidation = {
  createPatientValidationSchema,
  updatePatientValidationSchema,
  getPatientsByDoctorValidationSchema
};

export type CreatePatientInput = z.infer<typeof createPatientValidationSchema>;

export type UpdatePatientInput = z.infer<typeof updatePatientValidationSchema>;
