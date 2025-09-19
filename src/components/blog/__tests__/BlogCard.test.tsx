import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { BlogCard } from '../BlogCard'
import { mockBlogPost } from '@/test/utils'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

describe('BlogCard Component', () => {
  it('renders blog post information correctly', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    expect(screen.getByText(mockBlogPost.title)).toBeInTheDocument()
    expect(screen.getByText(mockBlogPost.description)).toBeInTheDocument()
    expect(screen.getByText(mockBlogPost.category)).toBeInTheDocument()
    expect(screen.getByText(mockBlogPost.readingTime)).toBeInTheDocument()
  })

  it('displays formatted publication date', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    // Should display formatted date (Jan 1)
    expect(screen.getByText(/Jan 1/i)).toBeInTheDocument()
  })

  it('shows tags when available', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    mockBlogPost.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it('renders featured badge when post is featured', () => {
    const featuredPost = { ...mockBlogPost, featured: true }
    render(<BlogCard post={featuredPost} featured />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders different layout for featured posts', () => {
    const featuredPost = { ...mockBlogPost, featured: true }
    const { container } = render(<BlogCard post={featuredPost} featured />)
    
    // Featured posts should have larger layout
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('shows correct number of tags with overflow indicator', () => {
    const postWithManyTags = { 
      ...mockBlogPost, 
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'] 
    }
    render(<BlogCard post={postWithManyTags} />)
    
    // Should show first 2 tags + overflow indicator
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('+3')).toBeInTheDocument()
  })

  it('has correct link structure', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    const links = screen.getAllByRole('link')
    const titleLink = links.find(link => 
      link.textContent?.includes(mockBlogPost.title)
    )
    
    expect(titleLink).toHaveAttribute('href', `/blog/${mockBlogPost.slug}`)
  })

  it('applies category-specific styling', () => {
    const techPost = { ...mockBlogPost, category: 'Technology' }
    render(<BlogCard post={techPost} />)
    
    const categoryBadge = screen.getByText('Technology')
    expect(categoryBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('handles posts without cover image gracefully', () => {
    const postWithoutImage = { ...mockBlogPost, coverImage: undefined }
    render(<BlogCard post={postWithoutImage} featured />)
    
    // Should render without errors
    expect(screen.getByText(mockBlogPost.title)).toBeInTheDocument()
  })

  it('shows read more link with correct text', () => {
    render(<BlogCard post={mockBlogPost} />)
    
    expect(screen.getByText('Read more')).toBeInTheDocument()
  })
})