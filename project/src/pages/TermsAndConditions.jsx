import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'

function TermsAndConditions() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader 
        title="Terms and Conditions" 
        subtitle="Please read these terms and conditions carefully before using our service."
        backgroundImage="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
      
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-10">
              <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:font-bold prose-headings:text-primary prose-p:text-gray-700">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Agarwal Matrimonial Punjab's services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.
                </p>
                
                <h2>2. Eligibility</h2>
                <p>
                  To use our services, you must be at least 18 years of age and legally eligible to marry under the laws of India or your country of residence. By registering, you confirm that you meet these eligibility requirements.
                </p>
                
                <h2>3. Registration and Account</h2>
                <p>
                  You agree to provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                
                <h2>4. Profile Information</h2>
                <p>
                  You are solely responsible for the content you provide in your profile. All information must be truthful, accurate, and not misleading. We reserve the right to verify the authenticity of your information and to remove any content that violates our terms.
                </p>
                
                <h2>5. Privacy Policy</h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                </p>
                
                <h2>6. Communication</h2>
                <p>
                  By registering, you consent to receive communications from Agarwal Matrimonial Punjab, including but not limited to emails, SMS messages, and phone calls related to your account and our services.
                </p>
                
                <h2>7. Prohibited Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul>
                  <li>Use our services for any illegal purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Impersonate any person or entity</li>
                  <li>Post false or misleading information</li>
                  <li>Share contact information through public profile sections</li>
                  <li>Use our services for commercial solicitation</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
                
                <h2>8. Intellectual Property</h2>
                <p>
                  All content, features, and functionality of our service, including but not limited to text, graphics, logos, and software, are owned by Agarwal Matrimonial Punjab and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                
                <h2>9. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties, or for any other reason.
                </p>
                
                <h2>10. Disclaimer of Warranties</h2>
                <p>
                  Our services are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of our services.
                </p>
                
                <h2>11. Limitation of Liability</h2>
                <p>
                  In no event shall Agarwal Matrimonial Punjab be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our service.
                </p>
                
                <h2>12. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms and Conditions at any time. Continued use of our services after such modifications constitutes your acceptance of the revised terms.
                </p>
                
                <h2>13. Governing Law</h2>
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
                
                <h2>14. Contact Information</h2>
                <p>
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <p>
                  Agarwal Matrimonial Punjab<br />
                  SCO 123, Sector 17<br />
                  Chandigarh, Punjab, India<br />
                  Email: legal@agarwalmatrimonialpunjab.com<br />
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

export default TermsAndConditions