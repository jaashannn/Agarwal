import express from 'express'
import { getProfiles, getProfile, verifyProfile, deleteProfile, uploadImages, createOrUpdateProfile, checkProfileCompletion, getMyProfile, updateProfile, adminCreateUserProfile, adminCreateProfile } from '../controllers/profileController.js'
import authMiddleware from '../middleware/auth.js'
import adminMiddleware from '../middleware/admin.js'

const router = express.Router()


router.post('/profile', authMiddleware, uploadImages, createOrUpdateProfile);

// GET route to check profile completion status
router.get('/my-profile', authMiddleware, getMyProfile);

router.get('/profile/completion', authMiddleware, checkProfileCompletion);
router.get('/', authMiddleware, getProfiles)
router.get('/:id', authMiddleware, getProfile)
router.put('/:id/verify', authMiddleware, adminMiddleware, verifyProfile)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProfile)

// PUT route to update profile (without images)
router.put('/update', authMiddleware, updateProfile);

// Admin: Create user and profile together
router.post('/admin-create', authMiddleware, adminMiddleware, adminCreateUserProfile);

// Admin: Create or update profile for any user by userId
router.post('/admin-create-profile', authMiddleware, adminMiddleware, adminCreateProfile);

export default router 