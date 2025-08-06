'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Music, 
  X, 
  Crop, 
  Filter, 
  Palette, 
  Type, 
  Sticker,
  MapPin,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  Wand2,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface MediaFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video' | 'audio'
  filters?: string[]
  crop?: { x: number; y: number; width: number; height: number }
}

const filters = [
  { name: 'Original', class: 'filter-none', preview: 'brightness-100' },
  { name: 'Vintage', class: 'filter-vintage', preview: 'sepia-50 contrast-125' },
  { name: 'Dramatic', class: 'filter-dramatic', preview: 'contrast-150 saturate-150' },
  { name: 'Warm', class: 'filter-warm', preview: 'hue-rotate-15 saturate-125' },
  { name: 'Cool', class: 'filter-cool', preview: 'hue-rotate-180 saturate-110' },
  { name: 'B&W', class: 'filter-bw', preview: 'grayscale-100 contrast-125' },
  { name: 'Bright', class: 'filter-bright', preview: 'brightness-125 saturate-125' },
  { name: 'Moody', class: 'filter-moody', preview: 'brightness-75 contrast-125 saturate-75' },
]

export default function CreatePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'edit' | 'details'>('upload')
  const [selectedFilter, setSelectedFilter] = useState('Original')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [taggedUsers, setTaggedUsers] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        const id = Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)
        const type = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 'audio'

        setMediaFiles(prev => [...prev, {
          id,
          file,
          preview,
          type,
          filters: []
        }])
      }
    })

    if (files.length > 0) {
      setCurrentStep('edit')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== id))
    if (mediaFiles.length === 1) {
      setCurrentStep('upload')
    }
  }

  const generateAISuggestions = async () => {
    setIsLoading(true)
    try {
      // Simulate AI caption generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      const suggestions = [
        "Living my best life ✨ #blessed #vibes",
        "Another day, another adventure 🌟 #explore",
        "Capturing moments that matter 📸 #memories",
        "Feeling grateful for this beautiful day 🌅 #gratitude"
      ]
      setAiSuggestions(suggestions)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePost = async () => {
    setIsLoading(true)
    try {
      // Simulate posting
      await new Promise(resolve => setTimeout(resolve, 3000))
      router.push('/')
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderUploadStep = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="w-full max-w-md border-2 border-dashed border-purple-300 rounded-3xl p-12 text-center bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <motion.div
          className="mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
            <Upload className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Your Story</h3>
        <p className="text-gray-600 mb-6">Drag photos and videos here, or click to browse</p>

        <div className="flex justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <ImageIcon className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">Photos</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Video className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium">Videos</span>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Music className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Audio</span>
          </div>
        </div>

        <Button variant="gradient" size="lg" className="rounded-full">
          Select from device
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </motion.div>
  )

  const renderEditStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Media Preview */}
      <div className="relative aspect-square bg-black rounded-2xl overflow-hidden">
        {mediaFiles[0] && (
          <div className="relative w-full h-full">
            {mediaFiles[0].type === 'image' ? (
              <img
                src={mediaFiles[0].preview}
                alt="Preview"
                className={`w-full h-full object-cover ${filters.find(f => f.name === selectedFilter)?.preview || ''}`}
              />
            ) : mediaFiles[0].type === 'video' ? (
              <video
                src={mediaFiles[0].preview}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <Music className="w-20 h-20 text-white" />
              </div>
            )}

            {/* Edit Tools Overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button size="sm" variant="glass" className="rounded-full">
                <Crop className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="glass" className="rounded-full">
                <Palette className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="glass" className="rounded-full">
                <Type className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="glass" className="rounded-full">
                <Sticker className="w-4 h-4" />
              </Button>
            </div>

            {/* Multiple Files Indicator */}
            {mediaFiles.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                1 / {mediaFiles.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setSelectedFilter(filter.name)}
              className={`flex-shrink-0 relative ${
                selectedFilter === filter.name ? 'ring-2 ring-purple-500' : ''
              } rounded-xl overflow-hidden`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 ${filter.preview}`} />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white text-xs font-medium">{filter.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('upload')}>
          Back
        </Button>
        <Button variant="gradient" onClick={() => setCurrentStep('details')}>
          Next
        </Button>
      </div>
    </motion.div>
  )

  const renderDetailsStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* User Info */}
      <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-200">
        <Avatar size="md">
          <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
          <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-800">{session?.user?.name}</h3>
          <p className="text-sm text-gray-600">@{session?.user?.username}</p>
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-gray-800">Caption</label>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAISuggestions}
            disabled={isLoading}
            className="rounded-full"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI Assist
          </Button>
        </div>
        
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={4}
        />

        {/* AI Suggestions */}
        <AnimatePresence>
          {aiSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <p className="text-sm font-medium text-gray-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                AI Suggestions
              </p>
              {aiSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setCaption(suggestion)}
                  className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors text-sm"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="font-semibold text-gray-800 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Add location
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search for a location..."
          className="rounded-2xl"
        />
      </div>

      {/* Tag People */}
      <div className="space-y-3">
        <label className="font-semibold text-gray-800 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Tag people
        </label>
        <Input
          placeholder="Search for people to tag..."
          className="rounded-2xl"
        />
      </div>

      {/* Privacy Settings */}
      <div className="space-y-3">
        <label className="font-semibold text-gray-800">Privacy</label>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center space-x-3">
            {isPrivate ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
            <div>
              <p className="font-medium text-gray-800">
                {isPrivate ? 'Only followers can see' : 'Everyone can see'}
              </p>
              <p className="text-sm text-gray-600">
                {isPrivate ? 'Your post will be visible to your followers only' : 'Your post will be visible to everyone'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPrivate ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPrivate ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Post Button */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep('edit')} className="flex-1">
          Back
        </Button>
        <Button 
          variant="gradient" 
          onClick={handlePost}
          disabled={isLoading}
          loading={isLoading}
          className="flex-1"
        >
          <Zap className="w-4 h-4 mr-2" />
          Share Post
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
          <p className="text-gray-600 mt-1">Share your moments with the world</p>
        </div>

        {/* Step Indicator */}
        <div className="flex space-x-2">
          {['upload', 'edit', 'details'].map((step, index) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentStep === step
                  ? 'bg-purple-500'
                  : index < ['upload', 'edit', 'details'].indexOf(currentStep)
                  ? 'bg-purple-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'edit' && renderEditStep()}
        {currentStep === 'details' && renderDetailsStep()}
      </div>
    </div>
  )
}