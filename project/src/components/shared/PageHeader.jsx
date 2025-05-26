import { motion } from 'framer-motion'

function PageHeader({ title, subtitle, backgroundImage }) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${backgroundImage})`, }}
      >
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-lg text-cream-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Decorative Shapes */}
      <motion.div 
        className="absolute left-10 top-1/4 w-32 h-32 bg-gold/10 rounded-full blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.5 }}
      ></motion.div>
      <motion.div 
        className="absolute right-10 bottom-1/4 w-48 h-48 bg-gold/10 rounded-full blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.8 }}
      ></motion.div>
    </section>
  )
}

export default PageHeader