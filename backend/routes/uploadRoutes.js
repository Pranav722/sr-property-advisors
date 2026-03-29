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

// Ensure root upload dir exists
if (!fs.existsSync(uploaddir)) {
    fs.mkdirSync(uploaddir, { recursive: true });
}

// ─── LIST FILES ───────────────────────────────────────────────────────────────
// @route   GET /api/uploads?folder=slug
// @access  Private/Admin
router.get('/', protect, admin, (req, res) => {
    try {
        const folder = req.query.folder ? req.query.folder : '';
        const targetDir = folder ? path.join(uploaddir, folder) : uploaddir;

        if (!fs.existsSync(targetDir)) {
            return res.json({ success: true, count: 0, data: [] });
        }

        const files = fs.readdirSync(targetDir).map(filename => {
            const fullPath = path.join(targetDir, filename);
            const stats = fs.statSync(fullPath);
            if (!stats.isFile()) return null;
            const urlPath = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;
            return {
                name: filename,
                url: urlPath,
                folder: folder || '',
                size: stats.size,
                createdAt: stats.birthtime,
                isFile: true
            };
        }).filter(Boolean);

        res.json({ success: true, count: files.length, data: files });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not read directory' });
    }
});

// ─── LIST FOLDERS ─────────────────────────────────────────────────────────────
// @route   GET /api/uploads/folders
// @access  Private/Admin
router.get('/folders', protect, admin, (req, res) => {
    try {
        const entries = fs.readdirSync(uploaddir).map(name => {
            const fullPath = path.join(uploaddir, name);
            const stats = fs.statSync(fullPath);
            return stats.isDirectory() ? { name, slug: name } : null;
        }).filter(Boolean);

        res.json({ success: true, data: entries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not list folders' });
    }
});

// ─── CREATE FOLDER ────────────────────────────────────────────────────────────
// @route   POST /api/uploads/folders
// @access  Private/Admin
router.post('/folders', protect, admin, (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Folder name required' });
        }
        const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const folderPath = path.join(uploaddir, slug);

        if (fs.existsSync(folderPath)) {
            return res.status(400).json({ success: false, message: 'Folder already exists' });
        }

        fs.mkdirSync(folderPath, { recursive: true });
        res.status(201).json({ success: true, data: { name, slug } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not create folder' });
    }
});

// ─── DELETE FOLDER ────────────────────────────────────────────────────────────
// @route   DELETE /api/uploads/folders/:slug
// @access  Private/Admin
router.delete('/folders/:slug', protect, admin, (req, res) => {
    try {
        const folderPath = path.join(uploaddir, req.params.slug);
        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({ success: false, message: 'Folder not found' });
        }
        // Remove folder and all its contents
        fs.rmSync(folderPath, { recursive: true, force: true });
        res.json({ success: true, message: 'Folder deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not delete folder' });
    }
});

// ─── UPLOAD FILES ─────────────────────────────────────────────────────────────
// @route   POST /api/uploads?folder=slug
// @access  Private/Admin
router.post('/', protect, admin, upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const folder = req.query.folder || '';

    // If a folder is specified, move files into it
    if (folder) {
        const destDir = path.join(uploaddir, folder);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        req.files.forEach(file => {
            const src = file.path;
            const dest = path.join(destDir, file.filename);
            fs.renameSync(src, dest);
        });
    }

    const uploadedFiles = req.files.map(file => ({
        name: file.filename,
        url: folder ? `/uploads/${folder}/${file.filename}` : `/uploads/${file.filename}`,
        size: file.size
    }));

    res.json({ success: true, data: uploadedFiles });
});

// ─── DELETE FILE ──────────────────────────────────────────────────────────────
// @route   DELETE /api/uploads/:filename
// @access  Private/Admin
router.delete('/:filename', protect, admin, (req, res) => {
    try {
        const folder = req.query.folder || '';
        const filepath = folder
            ? path.join(uploaddir, folder, req.params.filename)
            : path.join(uploaddir, req.params.filename);

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
