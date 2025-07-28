import Ad from '../models/Ad.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_KEY;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG and PNG images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

export const uploadAdImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Create a new ad
export const createAd = async (req, res) => {
  try {
    console.log('Creating ad with body:', req.body);
    console.log('File:', req.file);
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { title, description, position, pages } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    let imageUrl = '';
    const result = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { resource_type: 'image' }
    );
    imageUrl = result.secure_url;

    // Parse position - handle both string and array inputs
    let positionArray = ['popup'];
    if (position) {
      if (Array.isArray(position)) {
        positionArray = position;
      } else if (typeof position === 'string') {
        // Handle comma-separated string like 'popup,bottom'
        positionArray = position.split(',').map(pos => pos.trim()).filter(pos => pos);
      }
    }

    const ad = new Ad({
      title,
      description,
      image: imageUrl,
      position: positionArray,
      pages: pages ? JSON.parse(pages) : ['home']
    });

    await ad.save();
    res.status(201).json({ message: 'Ad created successfully', ad });
  } catch (error) {
    console.error('Error in createAd:', error);
    res.status(500).json({ error: 'An error occurred while creating the ad' });
  }
};

// Get all ads (admin only)
export const getAllAds = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const ads = await Ad.find().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error('Error in getAllAds:', error);
    res.status(500).json({ error: 'An error occurred while fetching ads' });
  }
};

// Get active ads for specific page
export const getActiveAds = async (req, res) => {
  try {
    const { page } = req.params;
    
    const ads = await Ad.find({
      isActive: true,
      pages: page
    }).sort({ createdAt: -1 });

    res.status(200).json(ads);
  } catch (error) {
    console.error('Error in getActiveAds:', error);
    res.status(500).json({ error: 'An error occurred while fetching ads' });
  }
};

// Update ad
export const updateAd = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { title, description, position, pages, isActive } = req.body;

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    let imageUrl = ad.image;
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { resource_type: 'image' }
      );
      imageUrl = result.secure_url;
    }

    ad.title = title || ad.title;
    ad.description = description || ad.description;
    ad.image = imageUrl;
    
    // Parse position for update - handle both string and array inputs
    if (position !== undefined) {
      if (Array.isArray(position)) {
        ad.position = position;
      } else if (typeof position === 'string') {
        // Handle comma-separated string like 'popup,bottom'
        ad.position = position.split(',').map(pos => pos.trim()).filter(pos => pos);
      }
    }
    
    ad.pages = pages ? JSON.parse(pages) : ad.pages;
    ad.isActive = isActive !== undefined ? isActive : ad.isActive;

    await ad.save();
    res.status(200).json({ message: 'Ad updated successfully', ad });
  } catch (error) {
    console.error('Error in updateAd:', error);
    res.status(500).json({ error: 'An error occurred while updating the ad' });
  }
};

// Delete ad
export const deleteAd = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const ad = await Ad.findByIdAndDelete(id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    res.status(200).json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAd:', error);
    res.status(500).json({ error: 'An error occurred while deleting the ad' });
  }
};

// Toggle ad status
export const toggleAdStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const ad = await Ad.findById(id);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    ad.isActive = !ad.isActive;
    await ad.save();

    res.status(200).json({ 
      message: `Ad ${ad.isActive ? 'activated' : 'deactivated'} successfully`, 
      ad 
    });
  } catch (error) {
    console.error('Error in toggleAdStatus:', error);
    res.status(500).json({ error: 'An error occurred while toggling ad status' });
  }
}; 