'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign, 
  Share2,
  Zap,
  Filter,
  CheckCircle
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatTimeAgo } from '@/lib/utils'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share'
  user: {
    id: string
    username: string
    name: string
    image?: string
    verified: boolean
  }
  post?: {
    id: string
    image: string
  }
  content?: string
  createdAt: Date
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: {
      id: '2',
      username: 'sarah_photographer',
      name: 'Sarah Wilson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    post: {
      id: '1',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
    },
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false
  },
  {
    id: '2',
    type: 'comment',
    user: {
      id: '3',
      username: 'alex_tech',
      name: 'Alex Rodriguez',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false
    },
    post: {
      id: '2',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop'
    },
    content: 'Amazing shot! Love the composition 📸',
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false
  },
  {
    id: '3',
    type: 'follow',
    user: {
      id: '4',
      username: 'emma_designer',
      name: 'Emma Chen',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true
  },
  {
    id: '4',
    type: 'mention',
    user: {
      id: '5',
      username: 'travel_blogger',
      name: 'Mike Johnson',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      verified: false
    },
    post: {
      id: '3',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec4ba5?w=100&h=100&fit=crop'
    },
    content: 'Check out this amazing view! @you would love this place',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500" />
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />
      case 'mention': return <AtSign className="w-5 h-5 text-purple-500" />
      case 'share': return <Share2 className="w-5 h-5 text-yellow-500" />
      default: return <Zap className="w-5 h-5 text-blue-500" />
    }
  }

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post'
      case 'comment':
        return 'commented on your post'
      case 'follow':
        return 'started following you'
      case 'mention':
        return 'mentioned you in a post'
      case 'share':
        return 'shared your post'
      default:
        return 'interacted with your content'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text text-shadow">
              Notifications
            </h1>
            <p className="text-white/60 mt-1">Stay updated with your activity</p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="rounded-full border-white/20 text-white/80 hover:bg-white/10"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="rounded-full relative"
          >
            Unread
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <motion.div
            className="card p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </h3>
            <p className="text-white/60">
              {filter === 'unread' 
                ? 'You have no unread notifications' 
                : 'Your notifications will appear here'
              }
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`card interactive p-4 cursor-pointer ${
                !notification.isRead 
                  ? 'border-blue-500/30 bg-blue-500/5' 
                  : 'border-white/10'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Notification Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  {!notification.isRead && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <Avatar size="md" className="ring-2 ring-white/20">
                    <AvatarImage src={notification.user.image} alt={notification.user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {notification.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white">
                      {notification.user.username}
                    </span>
                    {notification.user.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <span className="text-white/80">
                      {getNotificationText(notification)}
                    </span>
                  </div>

                  {notification.content && (
                    <p className="text-white/70 text-sm mb-2 line-clamp-2">
                      "{notification.content}"
                    </p>
                  )}

                  <p className="text-white/50 text-xs">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>

                {/* Post Thumbnail */}
                {notification.post && (
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-white/20">
                      <img
                        src={notification.post.image}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}