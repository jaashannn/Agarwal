import { motion } from 'framer-motion';
import Logo from './Logo';

function Navbar() {
  return (
    <motion.div
      className="w-full bg-cream-light/95 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-6">
        <img
          src="Logo" // Replace with your logo path
          alt="Logo"
          className="w-full h-auto max-h-24 object-contain"
        />
      </div>
    </motion.div>
  );
}

export default Navbar;