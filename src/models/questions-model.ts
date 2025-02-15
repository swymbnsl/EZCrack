import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ["midsem", "endsem"],
  },
  marks: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
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
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;
