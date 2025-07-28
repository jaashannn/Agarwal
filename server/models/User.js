import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  verified: { type: Boolean, default: false },
  password: { type: String, required: true },
  creatorRole: { type: String, required: true, enum: ['self', 'mother', 'father', 'friend'] },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isPaymentDone: { type: Boolean, default: false },
  resetOTP: {
    type: String,
  },
  resetOTPExpiry: {
    type: Date,
  },
});

export default mongoose.model('User', userSchema);