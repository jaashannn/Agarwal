import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import LanguageSwitcher from './LanguageSwitcher'

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <LanguageSwitcher />
      <Footer />
    </div>
  )
}

export default Layout