
import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((value) => !isNaN(new Date(value).getTime()), {
    message: "Invalid date",
  });

const patientStatisticsValidationSchema = z.object({
  query: z
    .object({
      startDate: dateSchema.optional(),
      endDate: dateSchema.optional(),

      period: z
        .enum(["daily", "monthly", "yearly"])
        .default("daily"),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) <= new Date(data.endDate);
        }

        return true;
      },
      {
        message: "Start date cannot be greater than end date",
        path: ["endDate"],
      },
    ),
});

export const DashboardValidation = {
  patientStatisticsValidationSchema,
};
