import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaChevronLeft, FaChevronRight, FaHeart, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaCrown } from 'react-icons/fa'
import { profiles } from '../data/profiles'

function ProfileDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProfile = profiles.find(p => p.id === parseInt(id))
      setProfile(foundProfile)
      setLoading(false)
    }, 500)
  }, [id])
  
  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === profile.photos.length - 1 ? 0 : prevIndex + 1
    )
  }
  
  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? profile.photos.length - 1 : prevIndex - 1
    )
  }
  
  const handleContact = () => {
    toast.success(`Contact request sent to ${profile.name}!`, {
      icon: '💌',
      style: {
        borderRadius: '10px',
        background: '#fff',
        color: '#046A38',
      },
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="rounded-full bg-primary/20 h-24 w-24 mx-auto mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-playfair font-bold text-primary mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The profile you are looking for does not exist or has been removed.</p>
          <Link to="/profiles" className="btn-primary">
            Browse Other Profiles
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div
      className="bg-cream pt-20 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <Link to="/profiles" className="inline-flex items-center text-primary font-medium mb-8 hover:underline">
          <FaChevronLeft className="mr-2" /> Back to Profiles
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Photos */}
          <div className="lg:col-span-1">
            <div className="glass-card overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentPhotoIndex}
                    src={profile.photos[currentPhotoIndex]} 
                    alt={`${profile.name} - Photo ${currentPhotoIndex + 1}`} 
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                {profile.photos.length > 1 && (
                  <>
                    <button 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white/70 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors duration-300"
                      onClick={prevPhoto}
                      aria-label="Previous photo"
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white/70 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors duration-300"
                      onClick={nextPhoto}
                      aria-label="Next photo"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {profile.premium && (
                    <div className="bg-gold text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
                      <FaCrown className="mr-1" /> Premium
                    </div>
                  )}
                  {profile.verified && (
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
                      <FaCheckCircle className="mr-1" /> Verified
                    </div>
                  )}
                </div>
                
                {/* Photo Indicators */}
                {profile.photos.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {profile.photos.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentPhotoIndex 
                            ? 'w-8 bg-gold' 
                            : 'w-2 bg-white/50'
                        }`}
                        onClick={() => setCurrentPhotoIndex(index)}
                        aria-label={`Go to photo ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="p-4 flex justify-between items-center">
                <button 
                  className="flex items-center text-rose-500 font-medium"
                  onClick={() => toast.success('Added to favorites!')}
                >
                  <FaHeart className="mr-2" /> Add to Favorites
                </button>
                <div className="text-gray-500 text-sm">
                  {currentPhotoIndex + 1} / {profile.photos.length}
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="lg:col-span-2">
            <motion.div 
              className="glass-card p-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-playfair font-bold text-primary mb-2">
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center text-gray-600 mb-6">
                <span className="mr-4">{profile.age} Years</span>
                <span className="mr-4">{profile.height}</span>
                <span>{profile.location}</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-playfair font-semibold text-primary mb-3">
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {profile.about}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Personal Details */}
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-4">
                    Personal Details
                  </h2>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Occupation</td>
                        <td className="py-3 text-gray-800">{profile.occupation}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Education</td>
                        <td className="py-3 text-gray-800">{profile.education}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Religion</td>
                        <td className="py-3 text-gray-800">{profile.religion}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Height</td>
                        <td className="py-3 text-gray-800">{profile.height}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Family Details */}
                <div>
                  <h2 className="text-xl font-playfair font-semibold text-primary mb-4">
                    Family Details
                  </h2>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Father</td>
                        <td className="py-3 text-gray-800">{profile.family.father}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Father's Occupation</td>
                        <td className="py-3 text-gray-800">{profile.family.fatherOccupation}</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-3 text-gray-600 font-medium">Mother</td>
                        <td className="py-3 text-gray-800">{profile.family.mother}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600 font-medium">Siblings</td>
                        <td className="py-3 text-gray-800">{profile.family.siblings}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Preferences */}
              <div className="mb-8">
                <h2 className="text-xl font-playfair font-semibold text-primary mb-4">
                  Partner Preferences
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-4 text-center">
                    <h3 className="text-gray-600 text-sm mb-2">Age Range</h3>
                    <p className="text-primary font-medium">{profile.preferences.ageRange} years</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <h3 className="text-gray-600 text-sm mb-2">Education</h3>
                    <p className="text-primary font-medium">{profile.preferences.education}</p>
                  </div>
                  <div className="glass-card p-4 text-center">
                    <h3 className="text-gray-600 text-sm mb-2">Location</h3>
                    <p className="text-primary font-medium">{profile.preferences.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="btn-primary flex-1 flex items-center justify-center"
                  onClick={handleContact}
                >
                  <FaPhoneAlt className="mr-2" /> Request Contact
                </button>
                <button 
                  className="btn-secondary flex-1 flex items-center justify-center"
                  onClick={handleContact}
                >
                  <FaEnvelope className="mr-2" /> Send Message
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileDetail