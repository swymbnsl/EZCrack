import mongoose from "mongoose";
import Subject from "./subjects-model";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subject_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
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

const Branch = mongoose.models.Branch || mongoose.model("Branch", branchSchema);

export default Branch;
