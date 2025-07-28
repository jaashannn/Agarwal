import { motion } from 'framer-motion'
import { FaUserShield, FaBars, FaTimes, FaChartBar, FaUsers, FaEnvelope, FaUserPlus, FaCog, FaChevronLeft } from 'react-icons/fa'

function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, handleLogout }) {
  return (
    <motion.div 
      className={`bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 fixed h-full z-10`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {sidebarOpen ? (
          <h2 className="text-xl font-playfair font-bold text-primary">Admin Panel</h2>
        ) : (
          <FaUserShield className="text-2xl text-primary mx-auto" />
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-primary"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaChartBar className="mr-3" />
              {sidebarOpen && <span>Dashboard</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'profiles' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaUsers className="mr-3" />
              {sidebarOpen && <span>Manage Profiles</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'messages' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaEnvelope className="mr-3" />
              {sidebarOpen && <span>Messages</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'register' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaUserPlus className="mr-3" />
              {sidebarOpen && <span>Register User</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FaCog className="mr-3" />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <FaChevronLeft className="mr-3" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar