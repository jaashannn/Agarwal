import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaTimes,
  FaImage, FaUpload, FaSave, FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
console.log('API URL:', apiUrl);

function Ad() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: ['popup'],
    pages: ['home']
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${apiUrl}/api/ads/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(response.data);
    } catch (error) {
      showErrorToast('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      style: {
        borderRadius: '12px',
        background: '#f0fdf4',
        color: '#15803d',
        border: '1px solid #bbf7d0',
      },
      iconTheme: {
        primary: '#16a34a',
        secondary: '#fff',
      }
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      style: {
        borderRadius: '12px',
        background: '#fef2f2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
      },
      iconTheme: {
        primary: '#dc2626',
        secondary: '#fff',
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('pages', JSON.stringify(formData.pages));
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      console.log('Submitting ad with URL:', `${apiUrl}/api/ads`);
      console.log('Form data:', formDataToSend);
      console.log('Token:', token);
      
      if (editingAd) {
        await axios.put(`${apiUrl}/api/ads/${editingAd._id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        showSuccessToast('Ad updated successfully');
      } else {
        const response = await axios.post(`${apiUrl}/api/ads`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Response:', response.data);
        showSuccessToast('Ad created successfully');
      }
      
      resetForm();
      fetchAds();
    } catch (error) {
      console.error('Error creating ad:', error);
      console.error('Error response:', error.response);
      showErrorToast(error.response?.data?.error || 'Failed to save ad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      position: Array.isArray(ad.position) ? ad.position : [ad.position],
      pages: ad.pages
    });
    setImagePreview(ad.image);
    setSelectedImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/api/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(ads.filter(ad => ad._id !== id));
      showSuccessToast('Ad deleted successfully');
    } catch (error) {
      showErrorToast(error.response?.data?.error || 'Failed to delete ad');
    }
  };

  const handleToggleStatus = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${apiUrl}/api/ads/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(ads.map(ad => ad._id === id ? response.data.ad : ad));
      showSuccessToast(response.data.message);
    } catch (error) {
      showErrorToast(error.response?.data?.error || 'Failed to toggle ad status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      position: ['popup'],
      pages: ['home']
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingAd(null);
    setShowForm(false);
  };

  const handlePageChange = (page) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.includes(page)
        ? prev.pages.filter(p => p !== page)
        : [...prev.pages, page]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full mx-auto text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Ads</h2>
          <p className="text-gray-500">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft size={18} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Ad Management</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Ad
          </button>
        </div>

        {/* Ad Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAd ? 'Edit Ad' : 'Create New Ad'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter ad title"
                        maxLength={100}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        rows={4}
                        placeholder="Enter ad description"
                        maxLength={500}
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <div className="space-y-2">
                        {['popup', 'bottom'].map(position => (
                          <label key={position} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.position.includes(position)}
                              onChange={() => {
                                const newPositions = formData.position.includes(position)
                                  ? formData.position.filter(p => p !== position)
                                  : [...formData.position, position];
                                setFormData({ ...formData, position: newPositions });
                              }}
                              className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{position}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Show on Pages
                      </label>
                      <div className="space-y-2">
                        {['home', 'about', 'contact'].map(page => (
                          <label key={page} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.pages.includes(page)}
                              onChange={() => handlePageChange(page)}
                              className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{page}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image *
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaUpload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              required={!editingAd}
                            />
                          </label>
                        </div>
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          isSubmitting 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingAd ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            {editingAd ? 'Update Ad' : 'Create Ad'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ads List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">All Ads</h2>
          </div>

          {ads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {ads.map(ad => (
                <motion.div
                  key={ad._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/80x80')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{ad.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{ad.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {ad.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {Array.isArray(ad.position) ? ad.position.join(', ') : ad.position}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Pages: {ad.pages.join(', ')}</span>
                        <span>Created: {new Date(ad.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(ad._id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title={ad.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {ad.isActive ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaImage className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No ads found</h3>
              <p className="text-gray-500">Create your first ad to get started</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Ad; 