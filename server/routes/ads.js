import express from 'express';
import { 
  createAd, 
  getAllAds, 
  getActiveAds, 
  updateAd, 
  deleteAd, 
  toggleAdStatus,
  uploadAdImage 
} from '../controllers/adController.js';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';

const router = express.Router();

console.log('Ads routes being registered');

// Test route to check if ads routes are working
router.get('/test', (req, res) => {
  console.log('Ads test route hit');
  res.json({ message: 'Ads routes are working' });
});

// Admin routes (protected) - specific routes first
router.post('/', (req, res, next) => {
  console.log('POST /api/ads route hit');
  next();
}, authMiddleware, adminMiddleware, uploadAdImage, createAd);
router.get('/admin', authMiddleware, adminMiddleware, getAllAds);
router.put('/:id', authMiddleware, adminMiddleware, uploadAdImage, updateAd);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAd);
router.put('/:id/toggle', authMiddleware, adminMiddleware, toggleAdStatus);

// Public routes (for getting active ads) - must be last to avoid conflicts
router.get('/:page', getActiveAds);

export default router; 