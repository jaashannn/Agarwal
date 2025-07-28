import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  FaUser, FaMapMarkerAlt, FaBriefcase, FaGraduationCap,
  FaPray, FaRulerVertical, FaUsers, FaPhotoVideo,
  FaCreditCard, FaQrcode, FaInfoCircle, FaCheckCircle,
  FaArrowRight, FaArrowLeft, FaSmoking, FaWineGlass,
  FaBirthdayCake, FaHome, FaHeart, FaEdit
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = {
  primary: '#0A5C36',
  gold: '#D4AF37',
  cream: '#F8F4EA',
  lightGold: '#EFE3B8',
  darkGreen: '#03482A',
  error: '#E53E3E',
  accent: '#B8860B'
};

const AGARWAL_GOTRAS = [
  'Bansal', 'Goyal', 'Kuchhal', 'Kansal', 'Bindal', 'Dharan', 'Singhal', 'Jindal',
  'Mittal', 'Tingal', 'Tayal', 'Mangal', 'Airan', 'Garg', 'Bhandal', 'Nangal', 
  'Goyan', 'Gupta', 'Sharma', 'Arora', 'Khatri'
];

const HEIGHT_FEET = ['4', '5', '6', '7'];
const HEIGHT_INCHES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const BODY_TYPES = ['Slim', 'Average', 'Athletic', 'Heavy'];
const COMPLEXIONS = ['Fair', 'Wheatish', 'Dark', 'Medium'];
const PHYSICAL_STATUSES = ['Normal', 'Physically Challenged'];
const OCCUPATION_TYPES = ['Private Sector', 'Government', 'Business', 'Professional', 'Not Employed'];
const FOOD_PREFERENCES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian'];
const MANGLIK_STATUSES = ['Yes', 'No', 'Not Sure'];
const REGION_TYPES = ['Marwari', 'Punjabi', 'Other'];
const FAMILY_TYPES = ['Joint', 'Nuclear'];

