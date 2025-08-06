import crypto from 'crypto'

// Advanced encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const TAG_LENGTH = 16 // 128 bits
const SALT_LENGTH = 32 // 256 bits

export class EncryptionManager {
  private masterKey: Buffer

  constructor(masterKey?: string) {
    if (masterKey) {
      this.masterKey = Buffer.from(masterKey, 'hex')
    } else {
      // Generate a new master key
      this.masterKey = crypto.randomBytes(KEY_LENGTH)
    }
  }

  // Generate a secure random key
  generateKey(): string {
    return crypto.randomBytes(KEY_LENGTH).toString('hex')
  }

  // Derive key from password using PBKDF2
  deriveKeyFromPassword(password: string, salt?: string): { key: string; salt: string } {
    const saltBuffer = salt ? Buffer.from(salt, 'hex') : crypto.randomBytes(SALT_LENGTH)
    const key = crypto.pbkdf2Sync(password, saltBuffer, 100000, KEY_LENGTH, 'sha256')
    
    return {
      key: key.toString('hex'),
      salt: saltBuffer.toString('hex')
    }
  }

  // Encrypt data with AES-256-GCM
  encrypt(data: string, key?: string): EncryptedData {
    try {
      const keyBuffer = key ? Buffer.from(key, 'hex') : this.masterKey
      const iv = crypto.randomBytes(IV_LENGTH)
      const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, keyBuffer)
      cipher.setAAD(Buffer.from('SocialApp-v1'))

      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: ENCRYPTION_ALGORITHM
      }
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`)
    }
  }

  // Decrypt data with AES-256-GCM
  decrypt(encryptedData: EncryptedData, key?: string): string {
    try {
      const keyBuffer = key ? Buffer.from(key, 'hex') : this.masterKey
      const decipher = crypto.createDecipher(encryptedData.algorithm, keyBuffer)
      
      decipher.setAAD(Buffer.from('SocialApp-v1'))
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'))

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`)
    }
  }

  // Hash password with bcrypt-like security
  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex')
    return `${salt}:${hash}`
  }

  // Verify password against hash
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':')
    const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex')
    return hash === passwordHash
  }

  // Generate secure tokens
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  // Create HMAC signature
  createSignature(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex')
  }

  // Verify HMAC signature
  verifySignature(data: string, signature: string, secret: string): boolean {
    const expectedSignature = this.createSignature(data, secret)
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  }
}

export interface EncryptedData {
  encrypted: string
  iv: string
  tag: string
  algorithm: string
}

// Content Security utilities
export class ContentSecurity {
  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  // Validate and sanitize URLs
  static sanitizeUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url)
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return null
      }

      // Block suspicious domains
      const blockedDomains = ['malicious.com', 'phishing.net'] // Add more as needed
      if (blockedDomains.some(domain => parsedUrl.hostname.includes(domain))) {
        return null
      }

      return parsedUrl.toString()
    } catch {
      return null
    }
  }

  // Generate Content Security Policy
  static generateCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "media-src 'self' https:",
      "connect-src 'self' wss: https:",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }

  // Rate limiting utilities
  static createRateLimiter(windowMs: number, maxRequests: number) {
    const requests = new Map<string, number[]>()

    return (identifier: string): boolean => {
      const now = Date.now()
      const windowStart = now - windowMs

      // Get existing requests for this identifier
      let userRequests = requests.get(identifier) || []
      
      // Filter out old requests
      userRequests = userRequests.filter(time => time > windowStart)
      
      // Check if limit exceeded
      if (userRequests.length >= maxRequests) {
        return false
      }

      // Add current request
      userRequests.push(now)
      requests.set(identifier, userRequests)

      return true
    }
  }
}

// Privacy utilities
export class PrivacyManager {
  // Anonymize sensitive data
  static anonymizeData(data: any, fields: string[]): any {
    const anonymized = { ...data }
    
    fields.forEach(field => {
      if (anonymized[field]) {
        if (typeof anonymized[field] === 'string') {
          anonymized[field] = this.maskString(anonymized[field])
        } else {
          anonymized[field] = '[REDACTED]'
        }
      }
    })

    return anonymized
  }

  // Mask sensitive strings
  private static maskString(str: string): string {
    if (str.length <= 4) return '*'.repeat(str.length)
    return str.substring(0, 2) + '*'.repeat(str.length - 4) + str.substring(str.length - 2)
  }

  // Generate privacy-compliant user ID
  static generatePrivateUserId(userId: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(userId).digest('hex').substring(0, 16)
  }

  // Data retention utilities
  static shouldDeleteData(createdAt: Date, retentionDays: number): boolean {
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000
    return Date.now() - createdAt.getTime() > retentionMs
  }
}

// Audit logging
export class AuditLogger {
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      details: event.details,
      severity: event.severity || 'info'
    }

    // In production, this would write to a secure audit log
    console.log('Security Event:', logEntry)
  }
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | '2fa_enable' | '2fa_disable' | 'suspicious_activity'
  userId?: string
  ip: string
  userAgent: string
  details?: any
  severity?: 'info' | 'warning' | 'error' | 'critical'
}

// Initialize global encryption manager
export const encryptionManager = new EncryptionManager(process.env.ENCRYPTION_KEY)