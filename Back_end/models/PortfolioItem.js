import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  scenarioId: String,
  title: String,
  topic: String,
  status: String,
  score: String,
  desc: String,
  logs: String,
  mentor: String,
  mentorName: String
}, { timestamps: true });

export default mongoose.model('PortfolioItem', portfolioItemSchema);
