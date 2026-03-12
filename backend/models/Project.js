import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  type: { type: String, enum: ['Plot', 'House', 'Building', 'Villa', 'Apartment', 'Office Space', 'Warehouse'], required: true },
  status: { type: String, enum: ['Available', 'Upcoming', 'Sold Out'], default: 'Available' },
  mapEmbedLink: { type: String },
  description: { type: String },
  coverImage: { type: String }, // Cloudinary URL
  gallery: [{ type: String }],
  brochureUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
