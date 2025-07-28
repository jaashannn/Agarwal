import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/my-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile images:', response.data.images); // Debug: Check image URLs
        setProfile(response.data);
        setEditData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const inputValue = e.target.value;
    const values = inputValue
      .split(/[,\s]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    setEditData(prev => ({ ...prev, [field]: values }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/update`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label, field, value, type = 'text', options = null) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            name={field}
            value={editData[field] || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else if (type === 'array') {
        return (
          <input
            type="text"
            name={field}
            value={editData[field]?.join(', ') || ''}
            onChange={(e) => handleArrayChange(e, field)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={`Enter ${label.toLowerCase()} separated by commas`}
          />
        );
      } else {
        return (
          <input
            type={type}
            name={field}
            value={editData[field] || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );
      }
    } else {
      return <p className="font-medium">{value || 'Not specified'}</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your profile information.</p>
          <button onClick={() => navigate('/complete-profile')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-primary hover:text-primary-dark">
            <FiArrowLeft className="mr-2" /> Back
          </button>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiEdit2 className="mr-2" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <h1 className="text-2xl font-bold">My Profile</h1>
            {isEditing && (
              <p className="text-sm mt-2 opacity-90">Edit mode - You can modify your profile information below</p>
            )}
          </div>
          <div className="p-6">
            {profile.images?.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`Profile ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg'; // Fallback image
                        }}
                      />
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Note:</strong> Images cannot be edited here. Please contact support if you need to update your photos.
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
                <p className="text-gray-600">No images available. Please upload images in your profile settings.</p>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Age</p>
                  {renderField('Age', 'age', profile.age, 'number')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Profile For</p>
                  {renderField('Profile For', 'profilefor', profile.profilefor, 'select', ['Self', 'Son', 'Daughter'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Marital Status</p>
                  {renderField('Marital Status', 'marital', profile.marital, 'select', ['Never Married', 'Divorced', 'Widowed', 'Separated'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gotra</p>
                  {renderField('Gotra', 'gotra', profile.gotra, 'select', ['Bansal', 'Goyal', 'Kuchhal', 'Kansal', 'Bindal', 'Dharan', 'Singhal', 'Jindal', 'Mittal', 'Tingal', 'Tayal', 'Mangal', 'Airan', 'Garg', 'Bhandal', 'Nangal', 'Goyan', 'Gupta', 'Sharma', 'Arora', 'Khatri'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  {renderField('Education', 'education', profile.education)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Occupation</p>
                  {renderField('Occupation', 'occupation', profile.occupation, 'select', ['Private Sector', 'Government', 'Business', 'Professional', 'Not Employed'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hobbies</p>
                  {renderField('Hobbies', 'hobbies', profile.hobbies?.join(', '), 'array')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Languages Known</p>
                  {renderField('Languages', 'language', profile.language?.join(', '), 'array')}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Physical Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Height (Feet)</p>
                  {renderField('Height Feet', 'hfeet', profile.hfeet, 'select', ['4', '5', '6', '7'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Height (Inches)</p>
                  {renderField('Height Inches', 'hinch', profile.hinch, 'select', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Weight</p>
                  {renderField('Weight', 'weight', profile.weight, 'number')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Body Type</p>
                  {renderField('Body Type', 'body', profile.body, 'select', ['Slim', 'Average', 'Athletic', 'Heavy'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Complexion</p>
                  {renderField('Complexion', 'complexion', profile.complexion, 'select', ['Fair', 'Wheatish', 'Dark', 'Medium'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Physical Status</p>
                  {renderField('Physical Status', 'physical', profile.physical, 'select', ['Normal', 'Physically Challenged'])}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Family Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Father's Name</p>
                  {renderField("Father's Name", 'fname', profile.fname)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Father's Occupation</p>
                  {renderField("Father's Occupation", 'foccupation', profile.foccupation)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mother's Name</p>
                  {renderField("Mother's Name", 'mname', profile.mname)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mother's Occupation</p>
                  {renderField("Mother's Occupation", 'moccupation', profile.moccupation)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Number of Brothers</p>
                  {renderField('Number of Brothers', 'bno', profile.bno, 'number')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Brothers Married</p>
                  {renderField('Brothers Married', 'bmarried', profile.bmarried, 'select', ['Yes', 'No'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Number of Sisters</p>
                  {renderField('Number of Sisters', 'sno', profile.sno, 'number')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sisters Married</p>
                  {renderField('Sisters Married', 'smarried', profile.smarried, 'select', ['Yes', 'No'])}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Lifestyle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Smoking</p>
                  {renderField('Smoking', 'smoking', profile.smoking, 'select', ['Yes', 'No', 'Occasionally'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Drinking</p>
                  {renderField('Drinking', 'drinking', profile.drinking, 'select', ['Yes', 'No', 'Occasionally'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Food Preference</p>
                  {renderField('Food Preference', 'food', profile.food, 'select', ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian'])}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Income</p>
                  {renderField('Income', 'income', profile.income)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Manglik</p>
                  {renderField('Manglik', 'manglik', profile.manglik, 'select', ['Yes', 'No', 'Not Sure'])}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  {renderField('Address', 'address', profile.address)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">City</p>
                  {renderField('City', 'city', profile.city)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">District</p>
                  {renderField('District', 'district', profile.district)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pincode</p>
                  {renderField('Pincode', 'pincode', profile.pincode)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">State</p>
                  {renderField('State', 'state', profile.state)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Country</p>
                  {renderField('Country', 'country', profile.country)}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth (Day)</p>
                  {renderField('Day', 'day', profile.day, 'number')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth (Month)</p>
                  {renderField('Month', 'month', profile.month)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth (Year)</p>
                  {renderField('Year', 'year', profile.year, 'number')}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Place of Birth</p>
                  {renderField('Place of Birth', 'place', profile.place)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Time of Birth</p>
                  {renderField('Time of Birth', 'time', profile.time)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Speciality</p>
                  {renderField('Speciality', 'speciality', profile.speciality)}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editData.description || ''}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">{profile.description || 'No description available'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyProfile;