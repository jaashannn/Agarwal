import express from 'express';
import { getAllUsers, updateUserPaymentStatus } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// Update user payment status (admin only)
router.patch('/:id/payment-status', authMiddleware, adminMiddleware, updateUserPaymentStatus);

export default router; 