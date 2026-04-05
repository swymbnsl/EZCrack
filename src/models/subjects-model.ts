import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    unit_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
      },
    ],
    subject_code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, "Credits is required"],
      min: [0, "Credits cannot be negative"],
      max: [10, "Credits cannot exceed 10"],
    },
  },
  {
    timestamps: true,
  }
)

const Subject =
  mongoose.models.Subject || mongoose.model("Subject", subjectSchema)

export default Subject