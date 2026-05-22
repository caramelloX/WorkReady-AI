import mongoose from 'mongoose';

const scenarioSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  desc: String,
  difficulty: String,
  initialLogs: { type: mongoose.Schema.Types.Mixed, default: [] }, // Was TEXT (JSON)
  initialChat: { type: mongoose.Schema.Types.Mixed, default: [] } // Was TEXT (JSON)
}, { timestamps: true });

export default mongoose.model('Scenario', scenarioSchema);
