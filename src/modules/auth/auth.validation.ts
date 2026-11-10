import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .trim(),

    email: z
      .string()
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password cannot exceed 64 characters"),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),

    password: z.string().min(1, "Password is required"),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};

export type RegisterInput = z.infer<
  typeof AuthValidation.registerValidationSchema
>;

export type LoginInput = z.infer<typeof AuthValidation.loginValidationSchema>;
