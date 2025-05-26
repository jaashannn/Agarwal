import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-gold font-playfair font-bold text-xl">A</span>
        </div>
        <div className="ml-2">
          <h1 className="text-primary text-lg font-playfair font-bold leading-tight">
            Agarwal <span className="text-gold">Matrimonial</span>
            <span className="block text-sm font-medium text-saffron">Punjab</span>
          </h1>
        </div>
      </motion.div>
    </Link>
  )
}

export default Logo