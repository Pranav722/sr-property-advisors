import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { projectValidationRules, validateRequest } from '../middleware/validation.js';

const router = express.Router();

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
