import express from 'express';
import { getPlots, createPlot } from '../controllers/plotController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { plotValidationRules, validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(getPlots)
  .post(
    protect, 
    admin, 
    upload.fields([{ name: 'legalFiles', maxCount: 5 }]), 
    plotValidationRules(), 
    validateRequest, 
    createPlot
  );

export default router;
