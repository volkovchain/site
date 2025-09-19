import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BlogCard } from '@/components/blog/BlogCard'
import type { BlogPostMetadata } from '@/lib/blog'

// Mock serviceRegistry
vi.mock('@/lib/serviceRegistry', () => ({
  serviceRegistry: {
    getServiceById: vi.fn(() => ({
      serviceId: 'test-service',
      name: { en: 'Test Service' }
    }))
  }
}))

const mockPost: BlogPostMetadata = {
  slug: 'test-post',
  title: 'Test Blog Post',
  description: 'Test description',
  publishedAt: '2024-01-15',
  author: 'Test Author',
  category: 'Technology',
  tags: ['test', 'blog'],
  readingTime: '5 min read',
  featured: false,
  type: 'tutorial',
  difficulty: 'Beginner',
  primaryService: 'test-service'
}

describe('BlogCard Component', () => {
  it('renders blog post information correctly', () => {
    render(<BlogCard post={mockPost} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('shows service badge when enabled', () => {
    render(<BlogCard post={mockPost} showServiceBadge={true} />)
    
    expect(screen.getByText('Test Service')).toBeInTheDocument()
  })

  it('displays content type and difficulty badges', () => {
    render(<BlogCard post={mockPost} />)
    
    expect(screen.getByText('Tutorial')).toBeInTheDocument()
    expect(screen.getByText('Beginner')).toBeInTheDocument()
  })

  it('shows featured badge for featured posts', () => {
    const featuredPost = { ...mockPost, featured: true }
    render(<BlogCard post={featuredPost} featured={true} />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })
})