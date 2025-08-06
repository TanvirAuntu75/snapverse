'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search as SearchIcon, 
  Filter, 
  Users, 
  Hash, 
  MapPin, 
  Calendar,
  Trending,
  Clock,
  X
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PostCard } from '@/components/post/post-card'
import { formatNumber } from '@/lib/utils'

interface SearchResult {
  type: 'user' | 'post' | 'hashtag' | 'location'
  id: string
  data: any
}

const trendingHashtags = [
  { tag: 'photography', posts: 2840000 },
  { tag: 'travel', posts: 1920000 },
  { tag: 'food', posts: 1560000 },
  { tag: 'art', posts: 1200000 },
  { tag: 'nature', posts: 980000 },
  { tag: 'fitness', posts: 850000 },
  { tag: 'sunset', posts: 720000 },
  { tag: 'architecture', posts: 650000 }
]

const suggestedUsers = [
  {
    id: '1',
    username: 'john_photographer',
    name: 'John Smith',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true,
    followers: 125000,
    bio: 'Professional photographer & visual storyteller'
  },
  {
    id: '2',
    username: 'sarah_travels',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
    verified: false,
    followers: 89000,
    bio: 'Travel blogger | Adventure seeker'
  },
  {
    id: '3',
    username: 'alex_chef',
    name: 'Alex Rodriguez',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true,
    followers: 67000,
    bio: 'Chef & food enthusiast | Recipe creator'
  }
]

const recentSearches = [
  { type: 'user', query: 'sarah_travels' },
  { type: 'hashtag', query: 'photography' },
  { type: 'location', query: 'New York' },
  { type: 'hashtag', query: 'sunset' }
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'users' | 'posts' | 'hashtags' | 'locations'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        // Mock search results
        const mockResults: SearchResult[] = [
          {
            type: 'user',
            id: '1',
            data: suggestedUsers[0]
          },
          {
            type: 'hashtag',
            id: '2',
            data: { tag: query.replace('#', ''), posts: Math.floor(Math.random() * 1000000) }
          }
        ]
        setResults(mockResults)
        setIsSearching(false)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsSearching(false)
    }
  }, [query])

  const clearSearch = () => {
    setQuery('')
    setResults([])
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
  }

  const renderSearchResult = (result: SearchResult) => {
    switch (result.type) {
      case 'user':
        return (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          >
            <Avatar size="md">
              <AvatarImage src={result.data.image} alt={result.data.name} />
              <AvatarFallback>{result.data.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900">{result.data.username}</h3>
                {result.data.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{result.data.name}</p>
              <p className="text-xs text-gray-500">{formatNumber(result.data.followers)} followers</p>
            </div>
            <Button variant="outline" size="sm">Follow</Button>
          </motion.div>
        )

      case 'hashtag':
        return (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <Hash className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">#{result.data.tag}</h3>
              <p className="text-sm text-gray-600">{formatNumber(result.data.posts)} posts</p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
        <SearchIcon className="w-10 h-10 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Amazing Content</h3>
      <p className="text-gray-600 text-center max-w-md">
        Search for people, hashtags, locations, and posts to find exactly what you're looking for
      </p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for people, hashtags, or locations..."
            className="pl-12 pr-12 h-14 text-lg rounded-2xl"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {['all', 'users', 'posts', 'hashtags', 'locations'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter as any)}
              className="capitalize whitespace-nowrap rounded-full"
            >
              {filter}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {query ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Results {query && `for "${query}"`}
                </h2>
                
                {isSearching ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map(renderSearchResult)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No results found for "{query}"</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <EmptyState />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Hashtags */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Trending className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Trending Hashtags</h3>
            </div>
            <div className="space-y-3">
              {trendingHashtags.map((hashtag, index) => (
                <motion.button
                  key={hashtag.tag}
                  onClick={() => handleSearch(`#${hashtag.tag}`)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">#{hashtag.tag}</p>
                      <p className="text-sm text-gray-600">{formatNumber(hashtag.posts)} posts</p>
                    </div>
                    <div className="text-xs text-gray-400">#{index + 1}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Suggested Users */}
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Suggested for You</h3>
            </div>
            <div className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Avatar size="sm">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <p className="font-medium text-sm text-gray-900 truncate">{user.username}</p>
                      {user.verified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.bio}</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Follow
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Searches */}
          {!query && (
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Recent Searches</h3>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search.query)}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {search.type === 'user' && <Users className="w-4 h-4 text-gray-600" />}
                      {search.type === 'hashtag' && <Hash className="w-4 h-4 text-gray-600" />}
                      {search.type === 'location' && <MapPin className="w-4 h-4 text-gray-600" />}
                    </div>
                    <span className="text-sm text-gray-900">{search.query}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}