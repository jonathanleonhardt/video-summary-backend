import mongoose from 'mongoose';

const userHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoURL: { type: String, required: true },
  hint: { type: String, required: true },
  question: { type: String, required: true },
  aiSummary: { type: String, required: true },
  feedback: { type: Boolean, required: true },
  feedbackDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserHistory = mongoose.models.UserHistory || mongoose.model('UserHistory', userHistorySchema);

export default UserHistory;
