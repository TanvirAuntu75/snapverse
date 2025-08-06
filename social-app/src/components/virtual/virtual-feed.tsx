'use client'

import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { PostCard } from '@/components/post/post-card'

interface VirtualFeedProps {
  posts: any[]
  onLoadMore?: () => void
  hasNextPage?: boolean
  isLoading?: boolean
  itemHeight?: number
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onSave?: (postId: string) => void
}

interface VirtualItemProps {
  index: number
  style: React.CSSProperties
  data: {
    posts: any[]
    onLike?: (postId: string) => void
    onComment?: (postId: string) => void
    onShare?: (postId: string) => void
    onSave?: (postId: string) => void
  }
}

const VirtualItem: React.FC<VirtualItemProps> = ({ index, style, data }) => {
  const { posts, onLike, onComment, onShare, onSave } = data
  const post = posts[index]

  if (!post) {
    return (
      <div style={style} className="flex items-center justify-center p-8">
        <div className="animate-pulse bg-gray-200 rounded-xl w-full h-96" />
      </div>
    )
  }

  return (
    <div style={style} className="px-4 py-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <PostCard
          post={post}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onSave={onSave}
        />
      </motion.div>
    </div>
  )
}

export function VirtualFeed({
  posts,
  onLoadMore,
  hasNextPage = false,
  isLoading = false,
  itemHeight = 600,
  onLike,
  onComment,
  onShare,
  onSave
}: VirtualFeedProps) {
  const [containerHeight, setContainerHeight] = useState(800)
  const [listRef, setListRef] = useState<List | null>(null)

  // Intersection observer for infinite loading
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Load more posts when scroll reaches the end
  useEffect(() => {
    if (inView && hasNextPage && !isLoading && onLoadMore) {
      onLoadMore()
    }
  }, [inView, hasNextPage, isLoading, onLoadMore])

  // Update container height on window resize
  useEffect(() => {
    const updateHeight = () => {
      setContainerHeight(window.innerHeight - 200) // Account for header/nav
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Memoized item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    posts,
    onLike,
    onComment,
    onShare,
    onSave
  }), [posts, onLike, onComment, onShare, onSave])

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    listRef?.scrollToItem(0, 'start')
  }, [listRef])

  // Custom scroll behavior for smooth scrolling
  const handleScroll = useCallback((scrollOffset: number) => {
    // Add any custom scroll logic here
  }, [])

  return (
    <div className="relative w-full">
      {/* Virtual List */}
      <List
        ref={setListRef}
        height={containerHeight}
        itemCount={posts.length + (hasNextPage ? 1 : 0)} // +1 for loading indicator
        itemSize={itemHeight}
        itemData={itemData}
        onScroll={({ scrollOffset }) => handleScroll(scrollOffset)}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        overscanCount={2} // Render 2 extra items for smoother scrolling
      >
        {({ index, style }) => {
          // Show loading indicator at the end
          if (index === posts.length) {
            return (
              <div style={style} className="flex items-center justify-center p-8">
                <div ref={loadMoreRef}>
                  <AnimatePresence>
                    {isLoading ? (
                      <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-3 h-3 bg-purple-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-3 h-3 bg-purple-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-3 h-3 bg-purple-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                        <span className="ml-2 text-gray-600">Loading more posts...</span>
                      </motion.div>
                    ) : (
                      hasNextPage && (
                        <motion.div
                          className="text-gray-500 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Scroll to load more
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          }

          return (
            <VirtualItem
              index={index}
              style={style}
              data={itemData}
            />
          )
        }}
      </List>

      {/* Scroll to top button */}
      <AnimatePresence>
        <motion.button
          className="fixed bottom-8 right-8 bg-purple-500 text-white p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </AnimatePresence>

      {/* Performance metrics (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Posts: {posts.length}</div>
          <div>Container: {containerHeight}px</div>
          <div>Item Height: {itemHeight}px</div>
        </div>
      )}
    </div>
  )
}

// Hook for managing virtual feed state
export function useVirtualFeed(initialPosts: any[] = []) {
  const [posts, setPosts] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasNextPage) return

    setIsLoading(true)
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock new posts
      const newPosts = Array.from({ length: 10 }, (_, i) => ({
        id: `${page}-${i}`,
        author: {
          id: `user-${Math.floor(Math.random() * 100)}`,
          username: `user${Math.floor(Math.random() * 100)}`,
          name: `User ${Math.floor(Math.random() * 100)}`,
          verified: Math.random() > 0.8,
        },
        caption: `This is post ${page}-${i} with some interesting content!`,
        mediaUrls: [`https://picsum.photos/600/600?random=${page}-${i}`],
        mediaTypes: ['image'],
        createdAt: new Date(Date.now() - Math.random() * 86400000),
        likesCount: Math.floor(Math.random() * 1000),
        commentsCount: Math.floor(Math.random() * 100),
        isLiked: Math.random() > 0.7,
        isSaved: Math.random() > 0.9,
      }))

      setPosts(prev => [...prev, ...newPosts])
      setPage(prev => prev + 1)
      
      // Simulate end of data
      if (page >= 5) {
        setHasNextPage(false)
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasNextPage, page])

  const refreshPosts = useCallback(async () => {
    setIsLoading(true)
    setPosts([])
    setPage(1)
    setHasNextPage(true)
    
    try {
      // Load initial posts
      await loadMorePosts()
    } catch (error) {
      console.error('Failed to refresh posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [loadMorePosts])

  return {
    posts,
    isLoading,
    hasNextPage,
    loadMorePosts,
    refreshPosts,
    setPosts
  }
}