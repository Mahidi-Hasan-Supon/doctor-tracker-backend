
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type PatientCondition =
  | "STABLE"
  | "CRITICAL"
  | "RECOVERING";

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: "MALE" | "FEMALE";
  phone: string;
  email?: string;
  address?: string;
  condition: PatientCondition;
  doctorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },

    age: {
      type: Number,
      required: [true, "Patient age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Invalid age"],
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: [true, "Gender is required"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    condition: {
      type: String,
      enum: ["STABLE", "CRITICAL", "RECOVERING"],
      default: "STABLE",
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Search, filtering and relationship indexes
patientSchema.index({ name: 1 });
patientSchema.index({ doctorId: 1 });
patientSchema.index({ condition: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ doctorId: 1, createdAt: -1 });

const Patient: Model<IPatient> =
  mongoose.models.Patient ||
  mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;
