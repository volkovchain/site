import type { MDXComponents } from 'mdx/types'
import { Highlight, themes } from 'prism-react-renderer'
import { ReactNode } from 'react'

interface CodeBlockProps {
  children: string
  className?: string
}

function CodeBlock({ children, className = '' }: CodeBlockProps) {
  const language = className.replace('language-', '') || 'text'
  
  return (
    <div className="relative my-6 overflow-hidden rounded-lg bg-gray-900">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-sm font-medium text-gray-300">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
      <Highlight
        theme={themes.vsDark}
        code={children.trim()}
        language={language as any}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="p-4 overflow-x-auto text-sm">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-gray-500 text-right pr-4 select-none">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

interface CalloutProps {
  children: ReactNode
  type?: 'info' | 'warning' | 'error' | 'success'
}

function Callout({ children, type = 'info' }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }
  
  return (
    <div className={`p-4 my-6 border-l-4 rounded-r-lg ${styles[type]}`}>
      {children}
    </div>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-gray-900 mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-medium text-gray-900 mt-6 mb-3">
        {children}
      </h4>
    ),
    
    // Text elements
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    
    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="ml-4">
        {children}
      </li>
    ),
    
    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-indigo-600 hover:text-indigo-800 underline transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    
    // Code
    code: ({ children, className }) => {
      if (className) {
        return <CodeBlock className={className}>{children as string}</CodeBlock>
      }
      return (
        <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
          {children}
        </code>
      )
    },
    pre: ({ children }) => children,
    
    // Block elements
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-6 italic text-gray-600">
        {children}
      </blockquote>
    ),
    
    // Table
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="bg-white divide-y divide-gray-200">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {children}
      </td>
    ),
    
    // Custom components
    Callout,
    
    ...components,
  }
}