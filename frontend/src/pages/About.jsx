import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import AdDisplay from '../components/AdDisplay'
import Img from '../assets/group_photo.jpeg'

function About() {
  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)
  const isInView1 = useInView(ref1, { once: true, amount: 0.3 })
  const isInView2 = useInView(ref2, { once: true, amount: 0.3 })
  const isInView3 = useInView(ref3, { once: true, amount: 0.3 })
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader 
        title="About Us" 
        subtitle="Learn about our mission, values, and journey in creating perfect matches within the Aggarwal community."
        backgroundImage="https://images.pexels.com/photos/3585798/pexels-photo-3585798.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      
      {/* Our Story */}
      <section className="py-20 bg-cream" ref={ref1}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Image taking full width */}
            <div className="relative">
              <img 
                src={Img} 
                alt="Our Story" 
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: '500px' }}
              />
              <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-lg z-0"></div>
            </div>
            
            {/* Text content below image */}
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-playfair font-bold text-primary mb-6">Our Story</h2>
              <div className="h-1 w-16 bg-gold mx-auto mb-8"></div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Aggarwal Matrimonial services is a social organisation involved in making matches of aggarwal families. It is a unit of aggarwal sewa samiti(regd.) Kotkapura, Founded in 2007. 
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
               Samiti begins with a simple mission to help Aggarwal families. It provides help in various fields like education, marriage of needy girl, ration to widow of aggarwal community and medical help.
              </p>
              <p className="text-gray-700 leading-relaxed">
               Now samiti has started matrimonial services to arora's, khatri's and sharma's also. 
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-20 bg-primary text-white" ref={ref2}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl font-playfair font-bold text-gold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              Our Mission
            </motion.h2>
            <motion.div 
              className="h-1 w-16 bg-gold mx-auto mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView2 ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            ></motion.div>
            <motion.p 
              className="text-xl mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              To preserve and celebrate the rich heritage of the Aggarwal community while helping create harmonious and lasting marriages through thoughtful matchmaking.
            </motion.p>
            <motion.p 
              className="text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              We believe that a successful marriage requires both traditional compatibility and personal connection. Our approach balances family values with individual aspirations, creating matches that satisfy both heart and tradition.
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-20 bg-cream-light" ref={ref3}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-playfair font-bold text-primary mb-4">
              Our Values
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Integrity',
                description: 'We operate with complete transparency and honesty in all our interactions with clients.',
                delay: 0
              },
              {
                title: 'Respect for Tradition',
                description: 'We honor the cultural heritage and traditions of the Aggarwal community in our matchmaking process.',
                delay: 0.2
              },
              {
                title: 'Privacy',
                description: 'We maintain strict confidentiality of all personal information shared with us.',
                delay: 0.4
              },
              {
                title: 'Excellence',
                description: 'We strive for excellence in our service, continuously improving our matching process.',
                delay: 0.6
              },
              {
                title: 'Empathy',
                description: 'We approach each match with understanding and care, recognizing the significance of this life decision.',
                delay: 0.8
              },
              {
                title: 'Innovation',
                description: 'While respecting tradition, we embrace modern technology to enhance our matchmaking effectiveness.',
                delay: 1.0
              }
            ].map((value, index) => (
              <motion.div 
                key={index} 
                className="glass-card p-8 text-center hover:border-gold"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: value.delay }}
              >
                <h3 className="text-xl font-playfair font-bold text-primary mb-4">
                  {value.title}
                </h3>
                <div className="h-1 w-12 bg-gold mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <AdDisplay page="about" />
    </motion.div>
  )
}

export default About