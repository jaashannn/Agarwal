import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import PageHeader from '../components/shared/PageHeader';
import ProfileCard from '../components/profiles/ProfileCard';
import ProfileFilters from '../components/profiles/ProfileFilters';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Profiles() {
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Fetch profiles when component mounts or token changes
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProfiles(res.data);
        setFilteredProfiles(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [token]);

  // Apply filters to the profile list
  const applyFilters = (filters) => {
    setCurrentFilters(filters);
    let results = [...allProfiles];

    if (filters.ageMin) {
      results = results.filter((profile) => profile.age >= parseInt(filters.ageMin));
    }
    if (filters.ageMax) {
      results = results.filter((profile) => profile.age <= parseInt(filters.ageMax));
    }
    if (filters.city && filters.city !== 'Any') {
      results = results.filter((profile) =>
        profile.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.education && filters.education !== 'Any') {
      results = results.filter((profile) =>
        profile.education?.toLowerCase().includes(filters.education.toLowerCase())
      );
    }
    if (filters.verified) {
      results = results.filter((profile) => profile.user?.verified);
    }
    if (filters.marital && filters.marital !== 'Any') {
      results = results.filter(
        (profile) => profile.marital?.toLowerCase() === filters.marital.toLowerCase()
      );
    }

    setFilteredProfiles(results);
  };

  // Animation variants for profile grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="glass-card p-8 max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // Main UI with profiles or no-matches message
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
          <ProfileFilters applyFilters={applyFilters} />
          <div className="mb-8">
            <p className="text-gray-600">
              Showing{' '}
              <span className="font-medium text-primary">{filteredProfiles.length}</span>{' '}
              profiles
            </p>
          </div>
          {filteredProfiles.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProfiles.map((profile) => (
                <motion.div key={profile._id} variants={itemVariants}>
                  <ProfileCard
                    profile={{
                      ...profile,
                      id: profile._id,
                      name: profile.user?.name,
                      verified: profile.user?.verified,
                      image:
                        profile.images?.length > 0
                          ? `${profile.user.imageUrl}/${profile.images[0]}`
                          : 'https://via.placeholder.com/300x400',
                      age: profile.age,
                      city: profile.city,
                      education: profile.education,
                      marital: profile.marital,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-playfair text-primary mb-4">No Matches Found</h3>
              <p className="text-gray-600 mb-8">
                We couldnâ€™t find any profiles matching your current filters. Please try adjusting your search criteria.
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
  );
}

export default Profiles;