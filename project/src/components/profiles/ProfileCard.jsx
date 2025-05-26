import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaCrown } from 'react-icons/fa'

function ProfileCard({ profile }) {
  return (
    <Link to={`/profiles/${profile.id}`}>
      <motion.div 
        className="glass-card h-full overflow-hidden group"
        whileHover={{ 
          y: -5, 
          boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
          borderColor: 'rgba(212, 175, 55, 0.5)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-72 overflow-hidden">
          <img 
            src={profile.photos[0]} 
            alt={profile.name} 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Premium Badge */}
          {profile.premium && (
            <div className="absolute top-4 right-4 bg-gold text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
              <FaCrown className="mr-1" /> Premium
            </div>
          )}
          
          {/* Verified Badge */}
          {profile.verified && (
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
              <FaCheckCircle className="mr-1" /> Verified
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-playfair font-bold text-primary mb-1">
            {profile.name}
          </h3>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>{profile.age} Years</span>
            <span>{profile.location}</span>
          </div>
          <div className="mb-4 pb-4 border-b border-gold/10">
            <span className="font-medium text-gray-700">{profile.occupation}</span>
            <p className="text-sm text-gray-600 mt-1">{profile.education}</p>
          </div>
          <p className="text-gray-600 line-clamp-2 mb-4">
            {profile.about}
          </p>
          <div className="flex justify-end">
            <motion.span 
              className="text-primary font-medium flex items-center"
              whileHover={{ x: 5 }}
            >
              View Profile
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProfileCard