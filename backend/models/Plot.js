import mongoose from 'mongoose';

const plotSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  plotNumber: { type: String, required: true },
  sizeSqFt: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Hold', 'Sold'], default: 'Available' },
  documents: [{
    title: String,
    url: String // Cloudinary URL
  }]
}, { timestamps: true });

export default mongoose.model('Plot', plotSchema);
