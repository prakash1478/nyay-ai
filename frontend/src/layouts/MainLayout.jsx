import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment-100 dark:bg-ink-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
