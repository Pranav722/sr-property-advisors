import express from 'express';
import { getInquiries, createInquiry, updateInquiry, deleteInquiry } from '../controllers/inquiryController.js';
import { protect, admin } from '../middleware/auth.js';
import { inquiryValidationRules, validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(protect, getInquiries)
  .post(inquiryValidationRules(), validateRequest, createInquiry);

router.route('/:id')
  .put(protect, updateInquiry)
  .delete(protect, deleteInquiry);

export default router;
