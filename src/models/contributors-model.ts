import mongoose from "mongoose";
import Subject from "@/models/subjects-model";

const contributorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  avatar: {
    type: String,
    required: true,
    default: "https://api.dicebear.com/9.x/avataaars/svg", // Default avatar URL
  },
  linkedinUrl: {
    type: String,
  },
  subject_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Subject
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
contributorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
contributorSchema.index({ branch: 1, semester: 1 });
contributorSchema.index({ subject_ids: 1 });

export const Contributor = mongoose.models.Contributor || mongoose.model('Contributor', contributorSchema); 