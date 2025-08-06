'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Reply, Send, MoreHorizontal, Flag } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatTimeAgo } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    username: string
    name: string
    image?: string
    verified: boolean
  }
  createdAt: Date
  likesCount: number
  isLiked: boolean
  replies: Comment[]
  parentId?: string
}

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  post: {
    id: string
    author: {
      username: string
      name: string
      image?: string
      verified: boolean
    }
    caption?: string
    mediaUrls: string[]
    createdAt: Date
  }
  comments: Comment[]
  onAddComment: (content: string, parentId?: string) => void
  onLikeComment: (commentId: string) => void
  onDeleteComment: (commentId: string) => void
}

export function CommentModal({
  isOpen,
  onClose,
  post,
  comments,
  onAddComment,
  onLikeComment,
  onDeleteComment
}: CommentModalProps) {
  const { data: session } = useSession()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const replyInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [replyingTo])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment('')
    }
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyContent.trim() && replyingTo) {
      onAddComment(replyContent.trim(), replyingTo)
      setReplyContent('')
      setReplyingTo(null)
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-12 mt-3' : 'mb-6'}`}
    >
      <div className="flex space-x-3">
        <Avatar size="sm">
          <AvatarImage src={comment.author.image} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-sm">{comment.author.username}</h4>
              {comment.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-800">{comment.content}</p>
          </div>

          <div className="flex items-center space-x-4 mt-2 px-2">
            <button
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center space-x-1 text-xs ${
                comment.isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}

            {session?.user?.id === comment.author.id && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            )}

            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {replyingTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmitReply}
                className="mt-3 flex space-x-2"
              >
                <Avatar size="sm">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                  <input
                    ref={replyInputRef}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.author.username}...`}
                    className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyContent.trim()}
                    className="rounded-full px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:h-[80vh] bg-white rounded-3xl z-50 flex overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Post Preview (Desktop) */}
            <div className="hidden md:block w-1/2 bg-black">
              <div className="relative w-full h-full">
                {post.mediaUrls[0] && (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Comments</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Post Info (Mobile) */}
              <div className="md:hidden p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar size="sm">
                    <AvatarImage src={post.author.image} alt={post.author.name} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">{post.author.username}</h3>
                    <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>
                {post.caption && (
                  <p className="text-sm text-gray-800">{post.caption}</p>
                )}
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Original Post Caption as Comment */}
                {post.caption && (
                  <div className="flex space-x-3 pb-4 border-b border-gray-100">
                    <Avatar size="sm">
                      <AvatarImage src={post.author.image} alt={post.author.name} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-sm">{post.author.username}</h4>
                        {post.author.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800">{post.caption}</p>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div>
                    {comments.map(comment => renderComment(comment))}
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSubmitComment} className="flex space-x-3">
                  <Avatar size="sm">
                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                    <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <input
                      ref={inputRef}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim()}
                      className="rounded-full px-6"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}