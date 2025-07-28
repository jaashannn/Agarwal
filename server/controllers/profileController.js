

import Profile from '../models/Profile.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

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
}).array('images', 3);

export const uploadImages = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

const AGARWAL_GOTRAS = [
  'Airan', 'Arora', 'Bansal', 'Bhandal', 'Bindal', 'Dharan', 'Garg', 'Goyal', 
  'Goyan', 'Gupta', 'Jindal', 'Kansal', 'Khatri', 'Kuchhal', 'Mangal', 'Mittal', 
  'Nangal', 'Sharma', 'Singhal', 'Tayal', 'Tingal'
];
const HEIGHT_FEET = ['4', '5', '6', '7'];
const HEIGHT_INCHES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const BODY_TYPES = ['Slim', 'Average', 'Athletic', 'Heavy'];
const COMPLEXIONS = ['Fair', 'Wheatish', 'Dark', 'Medium'];
const PHYSICAL_STATUSES = ['Normal', 'Physically Challenged'];
const OCCUPATION_TYPES = ['Private Sector', 'Government', 'Business', 'Professional', 'Not Employed'];
const FOOD_PREFERENCES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian'];
const MANGLIK_STATUSES = ['Yes', 'No', 'Not Sure'];
const REGION_TYPES = ['Aggarwal', 'Arora', 'Khatri', 'Bhraman', 'Jain'];
const FAMILY_TYPES = ['Joint', 'Nuclear'];

