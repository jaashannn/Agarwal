import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import toast from 'react-hot-toast'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import PageHeader from '../components/shared/PageHeader'

function Contact() {
  const formRef = useRef(null)
  const isInView = useInView(formRef, { once: true, amount: 0.3 })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    
    // Simulate API call
    toast.success('Your message has been sent successfully! We will get back to you soon.', {
      duration: 5000,
      icon: '✉️',
    })
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }
  
  const contactInfo = [
    {
      icon: <FaPhoneAlt className="text-gold text-2xl" />,
      title: 'Phone',
      details: ['+91 98765 43210', '+91 87654 32109'],
    },
    {
      icon: <FaEnvelope className="text-gold text-2xl" />,
      title: 'Email',
      details: ['info@agarwalmatrimonialpunjab.com', 'support@agarwalmatrimonialpunjab.com'],
    },
    {
      icon: <FaMapMarkerAlt className="text-gold text-2xl" />,
      title: 'Office',
      details: ['SCO 123, Sector 17', 'Chandigarh, Punjab, India'],
    },
  ]
  
  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader 
        title="Contact Us" 
        subtitle="We're here to answer your questions and help you find your perfect match."
        backgroundImage="https://images.pexels.com/photos/5935794/pexels-photo-5935794.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((item, index) => (
                <motion.div 
                  key={index}
                  className="glass-card p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
            
            <div className="glass-card p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <motion.div 
                  ref={formRef}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-playfair font-bold text-primary mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                          Phone Number
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                        Subject
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <motion.textarea
                        whileFocus={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className={inputClasses}
                      ></motion.textarea>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn-primary w-full py-4"
                    >
                      Send Message
                    </motion.button>
                  </form>
                </motion.div>
                
                {/* Map */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-playfair font-bold text-primary mb-6">
                    Visit Our Office
                  </h2>
                  <div className="h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27446.57252311358!2d76.77242863476564!3d30.735093599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0aa29d6b0d%3A0xb28cacf1d4bef5b!2sSector%2017%2C%20Chandigarh!5e0!3m2!1sen!2sin!4v1652345678901!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Office Location"
                    ></iframe>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Contact