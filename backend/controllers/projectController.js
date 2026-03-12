import Project from '../models/Project.js';
import { upload, cloudinary } from '../config/cloudinary.js';

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('location', 'name');
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
    const { title, location, type, status, description, mapEmbedLink } = req.body;
    
    // Parse Cloudinary files
    let coverImage = '';
    let gallery = [];
    let brochureUrl = '';

    if (req.files) {
      if (req.files.coverImage) coverImage = req.files.coverImage[0].path;
      if (req.files.gallery) gallery = req.files.gallery.map(file => file.path);
      if (req.files.brochure) brochureUrl = req.files.brochure[0].path;
    }

    const project = new Project({
      title,
      location,
      type,
      status,
      description,
      mapEmbedLink,
      coverImage,
      gallery,
      brochureUrl
    });

    const createdProject = await project.save();
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
      // update other fields...

      const updatedProject = await project.save();
      res.json(updatedProject);
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
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};
