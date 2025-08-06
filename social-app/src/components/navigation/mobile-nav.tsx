'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  User, 
  Menu,
  X
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'

const navigationItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: PlusSquare, label: 'Create', href: '/create' },
  { icon: Heart, label: 'Activity', href: '/notifications' },
  { icon: User, label: 'Profile', href: '/profile' },
]

const quickActions = [
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: Film, label: 'Reels', href: '/reels' },
  { icon: MessageCircle, label: 'Messages', href: '/messages' },
]

export function MobileNavigation() {
  const [showMenu, setShowMenu] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="flex items-center justify-around py-2 px-4">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.href === '/profile' && session?.user) {
              return (
                <Link key={item.href} href={`/${session.user.username}`}>
                  <motion.div
                    className="flex flex-col items-center py-2 px-3 rounded-xl"
                    whileTap={{ scale: 0.95 }}
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  >
                    <div className={`relative ${isActive ? 'ring-2 ring-purple-500 ring-offset-2' : ''} rounded-full`}>
                      <Avatar size="sm">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                    {isActive && (
                      <motion.div
                        className="w-1 h-1 bg-purple-500 rounded-full mt-1"
                        layoutId="mobileIndicator"
                      />
                    )}
                  </motion.div>
                </Link>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="flex flex-col items-center py-2 px-3 rounded-xl"
                  whileTap={{ scale: 0.95 }}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-purple-600' : 'text-gray-600'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      className="w-1 h-1 bg-purple-500 rounded-full mt-1"
                      layoutId="mobileIndicator"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}

          {/* Menu Button */}
          <motion.button
            onClick={() => setShowMenu(true)}
            className="flex flex-col items-center py-2 px-3 rounded-xl"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </motion.button>
        </div>
      </motion.div>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="fixed inset-x-4 top-20 bottom-20 bg-white/95 backdrop-blur-xl rounded-3xl z-50 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SocialApp
                </h2>
                <motion.button
                  onClick={() => setShowMenu(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={action.href} href={action.href}>
                        <motion.div
                          className="flex items-center space-x-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setShowMenu(false)}
                        >
                          <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-800">{action.label}</span>
                        </motion.div>
                      </Link>
                    )
                  })}
                </div>

                {/* Settings */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Settings</h3>
                  <Link href="/settings">
                    <motion.div
                      className="flex items-center space-x-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMenu(false)}
                    >
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">Settings & Privacy</span>
                    </motion.div>
                  </Link>
                </div>

                {/* User Profile */}
                {session?.user && (
                  <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center space-x-3">
                      <Avatar size="lg">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-800">{session.user.name}</h4>
                        <p className="text-sm text-gray-600">@{session.user.username}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}