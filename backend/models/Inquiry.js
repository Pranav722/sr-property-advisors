import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  interestedProperty: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [{ text: String, date: { type: Date, default: Date.now } }]
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
