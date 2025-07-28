import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaGlobe } from 'react-icons/fa'
import { CreditCard } from 'lucide-react'
import PaymentModal from '../shared/PaymentModal'

function FloatingButtons() {
  const { i18n } = useTranslation()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const toggleLanguageOpen = () => setIsLanguageOpen(!isLanguageOpen)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setIsLanguageOpen(false)
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' }
  ]

  return (
    <>
      <motion.div 
        className="fixed right-6 bottom-6 z-40 flex flex-col gap-3"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        {/* Payment Button */}
        <motion.button
          className="h-12 w-12 rounded-full bg-black shadow-lg flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
          onClick={() => setIsPaymentModalOpen(true)}
          whileTap={{ scale: 0.9 }}
          aria-label="Payment"
        >
          <CreditCard className="text-xl text-white" />
        </motion.button>

        {/* Language Switcher */}
        <motion.button
          className="h-12 w-12 rounded-full bg-primary shadow-lg flex items-center justify-center text-white"
          onClick={toggleLanguageOpen}
          whileTap={{ scale: 0.9 }}
          aria-label="Language switcher"
        >
          <FaGlobe className="text-xl text-pink-500" />
        </motion.button>

        {/* Language Dropdown */}
        {isLanguageOpen && (
          <motion.div 
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden w-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                  i18n.language === lang.code 
                    ? 'bg-cream text-primary font-medium' 
                    : 'bg-white text-gray-700 hover:bg-cream-light'
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </>
  )
}

export default FloatingButtons 