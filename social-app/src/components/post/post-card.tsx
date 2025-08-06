'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CommentModal } from './comment-modal'
import { formatTimeAgo, formatNumber } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    author: {
      id: string
      username: string
      name: string
      image?: string
      verified: boolean
    }
    caption?: string
    mediaUrls: string[]
    mediaTypes: string[]
    location?: string
    createdAt: Date
    likesCount: number
    commentsCount: number
    isLiked: boolean
    isSaved: boolean
  }
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onSave?: (postId: string) => void
}

// Mock comments data - in real app this would come from API
const mockComments = [
  {
    id: '1',
    content: 'Amazing shot! 📸',
    author: {
      id: '2',
      username: 'photographer_pro',
      name: 'Pro Photographer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likesCount: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        content: 'Thank you! 🙏',
        author: {
          id: '1',
          username: 'johndoe',
          name: 'John Doe',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          verified: false
        },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likesCount: 3,
        isLiked: true,
        replies: [],
        parentId: '1'
      }
    ]
  },
  {
    id: '2',
    content: 'Love the colors! What camera did you use?',
    author: {
      id: '3',
      username: 'camera_geek',
      name: 'Camera Enthusiast',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
      verified: false
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likesCount: 8,
    isLiked: true,
    replies: []
  }
]

export function PostCard({ post, onLike, onComment, onShare, onSave }: PostCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isSaved, setIsSaved] = useState(post.isSaved)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(mockComments)
  const [commentsCount, setCommentsCount] = useState(post.commentsCount)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post.id)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(post.id)
  }

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike()
    }
  }

  const handleOpenComments = () => {
    setShowComments(true)
    onComment?.(post.id)
  }

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: {
        id: 'current-user',
        username: 'you',
        name: 'You',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      createdAt: new Date(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      parentId
    }

    if (parentId) {
      // Add as reply
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...comment.replies, newComment] }
          : comment
      ))
    } else {
      // Add as new comment
      setComments(prev => [newComment, ...prev])
      setCommentsCount(prev => prev + 1)
    }
  }

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likesCount: comment.isLiked ? comment.likesCount - 1 : comment.likesCount + 1
        }
      }
      // Check replies
      return {
        ...comment,
        replies: comment.replies.map(reply => 
          reply.id === commentId 
            ? {
                ...reply,
                isLiked: !reply.isLiked,
                likesCount: reply.isLiked ? reply.likesCount - 1 : reply.likesCount + 1
              }
            : reply
        )
      }
    }))
  }

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId))
    setCommentsCount(prev => prev - 1)
  }

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % post.mediaUrls.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + post.mediaUrls.length) % post.mediaUrls.length)
  }

  const truncatedCaption = post.caption && post.caption.length > 100 
    ? post.caption.slice(0, 100) + '...' 
    : post.caption

  return (
    <>
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Avatar size="md" verified={post.author.verified}>
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-sm">{post.author.username}</h3>
                {post.author.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {post.location && (
                <p className="text-xs text-gray-500">{post.location}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Media */}
        <div className="relative aspect-square bg-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMediaIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onDoubleClick={handleDoubleTap}
            >
              {post.mediaTypes[currentMediaIndex] === 'video' ? (
                <div className="relative w-full h-full">
                  <video
                    src={post.mediaUrls[currentMediaIndex]}
                    className="w-full h-full object-cover"
                    controls
                    poster={post.mediaUrls[currentMediaIndex].replace('.mp4', '.jpg')}
                  />
                  <div className="absolute top-4 left-4 bg-black/50 rounded-full p-2">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={post.mediaUrls[currentMediaIndex]}
                  alt={`Post by ${post.author.username}`}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Media Navigation */}
          {post.mediaUrls.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {post.mediaUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Like Animation */}
          <AnimatePresence>
            {isLiked && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="w-20 h-20 text-red-500 fill-current" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-1"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isLiked ? 'text-red-500 fill-current' : 'text-gray-700'
                  }`}
                />
              </motion.button>
              <motion.button
                onClick={handleOpenComments}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-6 h-6 text-gray-700" />
              </motion.button>
              <motion.button
                onClick={() => onShare?.(post.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  isSaved ? 'text-yellow-500 fill-current' : 'text-gray-700'
                }`}
              />
            </motion.button>
          </div>

          {/* Likes Count */}
          {likesCount > 0 && (
            <p className="font-semibold text-sm mb-2">
              {formatNumber(likesCount)} {likesCount === 1 ? 'like' : 'likes'}
            </p>
          )}

          {/* Caption */}
          {post.caption && (
            <div className="mb-2">
              <span className="font-semibold text-sm mr-2">{post.author.username}</span>
              <span className="text-sm">
                {showFullCaption ? post.caption : truncatedCaption}
                {post.caption.length > 100 && (
                  <button
                    onClick={() => setShowFullCaption(!showFullCaption)}
                    className="text-gray-500 ml-1"
                  >
                    {showFullCaption ? 'less' : 'more'}
                  </button>
                )}
              </span>
            </div>
          )}

          {/* Comments */}
          {commentsCount > 0 && (
            <button
              onClick={handleOpenComments}
              className="text-gray-500 text-sm mb-2 block hover:text-gray-700 transition-colors"
            >
              View all {formatNumber(commentsCount)} comments
            </button>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-400 uppercase">
            {formatTimeAgo(post.createdAt)}
          </p>
        </div>
      </motion.div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onDeleteComment={handleDeleteComment}
      />
    </>
  )
}