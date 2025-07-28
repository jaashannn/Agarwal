import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaBars, FaSignOutAlt, FaUsers, FaEnvelope, FaTachometerAlt,
  FaEye, FaTimes, FaChevronLeft, FaChevronRight,
  FaPhoneAlt, FaCrown, FaSearch, FaTrash, FaFilter, FaDownload, FaUser, FaImage, FaPlus, FaCreditCard, FaCheck, FaDollarSign
} from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { AuthContext } from '../context/AuthContext';
import AddUser from './AddUser';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function AdminPanel() {
  const [profiles, setProfiles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [filters, setFilters] = useState({
    premium: 'all'
  });
  const [addUserOpen, setAddUserOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const [profilesRes, contactsRes, paymentsRes, usersRes] = await Promise.all([
          axios.get(`${apiUrl}/api/profiles`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/contacts`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/payments`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProfiles(profilesRes.data);
        console.log(profilesRes.data);
        setContacts(contactsRes.data);
        setPayments(paymentsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        showErrorToast('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const showSuccessToast = (message) => {
    toast.success(message, {
      style: {
        borderRadius: '12px',
        background: '#f0fdf4',
        color: '#15803d',
        border: '1px solid #bbf7d0',
      },
      iconTheme: {
        primary: '#16a34a',
        secondary: '#fff',
      }
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      style: {
        borderRadius: '12px',
        background: '#fef2f2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
      },
      iconTheme: {
        primary: '#dc2626',
        secondary: '#fff',
      }
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${apiUrl}/api/profiles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(profiles.filter(profile => profile._id !== id));
      if (selectedProfile?._id === id) {
        setSelectedProfile(null);
      }
      showSuccessToast(res.data.message);
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to delete profile');
    }
  };

  const handleViewProfile = async (id) => {
    const token = localStorage.getItem('token');
    try {
      // Find the profile from the existing profiles list to get the enhanced data
      const profile = profiles.find(p => p._id === id);
      if (profile) {
        setSelectedProfile(profile);
        setCurrentPhotoIndex(0);
      } else {
        // Fallback to API call if profile not found in list
        const res = await axios.get(`${apiUrl}/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedProfile(res.data);
        setCurrentPhotoIndex(0);
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to load profile');
    }
  };

  const closeModal = () => {
    setSelectedProfile(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex(prevIndex =>
      prevIndex === selectedProfile.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(prevIndex =>
      prevIndex === 0 ? selectedProfile.images.length - 1 : prevIndex - 1
    );
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!', {
      style: {
        borderRadius: '12px',
        background: '#f0fdf4',
        color: '#15803d',
        border: '1px solid #bbf7d0',
      },
      iconTheme: {
        primary: '#16a34a',
        secondary: '#fff',
      }
    });
    navigate('/');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const downloadProfilesExcel = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Mobile', 'Gender', 'Gotra', 'Age', 'City', 'Marital Status', 'Education', 'Occupation', 'Profile For', 'Verified', 'Premium', 'Profile Completion', 'Payment Status', 'Created Date'];
    
    const csvData = filteredProfiles.map(profile => [
      profile.user?.name || 'Unknown',
      profile.user?.email || 'N/A',
      profile.user?.mobile || 'N/A',
      profile.user?.gender || 'N/A',
      profile.gotra || 'N/A',
      profile.age || 'N/A',
      profile.city || 'N/A',
      profile.marital || 'N/A',
      profile.education || 'N/A',
      profile.occupation || 'N/A',
      profile.profilefor || 'N/A',
      profile.user?.verified ? 'Yes' : 'No',
      profile.user?.premium ? 'Yes' : 'No',
      profile.isCompleted ? 'Yes' : 'No',
      profile.isPaymentDone ? 'Yes' : 'No',
      profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'
    ]);
    
    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `user_profiles_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessToast('User profiles exported successfully!');
  };

  const downloadProfilePDF = (profile) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`${profile.user?.name || 'User'} Profile`, 105, 15, { align: 'center' });
    
    let yOffset = 30;
    
    // User Information
    doc.setFontSize(14);
    doc.text('User Information', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    const userFields = [
      { label: 'Name', value: profile.user?.name || 'N/A' },
      { label: 'Email', value: profile.user?.email || 'N/A' },
      { label: 'Mobile', value: profile.user?.mobile || 'N/A' },
      { label: 'Gender', value: profile.user?.gender || 'N/A' },
      { label: 'Verified', value: profile.user?.verified ? 'Yes' : 'No' },
      { label: 'Creator Role', value: profile.user?.creatorRole || 'N/A' },
      { label: 'Role', value: profile.userDetails?.role || 'N/A' }
    ];
    userFields.forEach(field => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
      doc.text(`${field.label}: ${field.value}`, 20, yOffset);
      yOffset += 8;
    });
    
    // Profile Information
    yOffset += 10;
    doc.setFontSize(14);
    doc.text('Profile Information', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(10);
    const profileFields = [
      { label: 'Registration No', value: profile.regdno || 'N/A' },
      { label: 'Profile For', value: profile.profilefor || 'N/A' },
      { label: 'Marital Status', value: profile.marital || 'N/A' },
      { label: 'Gotra', value: profile.gotra || 'N/A' },
      { label: 'Hobbies', value: profile.hobbies?.join(', ') || 'N/A' },
      { label: 'Languages', value: profile.language?.join(', ') || 'N/A' },
      { label: 'Height', value: profile.hfeet && profile.hinch ? `${profile.hfeet}'${profile.hinch}"` : 'N/A' },
      { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : 'N/A' },
      { label: 'Body Type', value: profile.body || 'N/A' },
      { label: 'Complexion', value: profile.complexion || 'N/A' },
      { label: 'Physical Status', value: profile.physical || 'N/A' },
      { label: 'Education', value: profile.education || 'N/A' },
      { label: 'Occupation', value: profile.occupation || 'N/A' },
      { label: 'Employer', value: profile.employed || 'N/A' },
      { label: 'Income', value: profile.income || 'N/A' },
      { label: 'Food Preference', value: profile.food || 'N/A' },
      { label: 'Smoking', value: profile.smoking || 'N/A' },
      { label: 'Drinking', value: profile.drinking || 'N/A' },
      { label: 'Date of Birth', value: profile.day && profile.month && profile.year ? `${profile.day} ${profile.month} ${profile.year}` : 'N/A' },
      { label: 'Place of Birth', value: profile.place || 'N/A' },
      { label: 'Time of Birth', value: profile.time || 'N/A' },
      { label: 'Day of Birth', value: profile.daybirth || 'N/A' },
      { label: 'Manglik', value: profile.manglik || 'N/A' },
      { label: 'Region', value: profile.region || 'N/A' },
      { label: 'Family Status', value: profile.status || 'N/A' },
      { label: 'Family Type', value: profile.type || 'N/A' },
      { label: 'Father\'s Name', value: profile.fname || 'N/A' },
      { label: 'Father\'s Occupation', value: profile.foccupation || 'N/A' },
      { label: 'Mother\'s Name', value: profile.mname || 'N/A' },
      { label: 'Mother\'s Occupation', value: profile.moccupation || 'N/A' },
      { label: 'Property Details', value: profile.property || 'N/A' },
      { label: 'Additional Info', value: profile.anyother || 'N/A' },
      { label: 'Brothers', value: profile.bno || 'N/A' },
      { label: 'Married Brothers', value: profile.bmarried || 'N/A' },
      { label: 'Brothers\' Location', value: profile.bwhere || 'N/A' },
      { label: 'Sisters', value: profile.sno || 'N/A' },
      { label: 'Married Sisters', value: profile.smarried || 'N/A' },
      { label: 'Sisters\' Location', value: profile.swhere || 'N/A' },
      { label: 'Spouse Preference', value: profile.spouse || 'N/A' },
      { label: 'Address', value: profile.address || 'N/A' },
      { label: 'City', value: profile.city || 'N/A' },
      { label: 'District', value: profile.district || 'N/A' },
      { label: 'Pincode', value: profile.pincode || 'N/A' },
      { label: 'State', value: profile.state || 'N/A' },
      { label: 'Country', value: profile.country || 'N/A' },
      { label: 'Speciality', value: profile.speciality || 'N/A' },
      { label: 'Description', value: profile.description || 'N/A' },
      { label: 'Age', value: profile.age || 'N/A' },
      { label: 'Profile Completion', value: profile.isCompleted ? 'Yes' : 'No' },
      { label: 'Payment Status', value: profile.isPaymentDone ? 'Yes' : 'No' },
      { label: 'Created At', value: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A' }
    ];
    profileFields.forEach(field => {
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
      const text = `${field.label}: ${field.value}`;
      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, 20, yOffset);
      yOffset += 8 * splitText.length;
    });
    
    doc.save(`${profile.user?.name || 'user'}_profile.pdf`);
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch =
      (profile.user?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (profile.user?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (profile.user?.mobile?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (profile.gotra?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesPremium =
      filters.premium === 'all' ||
      (filters.premium === 'premium' && profile.user?.premium) ||
      (filters.premium === 'regular' && !profile.user?.premium);

    return matchesSearch && matchesPremium;
  });

  const filteredContacts = contacts.filter(contact =>
    (contact.contactInfo?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (contact.contactInfo?.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (contact.contactInfo?.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (contact.message?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalUsers = users.length;
  const paidUsers = users.filter(user => user.isPaymentDone).length;
  const totalContacts = contacts.length;

  // Add handler to delete contact message
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(contacts.filter(contact => contact._id !== id));
      showSuccessToast('Message deleted successfully!');
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${apiUrl}/api/payments/${id}/status`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPayments(payments.map(payment => 
        payment._id === id ? { ...payment, status } : payment
      ));
      
      showSuccessToast(`Payment ${status.toLowerCase()} successfully`);
    } catch (error) {
      showErrorToast('Failed to update payment status');
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiUrl}/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(payments.filter(payment => payment._id !== id));
        showSuccessToast('Payment deleted successfully');
      } catch (error) {
        showErrorToast('Failed to delete payment');
      }
    }
  };

  const handleViewUserPayments = (user) => {
    const userPayments = payments.filter(payment => payment.user?._id === user._id);
    if (userPayments.length === 0) {
      showErrorToast('No payment records found for this user');
      return;
    }
    
    // Show payment details in a modal or navigate to payments tab
    setActiveTab('payments');
    setSearchQuery(user.email); // Filter payments by user email
  };

  const handleTogglePaymentStatus = async (user) => {
    const newStatus = !user.isPaymentDone;
    const action = newStatus ? 'mark as paid' : 'mark as unpaid';
    
    if (!window.confirm(`Are you sure you want to ${action} for ${user.name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${apiUrl}/api/users/${user._id}/payment-status`, {
        isPaymentDone: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => 
        u._id === user._id ? { ...u, isPaymentDone: newStatus } : u
      ));
      
      showSuccessToast(`User ${action} successfully`);
    } catch (error) {
      showErrorToast('Failed to update payment status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full mx-auto text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Admin Panel</h2>
          <p className="text-gray-500">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-50 min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex h-full">
        <motion.aside
          ref={sidebarRef}
          className={`bg-white border-r border-gray-200 fixed top-0 left-0 h-full z-50 transition-all duration-300 
            ${sidebarOpen ? 'w-64 shadow-xl' : 'w-0 md:w-20'} md:block`}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">
            {sidebarOpen && <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
            >
              <FaBars size={20} />
            </button>
          </div>
          <nav className={`mt-4 ${sidebarOpen ? 'px-2' : 'px-0'}`}>
            <ul className="space-y-1">
              {[
                { tab: 'dashboard', icon: <FaTachometerAlt className="text-gray-500" />, label: 'Dashboard' },
                { tab: 'users', icon: <FaUsers className="text-gray-500" />, label: 'Users' },
                { tab: 'profiles', icon: <FaUsers className="text-gray-500" />, label: 'Profiles' },
                { tab: 'contacts', icon: <FaEnvelope className="text-gray-500" />, label: 'Messages' },
                { tab: 'payments', icon: <FaCreditCard className="text-gray-500" />, label: 'Payments' },
                { tab: 'ads', icon: <FaImage className="text-gray-500" />, label: 'Ads' },
              ].map(item => (
                <li key={item.tab}>
                  <button
                    onClick={() => { 
                      if (item.tab === 'ads') {
                        navigate('/admin/ads');
                      } else {
                        setActiveTab(item.tab); 
                        setSidebarOpen(false);
                      }
                    }}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors 
                      ${activeTab === item.tab ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
                      ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                  >
                    <span className={`${activeTab === item.tab ? 'text-blue-500' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                  </button>
                </li>
              ))}
              <li className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors
                    ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                >
                  <FaSignOutAlt className="text-red-400" />
                  {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                </button>
              </li>
            </ul>
          </nav>
        </motion.aside>

        <div className={`flex-1 transition-all duration-300 p-4 sm:p-6 md:p-8 pt-16 md:pt-20
          ${sidebarOpen ? 'ml-64' : 'ml-0 md:ml-20'}`}>

          <header className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'profiles' && 'Profile Management'}
              {activeTab === 'contacts' && 'Contact Messages'}
              {activeTab === 'payments' && 'Payment Management'}
            </h1>
            <div className="flex items-center space-x-2">
              {activeTab === 'profiles' && (
                <button
                  onClick={downloadProfilesExcel}
                  className="hidden sm:flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="mr-2" /> Download Excel
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <FaBars size={18} />
              </button>
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
                {[
                  { label: 'Total Users', value: totalUsers, icon: <FaUsers className="text-blue-500" size={24} />, color: 'bg-blue-50', textColor: 'text-blue-600' },
                  { label: 'Paid Users', value: paidUsers, icon: <FaDollarSign className="text-green-500" size={24} />, color: 'bg-green-50', textColor: 'text-green-600' },
                  { label: 'Messages', value: totalContacts, icon: <FaEnvelope className="text-purple-500" size={24} />, color: 'bg-purple-50', textColor: 'text-purple-600' },
                  { label: 'Completed Profiles', value: profiles.filter(p => p.isCompleted).length, icon: <FaUser className="text-green-500" size={24} />, color: 'bg-green-50', textColor: 'text-green-600' },
                  { label: 'Total Payments', value: payments.length, icon: <FaCreditCard className="text-indigo-500" size={24} />, color: 'bg-indigo-50', textColor: 'text-indigo-600' },
                  { label: 'Verified Payments', value: payments.filter(p => p.status === 'Verified').length, icon: <FaCheck className="text-green-500" size={24} />, color: 'bg-green-50', textColor: 'text-green-600' },
                  { label: 'Total Images', value: profiles.reduce((sum, p) => sum + (p.images?.length || 0), 0), icon: <FaDownload className="text-indigo-500" size={24} />, color: 'bg-indigo-50', textColor: 'text-indigo-600' },
                  { label: 'Unpaid Users', value: totalUsers - paidUsers, icon: <FaCrown className="text-orange-500" size={24} />, color: 'bg-orange-50', textColor: 'text-orange-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className={`p-5 rounded-xl shadow-sm border border-gray-100 ${stat.color} flex items-start justify-between`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <h3 className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-white shadow-xs">
                      {stat.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">User Profiles</h2>
                {/* <button
                  onClick={() => setAddUserOpen(true)}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="mr-2" /> Add User
                </button> */}

                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search profiles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <select
                        value={filters.premium}
                        onChange={(e) => handleFilterChange('premium', e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="premium">Premium</option>
                        <option value="regular">Regular</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <FaFilter className="text-gray-400 text-xs" />
                      </div>
                    </div>
                    <button
                      onClick={downloadProfilesExcel}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors sm:hidden"
                      title="Download Excel"
                    >
                      <FaDownload size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {filteredProfiles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredProfiles.map(profile => (
                        <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                {profile.images?.[0] ? (
                                  <img
                                    src={profile.images[0]}
                                    alt={profile.user?.name || 'User'}
                                    className="h-10 w-10 rounded-full object-cover"
                                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FaUser className="text-gray-400" />
                                  </div>
                                )}
                                {profile.user?.premium && (
                                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                                    <FaCrown className="text-white text-xs" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{profile.user?.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">
                                  {profile.age || 'N/A'} • {profile.city || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                              {profile.user?.email || 'N/A'}
                            </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewProfile(profile._id)}
                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                title="View"
                              >
                                <FaEye size={14} />
                              </button>
                              <button
                                onClick={() => downloadProfilePDF(profile)}
                                className="text-green-600 hover:text-green-900 p-1.5 rounded-md hover:bg-green-50 transition-colors"
                                title="Download"
                              >
                                <FaDownload size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(profile._id)}
                                className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaUsers className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No profiles found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">User Management</h2>

                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.filter(user => 
                        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.mobile?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(user => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUser className="text-gray-400" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{user.creatorRole || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.mobile || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.gender || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isPaymentDone 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isPaymentDone ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewUserPayments(user)}
                                className="text-green-600 hover:text-green-900 p-1.5 rounded-md hover:bg-green-50 transition-colors"
                                title="View Payment Details"
                              >
                                <FaCreditCard size={14} />
                              </button>
                              <button
                                onClick={() => handleTogglePaymentStatus(user)}
                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                title={user.isPaymentDone ? 'Mark as Unpaid' : 'Mark as Paid'}
                              >
                                <FaDollarSign size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaUsers className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Contact Messages</h2>

                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {filteredContacts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredContacts.map(contact => (
                    <motion.div
                      key={contact._id}
                      className="p-5 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{contact.name || contact.contactInfo?.name || 'Unknown'}</h3>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="flex items-center text-sm text-gray-500">
                              <FaEnvelope className="mr-1.5 text-xs" /> {contact.email || contact.contactInfo?.email || 'N/A'}
                            </span>
                            {(contact.phone || contact.contactInfo?.phone) && (contact.phone || contact.contactInfo?.phone) !== 'Not provided' && (
                              <span className="flex items-center text-sm text-gray-500">
                                <FaPhoneAlt className="mr-1.5 text-xs" /> {contact.phone || contact.contactInfo?.phone}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                              {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : contact.contactInfo?.timeAgo || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ''}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteContact(contact._id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors text-xs flex items-center"
                              title="Delete Message"
                            >
                              <FaTrash size={14} className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          {(contact.subject || contact.contactInfo?.subject) ? (contact.subject || contact.contactInfo?.subject) : 'No subject'}
                        </h4>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {contact.message || contact.contactInfo?.message || 'No message'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaEnvelope className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No messages found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Payment Management</h2>

                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {payments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {payments.map(payment => (
                    <motion.div
                      key={payment._id}
                      className="p-5 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {payment.user?.name || 'Unknown User'}
                          </h3>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="flex items-center text-sm text-gray-500">
                              <FaCreditCard className="mr-1.5 text-xs" /> {payment.paymentMethod}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              ₹{payment.amount}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              payment.status === 'Verified' ? 'bg-green-100 text-green-800' :
                              payment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            {new Date(payment.createdAt).toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            {payment.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdatePaymentStatus(payment._id, 'Verified')}
                                  className="text-green-600 hover:text-green-900 p-1.5 rounded-md hover:bg-green-50 transition-colors text-xs flex items-center"
                                  title="Verify Payment"
                                >
                                  <FaCheck className="mr-1" /> Verify
                                </button>
                                <button
                                  onClick={() => handleUpdatePaymentStatus(payment._id, 'Rejected')}
                                  className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors text-xs flex items-center"
                                  title="Reject Payment"
                                >
                                  <FaTimes className="mr-1" /> Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeletePayment(payment._id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors text-xs flex items-center"
                              title="Delete Payment"
                            >
                              <FaTrash size={14} className="mr-1" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">UTR Number:</span>
                            <span className="ml-2 text-gray-600">{payment.utrNumber}</span>
                          </div>
                          {payment.upiId && (
                            <div>
                              <span className="font-medium text-gray-700">UPI ID:</span>
                              <span className="ml-2 text-gray-600">{payment.upiId}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">Payment Date:</span>
                            <span className="ml-2 text-gray-600">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </span>
                          </div>
                          {payment.remarks && (
                            <div className="sm:col-span-2">
                              <span className="font-medium text-gray-700">Remarks:</span>
                              <span className="ml-2 text-gray-600">{payment.remarks}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaCreditCard className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No payments found</h3>
                  <p className="text-gray-500">No payment records available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className="lg:col-span-1 bg-gray-50">
                  <div className="relative h-80 sm:h-96 lg:h-full">
                    <AnimatePresence mode="initial">
                      <motion.img
                        key={currentPhotoIndex}
                        src={selectedProfile.images?.[currentPhotoIndex] || 'https://via.placeholder.com/300x400'}
                        alt={`${selectedProfile.user?.name || 'Profile'} - Image ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/300x400')}
                      />
                    </AnimatePresence>
                    {selectedProfile.images?.length > 1 && (
                      <>
                        <button
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-300 shadow-md"
                          onClick={prevPhoto}
                          aria-label="Previous image"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-300 shadow-md"
                          onClick={nextPhoto}
                          aria-label="Next image"
                        >
                          <FaChevronRight />
                        </button>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                          {selectedProfile.images.map((_, index) => (
                            <button
                              key={index}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentPhotoIndex ? 'w-6 bg-blue-500' : 'w-2 bg-white/70'
                              }`}
                              onClick={() => setCurrentPhotoIndex(index)}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {selectedProfile.user?.premium && (
                        <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                          <FaCrown className="mr-1" /> Premium
                        </span>
                      )}
                      {selectedProfile.user?.verified && (
                        <span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-gray-500 text-sm">
                      Image {currentPhotoIndex + 1} of {selectedProfile.images?.length || 1}
                    </div>
                    <button
                      onClick={() => downloadProfilePDF(selectedProfile)}
                      className="flex items-center text-blue-500 font-medium text-sm hover:text-blue-600 transition-colors"
                    >
                      <FaDownload className="mr-2" /> Download Profile
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-2 p-6 sm:p-8">
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {selectedProfile.user?.name || 'Unknown'}, {selectedProfile.age || 'N/A'}
                    </h1>
                    <div className="flex flex-wrap items-center text-gray-600 text-sm sm:text-base gap-x-4 gap-y-2">
                      <span>{selectedProfile.hfeet && selectedProfile.hinch ? `${selectedProfile.hfeet}'${selectedProfile.hinch}"` : 'N/A'}</span>
                      <span>{selectedProfile.gotra || 'N/A'}</span>
                      <span>{selectedProfile.city || 'N/A'}</span>
                                              <span>{selectedProfile.user?.mobile || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                        About Me
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProfile.description || 'No information provided'}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          Registration Details
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Registration No</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.regdno || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Profile For</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.profilefor || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Marital Status</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.marital || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Gotra</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.gotra || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Age</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.age || 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          User Details
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Name</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.name || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Email</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.email || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Mobile</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.mobile || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Gender</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.gender || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Verified</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.verified ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Creator Role</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.creatorRole || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Role</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.role || 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          Personal Details
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Hobbies</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.hobbies?.join(', ') || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Languages</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.language?.join(', ') || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Height</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.hfeet && selectedProfile.hinch ? `${selectedProfile.hfeet}'${selectedProfile.hinch}"` : 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Weight</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.weight ? `${selectedProfile.weight} kg` : 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Body Type</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.body || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Complexion</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.complexion || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Physical Status</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.physical || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Education</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.education || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Occupation</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.occupation || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Employer</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.employed || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Income</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.income || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Food Preference</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.food || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Smoking</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.smoking || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Drinking</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.drinking || 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          Family Details
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Father's Name</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fname || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Father's Occupation</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.foccupation || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Mother's Name</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.mname || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Mother's Occupation</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.moccupation || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Family Status</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.status || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Family Type</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.type || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Brothers</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.bno || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Married Brothers</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.bmarried || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Brothers' Location</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.bwhere || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Sisters</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.sno || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Married Sisters</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.smarried || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Sisters' Location</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.swhere || 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          Additional Details
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Date of Birth</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.day && selectedProfile.month && selectedProfile.year ? `${selectedProfile.day} ${selectedProfile.month} ${selectedProfile.year}` : 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Place of Birth</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.place || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Time of Birth</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.time || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Day of Birth</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.daybirth || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Manglik</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.manglik || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Region</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.region || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Property Details</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.property || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Additional Info</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.anyother || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Spouse Preference</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.spouse || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Speciality</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.speciality || 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          Contact Information
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Address</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.address || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">City</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.city || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">District</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.district || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Pincode</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.pincode || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">State</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.state || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Country</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.country || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Email</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.email || 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Mobile</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.user?.mobile || 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          File Information
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Total Images</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fileInfo?.totalImages || 0}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Has Images</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fileInfo?.hasImages ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Image URLs</td>
                              <td className="py-2.5 text-gray-600">
                                {selectedProfile.fileInfo?.imageUrls?.length > 0 ? (
                                  <div className="space-y-1">
                                    {selectedProfile.fileInfo.imageUrls.map((url, index) => (
                                      <div key={index} className="text-xs break-all">
                                        {url}
                                      </div>
                                    ))}
                                  </div>
                                ) : 'No images uploaded'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                          Status
                        </h2>
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Profile Completion</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fileInfo?.profileCompletion ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Payment Status</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fileInfo?.paymentStatus ? 'Yes' : 'No'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Created At</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fileInfo?.createdAt ? new Date(selectedProfile.fileInfo.createdAt).toLocaleDateString() : 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="py-2.5 text-gray-600 font-medium">Updated At</td>
                              <td className="py-2.5 text-gray-600">{selectedProfile.fileInfo?.updatedAt ? new Date(selectedProfile.fileInfo.updatedAt).toLocaleDateString() : 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => {
                            handleDelete(selectedProfile._id);
                            closeModal();
                          }}
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center"
                        >
                          <FaTrash className="mr-2" /> Delete Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <AddUser isOpen={addUserOpen} onClose={() => setAddUserOpen(false)} onSuccess={null} /> */}
    </motion.div>
  );
}

export default AdminPanel;