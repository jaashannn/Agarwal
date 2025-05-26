import { motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import StatsSection from '../components/home/StatsSection'
import CtaSection from '../components/home/CtaSection'

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <StatsSection />
      <CtaSection />
    </motion.div>
  )
}

export default Home