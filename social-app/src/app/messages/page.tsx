'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Phone, 
  Video, 
  Info, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  MoreHorizontal,
  ArrowLeft,
  Check,
  CheckCheck,
  Camera,
  Mic,
  Paperclip
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatTimeAgo } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface Conversation {
  id: string
  participants: {
    id: string
    username: string
    name: string
    image?: string
    isOnline: boolean
    lastSeen?: Date
  }[]
  lastMessage: {
    id: string
    content: string
    senderId: string
    createdAt: Date
    isRead: boolean
    type: 'text' | 'image' | 'video' | 'audio'
  }
  unreadCount: number
  isGroup: boolean
  groupName?: string
  groupImage?: string
}

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: Date
  isRead: boolean
  type: 'text' | 'image' | 'video' | 'audio'
  mediaUrl?: string
  replyTo?: {
    id: string
    content: string
    senderName: string
  }
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: '2',
        username: 'sarah_wilson',
        name: 'Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e2?w=150&h=150&fit=crop&crop=face',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg1',
      content: 'Hey! How are you doing? 😊',
      senderId: '2',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    unreadCount: 3,
    isGroup: false
  },
  {
    id: '2',
    participants: [
      {
        id: '3',
        username: 'alex_tech',
        name: 'Alex Rodriguez',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    lastMessage: {
      id: 'msg2',
      content: 'Thanks for the help with the project!',
      senderId: 'current-user',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    unreadCount: 0,
    isGroup: false
  },
  {
    id: '3',
    participants: [
      {
        id: '4',
        username: 'design_team',
        name: 'Design Team',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg3',
      content: 'New mockups are ready for review',
      senderId: '4',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
      type: 'text'
    },
    unreadCount: 1,
    isGroup: true,
    groupName: 'Design Team',
    groupImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop'
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing?',
    senderId: '2',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '2',
    content: "I'm doing great! Just finished working on the new project.",
    senderId: 'current-user',
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '3',
    content: 'That sounds awesome! Can you share some screenshots?',
    senderId: '2',
    createdAt: new Date(Date.now() - 6 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '4',
    content: 'Sure! Here are the latest designs',
    senderId: 'current-user',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'
  },
  {
    id: '5',
    content: 'Wow! These look incredible! 🔥',
    senderId: '2',
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    isRead: false,
    type: 'text'
  }
]

export default function MessagesPage() {
  const { data: session } = useSession()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedConversation && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedConversation])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content: newMessage.trim(),
      senderId: 'current-user',
      createdAt: new Date(),
      isRead: false,
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: { ...message, isRead: false } }
        : conv
    ))
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setShowMobileChat(true)
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    ))
  }

  const filteredConversations = conversations.filter(conv => {
    const participant = conv.participants[0]
    return participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const renderMessage = (message: Message, isOwn: boolean) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isOwn && (
        <Avatar size="sm" className="mr-2 mt-1">
          <AvatarImage src={selectedConversation?.participants[0]?.image} />
          <AvatarFallback>{selectedConversation?.participants[0]?.name[0]}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.type === 'text' ? (
            <p className="text-sm">{message.content}</p>
          ) : message.type === 'image' ? (
            <div>
              {message.content && <p className="text-sm mb-2">{message.content}</p>}
              <img
                src={message.mediaUrl}
                alt="Shared image"
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          ) : null}
        </div>
        
        <div className={`flex items-center mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(message.createdAt)}
          </span>
          {isOwn && (
            <div className="ml-1">
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  const ConversationsList = () => (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <Button size="sm" variant="ghost" className="rounded-full">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const participant = conversation.participants[0]
          const isSelected = selectedConversation?.id === conversation.id
          
          return (
            <motion.button
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-purple-50 border-r-2 border-purple-500' : ''
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar size="md">
                    <AvatarImage src={participant.image} alt={participant.name} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  {participant.isOnline && (
                    <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      {conversation.isGroup ? conversation.groupName : participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.senderId === 'current-user' && 'You: '}
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  const ChatView = () => {
    if (!selectedConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation to start messaging</p>
          </div>
        </div>
      )
    }

    const participant = selectedConversation.participants[0]

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileChat(false)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="relative">
                <Avatar size="md">
                  <AvatarImage src={participant.image} alt={participant.name} />
                  <AvatarFallback>{participant.name[0]}</AvatarFallback>
                </Avatar>
                {participant.isOnline && (
                  <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                <p className="text-sm text-gray-600">
                  {participant.isOnline ? 'Online' : `Last seen ${formatTimeAgo(participant.lastSeen!)}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Info className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => 
            renderMessage(message, message.senderId === 'current-user')
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="rounded-full pr-24"
                multiline
              />
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button type="button" variant="ghost" size="sm" className="rounded-full p-1">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full p-1">
                  <Camera className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full p-1">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="rounded-full p-3"
              variant="gradient"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-2rem)] max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        <div className="w-80">
          <ConversationsList />
        </div>
        <ChatView />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full">
        <AnimatePresence mode="wait">
          {!showMobileChat ? (
            <motion.div
              key="conversations"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="h-full"
            >
              <ConversationsList />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="h-full"
            >
              <ChatView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}