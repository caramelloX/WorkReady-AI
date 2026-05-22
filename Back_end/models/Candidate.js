import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  university: String,
  location: String,
  role: String,
  score: Number,
  skills: { type: [String], default: [] }, // Was TEXT (JSON)
  scenarios: Number,
  rcaRating: Number,
  evidence: Number,
  availability: String,
  email: String,
  phone: String,
  linkedin: String,
  website: String,
  summary: String,
  education: { type: mongoose.Schema.Types.Mixed, default: {} }, // Was TEXT (JSON)
  processMap: { type: mongoose.Schema.Types.Mixed, default: [] }, // Was TEXT (JSON)
  reliabilityGuardrails: { type: mongoose.Schema.Types.Mixed, default: [] }, // Was TEXT (JSON)
  rca: { type: mongoose.Schema.Types.Mixed, default: {} }, // Was TEXT (JSON)
  memo: { type: mongoose.Schema.Types.Mixed, default: {} }, // Was TEXT (JSON)
  aiUsage: { type: mongoose.Schema.Types.Mixed, default: {} }, // Was TEXT (JSON)
  experience: { type: mongoose.Schema.Types.Mixed, default: [] }, // Was TEXT (JSON)
  mentorReviews: { type: mongoose.Schema.Types.Mixed, default: [] }, // Was TEXT (JSON)
  certifications: { type: mongoose.Schema.Types.Mixed, default: [] } // Was TEXT (JSON)
}, { timestamps: true });

export default mongoose.model('Candidate', candidateSchema);
