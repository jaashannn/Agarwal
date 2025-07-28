import express from 'express';
import { sendContactMessage, getAllContacts, deleteContactMessage } from '../controllers/contactController.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

// POST route to handle contact form submission
router.post('/',authMiddleware, sendContactMessage);

// GET route to fetch all contact messages
router.get('/',authMiddleware, getAllContacts);

// DELETE route to delete a contact message by ID
router.delete('/:id',authMiddleware, deleteContactMessage);

export default router;