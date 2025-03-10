import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    topics: {
      type: [String],
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    repeatedQuestions: {
      conceptBased: [
        {
          frequency: Number,
          concept: String,
          questions: [
            {
              question: String,
              year: String,
              examType: String,
            },
          ],
        },
      ],
      patternBased: [
        {
          frequency: Number,
          pattern: String,
          questions: [
            {
              question: String,
              year: String,
              examType: String,
            },
          ],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
