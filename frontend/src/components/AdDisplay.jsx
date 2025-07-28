import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function AdDisplay({ page }) {
  const [ads, setAds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [dismissedAds, setDismissedAds] = useState([]);
  const [dismissedTimestamps, setDismissedTimestamps] = useState({});

  useEffect(() => {
    fetchAds();
  }, [page]);

  // Check for popup ads every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (ads.length > 0) {
        const now = Date.now();
        const popupAds = ads.filter(ad => 
          Array.isArray(ad.position) 
            ? ad.position.includes('popup') 
            : ad.position === 'popup'
        );
        
        const availablePopupAd = popupAds.find(ad => {
          const dismissedTime = dismissedTimestamps[ad._id];
          if (!dismissedTime) return true; // Never dismissed
          return (now - dismissedTime) > 20000; // 20 seconds passed
        });
        
        if (availablePopupAd && !showPopup) {
          setCurrentAd(availablePopupAd);
          setShowPopup(true);
        }
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [ads, dismissedTimestamps, showPopup]);

  useEffect(() => {
    if (ads.length > 0) {
      const now = Date.now();
      const popupAds = ads.filter(ad => 
        Array.isArray(ad.position) 
          ? ad.position.includes('popup') 
          : ad.position === 'popup'
      );
      
      const availablePopupAd = popupAds.find(ad => {
        const dismissedTime = dismissedTimestamps[ad._id];
        if (!dismissedTime) return true; // Never dismissed
        return (now - dismissedTime) > 20000; // 20 seconds passed
      });
      
      if (availablePopupAd) {
        setTimeout(() => {
          setCurrentAd(availablePopupAd);
          setShowPopup(true);
        }, 5000); // Show after 5 seconds
      }
    }
  }, [ads, dismissedTimestamps]);

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/ads/${page}`);
      setAds(response.data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    }
  };

  const handleDismiss = () => {
    if (currentAd) {
      setDismissedTimestamps(prev => ({
        ...prev,
        [currentAd._id]: Date.now()
      }));
    }
    setShowPopup(false);
    setCurrentAd(null);
  };

  const bottomAds = ads.filter(ad => {
    const isBottomAd = Array.isArray(ad.position) 
      ? ad.position.includes('bottom') 
      : ad.position === 'bottom';
    const dismissedTime = dismissedTimestamps[ad._id];
    if (!dismissedTime) return isBottomAd; // Never dismissed
    return isBottomAd && (Date.now() - dismissedTime) > 20000; // 20 seconds passed
  });

  return (
    <>
      {/* Popup Ad */}
      <AnimatePresence>
        {showPopup && currentAd && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full shadow-2xl relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={16} />
              </button>
              
              <div className="p-6">
                <img
                  src={currentAd.image}
                  alt={currentAd.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/400x200')}
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentAd.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {currentAd.description}
                </p>
                <button
                  onClick={handleDismiss}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Banner Ads */}
      {bottomAds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          {bottomAds.map((ad, index) => (
            <motion.div
              key={ad._id}
              className="bg-white border-t border-gray-200 shadow-lg"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/48x48')}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{ad.title}</h4>
                      <p className="text-gray-600 text-xs">{ad.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissedTimestamps(prev => ({
                      ...prev,
                      [ad._id]: Date.now()
                    }))}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

export default AdDisplay; 