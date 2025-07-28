import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Logo from '../../assets/logo_banner.jpeg';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const checkProfile = async () => {
      if (user && token) {
        try {
          const response = await axios.get(`${VITE_API_BASE_URL}/api/profiles/profile/completion`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setIsProfileComplete(response.data.isComplete);
        } catch (error) {
          console.error('Error checking profile completion:', error);
          setIsProfileComplete(true);
        }
      }
    };
    checkProfile();
  }, [user, token, VITE_API_BASE_URL]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', {
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#046A38',
      },
    });
  };

  const handleProfileClick = () => navigate('/my-profile');

  const headerVariants = {
    top: {
      backgroundColor: 'rgba(249, 244, 239, 0)',
      backdropFilter: 'blur(0px)',
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      borderBottom: '1px solid rgba(212, 175, 55, 0)',
    },
    scrolled: {
      backgroundColor: 'rgba(249, 244, 239, 0.9)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
    },
  };

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    ...(user && user.role !== 'admin' ? [{ name: t('nav.profiles'), path: '/profiles' }] : []),
    { name: t('nav.contact'), path: '/contact' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      initial="scrolled"
      animate={isScrolled ? 'scrolled' : 'scrolled'}
      variants={headerVariants}
    >
      {/* Banner Section */}
      <div className="w-full bg-cream-light/95 backdrop-blur-md shadow-md">
        <div className=" mx-auto">
          <img
            src={Logo}
            alt="Logo Banner"
            className="w-full h-auto max-h-20 md:max-h-24 "
          />
        </div>
      </div>

      {/* Navigation Section */}
      <div className="container mx-auto px-4 md:px-6 pt-12 sm:pt-12 md:pt-4 pb-4 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary gold-highlight'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && user.role !== 'admin' && !isProfileComplete && (
              <Link
                to="/complete-profile"
                className={`font-medium transition-colors duration-300 ${
                  location.pathname === '/complete-profile'
                    ? 'text-primary gold-highlight'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Complete Profile
              </Link>
            )}

            {user && user.role !== 'admin' && isProfileComplete && (
              <button
                onClick={handleProfileClick}
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                aria-label="View profile"
              >
                <FiUser className="text-primary" size={20} />
              </button>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="btn-primary flex items-center"
              >
                <FiLogOut className="mr-2" />
                {t('nav.logout')}
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-primary"> 
                  Login
                </Link>
                <Link to="/register" className="btn-primary"> 
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mt-[-35px] md:hidden text-2xl text-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.nav
        className={`md:hidden bg-white backdrop-blur-md shadow-lg absolute left-0 right-0 overflow-hidden z-40`}
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2 font-medium text-center border-b border-gold/10 ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && user.role !== 'admin' && !isProfileComplete && (
            <Link
              to="/complete-profile"
              className={`py-2 font-medium text-center border-b border-gold/10 ${
                location.pathname === '/complete-profile'
                  ? 'text-primary'
                  : 'text-gray-700'
              }`}
            >
              Complete Profile
            </Link>
          )}

          {user && user.role !== 'admin' && isProfileComplete && (
            <button
              onClick={handleProfileClick}
              className="py-2 font-medium text-center border-b border-gold/10 text-gray-700"
            >
              My Profile
            </button>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="btn-primary text-center mt-4 flex items-center justify-center"
            >
              <FiLogOut className="mr-2" />
              {t('nav.logout')}
            </button>
          ) : (
            <>
                <Link to="/login"  className="btn-primary text-center mt-4"> 
                  Login
                </Link>
                <Link to="/register"  className="btn-primary text-center mt-4"> 
                  Register
                </Link>
              </>
          )}
        </div>
      </motion.nav>
    </motion.header>
  );
}

export default Header;