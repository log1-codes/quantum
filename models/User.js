import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // No password for Google users
  name: { type: String, required: true },
  image: { type: String },
  platforms: {
    leetcode: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    geeksforgeeks: { type: String },
    hackerrank: { type: String }
  },
  lastLogin: { type: Date, default: null }, // Set default to null, can be updated later
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving (only for users with a password)
UserSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