function EditProfile() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    regdno: '',
    profilefor: '',
    marital: '',
    gotra: '',
    hobbies: [],
    language: [],
    hfeet: '',
    hinch: '',
    weight: '',
    body: '',
    complexion: '',
    physical: '',
    education: '',
    occupation: '',
    employed: '',
    income: '',
    food: '',
    smoking: '',
    drinking: '',
    day: '',
    month: '',
    year: '',
    place: '',
    time: '',
    daybirth: '',
    manglik: '',
    region: '',
    status: '',
    type: '',
    fname: '',
    foccupation: '',
    mname: '',
    moccupation: '',
    property: '',
    anyother: '',
    bno: '',
    bmarried: '',
    bwhere: '',
    sno: '',
    smarried: '',
    swhere: '',
    spouse: '',
    address: '',
    city: '',
    district: '',
    pincode: '',
    state: '',
    country: '',
    speciality: '',
    description: '',
    age: '',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMale = user?.gender?.toLowerCase() === 'male';
  const tabs = [
    { id: 'personal', label: 'Personal', icon: <FaUser /> },
    { id: 'physical', label: 'Physical', icon: <FaRulerVertical /> },
    { id: 'family', label: 'Family', icon: <FaUsers /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <FaHeart /> },
    { id: 'contact', label: 'Contact', icon: <FaHome /> },
    { id: 'other', label: 'Other', icon: <FaInfoCircle /> },
    { id: 'images', label: 'Images', icon: <FaPhotoVideo /> }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profiles/my-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const profileData = response.data;
        setFormData({
          regdno: profileData.regdno || '',
          profilefor: profileData.profilefor || '',
          marital: profileData.marital || '',
          gotra: profileData.gotra || '',
          hobbies: profileData.hobbies || [],
          language: profileData.language || [],
          hfeet: profileData.hfeet || '',
          hinch: profileData.hinch || '',
          weight: profileData.weight || '',
          body: profileData.body || '',
          complexion: profileData.complexion || '',
          physical: profileData.physical || '',
          education: profileData.education || '',
          occupation: profileData.occupation || '',
          employed: profileData.employed || '',
          income: profileData.income || '',
          food: profileData.food || '',
          smoking: profileData.smoking || '',
          drinking: profileData.drinking || '',
          day: profileData.day || '',
          month: profileData.month || '',
          year: profileData.year || '',
          place: profileData.place || '',
          time: profileData.time || '',
          daybirth: profileData.daybirth || '',
          manglik: profileData.manglik || '',
          region: profileData.region || '',
          status: profileData.status || '',
          type: profileData.type || '',
          fname: profileData.fname || '',
          foccupation: profileData.foccupation || '',
          mname: profileData.mname || '',
          moccupation: profileData.moccupation || '',
          property: profileData.property || '',
          anyother: profileData.anyother || '',
          bno: profileData.bno || '',
          bmarried: profileData.bmarried || '',
          bwhere: profileData.bwhere || '',
          sno: profileData.sno || '',
          smarried: profileData.smarried || '',
          swhere: profileData.swhere || '',
          spouse: profileData.spouse || '',
          address: profileData.address || '',
          city: profileData.city || '',
          district: profileData.district || '',
          pincode: profileData.pincode || '',
          state: profileData.state || '',
          country: profileData.country || '',
          speciality: profileData.speciality || '',
          description: profileData.description || '',
          age: profileData.age || '',
          images: profileData.images || []
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
        navigate('/my-profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const validateCurrentTab = () => {
    const newErrors = {};
    if (activeTab === 'personal') {
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.profilefor) newErrors.profilefor = 'Profile for is required';
      if (!formData.marital) newErrors.marital = 'Marital status is required';
      if (!formData.gotra) newErrors.gotra = 'Gotra is required';
      if (!formData.education) newErrors.education = 'Education is required';
      if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    }
    if (activeTab === 'physical') {
      if (!formData.hfeet) newErrors.hfeet = 'Height (feet) is required';
      if (!formData.hinch) newErrors.hinch = 'Height (inches) is required';
    }
    if (activeTab === 'family') {
      if (!formData.fname) newErrors.fname = "Father's name is required";
      if (!formData.mname) newErrors.mname = "Mother's name is required";
      if (!formData.type) newErrors.type = "Family type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: values }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFormData(prev => ({ ...prev, images: files }));
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (validateCurrentTab()) {
    } else {
      toast.error('Please complete all required fields before proceeding.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentTab()) {
      toast.error('Please complete all required fields before submitting.');
      return;
    }
    setIsSubmitting(true);
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        // Only append new files, not existing URLs
        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item instanceof File) {
              data.append('images', item);
            }
          });
        }
      } else if (Array.isArray(value)) {
        value.forEach(item => data.append(`${key}[]`, item));
      } else {
        data.append(key, value);
      }
    });

    try {
      await axios.post(`${API_URL}/api/profiles/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Profile updated successfully!');
      navigate('/my-profile');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full p-3.5 rounded-lg bg-cream border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 text-gray-700 placeholder-gray-400";
  const labelClasses = "flex items-center text-gray-700 font-medium mb-2";
  const errorClasses = "text-red-500 text-sm mt-1 flex items-center";
  const iconClasses = "mr-2 text-gold";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen pt-16 pb-16 px-4 bg-cream" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="max-w-5xl mx-auto">
        <Link to="/my-profile" className="inline-flex items-center text-primary font-medium mb-6 hover:text-gold">
          <FaArrowLeft className="mr-2" /> Back to Profile
        </Link>
        <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gold/20">
          <div className="bg-gradient-to-r from-primary to-darkGreen p-6 text-center">
            <motion.h1 className="text-3xl font-bold text-white mb-2">Edit Profile</motion.h1>
            <p className="text-gold/90 max-w-lg mx-auto">Update your profile information</p>
          </div>
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => handleTabChange(tab.id)} className={`flex-1 min-w-max py-4 px-6 text-center border-b-2 font-medium flex items-center justify-center space-x-2 ${activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <span className={activeTab === tab.id ? 'text-gold' : 'text-gray-400'}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div key="personal" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Age *</label>
                      <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClasses} placeholder="Enter your age" required disabled={loading} />
                      {errors.age && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.age}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Profile For *</label>
                      <select name="profilefor" value={formData.profilefor} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select</option>
                        <option value="Self">Self</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                      </select>
                      {errors.profilefor && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.profilefor}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Marital Status *</label>
                      <select name="marital" value={formData.marital} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                      {errors.marital && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.marital}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Gotra *</label>
                      <select name="gotra" value={formData.gotra} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select Gotra</option>
                        {AGARWAL_GOTRAS.map(gotra => (
                          <option key={gotra} value={gotra}>{gotra}</option>
                        ))}
                      </select>
                      {errors.gotra && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.gotra}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Region *</label>
                      <select name="region" value={formData.region} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select Region</option>
                        {REGION_TYPES.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      {errors.region && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.region}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Hobbies</label>
                      <input type="text" name="hobbies" value={formData.hobbies.join(', ')} onChange={(e) => handleArrayChange(e, 'hobbies')} className={inputClasses} placeholder="e.g., Reading, Music, Travel (separate with commas)" disabled={loading} />
                      <p className="text-sm text-gray-500 mt-1">Enter hobbies separated by commas</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}><FaUser className={iconClasses} /> Languages Known</label>
                    <input type="text" name="language" value={formData.language.join(', ')} onChange={(e) => handleArrayChange(e, 'language')} className={inputClasses} placeholder="e.g., Hindi, English, Punjabi (separate with commas)" disabled={loading} />
                    <p className="text-sm text-gray-500 mt-1">Enter languages separated by commas</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaGraduationCap className={iconClasses} /> Education *</label>
                      <input type="text" name="education" value={formData.education} onChange={handleChange} className={inputClasses} placeholder="Highest degree" required disabled={loading} />
                      {errors.education && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.education}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaBriefcase className={iconClasses} /> Occupation Type *</label>
                      <select name="occupation" value={formData.occupation} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select Occupation</option>
                        {OCCUPATION_TYPES.map(occupation => (
                          <option key={occupation} value={occupation}>{occupation}</option>
                        ))}
                      </select>
                      {errors.occupation && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.occupation}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'physical' && (
                <motion.div key="physical" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaRulerVertical className={iconClasses} /> Height (Feet) *</label>
                      <select name="hfeet" value={formData.hfeet} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select Feet</option>
                        {HEIGHT_FEET.map(feet => (
                          <option key={feet} value={feet}>{feet}</option>
                        ))}
                      </select>
                      {errors.hfeet && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.hfeet}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaRulerVertical className={iconClasses} /> Height (Inches) *</label>
                      <select name="hinch" value={formData.hinch} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select Inches</option>
                        {HEIGHT_INCHES.map(inch => (
                          <option key={inch} value={inch}>{inch}</option>
                        ))}
                      </select>
                      {errors.hinch && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.hinch}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaRulerVertical className={iconClasses} /> Weight</label>
                      <input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputClasses} placeholder="Weight in kg" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Body Type</label>
                      <select name="body" value={formData.body} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select Body Type</option>
                        {BODY_TYPES.map(bodyType => (
                          <option key={bodyType} value={bodyType}>{bodyType}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Complexion</label>
                      <select name="complexion" value={formData.complexion} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select Complexion</option>
                        {COMPLEXIONS.map(complexion => (
                          <option key={complexion} value={complexion}>{complexion}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Physical Status</label>
                      <select name="physical" value={formData.physical} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select Physical Status</option>
                        {PHYSICAL_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'family' && (
                <motion.div key="family" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Father's Name *</label>
                      <input type="text" name="fname" value={formData.fname} onChange={handleChange} className={inputClasses} placeholder="Father's full name" required disabled={loading} />
                      {errors.fname && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.fname}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaBriefcase className={iconClasses} /> Father's Occupation</label>
                      <input type="text" name="foccupation" value={formData.foccupation} onChange={handleChange} className={inputClasses} placeholder="Father's profession" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Mother's Name *</label>
                      <input type="text" name="mname" value={formData.mname} onChange={handleChange} className={inputClasses} placeholder="Mother's full name" required disabled={loading} />
                      {errors.mname && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.mname}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaBriefcase className={iconClasses} /> Mother's Occupation</label>
                      <input type="text" name="moccupation" value={formData.moccupation} onChange={handleChange} className={inputClasses} placeholder="Mother's profession" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Family Type *</label>
                      <select name="type" value={formData.type} onChange={handleChange} className={inputClasses} required disabled={loading}>
                        <option value="">Select Family Type</option>
                        {FAMILY_TYPES.map(familyType => (
                          <option key={familyType} value={familyType}>{familyType}</option>
                        ))}
                      </select>
                      {errors.type && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.type}</p>}
                    </div>
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Number of Brothers</label>
                      <input type="number" name="bno" value={formData.bno} onChange={handleChange} className={inputClasses} placeholder="Number of brothers" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Brothers Married</label>
                      <input type="text" name="bmarried" value={formData.bmarried} onChange={handleChange} className={inputClasses} placeholder="Married brothers details" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Number of Sisters</label>
                      <input type="number" name="sno" value={formData.sno} onChange={handleChange} className={inputClasses} placeholder="Number of sisters" disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}><FaUsers className={iconClasses} /> Sisters Married</label>
                    <input type="text" name="smarried" value={formData.smarried} onChange={handleChange} className={inputClasses} placeholder="Married sisters details" disabled={loading} />
                  </div>
                </motion.div>
              )}
              {activeTab === 'lifestyle' && (
                <motion.div key="lifestyle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaSmoking className={iconClasses} /> Smoking</label>
                      <select name="smoking" value={formData.smoking} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Occasionally">Occasionally</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}><FaWineGlass className={iconClasses} /> Drinking</label>
                      <select name="drinking" value={formData.drinking} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Occasionally">Occasionally</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Food Preference</label>
                      <select name="food" value={formData.food} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select Food Preference</option>
                        {FOOD_PREFERENCES.map(food => (
                          <option key={food} value={food}>{food}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClasses}><FaBriefcase className={iconClasses} /> Income</label>
                      <input type="text" name="income" value={formData.income} onChange={handleChange} className={inputClasses} placeholder="Annual income" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Employed In</label>
                      <input type="text" name="employed" value={formData.employed} onChange={handleChange} className={inputClasses} placeholder="Employed in" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Manglik</label>
                      <select name="manglik" value={formData.manglik} onChange={handleChange} className={inputClasses} disabled={loading}>
                        <option value="">Select Manglik Status</option>
                        {MANGLIK_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaHome className={iconClasses} /> Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClasses} placeholder="Address" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaMapMarkerAlt className={iconClasses} /> City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClasses} placeholder="City" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaMapMarkerAlt className={iconClasses} /> District</label>
                      <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClasses} placeholder="District" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaMapMarkerAlt className={iconClasses} /> Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputClasses} placeholder="Pincode" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaMapMarkerAlt className={iconClasses} /> State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClasses} placeholder="State" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaMapMarkerAlt className={iconClasses} /> Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange} className={inputClasses} placeholder="Country" disabled={loading} />
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'other' && (
                <motion.div key="other" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div>
                    <label className={labelClasses}><FaBirthdayCake className={iconClasses} /> Date of Birth</label>
                    <div className="grid grid-cols-3 gap-4">
                      <input type="number" name="day" value={formData.day} onChange={handleChange} className={inputClasses} placeholder="Day" disabled={loading} />
                      <input type="text" name="month" value={formData.month} onChange={handleChange} className={inputClasses} placeholder="Month" disabled={loading} />
                      <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClasses} placeholder="Year" disabled={loading} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Place of Birth</label>
                      <input type="text" name="place" value={formData.place} onChange={handleChange} className={inputClasses} placeholder="Place of birth" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Time of Birth</label>
                      <input type="text" name="time" value={formData.time} onChange={handleChange} className={inputClasses} placeholder="Time of birth" disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}><FaUser className={iconClasses} /> Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className={inputClasses} placeholder="About yourself" rows="4" disabled={loading} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Speciality</label>
                      <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} className={inputClasses} placeholder="Speciality" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Any Other Details</label>
                      <input type="text" name="anyother" value={formData.anyother} onChange={handleChange} className={inputClasses} placeholder="Other details" disabled={loading} />
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'images' && (
                <motion.div key="images" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div>
                    <label className={labelClasses}><FaPhotoVideo className={iconClasses} /> Current Images</label>
                    {formData.images && formData.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                            <img
                              src={image}
                              alt={`Profile ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-2">No images uploaded yet.</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}><FaPhotoVideo className={iconClasses} /> Add New Images (Optional)</label>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className={inputClasses} disabled={loading} />
                    <p className="text-sm text-gray-500 mt-1">You can upload up to 3 new images. Existing images will be preserved.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button onClick={() => navigate('/my-profile')} className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-800 transition-colors">
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02, boxShadow: `0 5px 15px ${COLORS.gold}50` }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="px-8 py-3 rounded-lg font-bold text-white text-lg shadow-lg" style={{ backgroundColor: COLORS.primary, backgroundImage: 'linear-gradient(to right, #046A38, #03482A)' }} disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSubmitting ? 'Updating...' : 'Saving...'}
                  </span>
                ) : (
                  'Update Profile'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default EditProfile; 