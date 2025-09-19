import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import React from 'react'
import type { JSX } from 'react'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock Next.js 15 navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

// Mock Next.js 15 Image component
vi.mock('next/image', () => ({
  default: ({ priority, ...props }: any) => {
    return React.createElement('img', { ...props, 'data-priority': priority })
  },
}))

// React 19 compatible Framer Motion mock
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (target, prop) => {
      return ({ children, ...props }: any) => {
        const Element = prop as keyof JSX.IntrinsicElements
        return React.createElement(Element, props, children)
      }
    }
  }),
  AnimatePresence: ({ children }: any) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}))

// Mock Three.js components for testing
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => React.createElement('div', { 'data-testid': 'three-canvas' }, children),
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {},
    scene: {},
    gl: {},
  }),
  extend: vi.fn(),
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => React.createElement('div', { 'data-testid': 'orbit-controls' }),
  Text: ({ children }: any) => React.createElement('div', { 'data-testid': 'three-text' }, children),
  Box: () => React.createElement('div', { 'data-testid': 'three-box' }),
  Sphere: () => React.createElement('div', { 'data-testid': 'three-sphere' }),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock performance API
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
  },
})

// Enhanced Web API mocks for React 19
global.fetch = vi.fn()

// Create a partial mock for navigator
Object.defineProperty(global, 'navigator', {
  writable: true,
  value: {
    ...global.navigator,
    sendBeacon: vi.fn(),
    clipboard: {
      writeText: vi.fn(),
      readText: vi.fn(),
    } as Partial<Clipboard>,
  },
})