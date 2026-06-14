import React from 'react'
import { useAuth } from '../../context/useAuth'
import { Bell, User, Menu } from "lucide-react"


export const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className='bg-white border-b border-gray-200 shadow-sm'>
      <div className='flex items-center justify-between p-4 lg:px-6'>
        {/* Left side - Menu button for mobile */}
        <div className='flex items-center gap-4'>
          <button
            onClick={toggleSidebar}
            className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Toggle sidebar'
          >
            <Menu size={24} />
          </button>
          {/* Optional: Add page title or breadcrumb here */}
        </div>

        {/* Right side - Notifications and User Profile */}
        <div className='flex items-center gap-4'>
          {/* Notification Bell */}
          <button className='relative p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <Bell size={22} className='text-gray-700' />
            {/* Notification indicator */}
            <span className='absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white'></span>
          </button>

          {/* User Profile */}
          <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
            <div className='hidden sm:block text-right'>
              <p className='text-sm font-semibold text-gray-900'>
                {user?.name || 'codecrafter'}
              </p>
              <p className='text-xs text-gray-500'>
                {user?.email || 'codecrafter@123gmail.com'}
              </p>
            </div>
            <div className='w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center'>
              <User size={18} className='text-white' />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
