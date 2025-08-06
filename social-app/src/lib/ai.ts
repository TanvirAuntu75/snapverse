// AI-powered features for social media app
import { OpenAI } from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ContentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  hashtags: string[]
  mentions: string[]
  language: string
  toxicity: number // 0-1 scale
  engagement_prediction: number // 0-1 scale
}

export interface RecommendationContext {
  userId: string
  interests: string[]
  recentActivity: string[]
  followedUsers: string[]
  location?: string
  timeOfDay?: string
}

export class AIContentAnalyzer {
  // Analyze content for sentiment, topics, and safety
  async analyzeContent(content: string): Promise<ContentAnalysis> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Analyze the following social media content and return a JSON response with:
            - sentiment: positive/negative/neutral
            - topics: array of main topics/themes
            - hashtags: array of relevant hashtags (without #)
            - mentions: array of potential mentions (without @)
            - language: detected language code
            - toxicity: score 0-1 (0 = safe, 1 = toxic)
            - engagement_prediction: score 0-1 (likelihood of high engagement)`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      return result as ContentAnalysis
    } catch (error) {
      console.error('Content analysis failed:', error)
      // Return safe defaults
      return {
        sentiment: 'neutral',
        topics: [],
        hashtags: [],
        mentions: [],
        language: 'en',
        toxicity: 0,
        engagement_prediction: 0.5
      }
    }
  }

  // Generate smart hashtag suggestions
  async generateHashtags(content: string, imageAnalysis?: string[]): Promise<string[]> {
    try {
      const context = imageAnalysis ? `Content: ${content}\nImage contains: ${imageAnalysis.join(', ')}` : content

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Generate 5-10 relevant hashtags for this social media content. Return only the hashtag words without # symbol, separated by commas."
          },
          {
            role: "user",
            content: context
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })

      const hashtags = response.choices[0].message.content?.split(',').map(tag => tag.trim()) || []
      return hashtags.slice(0, 10) // Limit to 10 hashtags
    } catch (error) {
      console.error('Hashtag generation failed:', error)
      return []
    }
  }

  // Detect and classify images
  async analyzeImage(imageUrl: string): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and return a comma-separated list of objects, people, activities, and themes you can identify. Be concise and relevant for social media tagging."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 200
      })

      const tags = response.choices[0].message.content?.split(',').map(tag => tag.trim()) || []
      return tags
    } catch (error) {
      console.error('Image analysis failed:', error)
      return []
    }
  }

  // Content moderation using AI
  async moderateContent(content: string): Promise<{ safe: boolean; reasons: string[] }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Analyze this content for safety violations. Return JSON with:
            - safe: boolean (true if content is safe)
            - reasons: array of strings explaining any violations
            Check for: hate speech, harassment, violence, spam, misinformation, adult content`
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      })

      const result = JSON.parse(response.choices[0].message.content || '{"safe": true, "reasons": []}')
      return result
    } catch (error) {
      console.error('Content moderation failed:', error)
      return { safe: true, reasons: [] }
    }
  }
}

