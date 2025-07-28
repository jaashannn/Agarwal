import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight, FaHeart, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaCrown } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, token]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === profile.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? profile.images.length - 1 : prevIndex - 1
    );
  };

  const handleContact = async () => {
    try {
      await axios.post(
        `${API_URL}/api/messages`,
        {
          from: user.email,
          to: profile.user.email,
          content: `Contact request from ${user.name} to ${profile.user.name}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Contact request sent to ${profile.user.name}!`);
    } catch (error) {
      toast.error('Failed to send contact request');
    }
  };

  const handleMessage = async () => {
    try {
      await axios.post(
        `${API_URL}/api/messages`,
        {
          from: user.email,
          to: profile.user.email,
          content: `Message from ${user.name} to ${profile.user.name}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Message sent to ${profile.user.name}!`);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="rounded-full bg-primary/20 h-24 w-24 mx-auto mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The profile you are looking for does not exist or has been removed.</p>
          <Link to="/profiles" className="btn-primary">Browse Other Profiles</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-cream pt-20 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <Link to="/profiles" className="inline-flex items-center text-primary font-medium mb-8 hover:underline">
          <FaChevronLeft className="mr-2" /> Back to Profiles
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={profile.images[currentImageIndex] || 'https://via.placeholder.com/300x400'}
                    alt={`${profile.user.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                {profile.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white/70 rounded-full flex items-center justify-center text-primary hover:bg-white"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white/70 rounded-full flex items-center justify-center text-primary hover:bg-white"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {profile.images.map((_, index) => (
                        <button
                          key={index}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? 'w-8 bg-gold' : 'w-2 bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {profile.user.premium && (
                    <div className="bg-gold text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
                      <FaCrown className="mr-1" /> Premium
                    </div>
                  )}
                  {profile.user.verified && (
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
                      <FaCheckCircle className="mr-1" /> Verified
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <button
                  className="flex items-center text-rose-500 font-medium"
                  onClick={() => toast.success('Added to favorites!')}
                >
                  <FaHeart className="mr-2" /> Add to Favorites
                </button>
                <div className="text-gray-500 text-sm">
                  {currentImageIndex + 1} / {profile.images.length}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <motion.div
              className="glass-card p-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-playfair font-bold text-primary mb-2">{profile.user.name}</h1>
              <div className="flex flex-wrap items-center text-gray-600 mb-6">
                <span className="mr-4">{profile.age} Years</span>
                <span className="mr-4">{`${profile.hfeet}'${profile.hinch}"`}</span>
                <span>{profile.city}</span>
              </div>
              {profile.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-3">About Me</h2>
                  <p className="text-gray-700 leading-relaxed">{profile.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Personal Details</h2>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Profile For</td>
                        <td className="py-3 text-gray-800">{profile.profilefor || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Marital Status</td>
                        <td className="py-3 text-gray-800">{profile.marital || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Gotra</td>
                        <td className="py-3 text-gray-800">{profile.gotra || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Education</td>
                        <td className="py-3 text-gray-800">{profile.education || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Occupation</td>
                        <td className="py-3 text-gray-800">{profile.occupation || 'Not specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Physical Details</h2>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Height</td>
                        <td className="py-3 text-gray-800">{`${profile.hfeet}'${profile.hinch}"` || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Weight</td>
                        <td className="py-3 text-gray-800">{profile.weight ? `${profile.weight} kg` : 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Body Type</td>
                        <td className="py-3 text-gray-800">{profile.body || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Complexion</td>
                        <td className="py-3 text-gray-800">{profile.complexion || 'Not specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Family Details</h2>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Father's Name</td>
                        <td className="py-3 text-gray-800">{profile.fname || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Father's Occupation</td>
                        <td className="py-3 text-gray-800">{profile.foccupation || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Mother's Name</td>
                        <td className="py-3 text-gray-800">{profile.mname || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Mother's Occupation</td>
                        <td className="py-3 text-gray-800">{profile.moccupation || 'Not specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-4">Lifestyle Details</h2>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Smoking</td>
                        <td className="py-3 text-gray-800">{profile.smoking || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Drinking</td>
                        <td className="py-3 text-gray-800">{profile.drinking || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Food Preference</td>
                        <td className="py-3 text-gray-800">{profile.food || 'Not specified'}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Manglik</td>
                        <td className="py-3 text-gray-800">{profile.manglik || 'Not specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="btn-primary flex-1 flex items-center justify-center"
                  onClick={handleContact}
                >
                  <FaPhoneAlt className="mr-2" /> Request Contact
                </button>
                <button
                  className="btn-secondary flex-1 flex items-center justify-center"
                  onClick={handleMessage}
                >
                  <FaEnvelope className="mr-2" /> Send Message
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileDetail;