import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar.jsx'
import Footer from '../components/common/Footer.jsx'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment-100 dark:bg-ink-950">
      <Navbar />
      <main className="flex-1 container-page py-8 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
