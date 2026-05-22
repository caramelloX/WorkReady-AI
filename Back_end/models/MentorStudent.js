import mongoose from 'mongoose';

const mentorStudentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  readiness: Number,
  scenarios: { type: mongoose.Schema.Types.Mixed, default: {} }, // Was TEXT (JSON)
  risk: String,
  lastActive: String,
  targetIndustry: String,
  level: String,
  evidence: { type: mongoose.Schema.Types.Mixed, default: [] } // Was TEXT (JSON)
}, { timestamps: true });

export default mongoose.model('MentorStudent', mentorStudentSchema);
