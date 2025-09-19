import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '../useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.setState({
      theme: 'dark',
      language: 'ru',
      user: null,
      periodicTable: {
        selectedElement: null,
        filterCategory: 'all',
        searchQuery: '',
        viewMode: '3d',
        isLoading: false
      },
      navigation: {
        isMobileMenuOpen: false,
        activePage: '/'
      }
    })
  })

  describe('theme management', () => {
    it('initializes with dark theme', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.theme).toBe('dark')
    })

    it('can set theme', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setTheme('light')
      })
      
      expect(result.current.theme).toBe('light')
    })

    it('can toggle theme', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.toggleTheme()
      })
      
      expect(result.current.theme).toBe('light')
      
      act(() => {
        result.current.toggleTheme()
      })
      
      expect(result.current.theme).toBe('dark')
    })
  })

  describe('language management', () => {
    it('initializes with Russian language', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.language).toBe('ru')
    })

    it('can set language', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setLanguage('en')
      })
      
      expect(result.current.language).toBe('en')
    })
  })

  describe('periodic table state', () => {
    it('initializes with default periodic table state', () => {
      const { result } = renderHook(() => useAppStore())
      
      expect(result.current.periodicTable.selectedElement).toBeNull()
      expect(result.current.periodicTable.filterCategory).toBe('all')
      expect(result.current.periodicTable.searchQuery).toBe('')
      expect(result.current.periodicTable.viewMode).toBe('3d')
      expect(result.current.periodicTable.isLoading).toBe(false)
    })

    it('can update periodic table state', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.updatePeriodicTable({
          searchQuery: 'bitcoin',
          filterCategory: 'payment-coin',
          isLoading: true
        })
      })
      
      expect(result.current.periodicTable.searchQuery).toBe('bitcoin')
      expect(result.current.periodicTable.filterCategory).toBe('payment-coin')
      expect(result.current.periodicTable.isLoading).toBe(true)
    })

    it('can set selected element', () => {
      const { result } = renderHook(() => useAppStore())
      const mockElement = { symbol: 'Bt', name: 'Bitcoin' }
      
      act(() => {
        result.current.setSelectedElement(mockElement as any)
      })
      
      expect(result.current.periodicTable.selectedElement).toEqual(mockElement)
    })

    it('can set filter category', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setFilterCategory('defi-token')
      })
      
      expect(result.current.periodicTable.filterCategory).toBe('defi-token')
    })

    it('can set search query', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setSearchQuery('ethereum')
      })
      
      expect(result.current.periodicTable.searchQuery).toBe('ethereum')
    })

    it('can set view mode', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setViewMode('2d')
      })
      
      expect(result.current.periodicTable.viewMode).toBe('2d')
    })
  })

  describe('navigation state', () => {
    it('initializes with closed mobile menu', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.navigation.isMobileMenuOpen).toBe(false)
    })

    it('can toggle mobile menu', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.toggleMobileMenu()
      })
      
      expect(result.current.navigation.isMobileMenuOpen).toBe(true)
      
      act(() => {
        result.current.toggleMobileMenu()
      })
      
      expect(result.current.navigation.isMobileMenuOpen).toBe(false)
    })

    it('can close mobile menu', () => {
      const { result } = renderHook(() => useAppStore())
      
      // First open it
      act(() => {
        result.current.toggleMobileMenu()
      })
      
      expect(result.current.navigation.isMobileMenuOpen).toBe(true)
      
      // Then close it
      act(() => {
        result.current.closeMobileMenu()
      })
      
      expect(result.current.navigation.isMobileMenuOpen).toBe(false)
    })

    it('can set active page', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setActivePage('/blog')
      })
      
      expect(result.current.navigation.activePage).toBe('/blog')
    })
  })

  describe('user management', () => {
    it('initializes with no user', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.user).toBeNull()
    })

    it('can set user', () => {
      const { result } = renderHook(() => useAppStore())
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
      
      act(() => {
        result.current.setUser(mockUser)
      })
      
      expect(result.current.user).toEqual(mockUser)
    })
  })
})