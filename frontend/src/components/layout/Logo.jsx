import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoBanner from '../../assets/logo_banner.jpeg' // Adjust the path if needed

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img 
          src={logoBanner}
          alt="Agarwal Matrimonial Logo"
          className="h-16 w-auto object-contain" // You can increase h-16 if needed
        />
      </motion.div>
    </Link>
  )
}

export default Logo
