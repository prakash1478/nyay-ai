import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0F1B2D',
            color: '#F7F4EC',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            borderRadius: '10px',
            border: '1px solid rgba(184,147,95,0.3)',
          },
          success: { iconTheme: { primary: '#B8935F', secondary: '#0F1B2D' } },
        }}
      />
    </ErrorBoundary>
  )
}
