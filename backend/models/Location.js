import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active Market', 'Inactive'], default: 'Active Market' }
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);
