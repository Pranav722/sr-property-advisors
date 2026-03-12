import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists on the disk
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Format: sr-property-123456789.jpg
    cb(null, 'sr-property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create the multer instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max file size just in case they have large PDFs
});
