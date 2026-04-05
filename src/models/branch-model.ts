import mongoose from "mongoose"
import Subject from "./subjects-model"

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
      unique: true,
    },
    subject_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Subject,
      },
    ],
  },
  {
    timestamps: true,
  }
)

branchSchema.index({ name: 1 })

const Branch =
  mongoose.models.Branch || mongoose.model("Branch", branchSchema)

export default Branch