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
  Zap,
  Sparkles
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

const navigationItems = [
  { icon: Home, label: 'Home', href: '/', badge: null },
  { icon: Search, label: 'Search', href: '/search', badge: null },
  { icon: Compass, label: 'Explore', href: '/explore', badge: null },
  { icon: Film, label: 'Reels', href: '/reels', badge: null },
  { icon: MessageCircle, label: 'Messages', href: '/messages', badge: 3 },
  { icon: Heart, label: 'Notifications', href: '/notifications', badge: 12 },
  { icon: PlusSquare, label: 'Create', href: '/create', badge: null },
]

const moreItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showMore, setShowMore] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full glass-strong border-r border-white/10 z-30 transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo/Brand */}
        <motion.div 
          className="flex items-center space-x-3 mb-8 p-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <h1 className="text-xl font-bold gradient-text text-shadow">
                  SnapVerse
                </h1>
                <p className="text-xs text-white/60">Next-Gen Social</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto rounded-full hover:bg-white/10 text-white/80"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`nav-item group relative flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                      : 'hover:bg-white/5 hover:border hover:border-white/10'
                  }`}
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative">
                    <Icon 
                      className={`w-6 h-6 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-white/70 group-hover:text-white'
                      }`} 
                    />
                    {item.badge && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </motion.div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={`font-medium transition-colors ${
                          isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* More Menu */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <motion.button
            onClick={() => setShowMore(!showMore)}
            className="nav-item w-full flex items-center space-x-3 rounded-xl hover:bg-white/5 transition-all duration-300"
            whileHover={{ x: 4 }}
          >
            <Menu className="w-6 h-6 text-white/70" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium text-white/80"
                >
                  More
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {showMore && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1 overflow-hidden"
              >
                {moreItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        className={`nav-item flex items-center space-x-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30' 
                            : 'hover:bg-white/5'
                        }`}
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/70'}`} />
                        <span className={`font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                          {item.label}
                        </span>
                      </motion.div>
                    </Link>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        {session?.user && (
          <motion.div
            className="mt-4 p-3 rounded-xl glass border border-white/10 hover:border-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar size="md" className="ring-2 ring-blue-400/50">
                  <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {session.user.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full status-online" />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="font-semibold text-white text-sm truncate">
                      {session.user.name}
                    </p>
                    <p className="text-white/60 text-xs truncate">
                      @{session.user.username || 'user'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}