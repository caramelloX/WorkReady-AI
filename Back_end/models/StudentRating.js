import mongoose from 'mongoose';

const studentRatingSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  processMap: String,
  safetyRisk: String,
  rca: String,
  traceability: String,
  memo: String,
  responsibleAi: String
}, { timestamps: true });

export default mongoose.model('StudentRating', studentRatingSchema);