export const createOrUpdateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
 
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const {
      regdno, profilefor, marital, gotra, hobbies = [], language = [], hfeet, hinch, weight, body, complexion, physical,
      education, occupation, employed, income, food, smoking, drinking, day, month, year, place, time, daybirth,
      manglik, region, status, type, fname, foccupation, mname, moccupation, property, anyother, bno, bmarried,
      bwhere, sno, smarried, swhere, spouse, address, city, district, pincode, state, country, speciality,
      description, age,
    } = req.body;

    // Debug: Log the region value
    console.log('Received region value:', region);
    console.log('Expected region types:', REGION_TYPES);

    // Validate dropdown fields
    if (profilefor && !['Self', 'Son', 'Daughter', 'Friend', 'Nephew', 'Niece', 'Other'].includes(profilefor)) {
      return res.status(400).json({ error: 'Invalid profilefor value' });
    }
    if (marital && !['Never Married', 'Divorced', 'Widowed', 'Separated'].includes(marital)) {
      return res.status(400).json({ error: 'Invalid marital status' });
    }
    if (gotra && !AGARWAL_GOTRAS.includes(gotra)) {
      return res.status(400).json({ error: 'Invalid gotra value' });
    }
    if (hfeet && !HEIGHT_FEET.includes(hfeet)) {
      return res.status(400).json({ error: 'Invalid height (feet) value' });
    }
    if (hinch && !HEIGHT_INCHES.includes(hinch)) {
      return res.status(400).json({ error: 'Invalid height (inches) value' });
    }
    if (body && !BODY_TYPES.includes(body)) {
      return res.status(400).json({ error: 'Invalid body type' });
    }
    if (complexion && !COMPLEXIONS.includes(complexion)) {
      return res.status(400).json({ error: 'Invalid complexion' });
    }
    if (physical && !PHYSICAL_STATUSES.includes(physical)) {
      return res.status(400).json({ error: 'Invalid physical status' });
    }
    if (occupation && !OCCUPATION_TYPES.includes(occupation)) {
      return res.status(400).json({ error: 'Invalid occupation type' });
    }
    if (food && !FOOD_PREFERENCES.includes(food)) {
      return res.status(400).json({ error: 'Invalid food preference' });
    }
    if (smoking && !['Yes', 'No', 'Occasionally'].includes(smoking)) {
      return res.status(400).json({ error: 'Invalid smoking status' });
    }
    if (drinking && !['Yes', 'No', 'Occasionally'].includes(drinking)) {
      return res.status(400).json({ error: 'Invalid drinking status' });
    }
    if (manglik && !MANGLIK_STATUSES.includes(manglik)) {
      return res.status(400).json({ error: 'Invalid manglik status' });
    }
    if (region && !REGION_TYPES.includes(region)) {
      console.log('Region validation failed:', { 
        receivedRegion: region, 
        expectedRegions: REGION_TYPES,
        regionType: typeof region,
        regionLength: region ? region.length : 0
      });
      return res.status(400).json({ error: 'Invalid region type' });
    }
    if (type && !FAMILY_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid family type' });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.v2.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            { resource_type: 'image' }
          );
          return result.secure_url;
        })
      );
    }

    let profile = await Profile.findOne({ user: user._id });

    if (profile) {
      profile.regdno = regdno || profile.regdno;
      profile.profilefor = profilefor || profile.profilefor;
      profile.marital = marital || profile.marital;
      profile.gotra = gotra || profile.gotra;
      profile.hobbies = hobbies;
      profile.language = language;
      profile.hfeet = hfeet || profile.hfeet;
      profile.hinch = hinch || profile.hinch;
      profile.weight = weight || profile.weight;
      profile.body = body || profile.body;
      profile.complexion = complexion || profile.complexion;
      profile.physical = physical || profile.physical;
      profile.education = education || profile.education;
      profile.occupation = occupation || profile.occupation;
      profile.employed = employed || profile.employed;
      profile.income = income || profile.income;
      profile.food = food || profile.food;
      profile.smoking = smoking || profile.smoking;
      profile.drinking = drinking || profile.drinking;
      profile.day = day || profile.day;
      profile.month = month || profile.month;
      profile.year = year || profile.year;
      profile.place = place || profile.place;
      profile.time = time || profile.time;
      profile.daybirth = daybirth || profile.daybirth;
      profile.manglik = manglik || profile.manglik;
      profile.region = region || profile.region;
      profile.status = status || profile.status;
      profile.type = type || profile.type;
      profile.fname = fname || profile.fname;
      profile.foccupation = foccupation || profile.foccupation;
      profile.mname = mname || profile.mname;
      profile.moccupation = moccupation || profile.moccupation;
      profile.property = property || profile.property;
      profile.anyother = anyother || profile.anyother;
      profile.bno = bno || profile.bno;
      profile.bmarried = bmarried || profile.bmarried;
      profile.bwhere = bwhere || profile.bwhere;
      profile.sno = sno || profile.sno;
      profile.smarried = smarried || profile.smarried;
      profile.swhere = swhere || profile.swhere;
      profile.spouse = spouse || profile.spouse;
      profile.address = address || profile.address;
      profile.city = city || profile.city;
      profile.district = district || profile.district;
      profile.pincode = pincode || profile.pincode;
      profile.state = state || profile.state;
      profile.country = country || profile.country;
      profile.speciality = speciality || profile.speciality;
      profile.description = description || profile.description;
      profile.age = age || profile.age;
      profile.images = imageUrls.length > 0 ? [...profile.images, ...imageUrls] : profile.images;

      const requiredFields = ['age', 'profilefor', 'marital', 'gotra', 'education', 'occupation', 'hfeet', 'hinch', 'fname', 'mname', 'region', 'type'];
      profile.isCompleted = requiredFields.every(field => profile[field] != null && profile[field] !== '') && profile.images.length > 0;
      await profile.save();
    } else {
      profile = new Profile({
        user: user._id,
        regdno,
        profilefor,
        marital,
        gotra,
        hobbies,
        language,
        hfeet,
        hinch,
        weight,
        body,
        complexion,
        physical,
        education,
        occupation,
        employed,
        income,
        food,
        smoking,
        drinking,
        day,
        month,
        year,
        place,
        time,
        daybirth,
        manglik,
        region,
        status,
        type,
        fname,
        foccupation,
        mname,
        moccupation,
        property,
        anyother,
        bno,
        bmarried,
        bwhere,
        sno,
        smarried,
        swhere,
        spouse,
        address,
        city,
        district,
        pincode,
        state,
        country,
        speciality,
        description,
        age,
        images: imageUrls,
        isCompleted: false,
      });
      const requiredFields = ['age', 'profilefor', 'marital', 'gotra', 'education', 'occupation', 'hfeet', 'hinch', 'fname', 'mname', 'region', 'type'];
      profile.isCompleted = requiredFields.every(field => profile[field] != null && profile[field] !== '') && imageUrls.length > 0;
      await profile.save();
      user.profile = profile._id;
      await user.save();
    }

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    console.error('Error in createOrUpdateProfile:', error);
    res.status(500).json({ error: 'An error occurred while saving the profile' });
  }
};

// Get my profile
export const getMyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('profile');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(user.profile);
  } catch (error) {
    console.error('Error in getMyProfile:', error);
    res.status(500).json({ error: 'An error occurred while fetching the profile' });
  }
};

