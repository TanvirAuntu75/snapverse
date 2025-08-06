'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Smartphone, 
  Globe, 
  Lock, 
  Heart,
  MessageSquare,
  Camera,
  Palette,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  Check,
  X
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession, signOut } from 'next-auth/react'

interface SettingSection {
  id: string
  title: string
  icon: any
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description?: string
  type: 'toggle' | 'select' | 'input' | 'action'
  value?: any
  options?: { label: string; value: any }[]
  action?: () => void
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState('account')
  const [settings, setSettings] = useState({
    // Account settings
    username: session?.user?.username || '',
    name: session?.user?.name || '',
    bio: '',
    website: '',
    phone: '',
    email: session?.user?.email || '',
    
    // Privacy settings
    privateAccount: false,
    hideActiveStatus: false,
    allowTagging: true,
    allowMentions: true,
    showActivityStatus: true,
    
    // Notification settings
    pushNotifications: true,
    emailNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    messageNotifications: true,
    
    // Display settings
    darkMode: false,
    language: 'en',
    autoPlayVideos: true,
    showSensitiveContent: false,
    
    // Security settings
    twoFactorAuth: false,
    loginAlerts: true,
    suspiciousActivity: true,
  })

  const settingSections: SettingSection[] = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      items: [
        {
          id: 'username',
          label: 'Username',
          description: 'Your unique username',
          type: 'input',
          value: settings.username
        },
        {
          id: 'name',
          label: 'Display Name',
          description: 'Your display name',
          type: 'input',
          value: settings.name
        },
        {
          id: 'bio',
          label: 'Bio',
          description: 'Tell people about yourself',
          type: 'input',
          value: settings.bio
        },
        {
          id: 'website',
          label: 'Website',
          description: 'Your website or portfolio',
          type: 'input',
          value: settings.website
        },
        {
          id: 'phone',
          label: 'Phone Number',
          description: 'Your phone number',
          type: 'input',
          value: settings.phone
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          id: 'privateAccount',
          label: 'Private Account',
          description: 'Only approved followers can see your posts',
          type: 'toggle',
          value: settings.privateAccount
        },
        {
          id: 'hideActiveStatus',
          label: 'Hide Active Status',
          description: "Don't show when you're active",
          type: 'toggle',
          value: settings.hideActiveStatus
        },
        {
          id: 'allowTagging',
          label: 'Allow Tagging',
          description: 'Let others tag you in posts',
          type: 'toggle',
          value: settings.allowTagging
        },
        {
          id: 'allowMentions',
          label: 'Allow Mentions',
          description: 'Let others mention you in comments',
          type: 'toggle',
          value: settings.allowMentions
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          id: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your device',
          type: 'toggle',
          value: settings.pushNotifications
        },
        {
          id: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive notifications via email',
          type: 'toggle',
          value: settings.emailNotifications
        },
        {
          id: 'likeNotifications',
          label: 'Likes',
          description: 'Get notified when someone likes your post',
          type: 'toggle',
          value: settings.likeNotifications
        },
        {
          id: 'commentNotifications',
          label: 'Comments',
          description: 'Get notified when someone comments on your post',
          type: 'toggle',
          value: settings.commentNotifications
        },
        {
          id: 'followNotifications',
          label: 'New Followers',
          description: 'Get notified when someone follows you',
          type: 'toggle',
          value: settings.followNotifications
        }
      ]
    },
    {
      id: 'display',
      title: 'Display & Accessibility',
      icon: Eye,
      items: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme',
          type: 'toggle',
          value: settings.darkMode
        },
        {
          id: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: settings.language,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Japanese', value: 'ja' }
          ]
        },
        {
          id: 'autoPlayVideos',
          label: 'Auto-play Videos',
          description: 'Automatically play videos in feed',
          type: 'toggle',
          value: settings.autoPlayVideos
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      icon: Lock,
      items: [
        {
          id: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'toggle',
          value: settings.twoFactorAuth
        },
        {
          id: 'loginAlerts',
          label: 'Login Alerts',
          description: 'Get notified of new login attempts',
          type: 'toggle',
          value: settings.loginAlerts
        },
        {
          id: 'changePassword',
          label: 'Change Password',
          description: 'Update your password',
          type: 'action',
          action: () => console.log('Change password')
        },
        {
          id: 'downloadData',
          label: 'Download Your Data',
          description: 'Download a copy of your data',
          type: 'action',
          action: () => console.log('Download data')
        }
      ]
    }
  ]

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.label}</h3>
              {item.description && (
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => updateSetting(item.id, !item.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                item.value ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  item.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )

      case 'select':
        return (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{item.label}</h3>
            {item.description && (
              <p className="text-sm text-gray-500 mb-3">{item.description}</p>
            )}
            <select
              value={item.value}
              onChange={(e) => updateSetting(item.id, e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {item.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'input':
        return (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{item.label}</h3>
            {item.description && (
              <p className="text-sm text-gray-500 mb-3">{item.description}</p>
            )}
            <Input
              value={item.value}
              onChange={(e) => updateSetting(item.id, e.target.value)}
              className="rounded-xl"
              placeholder={`Enter your ${item.label.toLowerCase()}`}
            />
          </div>
        )

      case 'action':
        return (
          <button
            onClick={item.action}
            className="flex items-center justify-between w-full text-left hover:bg-gray-50 rounded-xl p-3 -m-3 transition-colors"
          >
            <div>
              <h3 className="font-medium text-gray-900">{item.label}</h3>
              {item.description && (
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )

      default:
        return null
    }
  }

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', settings)
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <motion.div
          className="lg:w-80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Profile Summary */}
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
              <Avatar size="lg">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{session?.user?.name}</h3>
                <p className="text-sm text-gray-600">@{session?.user?.username}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {settingSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                )
              })}

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors mt-4 pt-4 border-t border-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {settingSections.map((section) => (
              <div
                key={section.id}
                className={activeSection === section.id ? 'block' : 'hidden'}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <section.icon className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-8">
                  {section.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
                    >
                      {renderSettingItem(item)}
                    </motion.div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                  <Button onClick={handleSave} variant="gradient" size="lg">
                    Save Changes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}