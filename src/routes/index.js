import { Router } from 'express';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import listingRoutes from './listingRoutes.js';
import meetupRoutes from './meetupRoutes.js';
import messageRoutes from './messageRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/listings', listingRoutes);
router.use('/messages', messageRoutes);
router.use('/meetups', meetupRoutes);

export default router;
