import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaUserCheck, FaLock, FaHeart, FaLeaf } from 'react-icons/fa'

function FeaturesSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  const features = t('home.features.items', { returnObjects: true })
  
  const featureIcons = [
    <FaUserCheck size={36} className="text-gold" />,
    <FaLock size={36} className="text-gold" />,
    <FaHeart size={36} className="text-gold" />,
    <FaLeaf size={36} className="text-gold" />
  ]
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }
  
  return (
    <section className="py-20 bg-cream" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">
            {t('home.features.title')}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto"></div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="glass-card p-8 text-center group hover:border-gold hover:border-opacity-50"
              variants={itemVariants}
            >
              <motion.div 
                className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                {featureIcons[index]}
              </motion.div>
              <h3 className="text-xl font-playfair font-bold text-primary mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection