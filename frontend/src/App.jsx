import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Profiles from './pages/Profiles';
import ProfileDetail from './pages/ProfileDetail';
import Contact from './pages/Contact';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Ad from './pages/Ad';
import CompleteProfile from './pages/CompleteProfile';
import MyProfile from './pages/MyProfile';
import ScrollToTop from './components/layout/ScrollToTop';

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AuthRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);


  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        {/* Routes with Layout (header & footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="privacypolicy" element={<PrivacyPolicy />} />

          {/* Auth-only routes */}
          <Route
            path="login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />

          {/* Protected routes for "user" */}
          <Route
            path="profiles"
            element={
              <ProtectedRoute requiredRole="user">
                <Profiles />
              </ProtectedRoute>
            }
          />
          <Route
            path="profiles/:id"
            element={
              <ProtectedRoute requiredRole="user">
                <ProfileDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="complete-profile"
            element={
              <ProtectedRoute requiredRole="user">
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-profile"
            element={
              <ProtectedRoute requiredRole="user">
                <MyProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin routes (without layout) */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/ads"
          element={
            <ProtectedRoute requiredRole="admin">
              <Ad />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
