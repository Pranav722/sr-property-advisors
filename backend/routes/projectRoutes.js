import express from 'express';
import { getProjects, getProjectById, getProjectBySlug, createProject, updateProject, deleteProject, getSitemap } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { projectValidationRules, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Sitemap — must be before /:id to avoid conflict
router.get('/sitemap', getSitemap);

// Slug-based lookup for SEO-friendly URLs
router.get('/slug/:slug', getProjectBySlug);

router.route('/')
  .get(getProjects)
  .post(
    protect,
    admin,
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
      { name: 'brochure', maxCount: 1 }
    ]),
    projectValidationRules(),
    validateRequest,
    createProject
  );

router.route('/:id')
  .get(getProjectById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: 'coverImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
    projectValidationRules(),
    validateRequest,
    updateProject
  )
  .delete(protect, admin, deleteProject);

export default router;
