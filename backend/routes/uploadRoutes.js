import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploaddir = path.join(__dirname, '../uploads');

const router = express.Router();

// Ensure upload dir exists
if (!fs.existsSync(uploaddir)) {
    fs.mkdirSync(uploaddir, { recursive: true });
}

// @desc    List all files in uploads
// @route   GET /api/uploads
// @access  Private/Admin
router.get('/', protect, admin, (req, res) => {
    try {
        const files = fs.readdirSync(uploaddir).map(filename => {
            const stats = fs.statSync(path.join(uploaddir, filename));
            return {
                name: filename,
                url: `/uploads/${filename}`,
                size: stats.size,
                createdAt: stats.birthtime,
                isFile: stats.isFile()
            };
        }).filter(f => f.isFile);

        res.json({ success: true, count: files.length, data: files });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not read directory' });
    }
});

// @desc    Upload new standalone files
// @route   POST /api/uploads
// @access  Private/Admin
router.post('/', protect, admin, upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const uploadedFiles = req.files.map(file => ({
        name: file.filename,
        url: `/uploads/${file.filename}`,
        size: file.size
    }));

    res.json({ success: true, data: uploadedFiles });
});

// @desc    Delete a file
// @route   DELETE /api/uploads/:filename
// @access  Private/Admin
router.delete('/:filename', protect, admin, (req, res) => {
    try {
        const filepath = path.join(uploaddir, req.params.filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.json({ success: true, message: 'File deleted' });
        } else {
            res.status(404).json({ success: false, message: 'File not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not delete file' });
    }
});

export default router;
