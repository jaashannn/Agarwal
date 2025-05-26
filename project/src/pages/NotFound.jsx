import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
  return (
    <motion.div
      className="min-h-screen bg-cream flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center glass-card p-10">
          <motion.h1
            className="text-6xl font-playfair font-bold text-primary mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            404
          </motion.h1>
          <motion.div
            className="h-1 w-16 bg-gold mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
          <motion.h2
            className="text-2xl font-playfair font-semibold text-primary mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Page Not Found
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/" className="btn-primary">
              Return to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default NotFound