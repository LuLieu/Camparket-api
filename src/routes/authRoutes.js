import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/signup', asyncHandler(controller.signup));
router.post('/login', asyncHandler(controller.login));

export default router;
