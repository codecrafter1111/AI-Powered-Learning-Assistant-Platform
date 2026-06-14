import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, BookOpen, LogOut, BrainCircuit, User, X } from 'lucide-react'
import { useAuth } from '../../context/useAuth'

export const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navLinks = [
    { path: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { path: '/documents', icon: FileText, text: 'Documents' },
    { path: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { path: '/profile', icon: User, text: 'Profile' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0  z-50
          w-70 bg-white  shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo/Brand Section */}
        <div className="flex items-center justify-between p-4 shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <BrainCircuit size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-base">AI Learning Assistant</h1>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X size={25} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        toggleSidebar()
                      }
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors duration-200 ${isActive
                        ? 'bg-linear-to-r from-emerald-500  to-teal-500 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.text}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full  text-gray-700 hover:bg-red-300 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )

}
