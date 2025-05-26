import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'

function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader 
        title="Privacy Policy" 
        subtitle="We value your privacy and are committed to protecting your personal information."
        backgroundImage="https://images.pexels.com/photos/313691/pexels-photo-313691.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-10">
              <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-primary prose-p:text-gray-700">
                <p className="text-gray-500 mb-8">Last Updated: May 1, 2025</p>
                
                <h2>1. Introduction</h2>
                <p>
                  At Agarwal Matrimonial Punjab, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matrimonial services.
                </p>
                
                <h2>2. Information We Collect</h2>
                <p>
                  We collect the following types of information:
                </p>
                <h3>2.1 Personal Information</h3>
                <ul>
                  <li>Basic identity information (name, age, gender)</li>
                  <li>Contact details (email address, phone number)</li>
                  <li>Educational and professional details</li>
                  <li>Family information</li>
                  <li>Photographs</li>
                  <li>Personal preferences and interests</li>
                </ul>
                
                <h3>2.2 Usage Information</h3>
                <ul>
                  <li>Log data (IP address, browser type, pages visited)</li>
                  <li>Device information</li>
                  <li>Usage patterns and preferences</li>
                </ul>
                
                <h2>3. How We Collect Information</h2>
                <p>
                  We collect information through:
                </p>
                <ul>
                  <li>Registration and profile creation</li>
                  <li>Direct interactions with our service</li>
                  <li>Automated technologies (cookies, tracking pixels)</li>
                  <li>Third-party sources (with your consent)</li>
                </ul>
                
                <h2>4. How We Use Your Information</h2>
                <p>
                  We use your information for:
                </p>
                <ul>
                  <li>Providing matrimonial matching services</li>
                  <li>Account management and verification</li>
                  <li>Communication about our services</li>
                  <li>Improving and personalizing user experience</li>
                  <li>Legal compliance and enforcing our terms</li>
                  <li>Safety and security purposes</li>
                </ul>
                
                <h2>5. Information Sharing and Disclosure</h2>
                <p>
                  We may share your information with:
                </p>
                <ul>
                  <li>Other registered users (as per your privacy settings)</li>
                  <li>Service providers and business partners</li>
                  <li>Legal authorities (when required by law)</li>
                </ul>
                <p>
                  We will not sell your personal information to third parties for marketing purposes.
                </p>
                
                <h2>6. Your Privacy Controls</h2>
                <p>
                  You have control over your information through:
                </p>
                <ul>
                  <li>Privacy settings in your profile</li>
                  <li>Communication preferences</li>
                  <li>Access to your personal information</li>
                  <li>Right to correction and deletion</li>
                </ul>
                
                <h2>7. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee the security of information transmitted through our platform.
                </p>
                
                <h2>8. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                </p>
                
                <h2>9. Children's Privacy</h2>
                <p>
                  Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.
                </p>
                
                <h2>10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                
                <h2>11. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p>
                  Agarwal Matrimonial Punjab<br />
                  SCO 123, Sector 17<br />
                  Chandigarh, Punjab, India<br />
                  Email: privacy@agarwalmatrimonialpunjab.com<br />
                  Phone: +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default PrivacyPolicy