import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  type: { type: String, enum: ['Plot', 'House', 'Building', 'Villa', 'Apartment', 'Office Space', 'Warehouse'], required: true },
  status: { type: String, enum: ['Available', 'Upcoming', 'Sold Out'], default: 'Available' },
  price: { type: String, default: '' }, // e.g. "₹4.5 Cr"
  mapEmbedLink: { type: String },
  description: { type: String },
  coverImage: { type: String }, // URL path e.g. /uploads/sr-property-xxx.jpg
  gallery: [{ type: String }],
  brochureUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  folderSlug: { type: String }, // slugified folder name in uploads/
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
