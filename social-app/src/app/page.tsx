'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PostCard } from '@/components/post/post-card'

// Sample data - in real app this would come from API
const samplePosts = [
  {
    id: '1',
    author: {
      id: '1',
      username: 'johndoe',
      name: 'John Doe',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    caption: 'Just had an amazing day exploring the city! The architecture here is absolutely stunning. Can\'t wait to share more photos from this incredible journey. #travel #architecture #citylife',
    mediaUrls: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=600&h=600&fit=crop',
    ],
    mediaTypes: ['image', 'image'],
    location: 'New York, NY',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likesCount: 1247,
    commentsCount: 89,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      id: '2',
      username: 'sarahwilson',
      name: 'Sarah Wilson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
      verified: false,
    },
    caption: 'Morning coffee and good vibes ☕️✨',
    mediaUrls: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
    ],
    mediaTypes: ['image'],
    location: 'San Francisco, CA',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likesCount: 892,
    commentsCount: 34,
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    author: {
      id: '3',
      username: 'alextech',
      name: 'Alex Rodriguez',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    caption: 'Working on something amazing! Stay tuned for the big reveal 🚀 #startup #tech #innovation',
    mediaUrls: [
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=600&fit=crop',
    ],
    mediaTypes: ['image'],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likesCount: 2156,
    commentsCount: 156,
    isLiked: false,
    isSaved: false,
  },
]

export default function HomePage() {
  const handleLike = (postId: string) => {
    console.log('Liked post:', postId)
    // In real app, this would make an API call
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
    // In real app, this would open comment modal
  }

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
    // In real app, this would open share modal
  }

  const handleSave = (postId: string) => {
    console.log('Save post:', postId)
    // In real app, this would make an API call
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to SocialApp
            </h1>
            <p className="text-gray-600">
              Discover amazing content from people around the world
            </p>
          </div>
          
          {/* Stories Preview */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-purple-500 bg-gray-200 flex items-center justify-center"
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=48&h=48&fit=crop&crop=face)`,
                    backgroundSize: 'cover'
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">View Stories</p>
          </div>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {samplePosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PostCard
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading More Indicator */}
      <motion.div
        className="flex justify-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-2 text-gray-500">
          <motion.div
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
          <span className="ml-2 text-sm">Loading more posts...</span>
        </div>
      </motion.div>
    </div>
  )
}
