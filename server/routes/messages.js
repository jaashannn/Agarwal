import express from 'express'
import { getMessages, createMessage } from '../controllers/messageController.js'
import authMiddleware from '../middleware/auth.js'
import adminMiddleware from '../middleware/admin.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getMessages)
router.post('/', authMiddleware, createMessage)

export default router