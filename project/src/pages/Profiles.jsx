import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import ProfileCard from '../components/profiles/ProfileCard'
import ProfileFilters from '../components/profiles/ProfileFilters'
import { profiles } from '../data/profiles'

function Profiles() {
  const [filteredProfiles, setFilteredProfiles] = useState([])
  const [currentFilters, setCurrentFilters] = useState({})
  
  useEffect(() => {
    setFilteredProfiles(profiles)
  }, [])
  
  const applyFilters = (filters) => {
    setCurrentFilters(filters)
    
    let results = [...profiles]
    
    if (filters.gender) {
      // This is a mock filter since our data doesn't have gender explicitly marked
      // In a real application, we would filter by gender
    }
    
    if (filters.ageMin) {
      results = results.filter(profile => profile.age >= parseInt(filters.ageMin))
    }
    
    if (filters.ageMax) {
      results = results.filter(profile => profile.age <= parseInt(filters.ageMax))
    }
    
    if (filters.location && filters.location !== 'Any') {
      results = results.filter(profile => profile.location === filters.location)
    }
    
    if (filters.education && filters.education !== 'Any') {
      // This is a simplified filter that checks if the education string contains the filter value
      results = results.filter(profile => 
        profile.education.toLowerCase().includes(filters.education.toLowerCase())
      )
    }
    
    if (filters.verified) {
      results = results.filter(profile => profile.verified)
    }
    
    if (filters.premium) {
      results = results.filter(profile => profile.premium)
    }
    
    setFilteredProfiles(results)
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader 
        title="Find Your Perfect Match" 
        subtitle="Browse profiles of eligible Agarwal community members and take the first step towards a beautiful future together."
        backgroundImage="https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <ProfileFilters applyFilters={applyFilters} />
          
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing <span className="font-medium text-primary">{filteredProfiles.length}</span> profiles
            </p>
          </div>
          
          {/* Profile Grid */}
          {filteredProfiles.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProfiles.map(profile => (
                <motion.div key={profile.id} variants={itemVariants}>
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-playfair text-primary mb-4">No Matches Found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any profiles matching your current filters. 
                Please try adjusting your search criteria.
              </p>
              <button
                onClick={() => applyFilters({})}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

export default Profiles