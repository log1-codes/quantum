import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  name: { type: String, required: true },
  image: { type: String },
  platforms: {
    leetcode: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    geeksforgeeks: { type: String },
    hackerrank: { type: String }
  },
  lastLogin: { type: Date, default: null }, 
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
export default mongoose.models.User || mongoose.model('User', UserSchema);