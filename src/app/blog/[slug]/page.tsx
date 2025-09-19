import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogPost } from '@/components/blog/BlogPost'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { useMDXComponents } from '../../../../mdx-components'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const publishedTime = new Date(post.publishedAt).toISOString()
  const modifiedTime = publishedTime // Could be different if you track modifications

  return {
    title: `${post.title} | VolkovChain Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [post.author],
      tags: post.tags,
      url: `https://volkovchain.dev/blog/${post.slug}`,
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: `https://volkovchain.dev/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const components = useMDXComponents({})

  return (
    <BlogPost post={post}>
      <MDXRemote 
        source={post.content}
        components={components}
      />
    </BlogPost>
  )
}