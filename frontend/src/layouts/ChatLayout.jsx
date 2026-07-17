import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar.jsx'

export default function ChatLayout() {
  return (
    <div className="h-screen flex flex-col bg-parchment-100 dark:bg-ink-950 overflow-hidden">
      <Navbar />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
