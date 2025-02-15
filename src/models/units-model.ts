import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  topics: [
    {
      type: String,
      required: true,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);

export default Unit;
