import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
  readingTime: string
  content: string
  featured: boolean
  coverImage?: string
  type?: 'blog' | 'news' | 'tutorial' | 'case-study' | 'opinion'
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  targetedServices?: string[]
  primaryService?: string
}

export interface BlogPostMetadata {
  slug: string
  title: string
  description: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
  readingTime: string
  featured: boolean
  coverImage?: string
  type?: 'blog' | 'news' | 'tutorial' | 'case-study' | 'opinion'
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  targetedServices?: string[]
  primaryService?: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPostMetadata[] {
  try {
    // Create content/blog directory if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        const { text: readingTimeText } = readingTime(content)

        return {
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          publishedAt: data.publishedAt || new Date().toISOString(),
          author: data.author || 'Nikita Volkov',
          category: data.category || 'Technology',
          tags: data.tags || [],
          readingTime: readingTimeText,
          featured: data.featured || false,
          coverImage: data.coverImage,
          type: data.type || 'blog',
          difficulty: data.difficulty || 'Intermediate',
          targetedServices: data.targetedServices || [],
          primaryService: data.primaryService,
        } as BlogPostMetadata
      })

    return allPostsData.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const { text: readingTimeText } = readingTime(content)

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      author: data.author || 'Nikita Volkov',
      category: data.category || 'Technology',
      tags: data.tags || [],
      readingTime: readingTimeText,
      featured: data.featured || false,
      coverImage: data.coverImage,
      content,
      type: data.type || 'blog',
      difficulty: data.difficulty || 'Intermediate',
      targetedServices: data.targetedServices || [],
      primaryService: data.primaryService,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export function getPostsByCategory(category: string): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => 
    post.category.toLowerCase() === category.toLowerCase()
  )
}

export function getPostsByTag(tag: string): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => 
    post.tags.some((postTag) => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

export function getFeaturedPosts(): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.featured)
}

export function getCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = allPosts.map((post) => post.category)
  return Array.from(new Set(categories))
}

export function getTags(): string[] {
  const allPosts = getAllPosts()
  const tags = allPosts.flatMap((post) => post.tags)
  return Array.from(new Set(tags))
}

export function searchPosts(query: string): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  const lowercaseQuery = query.toLowerCase()
  
  return allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.description.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
    )
  })
}

export function getContentTypes(): string[] {
  const allPosts = getAllPosts()
  const types = allPosts.map((post) => post.type || 'blog')
  return Array.from(new Set(types))
}

export function getDifficultyLevels(): string[] {
  const allPosts = getAllPosts()
  const difficulties = allPosts.map((post) => post.difficulty || 'Intermediate')
  return Array.from(new Set(difficulties))
}

export function getPostsByType(type: 'blog' | 'news' | 'tutorial' | 'case-study' | 'opinion'): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => (post.type || 'blog') === type)
}

export function getPostsByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => (post.difficulty || 'Intermediate') === difficulty)
}

export function getPostsByService(serviceId: string): BlogPostMetadata[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => {
    const targetedServices = post.targetedServices || []
    const primaryService = post.primaryService
    return targetedServices.includes(serviceId) || primaryService === serviceId
  })
}

export function searchPostsWithServices(query: string): BlogPostMetadata[] {
  // For now, this is the same as searchPosts but can be extended
  // to include service-specific search logic
  return searchPosts(query)
}

export function getPostWithServices(slug: string): BlogPost | null {
  // For now, this is the same as getPostBySlug but can be extended
  // to include service-related data
  return getPostBySlug(slug)
}

export function getAllServiceContentStrategies(): Record<string, any> {
  // This would typically come from a database or configuration file
  // For now, return an empty object to prevent build errors
  // This function should be implemented when content strategies are defined
  return {}
}

// Pagination utility
export function paginatePosts(
  posts: BlogPostMetadata[], 
  page: number = 1, 
  postsPerPage: number = 10
): {
  posts: BlogPostMetadata[]
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
} {
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const startIndex = (page - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const paginatedPosts = posts.slice(startIndex, endIndex)

  return {
    posts: paginatedPosts,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}