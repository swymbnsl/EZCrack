import mongoose from "mongoose"

const unitSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, "Unit number is required"],
      min: [1, "Unit must be at least 1"],
      max: [20, "Unit cannot exceed 20"],
    },
    topics: {
      type: [String],
      required: [true, "At least one topic is required"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0
        },
        message: "Topics array cannot be empty",
      },
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject ID is required"],
      index: true,
    },
    notes: [
      {
        topic: String,
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    formula_sheet: {
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
)

unitSchema.index({ subject_id: 1, number: 1 })

export default mongoose.models.Unit || mongoose.model("Unit", unitSchema)