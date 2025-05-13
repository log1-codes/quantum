import mongoose from 'mongoose';
import { string } from 'zod';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  username: { type: String },
  platforms: {
    leetcode: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    geeksforgeeks: { type: String }
  },
  socials:{
    linkedin :{type : String}, 
    twitter :{type :String}, 
    github  :{ type : String}
  },
  providers: [String],
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);