export class AIRecommendationEngine {
  // Generate personalized content recommendations
  async getContentRecommendations(context: RecommendationContext, limit: number = 20): Promise<string[]> {
    try {
      const prompt = `
        Generate ${limit} personalized content recommendations for a social media user with:
        - Interests: ${context.interests.join(', ')}
        - Recent activity: ${context.recentActivity.join(', ')}
        - Follows: ${context.followedUsers.length} users
        ${context.location ? `- Location: ${context.location}` : ''}
        ${context.timeOfDay ? `- Time: ${context.timeOfDay}` : ''}
        
        Return content topics/themes that would interest this user, one per line.
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a social media recommendation engine. Generate engaging, relevant content suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })

      const recommendations = response.choices[0].message.content?.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim()) || []

      return recommendations.slice(0, limit)
    } catch (error) {
      console.error('Recommendation generation failed:', error)
      return []
    }
  }

  // Smart feed curation
  async curatePersonalizedFeed(posts: any[], context: RecommendationContext): Promise<any[]> {
    const scoredPosts = await Promise.all(
      posts.map(async (post) => {
        const score = await this.calculateRelevanceScore(post, context)
        return { ...post, relevanceScore: score }
      })
    )

    // Sort by relevance score and apply diversity
    const sortedPosts = scoredPosts.sort((a, b) => b.relevanceScore - a.relevanceScore)
    return this.applyDiversityFilter(sortedPosts)
  }

  private async calculateRelevanceScore(post: any, context: RecommendationContext): Promise<number> {
    let score = 0.5 // Base score

    // Interest matching
    const postTopics = post.topics || []
    const commonInterests = context.interests.filter(interest => 
      postTopics.some((topic: string) => topic.toLowerCase().includes(interest.toLowerCase()))
    )
    score += commonInterests.length * 0.2

    // Author following
    if (context.followedUsers.includes(post.authorId)) {
      score += 0.3
    }

    // Engagement prediction
    if (post.engagement_prediction) {
      score += post.engagement_prediction * 0.2
    }

    // Recency boost
    const hoursOld = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)
    if (hoursOld < 24) {
      score += 0.1 * (1 - hoursOld / 24)
    }

    // Location relevance
    if (context.location && post.location) {
      if (post.location.includes(context.location)) {
        score += 0.15
      }
    }

    return Math.min(score, 1.0)
  }

  private applyDiversityFilter(posts: any[]): any[] {
    const diversePosts = []
    const seenAuthors = new Set()
    const seenTopics = new Set()

    for (const post of posts) {
      let shouldInclude = true

      // Limit posts per author
      if (seenAuthors.has(post.authorId)) {
        const authorPostCount = diversePosts.filter(p => p.authorId === post.authorId).length
        if (authorPostCount >= 3) {
          shouldInclude = false
        }
      }

      // Ensure topic diversity
      const postTopics = post.topics || []
      const hasNewTopic = postTopics.some((topic: string) => !seenTopics.has(topic))
      
      if (shouldInclude && (hasNewTopic || diversePosts.length < 10)) {
        diversePosts.push(post)
        seenAuthors.add(post.authorId)
        postTopics.forEach((topic: string) => seenTopics.add(topic))
      }

      if (diversePosts.length >= 50) break // Limit feed size
    }

    return diversePosts
  }

  // Trending content detection
  async detectTrendingTopics(posts: any[], timeWindow: number = 24): Promise<string[]> {
    const cutoffTime = Date.now() - (timeWindow * 60 * 60 * 1000)
    const recentPosts = posts.filter(post => new Date(post.createdAt).getTime() > cutoffTime)

    // Count topic frequency
    const topicCounts = new Map<string, number>()
    recentPosts.forEach(post => {
      (post.topics || []).forEach((topic: string) => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1)
      })
    })

    // Sort by frequency and return top trending topics
    const trending = Array.from(topicCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic)

    return trending
  }
}

export class AISmartFilters {
  // Smart content filtering
  async applySmartFilters(posts: any[], filters: SmartFilterOptions): Promise<any[]> {
    let filteredPosts = posts

    // Content quality filter
    if (filters.minQuality) {
      filteredPosts = filteredPosts.filter(post => 
        (post.engagement_prediction || 0.5) >= filters.minQuality
      )
    }

    // Sentiment filter
    if (filters.sentiment) {
      filteredPosts = filteredPosts.filter(post => 
        post.sentiment === filters.sentiment
      )
    }

    // Topic filter
    if (filters.topics && filters.topics.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        (post.topics || []).some((topic: string) => 
          filters.topics!.some(filterTopic => 
            topic.toLowerCase().includes(filterTopic.toLowerCase())
          )
        )
      )
    }

    // Toxicity filter
    if (filters.maxToxicity !== undefined) {
      filteredPosts = filteredPosts.filter(post => 
        (post.toxicity || 0) <= filters.maxToxicity!
      )
    }

    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        filters.languages!.includes(post.language || 'en')
      )
    }

    return filteredPosts
  }

  // Auto-generate content tags
  async generateContentTags(content: string, mediaUrls?: string[]): Promise<string[]> {
    const analyzer = new AIContentAnalyzer()
    const analysis = await analyzer.analyzeContent(content)
    
    let tags = [...analysis.topics, ...analysis.hashtags]

    // Add image-based tags if media is present
    if (mediaUrls && mediaUrls.length > 0) {
      for (const url of mediaUrls.slice(0, 3)) { // Limit to 3 images
        try {
          const imageTags = await analyzer.analyzeImage(url)
          tags = [...tags, ...imageTags]
        } catch (error) {
          console.error('Failed to analyze image:', error)
        }
      }
    }

    // Remove duplicates and limit
    return Array.from(new Set(tags)).slice(0, 20)
  }
}

export interface SmartFilterOptions {
  minQuality?: number // 0-1
  sentiment?: 'positive' | 'negative' | 'neutral'
  topics?: string[]
  maxToxicity?: number // 0-1
  languages?: string[]
}

// Export singleton instances
export const aiAnalyzer = new AIContentAnalyzer()
export const aiRecommendations = new AIRecommendationEngine()
export const aiFilters = new AISmartFilters()

// Utility function for batching AI requests
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5,
  delayMs: number = 1000
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
  
  return results
}