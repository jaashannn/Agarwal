import express from 'express';
import { 
  createPayment, 
  getAllPayments, 
  getUserPayments, 
  getPayment, 
  updatePaymentStatus, 
  deletePayment 
} from '../controllers/paymentController.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

// Create a new payment (authenticated users)
router.post('/', authMiddleware, createPayment);

// Get all payments (admin only)
router.get('/', authMiddleware, adminMiddleware, getAllPayments);

// Get user's payments (authenticated users)
router.get('/my-payments', authMiddleware, getUserPayments);

// Get a single payment by ID
router.get('/:id', authMiddleware, getPayment);

// Update payment status (admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, updatePaymentStatus);

// Delete payment (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deletePayment);

export default router; 