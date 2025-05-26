import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1600)', }}
      >
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>
      
      {/* Decorative Elements */}
      <motion.div 
        className="absolute left-10 top-1/4 w-48 h-48 bg-gold/10 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 0.5 }}
      ></motion.div>
      <motion.div 
        className="absolute right-10 bottom-1/4 w-64 h-64 bg-saffron/10 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, delay: 0.8 }}
      ></motion.div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('home.hero.title')}
          </motion.h1>
          <motion.h2 
            className="text-2xl md:text-3xl font-playfair italic text-gold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('home.hero.subtitle')}
          </motion.h2>
          <motion.p 
            className="text-lg text-cream-light mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('home.hero.description')}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link 
              to="/profiles" 
              className="btn-primary"
            >
              {t('home.hero.cta.browse')}
            </Link>
            <Link 
              to="/profiles" 
              className="btn-secondary"
            >
              {t('home.hero.cta.register')}
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="text-cream text-sm font-medium mb-2">Scroll Down</div>
        <motion.div 
          className="w-6 h-10 rounded-full border-2 border-cream/50 flex justify-center p-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.div className="w-2 h-2 bg-cream rounded-full"></motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection