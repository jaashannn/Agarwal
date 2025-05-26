import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import Logo from './Logo'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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
    }
  }

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.profiles'), path: '/profiles' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' },
  ]

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      initial="top"
      animate={isScrolled ? 'scrolled' : 'top'}
      variants={headerVariants}
    >
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
            <Link
              to="/profiles"
              className="btn-primary"
            >
              {t('home.hero.cta.register')}
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl text-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <motion.nav
        className={`md:hidden bg-cream-light/95 backdrop-blur-md shadow-lg absolute left-0 right-0 overflow-hidden z-40`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
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
          <Link
            to="/profiles"
            className="btn-primary text-center mt-4"
          >
            {t('home.hero.cta.register')}
          </Link>
        </div>
      </motion.nav>
    </motion.header>
  )
}

export default Header