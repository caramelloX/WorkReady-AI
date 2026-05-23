import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: String,
  fullname: String,
  email: String,
  target_track: String,
  target_industry: String,
  occupation_goal: String,
  major: String,
  education_level: String,
  career_goal: String,
  strengths: [String],
  develop_areas: [String],
  profile_completed: { type: Boolean, default: false },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
