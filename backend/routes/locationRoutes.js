import express from 'express';
import { getLocations, createLocation } from '../controllers/locationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getLocations)
  .post(protect, admin, createLocation);

export default router;
