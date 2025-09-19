import { describe, it, expect, vi } from 'vitest'
import { 
  getPostsByService, 
  getPostsByType, 
  searchPostsWithServices
} from '@/lib/blog'

// Mock dependencies
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(() => true),
    readdirSync: vi.fn(() => ['test-post.mdx']),
    readFileSync: vi.fn(() => `---
title: "Test Post"
type: "tutorial"
primaryService: "rust-blockchain-course"
tags: ["rust", "blockchain"]
---
Content`),
    mkdirSync: vi.fn()
  }
}))

vi.mock('reading-time', () => ({
  default: vi.fn(() => ({ text: '5 min read', minutes: 5 }))
}))

vi.mock('@/lib/serviceRegistry', () => ({
  serviceRegistry: {
    getServiceById: vi.fn(() => ({
      serviceId: 'rust-blockchain-course',
      name: { en: 'Rust Course' }
    }))
  }
}))

describe('Enhanced Blog System', () => {
  it('should filter posts by service', () => {
    const posts = getPostsByService('rust-blockchain-course')
    expect(posts).toHaveLength(1)
  })

  it('should filter posts by type', () => {
    const posts = getPostsByType('tutorial')
    expect(posts).toHaveLength(1)
  })

  it('should search posts with service integration', () => {
    const posts = searchPostsWithServices('rust')
    expect(posts).toHaveLength(1)
  })
})