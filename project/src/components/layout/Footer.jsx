import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import Logo from './Logo'

function Footer() {
  const { t } = useTranslation()
  
  const socialIcons = {
    Facebook: <FaFacebookF />,
    Instagram: <FaInstagram />,
    Twitter: <FaTwitter />,
    LinkedIn: <FaLinkedinIn />
  }

  return (
    <footer className="bg-primary text-cream pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <div className="bg-cream inline-block p-2 rounded-lg mb-4">
              <Logo />
            </div>
            <p className="mt-4 text-cream-light">
              Premium matchmaking service dedicated to creating beautiful marriages in the Agarwal community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-playfair text-gold mb-4">
              {t('footer.links.title')}
            </h3>
            <ul className="space-y-2">
              {t('footer.links.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>
                  <Link 
                    to={index === 0 ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`}
                    className="text-cream-light hover:text-gold transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-playfair text-gold mb-4">
              {t('footer.contact.title')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-gold mt-1 mr-3" />
                <span>{t('footer.contact.address')}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-gold mr-3" />
                <span>{t('footer.contact.phone')}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-gold mr-3" />
                <span>{t('footer.contact.email')}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-playfair text-gold mb-4">
              {t('footer.social.title')}
            </h3>
            <div className="flex space-x-4">
              {t('footer.social.items', { returnObjects: true }).map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="h-10 w-10 rounded-full bg-cream-dark/10 flex items-center justify-center text-gold hover:bg-gold hover:text-primary transition-colors duration-300"
                  aria-label={item}
                >
                  {socialIcons[item]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream-light/20 mt-12 pt-8 text-center">
          <p className="text-cream-light">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer