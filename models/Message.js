import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  senderImage: { type: String },
  recipientEmail: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reactions: [{ type: String }],
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);