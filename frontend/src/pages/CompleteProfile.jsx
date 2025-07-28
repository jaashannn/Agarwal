import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  FaUser, FaMapMarkerAlt, FaBriefcase, FaGraduationCap,
  FaPray, FaRulerVertical, FaUsers, FaPhotoVideo,
  FaCreditCard, FaQrcode, FaInfoCircle, FaCheckCircle,
  FaArrowRight, FaArrowLeft, FaSmoking, FaWineGlass,
  FaBirthdayCake, FaHome, FaHeart
} from 'react-icons/fa';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Scanner from '../assets/scanner.jpg';
import PaymentModal from '../components/shared/PaymentModal';

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

function CompleteYourProfile() {
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
    birthDate: '',
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
    images: [],
    isNRI: false,
    nriCountry: '',
    nriStatus: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isMale = user?.gender?.toLowerCase() === 'male';

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <FaUser /> },
    { id: 'physical', label: 'Physical', icon: <FaRulerVertical /> },
    { id: 'family', label: 'Family', icon: <FaUsers /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <FaHeart /> },
    { id: 'contact', label: 'Contact', icon: <FaHome /> },
    { id: 'other', label: 'Other', icon: <FaInfoCircle /> },
    { id: 'images', label: 'Images', icon: <FaPhotoVideo /> },
    ...(isMale ? [{ id: 'payment', label: 'Payment', icon: <FaCreditCard /> }] : [])
  ];

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
    if (activeTab === 'images' && formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
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
    const inputValue = e.target.value;
    
    // Split by commas and clean up each item, also handle spaces as separators
    const values = inputValue
      .split(/[,\s]+/) // Split by comma or whitespace
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    setFormData(prev => ({ ...prev, [field]: values }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleArrayKeyDown = (e, field) => {
    // Allow comma and space keys to be typed
    if (e.key === ',' || e.key === ' ') {
      e.preventDefault();
      const input = e.target;
      const cursorPosition = input.selectionStart;
      const value = input.value;
      const separator = e.key === ',' ? ', ' : ' '; // Add space after comma for better UX
      const newValue = value.slice(0, cursorPosition) + separator + value.slice(cursorPosition);
      input.value = newValue;
      input.setSelectionRange(cursorPosition + separator.length, cursorPosition + separator.length);
      
      // Trigger the change event
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFormData(prev => ({ ...prev, images: files }));
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (indexToRemove) => {
    const newImages = formData.images.filter((_, index) => index !== indexToRemove);
    setFormData(prev => ({ ...prev, images: newImages }));
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
        value.forEach(file => data.append('images', file));
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
      toast.success('Profile saved successfully!');
      navigate('/profiles');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full p-3.5 rounded-lg bg-cream border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 text-gray-700 placeholder-gray-400";
  const labelClasses = "flex items-center text-gray-700 font-medium mb-2";
  const errorClasses = "text-red-500 text-sm mt-1 flex items-center";
  const iconClasses = "mr-2 text-gold";

  return (
    <motion.div className="min-h-screen pt-16 pb-16 px-4 bg-cream" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary font-medium mb-6 hover:text-gold">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gold/20">
          <div className="bg-gradient-to-r from-primary to-darkGreen p-6 text-center">
            <motion.h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</motion.h1>
            <p className="text-gold/90 max-w-lg mx-auto">Help us find your perfect match by providing detailed information</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Please fill all details carefully. Some options may not be editable after submission.
                </p>
              </div>
            </div>
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
                        <option value="Friend">Friend</option>
                        <option value="Nephew">Nephew</option>
                        <option value="Niece">Niece</option>
                        <option value="Other">Other</option>
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
                      <input type="text" name="hobbies" value={formData.hobbies.join(', ')} onChange={(e) => handleArrayChange(e, 'hobbies')} onKeyDown={(e) => handleArrayKeyDown(e, 'hobbies')} className={inputClasses} placeholder="e.g., Reading, Music, Travel, Cooking (separate with commas or spaces)" disabled={loading} />
                      <p className="text-sm text-gray-500 mt-1">Enter hobbies separated by commas or spaces</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}><FaUser className={iconClasses} /> Languages Known</label>
                    <input type="text" name="language" value={formData.language.join(', ')} onChange={(e) => handleArrayChange(e, 'language')} onKeyDown={(e) => handleArrayKeyDown(e, 'language')} className={inputClasses} placeholder="e.g., Hindi, English, Punjabi, Gujarati (separate with commas or spaces)" disabled={loading} />
                    <p className="text-sm text-gray-500 mt-1">Enter languages separated by commas or spaces</p>
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
                      <input type="number" name="bmarried" value={formData.bmarried} onChange={handleChange} className={inputClasses} placeholder="Number of married brothers" min="0" max={formData.bno || 0} disabled={loading} />
                      {formData.bno && formData.bmarried > formData.bno && (
                        <p className="text-red-500 text-sm mt-1">Married brothers cannot exceed total brothers</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClasses}><FaUsers className={iconClasses} /> Number of Sisters</label>
                      <input type="number" name="sno" value={formData.sno} onChange={handleChange} className={inputClasses} placeholder="Number of sisters" disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}><FaUsers className={iconClasses} /> Sisters Married</label>
                    <input type="number" name="smarried" value={formData.smarried} onChange={handleChange} className={inputClasses} placeholder="Number of married sisters" min="0" max={formData.sno || 0} disabled={loading} />
                    {formData.sno && formData.smarried > formData.sno && (
                      <p className="text-red-500 text-sm mt-1">Married sisters cannot exceed total sisters</p>
                    )}
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
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputClasses} disabled={loading} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Place of Birth</label>
                      <input type="text" name="place" value={formData.place} onChange={handleChange} className={inputClasses} placeholder="Place of birth" disabled={loading} />
                    </div>
                    <div>
                      <label className={labelClasses}><FaUser className={iconClasses} /> Time of Birth</label>
                      <input type="time" name="time" value={formData.time} onChange={handleChange} className={inputClasses} disabled={loading} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}><FaUser className={iconClasses} /> Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className={inputClasses} placeholder="About yourself" rows="4" disabled={loading} />
                  </div>
                  
                  {/* NRI Section */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-bold text-lg text-blue-800 mb-4">NRI Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isNRI"
                            checked={formData.isNRI}
                            onChange={(e) => setFormData(prev => ({ ...prev, isNRI: e.target.checked }))}
                            className="mr-2"
                            disabled={loading}
                          />
                          <span className="text-gray-700 font-medium">NRI (Non-Resident Indian)</span>
                        </label>
                      </div>
                      {formData.isNRI && (
                        <>
                          <div>
                            <label className={labelClasses}>Country</label>
                            <input type="text" name="nriCountry" value={formData.nriCountry} onChange={handleChange} className={inputClasses} placeholder="Country of residence" disabled={loading} />
                          </div>
                          <div>
                            <label className={labelClasses}>Status</label>
                            <select name="nriStatus" value={formData.nriStatus} onChange={handleChange} className={inputClasses} disabled={loading}>
                              <option value="">Select Status</option>
                              <option value="PR">PR (Permanent Resident)</option>
                              <option value="Work Permit">Work Permit</option>
                              <option value="Citizen">Citizen</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
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
                    <label className={labelClasses}><FaPhotoVideo className={iconClasses} /> Upload Images (JPEG/PNG, max 3) *</label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gold rounded-xl p-8 text-center bg-cream/50 relative">
                      <input
                        type="file"
                        name="images"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept="image/jpeg,image/png"
                        multiple
                        required
                        disabled={loading}
                      />
                      <FaPhotoVideo className="text-4xl mb-3 z-0" style={{ color: COLORS.gold }} />
                      <p className="font-medium text-gray-700 mb-1 z-0">Click to upload images</p>
                      <p className="text-sm text-gray-500 z-0">Upload at least 1 image (max 3)</p>
                      <p className="text-xs text-gray-400 z-0 mt-2">Hover over images to remove them</p>
                    </div>
                    {errors.images && <p className={errorClasses}><FaInfoCircle className="mr-1" /> {errors.images}</p>}
                    {formData.images.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-700 mb-3">Preview:</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative group">
                              <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-gold/30 shadow-sm" />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-white text-sm font-medium">Image {index + 1}</span>
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                              {/* Cross button in top-right corner */}
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                title="Remove image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              {isMale && activeTab === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="bg-gold/10 rounded-xl p-6 mb-6 border border-gold/30">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg" style={{ color: COLORS.darkGreen }}>Registration Fee: ₹500</h3>
                      <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">Required</span>
                    </div>
                    <p className="text-gray-700 mt-2">To complete your profile registration, please make a secure payment.</p>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="flex items-center justify-center mx-auto px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
                    >
                      <FaCreditCard className="mr-3" />
                      View Payment Details
                    </button>
                    <p className="text-sm text-gray-600 mt-3">
                      Click above to view UPI QR code and bank transfer details
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-10 flex justify-between items-center">
              <button type="button" onClick={() => navigate('/')} className="flex items-center px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                <FaArrowLeft className="mr-2" /> Back to Home
              </button>
              
              <div className="flex items-center space-x-4">
                {tabs.findIndex(tab => tab.id === activeTab) > 0 && (
                  <button type="button" onClick={() => handleTabChange(tabs[tabs.findIndex(tab => tab.id === activeTab) - 1].id)} className="flex items-center px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <FaArrowLeft className="mr-2" /> Previous
                  </button>
                )}
                
                {tabs.findIndex(tab => tab.id === activeTab) < tabs.length - 1 ? (
                  <button type="button" onClick={() => handleTabChange(tabs[tabs.findIndex(tab => tab.id === activeTab) + 1].id)} className="flex items-center px-6 py-3 rounded-lg font-medium bg-primary text-black hover:bg-darkGreen">
                    Next <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <motion.button whileHover={{ scale: 1.02, boxShadow: `0 5px 15px ${COLORS.gold}50` }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="px-8 py-3 rounded-lg font-bold text-white text-lg shadow-lg" style={{ backgroundColor: COLORS.primary, backgroundImage: 'linear-gradient(to right, #046A38, #03482A)' }} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isSubmitting ? 'Processing...' : 'Saving...'}
                      </span>
                    ) : (
                      `Save Profile ${isMale ? '& Make Payment' : ''}`
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />


    </motion.div>
  );
}

export default CompleteYourProfile;