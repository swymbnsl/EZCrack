import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  topics: {
    type: [String],
    required: true,
    default: [],
  },
  midsem: {
    type: Boolean,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
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

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
