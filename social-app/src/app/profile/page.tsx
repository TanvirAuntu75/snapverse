'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Grid, 
  Bookmark, 
  Tag, 
  Settings, 
  MoreHorizontal,
  Plus,
  Users,
  MapPin,
  Calendar,
  Link as LinkIcon,
  CheckCircle,
  Heart,
  MessageCircle,
  Play
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { formatNumber } from '@/lib/utils'

interface Post {
  id: string
  image: string
  type: 'image' | 'video' | 'carousel'
  likesCount: number
  commentsCount: number
}

const mockPosts: Post[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    type: 'image',
    likesCount: 234,
    commentsCount: 18
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    type: 'video',
    likesCount: 567,
    commentsCount: 45
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1464822759844-d150baec4ba5?w=400&h=400&fit=crop',
    type: 'carousel',
    likesCount: 892,
    commentsCount: 76
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    type: 'image',
    likesCount: 345,
    commentsCount: 23
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop',
    type: 'image',
    likesCount: 678,
    commentsCount: 34
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop',
    type: 'video',
    likesCount: 456,
    commentsCount: 28
  }
]

const mockStats = {
  posts: 156,
  followers: 12500,
  following: 234
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  const isOwnProfile = true // In real app, check if viewing own profile

  const renderPostIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <div className="absolute top-2 right-2">
            <Play className="w-4 h-4 text-white drop-shadow-lg" />
          </div>
        )
      case 'carousel':
        return (
          <div className="absolute top-2 right-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full drop-shadow-lg" />
              <div className="w-2 h-2 bg-white/60 rounded-full drop-shadow-lg" />
              <div className="w-2 h-2 bg-white/60 rounded-full drop-shadow-lg" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        className="card p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="relative">
              <Avatar size="xl" className="ring-4 ring-blue-400/50 shadow-2xl">
                <AvatarImage 
                  src={session?.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'} 
                  alt={session?.user?.name || 'User'} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {session?.user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full status-online" />
            </div>
            
            {isOwnProfile && (
              <motion.button
                className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white">
                  {session?.user?.username || 'username'}
                </h1>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant={isFollowing ? "outline" : "default"}
                      size="sm" 
                      className="rounded-full"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Message
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" className="rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {formatNumber(mockStats.posts)}
                </div>
                <div className="text-sm text-white/60">Posts</div>
              </div>
              <button className="text-center hover:scale-105 transition-transform">
                <div className="text-xl font-bold text-white">
                  {formatNumber(mockStats.followers)}
                </div>
                <div className="text-sm text-white/60">Followers</div>
              </button>
              <button className="text-center hover:scale-105 transition-transform">
                <div className="text-xl font-bold text-white">
                  {formatNumber(mockStats.following)}
                </div>
                <div className="text-sm text-white/60">Following</div>
              </button>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <h2 className="font-semibold text-white">
                {session?.user?.name || 'John Doe'}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                ✨ Creating magic through pixels and code<br/>
                📸 Visual storyteller & digital artist<br/>
                🌍 Exploring the world one frame at a time
              </p>
              <div className="flex items-center space-x-4 text-sm text-white/60">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href="#" className="text-blue-400 hover:underline">
                    snapverse.app
                  </a>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined March 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Highlights/Stories */}
      <motion.div
        className="card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {/* Add New Highlight */}
          {isOwnProfile && (
            <motion.button
              className="flex-shrink-0 flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 border-2 border-dashed border-white/40 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-white/60" />
              </div>
              <span className="text-xs text-white/60">New</span>
            </motion.button>
          )}

          {/* Highlight Items */}
          {['Travel', 'Food', 'Work', 'Friends'].map((highlight, index) => (
            <motion.button
              key={highlight}
              className="flex-shrink-0 flex flex-col items-center space-y-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full ring-2 ring-blue-400/50 p-0.5">
                <div className="w-full h-full bg-gray-300 rounded-full overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000 + index}0000000-0000-0000-0000-000000000000?w=64&h=64&fit=crop`}
                    alt={highlight}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs text-white/80">{highlight}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex bg-white/5 rounded-full p-1 backdrop-blur-sm">
          {[
            { id: 'posts', label: 'Posts', icon: Grid },
            { id: 'saved', label: 'Saved', icon: Bookmark },
            { id: 'tagged', label: 'Tagged', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full -z-10"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Posts Grid */}
      <motion.div
        className="grid grid-cols-3 gap-1 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'posts' && mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={post.image}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {renderPostIcon(post.type)}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center space-x-4 text-white">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-semibold">{formatNumber(post.likesCount)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span className="font-semibold">{formatNumber(post.commentsCount)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {activeTab === 'saved' && (
            <motion.div
              className="col-span-3 flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6">
                <Bookmark className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Saved Posts</h3>
              <p className="text-white/60 text-center max-w-md">
                Save posts you love to see them here. Tap the bookmark icon on any post to save it.
              </p>
            </motion.div>
          )}

          {activeTab === 'tagged' && (
            <motion.div
              className="col-span-3 flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6">
                <Tag className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Tagged Posts</h3>
              <p className="text-white/60 text-center max-w-md">
                Posts where you're tagged will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}