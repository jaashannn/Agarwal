import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import './i18n'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: 'rgba(249, 244, 239, 0.95)',
              color: '#046A38',
              border: '1px solid #D4AF37',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#046A38',
                secondary: '#F9F4EF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#F9F4EF',
              },
              style: {
                color: '#EF4444',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)