import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, PeriodicElement, ElementCategory, PeriodicTableState, NavigationState, User } from '@/types'

interface AppStoreState extends AppState {
  // Theme and language actions
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'ru' | 'en') => void
  toggleTheme: () => void
  
  // User actions
  setUser: (user: User | null) => void
  
  // Periodic table actions
  updatePeriodicTable: (updates: Partial<PeriodicTableState>) => void
  setSelectedElement: (element: PeriodicElement | null) => void
  setFilterCategory: (category: ElementCategory | 'all') => void
  setSearchQuery: (query: string) => void
  setViewMode: (mode: '2d' | '3d') => void
  
  // Navigation actions
  toggleMobileMenu: () => void
  setActivePage: (page: string) => void
  closeMobileMenu: () => void
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
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
      },
      
      // Theme and language actions
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      // User actions
      setUser: (user) => set({ user }),
      
      // Periodic table actions
      updatePeriodicTable: (updates) => set((state) => ({
        periodicTable: { ...state.periodicTable, ...updates }
      })),
      
      setSelectedElement: (element) => set((state) => ({
        periodicTable: { ...state.periodicTable, selectedElement: element }
      })),
      
      setFilterCategory: (category) => set((state) => ({
        periodicTable: { ...state.periodicTable, filterCategory: category }
      })),
      
      setSearchQuery: (query) => set((state) => ({
        periodicTable: { ...state.periodicTable, searchQuery: query }
      })),
      
      setViewMode: (mode) => set((state) => ({
        periodicTable: { ...state.periodicTable, viewMode: mode }
      })),
      
      // Navigation actions
      toggleMobileMenu: () => set((state) => ({
        navigation: {
          ...state.navigation,
          isMobileMenuOpen: !state.navigation.isMobileMenuOpen
        }
      })),
      
      setActivePage: (activePage) => set((state) => ({
        navigation: { ...state.navigation, activePage }
      })),
      
      closeMobileMenu: () => set((state) => ({
        navigation: { ...state.navigation, isMobileMenuOpen: false }
      }))
    }),
    {
      name: 'volkovchain-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        periodicTable: {
          filterCategory: state.periodicTable.filterCategory,
          viewMode: state.periodicTable.viewMode
        }
      })
    }
  )
)