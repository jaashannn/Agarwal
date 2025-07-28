import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profiles.js'
import messageRoutes from './routes/messages.js'
import contactRoutes from './routes/contact.js'
import adRoutes from './routes/ads.js'
import paymentRoutes from './routes/payments.js'
import userRoutes from './routes/users.js'
import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_URI = process.env.MONGODB_URI ;

mongoose.connect(`${MONGO_URI}`)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/profiles', profileRoutes)  
app.use('/api/messages', messageRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/users', userRoutes)
// Test route to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running', port: process.env.PORT || 5000 });
});

app.use('/api/ads', adRoutes)

// Catch-all route to debug 404s
app.use('*', (req, res) => {
  console.log(`404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found', 
    method: req.method, 
    url: req.originalUrl,
    availableRoutes: ['/api/auth', '/api/profiles', '/api/messages', '/api/contacts', '/api/ads', '/api/payments', '/api/users']
  });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});