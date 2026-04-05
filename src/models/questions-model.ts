import mongoose from "mongoose"

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      minlength: [3, "Question must be at least 3 characters"],
    },
    answer: {
      type: String,
      default: null,
    },
    year: {
      type: Number,
      min: [2000, "Year must be after 2000"],
      max: [2100, "Year must be before 2100"],
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
    midsem: {
      type: Boolean,
      required: [true, "midsem boolean is required"],
    },
    marks: {
      type: Number,
      required: [true, "Marks is required"],
      min: [0, "Marks cannot be negative"],
      max: [100, "Marks cannot exceed 100"],
    },
    unit: {
      type: Number,
      required: [true, "Unit number is required"],
      min: [1, "Unit must be at least 1"],
      max: [10, "Unit cannot exceed 10"],
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject ID is required"],
      index: true,
    },
    image_urls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

questionSchema.index({ subject_id: 1, unit: 1 })
questionSchema.index({ year: 1 })
questionSchema.index({ midsem: 1 })
questionSchema.index({ subject_id: 1, year: 1 })

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema)

export default Question