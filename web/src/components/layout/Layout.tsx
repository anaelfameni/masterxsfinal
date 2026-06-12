import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex bg-bg text-fg relative overflow-x-hidden">
      {/* Ambient violet glow background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168, 85, 247, 0.12), transparent 70%), radial-gradient(ellipse 60% 40% at 100% 60%, rgba(124, 58, 237, 0.08), transparent 60%)',
        }}
      />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 lg:pl-[260px] relative z-10 min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
