import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'
import logo from '../../assets/logo.jpg'

function Footer() {
  const { t } = useTranslation()
  
  const socialIcons = {
    Facebook: <FaFacebookF />,
    Instagram: <FaInstagram />,
    Twitter: <FaTwitter />,
    LinkedIn: <FaLinkedinIn />
  }

  return (
    <footer className="bg-gradient-to-b from-primary to-primary-dark text-cream pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-3 rounded-xl mb-6 shadow-lg">
             <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>
            <p className="text-cream-light text-sm leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-playfair text-gold mb-6 font-semibold">
              {t('footer.links.title')}
            </h3>
            <ul className="space-y-3">
              {t('footer.links.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>
                  <Link 
                    to={index === 0 ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`}
                    className="text-cream-light hover:text-gold transition-colors duration-300 text-base"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
    <div className="lg:col-span-1">
  <h3 className="text-2xl font-playfair text-gold mb-6 font-semibold tracking-wide">
    {t('footer.contact.title')}
  </h3>
  <ul className="space-y-5 text-sm text-gray-700">
    <li className="flex items-start gap-3">
      <FaMapMarkerAlt className="text-gold mt-1 shrink-0" size={16} />
      <span className="leading-relaxed">{t('footer.contact.address')}</span>
    </li>
    <li className="flex items-start gap-3">
      <FaPhone className="text-gold mt-1 shrink-0" size={16} />
      <div className="space-y-2">
        <p className="hover:text-gold transition-colors duration-300">{t('footer.contact.phone1')}</p>
        <p className="hover:text-gold transition-colors duration-300">{t('footer.contact.phone2')}</p>
        <p className="hover:text-gold transition-colors duration-300">{t('footer.contact.phone3')}</p>
      </div>
    </li>
    <li className="flex items-center gap-3">
      <FaEnvelope className="text-gold shrink-0" size={16} />
      <a
        href={`mailto:${t('footer.contact.email')}`}
        className="hover:text-gold transition-colors duration-300 underline underline-offset-4 decoration-gold/50"
      >
        {t('footer.contact.email')}
      </a>
    </li>
  </ul>
</div>

          {/* Social */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-playfair text-gold mb-6 font-semibold">
              {t('footer.social.title')}
            </h3>
            <div className="flex space-x-4">
              {t('footer.social.items', { returnObjects: true }).map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="h-12 w-12 rounded-full bg-cream-dark/20 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-all duration-300 transform hover:scale-110"
                  aria-label={item}
                >
                  {socialIcons[item]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream-light/30 mt-12 pt-8 text-center">
          <p className="text-cream-light text-sm">
            {t('footer.copyright')}
          </p>
          <p className="text-cream-light text-sm mt-2 flex items-center justify-center">
            {t('footer.madeBy')} <FaHeart className="text-gold mx-2" /> 
            <a 
              href="https://www.codeviewsolution.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              Code View Solution
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer