import { motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import StatsSection from '../components/home/StatsSection'
import CtaSection from '../components/home/CtaSection'
import AdDisplay from '../components/AdDisplay'

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <div className="mb-6 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded text-center">
        <strong>Note:</strong> A one-time joining fee of ₹500 applies to male users (INR). Registration is free for female users.
      </div>
      <FeaturesSection />
      <TestimonialsSection />
      <StatsSection />
      <CtaSection />
      <AdDisplay page="home" />
    </motion.div>
  )
}

export default Home