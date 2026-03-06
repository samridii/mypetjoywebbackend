import mongoose, { Schema, Document } from "mongoose";

export interface IAdoption extends Document {
  user: mongoose.Types.ObjectId;
  pet: mongoose.Types.ObjectId;

  fullName: string;
  email: string;
  phone: string;
  address: string;
  livingType: string;
  hasOtherPets: boolean;
  experience: string;
  reason: string;

  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

const AdoptionSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },

    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    livingType: { type: String, required: true },
    hasOtherPets: { type: Boolean, required: true },
    experience: { type: String, required: true },
    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAdoption>("Adoption", AdoptionSchema);