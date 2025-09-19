import { NextRequest, NextResponse } from 'next/server'
import { getPostWithServices, getAllPosts } from '@/lib/blog'
import type { PostWithServices, BlogPostMetadata } from '@/lib/blog'

export interface ReadingProgressInfo {
  estimatedReadingTime: number
  wordCount: number
  headingCount: number
}

export interface BlogPostResponse {
  post: PostWithServices
  relatedPosts: BlogPostMetadata[]
  readingProgress: ReadingProgressInfo
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Get the blog post with service integration
    const post = getPostWithServices(slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get related posts based on tags, category, or services
    const relatedPosts = getRelatedPosts(post, 3)
    
    // Calculate reading progress info
    const readingProgress = calculateReadingProgress(post)

    const response: BlogPostResponse = {
      post,
      relatedPosts,
      readingProgress
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getRelatedPosts(currentPost: PostWithServices, limit: number = 3): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug)
  
  // Score posts based on similarity
  const scoredPosts = otherPosts.map(post => {
    let score = 0
    
    // Category match (high weight)
    if (post.category === currentPost.category) score += 10
    
    // Tag matches (medium weight)
    const tagMatches = post.tags.filter(tag => 
      currentPost.tags.includes(tag)
    ).length
    score += tagMatches * 5
    
    // Service matches (high weight)
    const serviceMatches = (post.targetedServices || []).filter(serviceId =>
      (currentPost.targetedServices || []).includes(serviceId) ||
      currentPost.primaryService === serviceId
    ).length
    score += serviceMatches * 8
    
    // Content type match (low weight)
    if (post.type === currentPost.type) score += 3
    
    // Difficulty level similarity (low weight)
    if (post.difficulty === currentPost.difficulty) score += 2
    
    return { post, score }
  })
  
  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post)
}

function calculateReadingProgress(post: PostWithServices): ReadingProgressInfo {
  const wordCount = post.content.split(/\s+/).length
  const estimatedReadingTime = Math.ceil(wordCount / 200) // Average reading speed
  
  // Count headings in the content
  const headingMatches = post.content.match(/^#{1,6}\s/gm)
  const headingCount = headingMatches ? headingMatches.length : 0
  
  return {
    estimatedReadingTime,
    wordCount,
    headingCount
  }
}