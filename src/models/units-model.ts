import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
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
