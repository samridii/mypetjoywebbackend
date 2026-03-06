import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  name: string;
  type: string;
  breed: string;
  age: number;
  description: string;
  image: string;
  status: "AVAILABLE" | "PENDING" | "ADOPTED";
  yearlyFoodCost?: number;
  yearlyMedicalCost?: number;
  yearlyGroomingCost?: number;
  averageLifespan?: number;
  createdAt: Date;
}

const PetSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    status: {
      type: String,
      enum: ["AVAILABLE", "PENDING", "ADOPTED"],
      default: "AVAILABLE",
    },
    yearlyFoodCost: { type: Number, default: 0 },
    yearlyMedicalCost: { type: Number, default: 0 },
    yearlyGroomingCost: { type: Number, default: 0 },
    averageLifespan: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPet>("Pet", PetSchema);