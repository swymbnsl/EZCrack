import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  unit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
  },
});

const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;
