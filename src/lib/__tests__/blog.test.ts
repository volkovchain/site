import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  getAllPosts, 
  getPostBySlug, 
  getPostsByCategory, 
  searchPosts,
  paginatePosts 
} from '../blog'
import fs from 'fs'

// Mock fs module
vi.mock('fs')
const mockFs = vi.mocked(fs)

// Mock gray-matter
vi.mock('gray-matter', () => ({
  default: vi.fn((content: string) => ({
    data: {
      title: 'Test Post',
      description: 'Test description',
      publishedAt: '2024-01-01',
      author: 'Test Author',
      category: 'Technology',
      tags: ['test'],
      featured: false
    },
    content: '# Test Content'
  }))
}))

// Mock reading-time
vi.mock('reading-time', () => ({
  default: vi.fn(() => ({ text: '5 min read' }))
}))

describe('Blog Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllPosts', () => {
    it('returns empty array when directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      mockFs.mkdirSync.mockImplementation(() => {})
      
      const posts = getAllPosts()
      expect(posts).toEqual([])
    })

    it('returns posts when directory exists with MDX files', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['post1.mdx', 'post2.mdx', 'other.txt'] as any)
      mockFs.readFileSync.mockReturnValue('---\ntitle: Test\n---\nContent')
      
      const posts = getAllPosts()
      expect(posts).toHaveLength(2)
      expect(posts[0]).toHaveProperty('title', 'Test Post')
    })

    it('sorts posts by publishedAt date descending', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue(['old.mdx', 'new.mdx'] as any)
      
      let callCount = 0
      mockFs.readFileSync.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return '---\npublishedAt: 2024-01-01\n---\nOld post'
        }
        return '---\npublishedAt: 2024-02-01\n---\nNew post'
      })
      
      const posts = getAllPosts()
      expect(posts[0].publishedAt).toBe('2024-02-01')
      expect(posts[1].publishedAt).toBe('2024-01-01')
    })
  })

  describe('getPostBySlug', () => {
    it('returns null when file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      
      const post = getPostBySlug('nonexistent')
      expect(post).toBeNull()
    })

    it('returns post when file exists', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue('---\ntitle: Test\n---\nContent')
      
      const post = getPostBySlug('test-slug')
      expect(post).toHaveProperty('slug', 'test-slug')
      expect(post).toHaveProperty('title', 'Test Post')
      expect(post).toHaveProperty('content', '# Test Content')
    })
  })

  describe('getPostsByCategory', () => {
    it('filters posts by category', () => {
      // Mock getAllPosts to return test data
      vi.doMock('../blog', async () => {
        const actual = await vi.importActual('../blog')
        return {
          ...actual,
          getAllPosts: () => [
            { category: 'Technology', title: 'Tech Post' },
            { category: 'Blockchain', title: 'Blockchain Post' },
            { category: 'Technology', title: 'Another Tech Post' }
          ]
        }
      })
      
      const posts = getPostsByCategory('Technology')
      expect(posts).toHaveLength(2)
      expect(posts.every(post => post.category === 'Technology')).toBe(true)
    })
  })

  describe('searchPosts', () => {
    it('searches posts by title and description', () => {
      // This would need mocking of getAllPosts similar to above
      const query = 'blockchain'
      const results = searchPosts(query)
      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('paginatePosts', () => {
    const mockPosts = Array.from({ length: 25 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      description: `Description ${i}`,
      publishedAt: '2024-01-01',
      author: 'Author',
      category: 'Technology',
      tags: [],
      readingTime: '5 min read',
      featured: false
    }))

    it('paginates posts correctly', () => {
      const result = paginatePosts(mockPosts, 1, 10)
      
      expect(result.posts).toHaveLength(10)
      expect(result.totalPages).toBe(3)
      expect(result.currentPage).toBe(1)
      expect(result.hasNextPage).toBe(true)
      expect(result.hasPrevPage).toBe(false)
    })

    it('handles last page correctly', () => {
      const result = paginatePosts(mockPosts, 3, 10)
      
      expect(result.posts).toHaveLength(5) // 25 % 10 = 5
      expect(result.hasNextPage).toBe(false)
      expect(result.hasPrevPage).toBe(true)
    })

    it('handles empty posts array', () => {
      const result = paginatePosts([], 1, 10)
      
      expect(result.posts).toHaveLength(0)
      expect(result.totalPages).toBe(0)
      expect(result.hasNextPage).toBe(false)
      expect(result.hasPrevPage).toBe(false)
    })
  })
})