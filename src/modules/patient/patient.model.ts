import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatient extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "MALE" | "FEMALE";
  address: string;
  condition: string;
  medicalHistory?: string;
  doctorId: mongoose.Types.ObjectId;
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

    email: {
      type: String,
      required: [true, "Patient email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Patient phone number is required"],
      trim: true,
    },

    age: {
      type: Number,
      required: [true, "Patient age is required"],
      min: [0, "Age cannot be negative"],
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: [true, "Gender is required"],
    },

    address: {
      type: String,
      required: [true, "Patient address is required"],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, "Patient condition is required"],
      trim: true,
      index: true,
    },

    medicalHistory: {
      type: String,
      trim: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ name: 1 });
patientSchema.index({ email: 1 });
patientSchema.index({ createdAt: -1 });

const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;
