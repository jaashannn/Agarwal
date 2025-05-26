import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaFilter, FaTimes } from 'react-icons/fa'

function ProfileFilters({ applyFilters }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    gender: '',
    ageMin: '',
    ageMax: '',
    location: '',
    education: '',
    verified: false,
    premium: false
  })
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    applyFilters(filters)
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }
  
  const resetFilters = () => {
    const emptyFilters = {
      gender: '',
      ageMin: '',
      ageMax: '',
      location: '',
      education: '',
      verified: false,
      premium: false
    }
    setFilters(emptyFilters)
    applyFilters(emptyFilters)
  }
  
  const locations = ['Any', 'Amritsar', 'Chandigarh', 'Ludhiana', 'Jalandhar', 'Patiala']
  const educations = ['Any', 'High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Professional Degree']
  
  return (
    <div className="mb-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <button
          className="flex items-center justify-center w-full py-3 bg-primary text-white font-medium rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
          {isOpen ? 'Close Filters' : 'Filter Profiles'}
        </button>
      </div>
      
      {/* Filters Form */}
      <motion.div
        className="mt-4 md:mt-0"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen || window.innerWidth >= 768 ? 'auto' : 0,
          opacity: isOpen || window.innerWidth >= 768 ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <form onSubmit={handleSubmit} className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-playfair font-semibold text-primary">Find Your Match</h3>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-primary hover:text-primary-dark"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            {/* Age Range */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Age (Min-Max)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="ageMin"
                  placeholder="Min"
                  value={filters.ageMin}
                  onChange={handleChange}
                  min="18"
                  max="80"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="number"
                  name="ageMax"
                  placeholder="Max"
                  value={filters.ageMax}
                  onChange={handleChange}
                  min="18"
                  max="80"
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Location */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location} value={location === 'Any' ? '' : location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Education */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Education</label>
              <select
                name="education"
                value={filters.education}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {educations.map((education) => (
                  <option key={education} value={education === 'Any' ? '' : education}>
                    {education}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Verification Options */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Profile Status</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    name="verified"
                    checked={filters.verified}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="verified" className="ml-2 text-gray-700">
                    Verified Profiles Only
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="premium"
                    name="premium"
                    checked={filters.premium}
                    onChange={handleChange}
                    className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <label htmlFor="premium" className="ml-2 text-gray-700">
                    Premium Profiles Only
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors duration-300"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ProfileFilters