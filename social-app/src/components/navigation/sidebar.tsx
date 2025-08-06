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
  Settings,
  Menu,
  X,
  Bookmark,
  TrendingUp,
  Radio
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

const navigationItems = [
  { icon: Home, label: 'Home', href: '/', badge: null },
  { icon: Search, label: 'Search', href: '/search', badge: null },
  { icon: Compass, label: 'Explore', href: '/explore', badge: null },
  { icon: Film, label: 'Reels', href: '/reels', badge: null },
  { icon: MessageCircle, label: 'Messages', href: '/messages', badge: 5 },
  { icon: Heart, label: 'Notifications', href: '/notifications', badge: 12 },
  { icon: PlusSquare, label: 'Create', href: '/create', badge: null },
  { icon: Radio, label: 'Live', href: '/live', badge: null },
]

const moreItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Bookmark, label: 'Saved', href: '/saved' },
  { icon: TrendingUp, label: 'Your activity', href: '/activity' },
]

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showMore, setShowMore] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 ${
          isExpanded ? 'w-64' : 'w-16'
        } transition-all duration-300 ease-in-out`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <motion.h1
                className={`font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${
                  isExpanded ? 'block' : 'hidden'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ delay: 0.2 }}
              >
                SocialApp
              </motion.h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6">
            <div className="space-y-2">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 relative group ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative">
                          <Icon
                            className={`w-6 h-6 ${
                              isActive ? 'text-purple-600' : 'text-gray-600'
                            }`}
                          />
                          {item.badge && (
                            <motion.div
                              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                            >
                              {item.badge > 9 ? '9+' : item.badge}
                            </motion.div>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.span
                              className="ml-4 font-medium"
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {isActive && (
                          <motion.div
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-full"
                            layoutId="activeIndicator"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}

              {/* More Menu */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigationItems.length * 0.1 }}
              >
                <motion.button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center w-full px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Menu className="w-6 h-6" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        className="ml-4 font-medium"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        More
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                  {showMore && isExpanded && (
                    <motion.div
                      className="ml-6 mt-2 space-y-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {moreItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <Link key={item.href} href={item.href}>
                            <motion.div
                              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 4 }}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="ml-3 text-sm">{item.label}</span>
                            </motion.div>
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </nav>

          {/* User Profile */}
          {session?.user && (
            <motion.div
              className="p-4 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href={`/${session.user.username}`}>
                <motion.div
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar size="md">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                    <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-semibold text-sm">{session.user.name}</p>
                        <p className="text-xs text-gray-500">@{session.user.username}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  )
}