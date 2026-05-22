import mongoose from 'mongoose';

const mentorHighlightSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  highlight_comment: String
}, { timestamps: true });

export default mongoose.model('MentorHighlight', mentorHighlightSchema);
