import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaChevronLeft, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import img2 from '../assets/img2.jpg';
import ForgotPasswordModal from '../components/layout/ForgotPasswordModal';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      login(res.data.token);

      toast.success('Login successful!', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#046A38',
        },
      });

      navigate('/profiles');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMsg, {
        style: {
          borderRadius: '10px',
          background: '#fff',
          color: '#d32f2f',
        },
      });
    } finally {
      setLoading(false);
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
                src={img2}
                alt="Community"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className="text-xl font-playfair font-semibold text-primary mb-4">
                About Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We are a heartfelt community dedicated to bringing people together to form genuine connections. Our platform is built on trust, respect, and the belief that everyone deserves to find meaningful relationships.
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
              Login to Your Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-right mt-2">
              <button
                type="button"
                className="text-primary hover:underline text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </p>
          </motion.div>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </motion.div>
  );
}

export default Login;