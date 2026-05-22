import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student: String,
  type: String,
  artifact: String,
  date: String,
  status: String,
  feedback: String
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
