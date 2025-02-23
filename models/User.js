import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  username: { type: String },
  platforms: {
    leetcode: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    // geeksforgeeks: { type: String },
    // hackerrank: { type: String }, 
    // github :{type : String}
  },
  
  providers: [String],
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);