// Check if profile is complete
export const checkProfileCompletion = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('profile');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.profile) {
      return res.status(200).json({ isComplete: false });
    }

    const profile = user.profile;
    const requiredFields = [
      'age', 'profilefor', 'marital', 'gotra', 'education', 'occupation',
      'hfeet', 'hinch', 'fname', 'mname'
    ];
    const isComplete = requiredFields.every(field => profile[field] != null && profile[field] !== '') &&
      profile.images.length > 0;

    res.status(200).json({ isComplete });
  } catch (error) {
    console.error('Error in checkProfileCompletion:', error);
    res.status(500).json({ error: 'An error occurred while checking profile completion' });
  }
};

// Get all profiles
export const getProfiles = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let profiles;
    if (user.role === 'admin') {
      // For admins: fetch all profiles with complete user details and file information
      profiles = await Profile.find({})
        .populate({
          path: 'user',
          select: '-password' // Exclude password field but include everything else
        })
        .lean();
      
      // Filter out admin users if needed and add file information
      profiles = profiles.filter(profile => profile.user?.role !== 'admin').map(profile => {
        // Add file information for each profile
        const fileInfo = {
          totalImages: profile.images?.length || 0,
          imageUrls: profile.images || [],
          hasImages: profile.images && profile.images.length > 0,
          profileCompletion: profile.isCompleted || false,
          paymentStatus: profile.isPaymentDone || false,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt
        };
        
        return {
          ...profile,
          fileInfo,
          userDetails: {
            id: profile.user?._id,
            name: profile.user?.name,
            email: profile.user?.email,
            mobile: profile.user?.mobile,
            gender: profile.user?.gender,
            verified: profile.user?.verified,
            creatorRole: profile.user?.creatorRole,
            role: profile.user?.role,
            createdAt: profile.user?.createdAt
          }
        };
      });
    } else {
      // For regular users: fetch limited data and filter in the query
      profiles = await Profile.find({})
        .populate({
          path: 'user',
          select: 'name email role',
          match: { role: 'user' } // Only populate users with role 'user'
        })
        .lean(); 
      
      // Filter out the current user and profiles without populated users
      profiles = profiles.filter(profile => 
        profile.user && 
        profile.user._id.toString() !== user._id.toString()
      );
    }

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error in getProfiles:', error);
    res.status(500).json({ error: 'An error occurred while fetching profiles' });
  }
};

// Get a single profile by ID
export const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = await Profile.findById(req.params.id).populate('user', '-password');
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // For admins, return enhanced data structure
    if (user.role === 'admin') {
      const fileInfo = {
        totalImages: profile.images?.length || 0,
        imageUrls: profile.images || [],
        hasImages: profile.images && profile.images.length > 0,
        profileCompletion: profile.isCompleted || false,
        paymentStatus: profile.isPaymentDone || false,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      };
      
      const enhancedProfile = {
        ...profile.toObject(),
        fileInfo,
        userDetails: {
          id: profile.user?._id,
          name: profile.user?.name,
          email: profile.user?.email,
          mobile: profile.user?.mobile,
          gender: profile.user?.gender,
          verified: profile.user?.verified,
          creatorRole: profile.user?.creatorRole,
          role: profile.user?.role,
          createdAt: profile.user?.createdAt
        }
      };
      
      res.status(200).json(enhancedProfile);
    } else {
      // For regular users, return basic profile data
      res.status(200).json(profile);
    }
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: 'An error occurred while fetching the profile' });
  }
};

// Verify a profile (admin only)
export const verifyProfile = async (req, res) => {
  try {
    const user = await Profile.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.verified = !user.verified;
    await user.save();
    res.status(200).json({ message: `Profile ${user.verified ? 'verified' : 'unverified'}` });
  } catch (error) {
    console.error('Error in verifyProfile:', error);
    res.status(500).json({ error: 'An error occurred while verifying the profile' });
  }
};

// Delete a profile (admin only)
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    await User.findByIdAndDelete(profile.user);
    res.status(200).json({ message: 'Profile and associated user deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProfile:', error);
    res.status(500).json({ error: 'An error occurred while deleting the profile' });
  }
};

