import Project from '../models/Project.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: slugify a project title into a folder-safe name
const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('location', 'name').sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const { title, location, type, status, description, mapEmbedLink, price } = req.body;

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

    const project = new Project({
      title,
      location,
      type,
      status,
      description,
      mapEmbedLink,
      price: price || '',
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
      if (req.body.location) project.location = req.body.location;

      // Handle new cover image upload
      if (req.files?.coverImage) {
        project.coverImage = '/uploads/' + req.files.coverImage[0].filename;
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
