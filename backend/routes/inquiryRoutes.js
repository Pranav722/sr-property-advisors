import express from 'express';
import { getInquiries, createInquiry } from '../controllers/inquiryController.js';
import { protect, admin } from '../middleware/auth.js';
import { inquiryValidationRules, validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(protect, getInquiries)
  .post(inquiryValidationRules(), validateRequest, createInquiry);

export default router;
