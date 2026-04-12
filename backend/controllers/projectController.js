import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: slugify a string to a URL-safe slug
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // strip non-alphanumeric
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '');          // trim leading/trailing hyphens

// Build a unique slug from title + location name (for SEO-friendly URLs)
const buildSlug = async (title, locationName) => {
  const base = slugify(`${title}${locationName ? '-' + locationName : ''}`);
  let candidate = base;
  let counter = 1;
  while (await Project.exists({ slug: candidate })) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
};

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.isFeatured) filter.isFeatured = req.query.isFeatured === 'true';

    const projects = await Project.find(filter).populate('location', 'name').sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('location', 'name');
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single project by SEO slug
// @route   GET /api/projects/slug/:slug
// @access  Public
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('location', 'name');
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const { title, location, type, status, description, mapEmbedLink, price, isFeatured } = req.body;

    // Parse uploaded files
    let coverImage = '';
    let gallery = [];
    let brochureUrl = '';

    if (req.files) {
      if (req.files.coverImage) coverImage = '/uploads/' + req.files.coverImage[0].filename;
      if (req.files.gallery) gallery = req.files.gallery.map(file => '/uploads/' + file.filename);
      if (req.files.brochure) brochureUrl = '/uploads/' + req.files.brochure[0].filename;
    }

    const folderSlug = slugify(title);

    // Build SEO slug using title + location name if available
    // We temporarily fetch location name for richer slug
    let locationName = '';
    try {
      const { default: Location } = await import('../models/Location.js');
      const loc = await Location.findById(location);
      if (loc?.name) locationName = loc.name;
    } catch (_) {}

    const seoSlug = await buildSlug(title, locationName);

    const project = new Project({
      title,
      slug: seoSlug,
      location,
      type,
      status,
      description,
      mapEmbedLink,
      price: price || '',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      coverImage,
      gallery,
      brochureUrl,
      folderSlug,
    });

    const createdProject = await project.save();

    // Auto-create a dedicated folder in uploads for this project
    const projectFolder = path.join(__dirname, '../uploads', folderSlug);
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
    }

    res.status(201).json({ success: true, data: createdProject });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = req.body.title || project.title;
      project.status = req.body.status || project.status;
      project.type = req.body.type || project.type;
      project.description = req.body.description !== undefined ? req.body.description : project.description;
      project.mapEmbedLink = req.body.mapEmbedLink !== undefined ? req.body.mapEmbedLink : project.mapEmbedLink;
      project.price = req.body.price !== undefined ? req.body.price : project.price;
      if (req.body.isFeatured !== undefined) project.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
      if (req.body.location) project.location = req.body.location;

      // Regenerate slug if title changed and slug is missing
      if (!project.slug) {
        let locationName = '';
        try {
          const { default: Location } = await import('../models/Location.js');
          const loc = await Location.findById(project.location);
          if (loc?.name) locationName = loc.name;
        } catch (_) {}
        project.slug = await buildSlug(project.title, locationName);
      }

      // Handle new cover image upload
      if (req.files?.coverImage) {
        project.coverImage = '/uploads/' + req.files.coverImage[0].filename;
      }

      // Handle gallery: append new uploads, remove specified ones
      if (req.files?.gallery) {
        const newGallery = req.files.gallery.map(f => '/uploads/' + f.filename);
        project.gallery = [...(project.gallery || []), ...newGallery];
      }
      // Support removing specific gallery images
      if (req.body.galleryRemove) {
        const toRemove = Array.isArray(req.body.galleryRemove)
          ? req.body.galleryRemove
          : [req.body.galleryRemove];
        project.gallery = (project.gallery || []).filter(g => !toRemove.includes(g));
      }

      const updatedProject = await project.save();
      res.json({ success: true, data: updatedProject });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ success: true, message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Generate XML sitemap with all project slugs
// @route   GET /api/sitemap
// @access  Public
export const getSitemap = async (req, res, next) => {
  try {
    const projects = await Project.find({ slug: { $exists: true, $ne: '' } }, 'slug updatedAt').lean();
    const BASE = process.env.CLIENT_URL || 'https://srpropertyadvisor.in';

    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/projects', priority: '0.9', changefreq: 'daily' },
      { url: '/services', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    const now = new Date().toISOString().split('T')[0];

    const urls = [
      ...staticPages.map(p => `
  <url>
    <loc>${BASE}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`),
      ...projects.map(p => `
  <url>
    <loc>${BASE}/property/slug/${p.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : now}</lastmod>
  </url>`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
};
