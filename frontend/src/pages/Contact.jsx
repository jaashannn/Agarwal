import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import PageHeader from '../components/shared/PageHeader';
import AdDisplay from '../components/AdDisplay';

function Contact() {
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/api/contacts`, formData);

      toast.success(response.data.message, {
        duration: 5000,
        icon: '✉️',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
      console.error('Error submitting form:', error);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhoneAlt className="text-gold text-2xl" />,
      title: 'Phone',
      details: [
        '+91 9814738647 (O.P. Goyal)',
        '+91 8360332983 (Bhushan Mittal)',
        '+91 9814820338 (Sheetal Goel)'
      ],
    },
    {
      icon: <FaEnvelope className="text-gold text-2xl" />,
      title: 'Email',
      details: ['aggarwalmatrimonialkkp@gmail.com'],
    },
    {
      icon: <FaMapMarkerAlt className="text-gold text-2xl" />,
      title: 'Office',
      details: [
        'Aggarwal Matrimonial Services, A Unit of Aggarwal Sewa Samiti (Regd.)',
        'Radha krishana mandir guga medi wali gali',
        'Kotkapura 151204, District Faridkot, Punjab, India'
      ],
    },
  ];

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white/80 shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center"
    >
      <PageHeader
        title="Contact Us"
        subtitle="We're here to answer your questions and help you find your perfect match."
        backgroundImage="https://images.pexels.com/photos/5935794/pexels-photo-5935794.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      <section className="py-20 bg-cream w-full">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="glass-card p-8 text-center bg-white/90 shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-primary mb-4">
                    {item.title}
                  </h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            <div className="glass-card p-8 md:p-12 bg-white/90 shadow-xl rounded-xl max-w-3xl mx-auto">
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="text-3xl font-playfair font-bold text-primary mb-8 text-center">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
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
                        whileFocus={{ scale: 1.02 }}
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
                        whileFocus={{ scale: 1.02 }}
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
                      whileFocus={{ scale: 1.02 }}
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
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className={inputClasses}
                    ></motion.textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary w-full py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <AdDisplay page="contact" />
    </motion.div>
  );
}

export default Contact;