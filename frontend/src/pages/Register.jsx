import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  FaChevronLeft, FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaUsers, FaGenderless, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import img1 from '../assets/img1.jpg';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    mobile: '',
    creatorRole: 'self',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#d32f2f',
        },
      });
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData; // Exclude confirmPassword
      const res = await axios.post(`${API_URL}/api/auth/register`, dataToSend);

      setLoading(false);
      toast.success('Registration successful!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#046A38',
        },
      });
      navigate('/login');
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || 'Registration failed',
        {
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#d32f2f',
          },
        }
      );
    }
  };

  return (
    <motion.div
      className="bg-cream min-h-screen pt-20 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-primary font-medium mb-8 hover:underline">
          <FaChevronLeft className="mr-2" /> Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <motion.div 
            className="glass-card p-8 lg:w-1/2 flex flex-col justify-between"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <img 
                src={img1}
                alt="Community"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className="text-xl font-playfair font-semibold text-primary mb-4">
                About Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We are a heartfelt community dedicated to bringing people together to form genuine connections. Our platform is built on trust, respect, and the belief that everyone deserves to find meaningful relationships. With a focus on authenticity, we help individuals from all walks of life create bonds that last a lifetime. Join us to be part of something truly special.
              </p>
            </div>
          </motion.div>

          <div className="hidden lg:block w-px bg-gold/20"></div>

          <motion.div 
            className="glass-card p-8 lg:w-1/2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-3xl font-playfair font-bold text-primary mb-6 text-center">
              Create Your Account
            </h1>

            <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded text-center">
              <strong>Note:</strong> A one-time joining fee of ₹500 applies to male users (INR). Registration is free for female users.
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaUser className="mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaEnvelope className="mr-2" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaGenderless className="mr-2" /> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={loading}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaPhoneAlt className="mr-2" /> Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your mobile number"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaUsers className="mr-2" /> Who is creating this account?
                </label>
                <select
                  name="creatorRole"
                  value={formData.creatorRole}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={loading}
                >
                  <option value="self">Myself</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="friend">Friend</option>
                </select>
              </div>

              <div className="relative">
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaLock className="mr-2" /> Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <label className="flex items-center text-gray-600 font-medium mb-2">
                  <FaLock className="mr-2" /> Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Register;