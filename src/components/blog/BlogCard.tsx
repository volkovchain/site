import Link from 'next/link'
import { CalendarIcon, ClockIcon, TagIcon, ArrowRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import { BlogPostMetadata } from '@/lib/blog'
import { serviceRegistry } from '@/lib/serviceRegistry'

interface BlogCardProps {
  post: BlogPostMetadata
  featured?: boolean
  showServiceBadge?: boolean
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

function ContentTypeBadge({ type }: { type?: string }) {
  if (!type || type === 'blog') return null
  
  const typeColors = {
    'tutorial': 'bg-blue-100 text-blue-700',
    'case-study': 'bg-green-100 text-green-700',
    'opinion': 'bg-purple-100 text-purple-700',
    'news': 'bg-orange-100 text-orange-700'
  }
  
  const colorClass = typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-700'
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
    </span>
  )
}

function ServiceBadge({ serviceId }: { serviceId?: string }) {
  if (!serviceId) return null
  
  const service = serviceRegistry.getServiceById(serviceId)
  if (!service) return null
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
      <AcademicCapIcon className="w-3 h-3 mr-1" />
      {service.name.en}
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  if (!difficulty) return null
  
  const difficultyColors = {
    'Beginner': 'bg-green-50 text-green-700 border-green-200',
    'Intermediate': 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    'Advanced': 'bg-red-50 text-red-700 border-red-200'
  }
  
  const colorClass = difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-gray-50 text-gray-700 border-gray-200'
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
      {difficulty}
    </span>
  )
}

export function BlogCard({ post, featured = false, showServiceBadge = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  if (featured) {
    return (
      <article className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {post.coverImage && (
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CategoryBadge category={post.category} />
              <ContentTypeBadge type={post.type} />
              {showServiceBadge && <ServiceBadge serviceId={post.primaryService} />}
            </div>
            <div className="flex items-center space-x-2">
              <DifficultyBadge difficulty={post.difficulty} />
              {post.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            <Link 
              href={`/blog/${post.slug}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {post.title}
            </Link>
          </h2>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {post.readingTime}
              </div>
            </div>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                >
                  <TagIcon className="w-2.5 h-2.5 mr-1" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Read article
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <CategoryBadge category={post.category} />
          <ContentTypeBadge type={post.type} />
          {showServiceBadge && <ServiceBadge serviceId={post.primaryService} />}
        </div>
        <div className="flex items-center space-x-2">
          <DifficultyBadge difficulty={post.difficulty} />
          {post.featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        <Link 
          href={`/blog/${post.slug}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {post.title}
        </Link>
      </h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {post.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {formattedDate}
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            {post.readingTime}
          </div>
        </div>
      </div>
      
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
            >
              <TagIcon className="w-2.5 h-2.5 mr-1" />
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-xs text-gray-500">
              +{post.tags.length - 2}
            </span>
          )}
        </div>
      )}
      
      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
      >
        Read more
        <ArrowRightIcon className="w-4 h-4 ml-1" />
      </Link>
    </article>
  )
}