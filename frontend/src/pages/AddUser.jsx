import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

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

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const initialRegister = {
  name: '',
  email: '',
  gender: '',
  mobile: '',
  creatorRole: 'self',
  password: '',
  confirmPassword: '',
};

const initialProfile = {
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
  images: [],
};

function AddUser({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [register, setRegister] = useState(initialRegister);
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  // Registration handlers
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegister((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const handleArrayChange = (e, field) => {
    const inputValue = e.target.value;
    // Only split on commas, not spaces
    const values = inputValue
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setProfile((prev) => ({ ...prev, [field]: values }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setProfile((prev) => ({ ...prev, images: files }));
    setErrors((prev) => ({ ...prev, images: '' }));
  };

  // Registration validation
  const validateRegister = () => {
    const newErrors = {};
    if (!register.name) newErrors.name = 'Name is required';
    if (!register.email) newErrors.email = 'Email is required';
    if (!register.gender) newErrors.gender = 'Gender is required';
    if (!register.mobile) newErrors.mobile = 'Mobile is required';
    if (!register.password) newErrors.password = 'Password is required';
    if (!register.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (register.password !== register.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!register.creatorRole) newErrors.creatorRole = 'Who is creating this account? is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Profile validation (minimal, admin can fill as much as needed)
  const validateProfile = () => {
    // Add required fields if needed
    return true;
  };

  // Step 1: Register user
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) {
      toast.error('Please complete all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = register;
      const res = await axios.post(`${apiUrl}/api/auth/register`, dataToSend);
      // Get new user id from response if available
      const userId = res.data?.user?._id || res.data?.userId || res.data?.id;
      setNewUserId(userId);
      setStep(2);
      toast.success('User registered! Now complete profile.');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) {
      toast.error('Please complete all required fields.');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('userId', newUserId);
    Object.entries(profile).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((file) => data.append('images', file));
      } else if (Array.isArray(value)) {
        value.forEach((item) => data.append(`${key}[]`, item));
      } else if (
        ['age', 'weight', 'bno', 'sno', 'day', 'year'].includes(key) && value !== ''
      ) {
        data.append(key, Number(value));
      } else {
        data.append(key, value);
      }
    });
    try {
      await axios.post(`${apiUrl}/api/profiles/admin-create-profile`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      toast.success('Profile completed!');
      if (onSuccess) onSuccess();
      onClose();
      setStep(1);
      setRegister(initialRegister);
      setProfile(initialProfile);
      setNewUserId('');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to complete profile');
    }
  };

  const inputClasses = 'border p-2 rounded w-full';
  const errorClasses = 'text-red-500 text-sm mt-1';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl p-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            {step === 1 ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input name="name" value={register.name} onChange={handleRegisterChange} placeholder="Name" className={inputClasses} />
                    {errors.name && <div className={errorClasses}>{errors.name}</div>}
                  </div>
                  <div>
                    <input name="email" value={register.email} onChange={handleRegisterChange} placeholder="Email" className={inputClasses} />
                    {errors.email && <div className={errorClasses}>{errors.email}</div>}
                  </div>
                  <div>
                    <select name="gender" value={register.gender} onChange={handleRegisterChange} className={inputClasses}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <div className={errorClasses}>{errors.gender}</div>}
                  </div>
                  <div>
                    <input name="mobile" value={register.mobile} onChange={handleRegisterChange} placeholder="Mobile" className={inputClasses} />
                    {errors.mobile && <div className={errorClasses}>{errors.mobile}</div>}
                  </div>
                  <div className="relative">
                    <input name="password" value={register.password} onChange={handleRegisterChange} placeholder="Password" className={inputClasses} type={showPassword ? 'text' : 'password'} />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-2 text-gray-600">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && <div className={errorClasses}>{errors.password}</div>}
                  </div>
                  <div className="relative">
                    <input name="confirmPassword" value={register.confirmPassword} onChange={handleRegisterChange} placeholder="Confirm Password" className={inputClasses} type={showConfirmPassword ? 'text' : 'password'} />
                    <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-2 text-gray-600">
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.confirmPassword && <div className={errorClasses}>{errors.confirmPassword}</div>}
                  </div>
                  <div>
                    <select name="creatorRole" value={register.creatorRole} onChange={handleRegisterChange} className={inputClasses}>
                      <option value="self">Self</option>
                      <option value="mother">Mother</option>
                      <option value="father">Father</option>
                      <option value="friend">Friend</option>
                    </select>
                    {errors.creatorRole && <div className={errorClasses}>{errors.creatorRole}</div>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg" disabled={loading}>
                    {loading ? 'Registering...' : 'Register & Next'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select name="profilefor" value={profile.profilefor} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Profile For</option>
                    <option value="Self">Self</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                  </select>
                  <select name="marital" value={profile.marital} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Marital Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                  <select name="gotra" value={profile.gotra} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Gotra</option>
                    {AGARWAL_GOTRAS.map((gotra) => (
                      <option key={gotra} value={gotra}>{gotra}</option>
                    ))}
                  </select>
                  <input name="age" value={profile.age} onChange={handleProfileChange} placeholder="Age" className={inputClasses} type="number" />
                  <input name="hobbies" value={profile.hobbies.join(', ')} onChange={e => handleArrayChange(e, 'hobbies')} placeholder="Hobbies (comma separated)" className={inputClasses} />
                  <input name="language" value={profile.language.join(', ')} onChange={e => handleArrayChange(e, 'language')} placeholder="Languages (comma separated)" className={inputClasses} />
                  <input name="city" value={profile.city} onChange={handleProfileChange} placeholder="City" className={inputClasses} />
                  <input name="district" value={profile.district} onChange={handleProfileChange} placeholder="District" className={inputClasses} />
                  <input name="pincode" value={profile.pincode} onChange={handleProfileChange} placeholder="Pincode" className={inputClasses} />
                  <input name="state" value={profile.state} onChange={handleProfileChange} placeholder="State" className={inputClasses} />
                  <input name="country" value={profile.country} onChange={handleProfileChange} placeholder="Country" className={inputClasses} />
                  <input name="education" value={profile.education} onChange={handleProfileChange} placeholder="Education" className={inputClasses} />
                  <select name="occupation" value={profile.occupation} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Occupation</option>
                    {OCCUPATION_TYPES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <input name="employed" value={profile.employed} onChange={handleProfileChange} placeholder="Employed In" className={inputClasses} />
                  <input name="income" value={profile.income} onChange={handleProfileChange} placeholder="Income" className={inputClasses} />
                  <select name="food" value={profile.food} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Food Preference</option>
                    {FOOD_PREFERENCES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <select name="smoking" value={profile.smoking} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Smoking</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Occasionally">Occasionally</option>
                  </select>
                  <select name="drinking" value={profile.drinking} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Drinking</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Occasionally">Occasionally</option>
                  </select>
                  <select name="hfeet" value={profile.hfeet} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Height (feet)</option>
                    {HEIGHT_FEET.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <select name="hinch" value={profile.hinch} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Height (inches)</option>
                    {HEIGHT_INCHES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                  <input name="weight" value={profile.weight} onChange={handleProfileChange} placeholder="Weight" className={inputClasses} type="number" />
                  <select name="body" value={profile.body} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Body Type</option>
                    {BODY_TYPES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <select name="complexion" value={profile.complexion} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Complexion</option>
                    {COMPLEXIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select name="physical" value={profile.physical} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Physical Status</option>
                    {PHYSICAL_STATUSES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input name="fname" value={profile.fname} onChange={handleProfileChange} placeholder="Father's Name" className={inputClasses} />
                  <input name="foccupation" value={profile.foccupation} onChange={handleProfileChange} placeholder="Father's Occupation" className={inputClasses} />
                  <input name="mname" value={profile.mname} onChange={handleProfileChange} placeholder="Mother's Name" className={inputClasses} />
                  <input name="moccupation" value={profile.moccupation} onChange={handleProfileChange} placeholder="Mother's Occupation" className={inputClasses} />
                  <select name="type" value={profile.type} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Family Type</option>
                    {FAMILY_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <input name="status" value={profile.status} onChange={handleProfileChange} placeholder="Family Status" className={inputClasses} />
                  <input name="bno" value={profile.bno} onChange={handleProfileChange} placeholder="Number of Brothers" className={inputClasses} type="number" />
                  <select name="bmarried" value={profile.bmarried} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Brothers Married</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <input name="bwhere" value={profile.bwhere} onChange={handleProfileChange} placeholder="Brothers' Location" className={inputClasses} />
                  <input name="sno" value={profile.sno} onChange={handleProfileChange} placeholder="Number of Sisters" className={inputClasses} type="number" />
                  <select name="smarried" value={profile.smarried} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Sisters Married</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <input name="swhere" value={profile.swhere} onChange={handleProfileChange} placeholder="Sisters' Location" className={inputClasses} />
                  <input name="spouse" value={profile.spouse} onChange={handleProfileChange} placeholder="Spouse Preference" className={inputClasses} />
                  <input name="address" value={profile.address} onChange={handleProfileChange} placeholder="Address" className={inputClasses} />
                  <select name="region" value={profile.region} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Region</option>
                    {REGION_TYPES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input name="speciality" value={profile.speciality} onChange={handleProfileChange} placeholder="Speciality" className={inputClasses} />
                  <input name="description" value={profile.description} onChange={handleProfileChange} placeholder="Description" className={inputClasses} />
                  <input name="day" value={profile.day} onChange={handleProfileChange} placeholder="Day of Birth" className={inputClasses} type="number" />
                  <input name="month" value={profile.month} onChange={handleProfileChange} placeholder="Month of Birth" className={inputClasses} />
                  <input name="year" value={profile.year} onChange={handleProfileChange} placeholder="Year of Birth" className={inputClasses} type="number" />
                  <input name="place" value={profile.place} onChange={handleProfileChange} placeholder="Place of Birth" className={inputClasses} />
                  <input name="time" value={profile.time} onChange={handleProfileChange} placeholder="Time of Birth" className={inputClasses} />
                  <input name="daybirth" value={profile.daybirth} onChange={handleProfileChange} placeholder="Day of Birth (Day)" className={inputClasses} />
                  <select name="manglik" value={profile.manglik} onChange={handleProfileChange} className={inputClasses}>
                    <option value="">Manglik</option>
                    {MANGLIK_STATUSES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input name="property" value={profile.property} onChange={handleProfileChange} placeholder="Property Details" className={inputClasses} />
                  <input name="anyother" value={profile.anyother} onChange={handleProfileChange} placeholder="Any Other Details" className={inputClasses} />
                </div>
                {/* Image upload */}
                <div>
                  <label className="block font-medium mb-2">Upload Images (JPEG/PNG, max 3)</label>
                  <input
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png"
                    multiple
                    className={inputClasses}
                  />
                  {errors.images && <div className={errorClasses}>{errors.images}</div>}
                  {profile.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {profile.images.map((file, idx) => (
                        <img key={idx} src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2">Back</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddUser; 