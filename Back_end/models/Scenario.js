import mongoose from 'mongoose';

const scenarioSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  desc: String,
  difficulty: String,
  category: String,
  tags: [String],
  estimatedTime: String,
  briefing: String,
  objectives: [String],
  evaluationCriteria: [String],
  quiz: { type: mongoose.Schema.Types.Mixed, default: [] },
  initialLogs: { type: mongoose.Schema.Types.Mixed, default: [] },
  initialChat: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

export default mongoose.model('Scenario', scenarioSchema);
