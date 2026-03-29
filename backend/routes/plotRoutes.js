import express from 'express';
import { getPlots, getPlotById, createPlot, updatePlot, deletePlot, bulkCreatePlots } from '../controllers/plotController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { plotValidationRules, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Bulk create (must be before /:id to avoid conflict)
router.post('/bulk', protect, admin, bulkCreatePlots);

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

router.route('/:id')
  .get(protect, admin, getPlotById)
  .put(protect, admin, updatePlot)
  .delete(protect, admin, deletePlot);

export default router;
