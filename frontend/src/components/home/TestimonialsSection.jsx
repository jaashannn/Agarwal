import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function TestimonialsSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const testimonials = t('home.testimonials.testimonials', { returnObjects: true })
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }
  
  return (
    <section 
      className="py-20 bg-primary text-white relative overflow-hidden"
      ref={ref}
    >
      {/* Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-gold"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full border-4 border-gold"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full border-2 border-gold"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gold mb-4">
            {t('home.testimonials.title')}
          </h2>
          <div className="w-20 h-1 bg-gold/50 mx-auto"></div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="glass-card bg-white/5 p-8 md:p-10 text-center"
            >
              <FaQuoteLeft className="text-gold text-4xl mx-auto mb-6" />
              <p className="text-xl md:text-2xl font-playfair italic mb-8">
                "{testimonials[currentIndex].quote}"
              </p>
              <div className="flex flex-col items-center">
                <h4 className="text-gold text-lg font-medium mb-1">
                  {testimonials[currentIndex].author}
                </h4>
                <p className="text-cream-light">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </motion.div>
            
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-4">
              <motion.button
                onClick={prevTestimonial}
                className="h-10 w-10 bg-primary border border-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-primary-dark transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Previous testimonial"
              >
                <FaChevronLeft />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                className="h-10 w-10 bg-primary border border-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-primary-dark transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Next testimonial"
              >
                <FaChevronRight />
              </motion.button>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-gold' 
                    : 'w-2 bg-gold/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection