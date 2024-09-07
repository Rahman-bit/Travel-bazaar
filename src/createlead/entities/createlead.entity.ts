
import mongoose from "mongoose";

export const LeadSchema = new mongoose.Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerFirstName: { type: String, required: true },
    customerLastName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
  },{ timestamps: true });
