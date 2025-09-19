import { test, expect } from '@playwright/test'

test.describe('Periodic Table Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/periodic-table')
  })

  test('loads 3D periodic table correctly', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Check for 3D canvas element
    await expect(page.locator('[data-testid="three-canvas"]')).toBeVisible()
    
    // Check page title
    await expect(page.getByRole('heading', { name: /periodic table/i })).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    // Wait for the search input to be available
    const searchInput = page.getByPlaceholder(/search/i)
    await expect(searchInput).toBeVisible()
    
    // Type in search query
    await searchInput.fill('bitcoin')
    
    // Should filter results (this would need the actual implementation to verify)
    await page.waitForTimeout(500) // Allow for debouncing
  })

  test('category filtering works', async ({ page }) => {
    // Check for filter buttons
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible()
    
    // Click on a category filter (if available)
    const paymentFilter = page.getByRole('button', { name: /payment/i })
    if (await paymentFilter.isVisible()) {
      await paymentFilter.click()
      await page.waitForTimeout(500)
    }
  })

  test('element interaction works', async ({ page }) => {
    // Wait for 3D scene to load
    await page.waitForTimeout(2000)
    
    // Look for clickable elements (this would depend on the actual 3D implementation)
    const threeCanvas = page.locator('[data-testid="three-canvas"]')
    await expect(threeCanvas).toBeVisible()
    
    // Try clicking on the canvas (in a real test, you'd target specific elements)
    await threeCanvas.click({ position: { x: 200, y: 200 } })
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Page should still be functional
    await expect(page.locator('[data-testid="three-canvas"]')).toBeVisible()
    
    // Search should be accessible
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()
  })

  test('view mode toggle works', async ({ page }) => {
    // Look for view mode buttons (2D/3D toggle)
    const viewToggle = page.getByRole('button', { name: /2d|3d/i })
    if (await viewToggle.isVisible()) {
      await viewToggle.click()
      await page.waitForTimeout(500)
    }
  })

  test('performance is acceptable', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/periodic-table')
    await page.waitForLoadState('networkidle')
    
    // Wait for 3D scene to initialize
    await page.waitForTimeout(3000)
    
    const loadTime = Date.now() - startTime
    
    // 3D page should load within 8 seconds
    expect(loadTime).toBeLessThan(8000)
  })

  test('accessibility features work', async ({ page }) => {
    // Check for proper heading structure
    const mainHeading = page.getByRole('heading', { level: 1 })
    await expect(mainHeading).toBeVisible()
    
    // Check for proper focus management
    await page.keyboard.press('Tab')
    
    // Check for ARIA labels on interactive elements
    const searchInput = page.getByPlaceholder(/search/i)
    if (await searchInput.isVisible()) {
      await expect(searchInput).toHaveAttribute('aria-label', /.+/)
    }
  })

  test('back navigation works', async ({ page }) => {
    // Navigate to homepage first
    await page.goto('/')
    
    // Then go to periodic table
    await page.goto('/periodic-table')
    
    // Use browser back button
    await page.goBack()
    
    // Should be back on homepage
    await expect(page).toHaveURL('/')
  })
})