// Update profile (without images)
export const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
 
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const {
      regdno, profilefor, marital, gotra, hobbies = [], language = [], hfeet, hinch, weight, body, complexion, physical,
      education, occupation, employed, income, food, smoking, drinking, day, month, year, place, time, daybirth,
      manglik, region, status, type, fname, foccupation, mname, moccupation, property, anyother, bno, bmarried,
      bwhere, sno, smarried, swhere, spouse, address, city, district, pincode, state, country, speciality,
      description, age,
    } = req.body;

    // Debug: Log the region value
    console.log('Received region value:', region);
    console.log('Expected region types:', REGION_TYPES);

    // Validate dropdown fields
    if (profilefor && !['Self', 'Son', 'Daughter', 'Friend', 'Nephew', 'Niece', 'Other'].includes(profilefor)) {
      return res.status(400).json({ error: 'Invalid profilefor value' });
    }
    if (marital && !['Never Married', 'Divorced', 'Widowed', 'Separated'].includes(marital)) {
      return res.status(400).json({ error: 'Invalid marital status' });
    }
    if (gotra && !AGARWAL_GOTRAS.includes(gotra)) {
      return res.status(400).json({ error: 'Invalid gotra value' });
    }
    if (hfeet && !HEIGHT_FEET.includes(hfeet)) {
      return res.status(400).json({ error: 'Invalid height (feet) value' });
    }
    if (hinch && !HEIGHT_INCHES.includes(hinch)) {
      return res.status(400).json({ error: 'Invalid height (inches) value' });
    }
    if (body && !BODY_TYPES.includes(body)) {
      return res.status(400).json({ error: 'Invalid body type' });
    }
    if (complexion && !COMPLEXIONS.includes(complexion)) {
      return res.status(400).json({ error: 'Invalid complexion' });
    }
    if (physical && !PHYSICAL_STATUSES.includes(physical)) {
      return res.status(400).json({ error: 'Invalid physical status' });
    }
    if (occupation && !OCCUPATION_TYPES.includes(occupation)) {
      return res.status(400).json({ error: 'Invalid occupation type' });
    }
    if (food && !FOOD_PREFERENCES.includes(food)) {
      return res.status(400).json({ error: 'Invalid food preference' });
    }
    if (smoking && !['Yes', 'No', 'Occasionally'].includes(smoking)) {
      return res.status(400).json({ error: 'Invalid smoking status' });
    }
    if (drinking && !['Yes', 'No', 'Occasionally'].includes(drinking)) {
      return res.status(400).json({ error: 'Invalid drinking status' });
    }
    if (manglik && !MANGLIK_STATUSES.includes(manglik)) {
      return res.status(400).json({ error: 'Invalid manglik status' });
    }
    if (region && !REGION_TYPES.includes(region)) {
      console.log('Region validation failed:', { 
        receivedRegion: region, 
        expectedRegions: REGION_TYPES,
        regionType: typeof region,
        regionLength: region ? region.length : 0
      });
      return res.status(400).json({ error: 'Invalid region type' });
    }
    if (type && !FAMILY_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid family type' });
    }

    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update profile fields
    profile.regdno = regdno !== undefined ? regdno : profile.regdno;
    profile.profilefor = profilefor !== undefined ? profilefor : profile.profilefor;
    profile.marital = marital !== undefined ? marital : profile.marital;
    profile.gotra = gotra !== undefined ? gotra : profile.gotra;
    profile.hobbies = hobbies;
    profile.language = language;
    profile.hfeet = hfeet !== undefined ? hfeet : profile.hfeet;
    profile.hinch = hinch !== undefined ? hinch : profile.hinch;
    profile.weight = weight !== undefined ? weight : profile.weight;
    profile.body = body !== undefined ? body : profile.body;
    profile.complexion = complexion !== undefined ? complexion : profile.complexion;
    profile.physical = physical !== undefined ? physical : profile.physical;
    profile.education = education !== undefined ? education : profile.education;
    profile.occupation = occupation !== undefined ? occupation : profile.occupation;
    profile.employed = employed !== undefined ? employed : profile.employed;
    profile.income = income !== undefined ? income : profile.income;
    profile.food = food !== undefined ? food : profile.food;
    profile.smoking = smoking !== undefined ? smoking : profile.smoking;
    profile.drinking = drinking !== undefined ? drinking : profile.drinking;
    profile.day = day !== undefined ? day : profile.day;
    profile.month = month !== undefined ? month : profile.month;
    profile.year = year !== undefined ? year : profile.year;
    profile.place = place !== undefined ? place : profile.place;
    profile.time = time !== undefined ? time : profile.time;
    profile.daybirth = daybirth !== undefined ? daybirth : profile.daybirth;
    profile.manglik = manglik !== undefined ? manglik : profile.manglik;
    profile.region = region !== undefined ? region : profile.region;
    profile.status = status !== undefined ? status : profile.status;
    profile.type = type !== undefined ? type : profile.type;
    profile.fname = fname !== undefined ? fname : profile.fname;
    profile.foccupation = foccupation !== undefined ? foccupation : profile.foccupation;
    profile.mname = mname !== undefined ? mname : profile.mname;
    profile.moccupation = moccupation !== undefined ? moccupation : profile.moccupation;
    profile.property = property !== undefined ? property : profile.property;
    profile.anyother = anyother !== undefined ? anyother : profile.anyother;
    profile.bno = bno !== undefined ? bno : profile.bno;
    profile.bmarried = bmarried !== undefined ? bmarried : profile.bmarried;
    profile.bwhere = bwhere !== undefined ? bwhere : profile.bwhere;
    profile.sno = sno !== undefined ? sno : profile.sno;
    profile.smarried = smarried !== undefined ? smarried : profile.smarried;
    profile.swhere = swhere !== undefined ? swhere : profile.swhere;
    profile.spouse = spouse !== undefined ? spouse : profile.spouse;
    profile.address = address !== undefined ? address : profile.address;
    profile.city = city !== undefined ? city : profile.city;
    profile.district = district !== undefined ? district : profile.district;
    profile.pincode = pincode !== undefined ? pincode : profile.pincode;
    profile.state = state !== undefined ? state : profile.state;
    profile.country = country !== undefined ? country : profile.country;
    profile.speciality = speciality !== undefined ? speciality : profile.speciality;
    profile.description = description !== undefined ? description : profile.description;
    profile.age = age !== undefined ? age : profile.age;

    // Check if profile is completed
    const requiredFields = ['age', 'profilefor', 'marital', 'gotra', 'education', 'occupation', 'hfeet', 'hinch', 'fname', 'mname', 'region', 'type'];
    profile.isCompleted = requiredFields.every(field => profile[field] != null && profile[field] !== '') && profile.images.length > 0;
    
    await profile.save();
    
    // Populate user details for response
    await profile.populate('user', 'name email gender');
    
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: Create user and profile together
export const adminCreateUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== 'admin') { 
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Accept all fields, but do not require any
    const {
      name, email, gender, mobile, creatorRole, password, confirmPassword,
      regdno, profilefor, marital, gotra, hobbies, language, hfeet, hinch, weight, body, complexion, physical,
      education, occupation, employed, income, food, smoking, drinking, day, month, year, place, time, daybirth,
      manglik, region, status, type, fname, foccupation, mname, moccupation, property, anyother, bno, bmarried,
      bwhere, sno, smarried, swhere, spouse, address, city, district, pincode, state, country, speciality,
      description, age, images, isCompleted, isPaymentDone
    } = req.body;

    // Only check for duplicate email if email is provided
    if (email) {
      let userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    // Hash password if provided
    let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({
      name,
      email,
      gender,
      mobile,
      creatorRole,
      password: hashedPassword,
    });
    await user.save();

    // Prepare profile fields (all optional)
    const profileData = {
      user: user._id,
      regdno,
      profilefor,
      marital,
      gotra,
      hobbies: hobbies ? (Array.isArray(hobbies) ? hobbies : hobbies.split(',').map(h => h.trim())) : [],
      language: language ? (Array.isArray(language) ? language : language.split(',').map(l => l.trim())) : [],
      hfeet,
      hinch,
      weight,
      body,
      complexion,
      physical,
      education,
      occupation,
      employed,
      income,
      food,
      smoking,
      drinking,
      day,
      month,
      year,
      place,
      time,
      daybirth,
      manglik,
      region,
      status,
      type,
      fname,
      foccupation,
      mname,
      moccupation,
      property,
      anyother,
      bno,
      bmarried,
      bwhere,
      sno,
      smarried,
      swhere,
      spouse,
      address,
      city,
      district,
      pincode,
      state,
      country,
      speciality,
      description,
      age,
      images: images ? (Array.isArray(images) ? images : images.split(',').map(i => i.trim())) : [],
      isCompleted,
      isPaymentDone
    };
    const profile = new Profile(profileData);
    await profile.save();

    // Link profile to user
    user.profile = profile._id;
    await user.save();

    res.status(201).json({ message: 'User and profile created successfully', user, profile });
  } catch (error) {
    console.error('Error in adminCreateUserProfile:', error);
    res.status(500).json({ error: 'An error occurred while creating user and profile' });
  }
};

export const adminCreateProfile = async (req, res) => {
  try {
    // Only admin can access (middleware should check)
    const { userId, ...profileData } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile
      profile = new Profile({ user: userId, ...profileData });
      await profile.save();
    }
    res.status(200).json({ message: 'Profile saved', profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
};