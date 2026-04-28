import { Router } from 'express';
import * as controller from '../controllers/categoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.get));
router.post('/', authenticate, requireAdmin, asyncHandler(controller.create));
router.put('/:id', authenticate, requireAdmin, asyncHandler(controller.update));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(controller.remove));

export default router;
