import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow  mt-[110px] lg:mt-[110px]">
        <Outlet />
      </main>
      <FloatingButtons />
      <Footer />
    </div>
  )
}

export default Layout