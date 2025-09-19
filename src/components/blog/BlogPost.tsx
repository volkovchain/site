import { ReactNode, useMemo } from 'react'
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { BlogPost as BlogPostType } from '@/lib/blog'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface BlogPostProps {
  post: BlogPostType
  children: ReactNode
}

function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    
    headings.push({ id, text, level })
  }

  return headings
}

function TableOfContents({ headings }: { headings: TableOfContentsItem[] }) {
  if (headings.length === 0) return null

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm hover:text-indigo-600 transition-colors ${{
                  1: 'font-medium text-gray-900',
                  2: 'ml-3 text-gray-700',
                  3: 'ml-6 text-gray-600',
                  4: 'ml-9 text-gray-500',
                  5: 'ml-12 text-gray-500',
                  6: 'ml-15 text-gray-500',
                }[heading.level] || 'text-gray-500'}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const categoryColors = {
    'Web Development': 'bg-blue-100 text-blue-800',
    'Blockchain': 'bg-purple-100 text-purple-800',
    'Technology': 'bg-green-100 text-green-800',
    'Tutorial': 'bg-yellow-100 text-yellow-800',
    'Opinion': 'bg-red-100 text-red-800',
  }

  const colorClass = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  )
}

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <TagIcon className="w-3 h-3 mr-1" />
          {tag}
        </Link>
      ))}
    </div>
  )
}

function ShareButtons({ post }: { post: BlogPostType }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${post.title} - ${post.description}`

  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'Copy Link',
      url: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => {
        navigator.clipboard.writeText(shareUrl)
        // You could add a toast notification here
      },
    },
  ]

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Share this article</h3>
      <div className="flex space-x-4">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={link.onClick || (() => window.open(link.url, '_blank', 'noopener,noreferrer'))}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {link.icon}
            <span className="ml-2">{link.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function AuthorCard({ author }: { author: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {author.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{author}</h3>
          <p className="text-gray-600">
            Blockchain developer and consultant with expertise in Rust, Go, and Solidity.
            Building the future of decentralized applications.
          </p>
          <div className="mt-2">
            <Link
              href="/about"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              Learn more about {author} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlogPost({ post, children }: BlogPostProps) {
  const tableOfContents = useMemo(() => {
    return extractTableOfContents(post.content)
  }, [post.content])

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to blog link */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to blog
        </Link>
      </div>

      {/* Article header */}
      <header className="mb-8">
        <div className="mb-4">
          <CategoryBadge category={post.category} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-6">
          {post.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-1.5" />
            {post.author}
          </div>
          
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            {formattedDate}
          </div>
          
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1.5" />
            {post.readingTime}
          </div>
        </div>

        <TagList tags={post.tags} />
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <div className="mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Table of contents */}
      <TableOfContents headings={tableOfContents} />

      {/* Article content */}
      <div className="prose prose-lg prose-indigo max-w-none">
        {children}
      </div>

      {/* Share buttons */}
      <ShareButtons post={post} />

      {/* Author card */}
      <AuthorCard author={post.author} />

      {/* Related articles or newsletter signup could go here */}
      <div className="bg-indigo-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Enjoyed this article?
        </h3>
        <p className="text-gray-600 mb-4">
          Get more insights on blockchain development, Web3 technologies, and programming best practices.
        </p>
        <Link
          href="/consulting"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Work with me
        </Link>
      </div>
    </article>
  )
}

// Default export for lazy loading
export default BlogPost