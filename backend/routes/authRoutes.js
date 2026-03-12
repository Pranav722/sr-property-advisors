import express from 'express';
import { authUser, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/google', googleLogin);

export default router;
