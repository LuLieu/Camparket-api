import { Router } from 'express';
import * as controller from '../controllers/listingController.js';
import { authenticate } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.get));
router.post('/', authenticate, asyncHandler(controller.create));
router.put('/:id', authenticate, asyncHandler(controller.update));
router.delete('/:id', authenticate, asyncHandler(controller.remove));

export default router;
