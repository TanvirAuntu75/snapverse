import { NextRequest } from 'next/server'

export interface MediaUploadOptions {
  maxFileSize?: number // in bytes
  allowedTypes?: string[]
  quality?: number // 0-1 for compression
  maxWidth?: number
  maxHeight?: number
}

export interface MediaProcessingResult {
  url: string
  thumbnailUrl?: string
  width: number
  height: number
  size: number
  type: string
  duration?: number // for videos
}

const DEFAULT_OPTIONS: MediaUploadOptions = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'],
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1920,
}

export class MediaProcessor {
  private options: MediaUploadOptions

  constructor(options: Partial<MediaUploadOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  async processFile(file: File): Promise<MediaProcessingResult> {
    // Validate file
    this.validateFile(file)

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (isImage) {
      return this.processImage(file)
    } else if (isVideo) {
      return this.processVideo(file)
    } else {
      throw new Error('Unsupported file type')
    }
  }

  private validateFile(file: File): void {
    if (!this.options.allowedTypes?.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    if (this.options.maxFileSize && file.size > this.options.maxFileSize) {
      throw new Error(`File size ${file.size} exceeds maximum ${this.options.maxFileSize}`)
    }
  }

  private async processImage(file: File): Promise<MediaProcessingResult> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      img.onload = () => {
        try {
          // Calculate new dimensions
          const { width, height } = this.calculateDimensions(img.width, img.height)

          canvas.width = width
          canvas.height = height

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                reject(new Error('Failed to process image'))
                return
              }

              // Generate thumbnail
              const thumbnailCanvas = document.createElement('canvas')
              const thumbnailCtx = thumbnailCanvas.getContext('2d')!
              const thumbnailSize = 300

              thumbnailCanvas.width = thumbnailSize
              thumbnailCanvas.height = thumbnailSize
              thumbnailCtx.drawImage(img, 0, 0, thumbnailSize, thumbnailSize)

              thumbnailCanvas.toBlob(
                async (thumbnailBlob) => {
                  try {
                    // Upload main image and thumbnail
                    const [mainUrl, thumbnailUrl] = await Promise.all([
                      this.uploadToStorage(blob, `image_${Date.now()}.jpg`),
                      thumbnailBlob ? this.uploadToStorage(thumbnailBlob, `thumb_${Date.now()}.jpg`) : null
                    ])

                    resolve({
                      url: mainUrl,
                      thumbnailUrl: thumbnailUrl || undefined,
                      width,
                      height,
                      size: blob.size,
                      type: file.type,
                    })
                  } catch (error) {
                    reject(error)
                  }
                },
                'image/jpeg',
                this.options.quality
              )
            },
            'image/jpeg',
            this.options.quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  private async processVideo(file: File): Promise<MediaProcessingResult> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      video.onloadedmetadata = async () => {
        try {
          // Get video dimensions and duration
          const { width, height } = this.calculateDimensions(video.videoWidth, video.videoHeight)
          const duration = video.duration

          // Generate thumbnail from first frame
          canvas.width = 300
          canvas.height = 300
          video.currentTime = 1 // 1 second in
          
          video.onseeked = async () => {
            ctx.drawImage(video, 0, 0, 300, 300)
            
            canvas.toBlob(
              async (thumbnailBlob) => {
                try {
                  // Upload video and thumbnail
                  const [videoUrl, thumbnailUrl] = await Promise.all([
                    this.uploadToStorage(file, `video_${Date.now()}.${file.type.split('/')[1]}`),
                    thumbnailBlob ? this.uploadToStorage(thumbnailBlob, `video_thumb_${Date.now()}.jpg`) : null
                  ])

                  resolve({
                    url: videoUrl,
                    thumbnailUrl: thumbnailUrl || undefined,
                    width,
                    height,
                    size: file.size,
                    type: file.type,
                    duration,
                  })
                } catch (error) {
                  reject(error)
                }
              },
              'image/jpeg',
              0.8
            )
          }
        } catch (error) {
          reject(error)
        }
      }

      video.onerror = () => reject(new Error('Failed to load video'))
      video.src = URL.createObjectURL(file)
    })
  }

  private calculateDimensions(originalWidth: number, originalHeight: number): { width: number; height: number } {
    const maxWidth = this.options.maxWidth || 1920
    const maxHeight = this.options.maxHeight || 1920

    let { width, height } = { width: originalWidth, height: originalHeight }

    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  private async uploadToStorage(blob: Blob, filename: string): Promise<string> {
    // In a real application, this would upload to a cloud storage service
    // like AWS S3, Cloudinary, or similar
    const formData = new FormData()
    formData.append('file', blob, filename)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const result = await response.json()
    return result.url
  }
}

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getMediaType(file: File): 'image' | 'video' | 'unknown' {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return 'unknown'
}

export function generateThumbnail(file: File, size: number = 300): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = size
    canvas.height = size

    if (file.type.startsWith('image/')) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to generate thumbnail'))
          },
          'image/jpeg',
          0.8
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        video.currentTime = 1
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, size, size)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Failed to generate video thumbnail'))
            },
            'image/jpeg',
            0.8
          )
        }
      }
      video.onerror = () => reject(new Error('Failed to load video'))
      video.src = URL.createObjectURL(file)
    } else {
      reject(new Error('Unsupported file type for thumbnail generation'))
    }
  })
}

// Content moderation utilities
export async function moderateContent(imageUrl: string): Promise<{ safe: boolean; reasons?: string[] }> {
  try {
    // In a real app, this would use a service like Google Vision API or AWS Rekognition
    const response = await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    })

    if (!response.ok) {
      throw new Error('Moderation failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Content moderation error:', error)
    // Fail open - allow content if moderation fails
    return { safe: true }
  }
}