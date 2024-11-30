import mongoose from 'mongoose';

const userPushTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  expoToken: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const UserPushToken = mongoose.models.UserPushToken || mongoose.model('UserPushToken', userPushTokenSchema);

export default UserPushToken;
