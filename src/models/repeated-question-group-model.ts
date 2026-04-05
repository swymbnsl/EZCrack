import mongoose from "mongoose"

const repeatedQuestionGroupSchema = new mongoose.Schema(
  {
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: [true, "Unit ID is required"],
      index: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["concept", "pattern"],
    },
    name: {
      type: String,
      required: [true, "Name (concept/pattern) is required"],
      trim: true,
    },
    frequency: {
      type: Number,
      required: [true, "Frequency is required"],
      min: [1, "Frequency must be at least 1"],
    },
    question_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  }
)

repeatedQuestionGroupSchema.index({ subject_id: 1, unit_id: 1 })
repeatedQuestionGroupSchema.index({ subject_id: 1, type: 1 })

const RepeatedQuestionGroup =
  mongoose.models.RepeatedQuestionGroup ||
  mongoose.model("RepeatedQuestionGroup", repeatedQuestionGroupSchema)

export default RepeatedQuestionGroup