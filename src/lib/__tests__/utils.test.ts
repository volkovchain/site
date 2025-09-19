import { describe, it, expect } from 'vitest'
import { cn, formatDate, formatPrice, slugify, truncateText } from '../utils'

describe('Utils Functions', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('base', 'additional')).toBe('base additional')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('merges Tailwind classes properly', () => {
      expect(cn('p-4', 'p-6')).toBe('p-6') // Later class should override
    })

    it('handles undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024|January 15, 2024/)
    })

    it('handles string input', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/Jan 15, 2024|January 15, 2024/)
    })

    it('handles custom format options', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date, { year: 'numeric', month: 'short' })
      expect(formatted).toMatch(/Jan 2024|January 2024/)
    })
  })

  describe('formatPrice', () => {
    it('formats price with currency symbol', () => {
      expect(formatPrice(1000)).toBe('$1,000')
    })

    it('handles decimal values', () => {
      expect(formatPrice(99.99)).toBe('$99.99')
    })

    it('formats large numbers with commas', () => {
      expect(formatPrice(1234567.89)).toBe('$1,234,567.89')
    })

    it('handles custom currency', () => {
      expect(formatPrice(1000, 'EUR')).toBe('€1,000')
    })
  })

  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('handles special characters', () => {
      expect(slugify('Hello, World! & More')).toBe('hello-world-more')
    })

    it('handles multiple spaces', () => {
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })

    it('handles non-ASCII characters', () => {
      expect(slugify('Café & Résumé')).toBe('cafe-resume')
    })
  })

  describe('truncateText', () => {
    it('truncates text at specified length', () => {
      const text = 'This is a very long text that needs to be truncated'
      expect(truncateText(text, 20)).toBe('This is a very long...')
    })

    it('returns original text if shorter than limit', () => {
      const text = 'Short text'
      expect(truncateText(text, 20)).toBe('Short text')
    })

    it('handles custom suffix', () => {
      const text = 'This is a long text'
      expect(truncateText(text, 10, ' [more]')).toBe('This is a [more]')
    })

    it('handles edge cases', () => {
      expect(truncateText('', 10)).toBe('')
      expect(truncateText('Hello', 0)).toBe('...')
    })
  })
})