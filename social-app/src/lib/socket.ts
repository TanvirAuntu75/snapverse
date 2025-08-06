'use client'

import { io, Socket } from 'socket.io-client'

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(userId?: string): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    })

    this.setupEventListeners()
    return this.socket
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      this.handleReconnect()
    })

    // Real-time message events
    this.socket.on('new_message', (data) => {
      this.handleNewMessage(data)
    })

    this.socket.on('message_read', (data) => {
      this.handleMessageRead(data)
    })

    this.socket.on('user_typing', (data) => {
      this.handleUserTyping(data)
    })

    this.socket.on('user_online', (data) => {
      this.handleUserOnline(data)
    })

    this.socket.on('user_offline', (data) => {
      this.handleUserOffline(data)
    })

    // Notification events
    this.socket.on('new_notification', (data) => {
      this.handleNewNotification(data)
    })

    // Live streaming events
    this.socket.on('stream_started', (data) => {
      this.handleStreamStarted(data)
    })

    this.socket.on('stream_ended', (data) => {
      this.handleStreamEnded(data)
    })

    this.socket.on('viewer_count_update', (data) => {
      this.handleViewerCountUpdate(data)
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.pow(2, this.reconnectAttempts) * 1000 // Exponential backoff
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`)
        this.socket?.connect()
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  // Message handlers
  private handleNewMessage(data: any) {
    window.dispatchEvent(new CustomEvent('socket:new_message', { detail: data }))
  }

  private handleMessageRead(data: any) {
    window.dispatchEvent(new CustomEvent('socket:message_read', { detail: data }))
  }

  private handleUserTyping(data: any) {
    window.dispatchEvent(new CustomEvent('socket:user_typing', { detail: data }))
  }

  private handleUserOnline(data: any) {
    window.dispatchEvent(new CustomEvent('socket:user_online', { detail: data }))
  }

  private handleUserOffline(data: any) {
    window.dispatchEvent(new CustomEvent('socket:user_offline', { detail: data }))
  }

  private handleNewNotification(data: any) {
    window.dispatchEvent(new CustomEvent('socket:new_notification', { detail: data }))
  }

  private handleStreamStarted(data: any) {
    window.dispatchEvent(new CustomEvent('socket:stream_started', { detail: data }))
  }

  private handleStreamEnded(data: any) {
    window.dispatchEvent(new CustomEvent('socket:stream_ended', { detail: data }))
  }

  private handleViewerCountUpdate(data: any) {
    window.dispatchEvent(new CustomEvent('socket:viewer_count_update', { detail: data }))
  }

  // Public methods for emitting events
  sendMessage(conversationId: string, content: string, mediaUrl?: string) {
    this.socket?.emit('send_message', {
      conversationId,
      content,
      mediaUrl,
    })
  }

  markMessageAsRead(messageId: string) {
    this.socket?.emit('mark_message_read', { messageId })
  }

  startTyping(conversationId: string) {
    this.socket?.emit('start_typing', { conversationId })
  }

  stopTyping(conversationId: string) {
    this.socket?.emit('stop_typing', { conversationId })
  }

  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', { conversationId })
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', { conversationId })
  }

  // Live streaming methods
  startStream(streamData: any) {
    this.socket?.emit('start_stream', streamData)
  }

  endStream(streamId: string) {
    this.socket?.emit('end_stream', { streamId })
  }

  joinStream(streamId: string) {
    this.socket?.emit('join_stream', { streamId })
  }

  leaveStream(streamId: string) {
    this.socket?.emit('leave_stream', { streamId })
  }

  // Notification methods
  markNotificationAsRead(notificationId: string) {
    this.socket?.emit('mark_notification_read', { notificationId })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const socketManager = new SocketManager()

// React hook for using socket in components
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function useSocket() {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      const socketInstance = socketManager.connect(session.user.id)
      setSocket(socketInstance)

      const handleConnect = () => setIsConnected(true)
      const handleDisconnect = () => setIsConnected(false)

      socketInstance.on('connect', handleConnect)
      socketInstance.on('disconnect', handleDisconnect)

      setIsConnected(socketInstance.connected)

      return () => {
        socketInstance.off('connect', handleConnect)
        socketInstance.off('disconnect', handleDisconnect)
      }
    }
  }, [session?.user?.id])

  return { socket, isConnected }
}

// Custom hooks for specific socket events
export function useSocketEvent(event: string, handler: (data: any) => void) {
  useEffect(() => {
    const eventHandler = (e: CustomEvent) => handler(e.detail)
    window.addEventListener(`socket:${event}`, eventHandler as EventListener)
    
    return () => {
      window.removeEventListener(`socket:${event}`, eventHandler as EventListener)
    }
  }, [event, handler])
}

export function useTyping(conversationId: string) {
  const { socket } = useSocket()
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  useSocketEvent('user_typing', (data) => {
    if (data.conversationId === conversationId) {
      setTypingUsers(prev => 
        data.isTyping 
          ? [...prev.filter(id => id !== data.userId), data.userId]
          : prev.filter(id => id !== data.userId)
      )
    }
  })

  const startTyping = () => {
    socket?.emit('start_typing', { conversationId })
  }

  const stopTyping = () => {
    socket?.emit('stop_typing', { conversationId })
  }

  return { typingUsers, startTyping, stopTyping }
}