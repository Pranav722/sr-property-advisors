import mongoose from 'mongoose';

const plotSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  plotNumber: { type: String, required: true },
  sizeSqFt: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Hold', 'Sold'], default: 'Available' },
  buyerName: { type: String, default: '' },
  buyerContact: { type: String, default: '' },
  documents: [{
    title: String,
    url: String
  }]
}, { timestamps: true });

export default mongoose.model('Plot', plotSchema);
