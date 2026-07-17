import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import ChatLayout from '../layouts/ChatLayout.jsx'
import ProtectedRoute from '../components/common/ProtectedRoute.jsx'
import Loader from '../components/common/Loader.jsx'

import LandingPage from '../pages/LandingPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import SignupPage from '../pages/auth/SignupPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ChatbotPage from '../pages/chatbot/ChatbotPage.jsx'
import DocumentAnalyzerPage from '../pages/documentAnalyzer/DocumentAnalyzerPage.jsx'
import KnowYourRightsPage from '../pages/rights/KnowYourRightsPage.jsx'
import CategoryDetailPage from '../pages/rights/CategoryDetailPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public marketing pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Authentication flow */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected application modules */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/document-analyzer" element={<DocumentAnalyzerPage />} />
          <Route path="/know-your-rights" element={<KnowYourRightsPage />} />
          <Route path="/know-your-rights/:categoryId" element={<CategoryDetailPage />} />
        </Route>

        {/* Chatbot uses a full-height custom layout (no footer / centered container) */}
        <Route
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>

        <Route path="*" element={<MainLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
