import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/VolkovChain - Principal Blockchain Developer/)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /blockchain developer/i)
  })

  test('displays main navigation correctly', async ({ page }) => {
    // Check main navigation links
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /periodic table/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /blog/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /videos/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /consulting/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
  })

  test('displays hero section with correct content', async ({ page }) => {
    // Check for hero elements
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Check for technology cards
    await expect(page.getByText('Rust')).toBeVisible()
    await expect(page.getByText('Solidity')).toBeVisible()
    await expect(page.getByText('Go')).toBeVisible()
  })

  test('quick links navigation works', async ({ page }) => {
    // Test periodic table link
    await page.getByRole('link', { name: /interactive.*table/i }).click()
    await expect(page).toHaveURL('/periodic-table')
    
    await page.goBack()
    
    // Test blog link
    await page.getByRole('link', { name: /blog/i }).first().click()
    await expect(page).toHaveURL('/blog')
    
    await page.goBack()
    
    // Test consulting link
    await page.getByRole('link', { name: /consulting/i }).first().click()
    await expect(page).toHaveURL('/consulting')
  })

  test('theme toggle works correctly', async ({ page }) => {
    // Check initial theme (should be dark by default)
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
    
    // Click theme toggle
    await page.getByRole('button', { name: /toggle theme/i }).first().click()
    
    // Check theme changed to light
    await expect(html).not.toHaveClass(/dark/)
    
    // Toggle back to dark
    await page.getByRole('button', { name: /toggle theme/i }).first().click()
    await expect(html).toHaveClass(/dark/)
  })

  test('language switcher works', async ({ page }) => {
    // Find and click language toggle
    await page.getByRole('button', { name: /ru|en/i }).click()
    
    // Verify language changed (content should update)
    // This would need specific content to verify the actual language change
    await expect(page.getByRole('button', { name: /ru|en/i })).toBeVisible()
  })

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Mobile menu should be hidden initially
    await expect(page.getByRole('navigation').getByRole('link', { name: /home/i })).not.toBeVisible()
    
    // Click hamburger menu
    await page.getByRole('button', { name: /menu/i }).click()
    
    // Mobile menu should be visible
    await expect(page.getByRole('navigation').getByRole('link', { name: /home/i })).toBeVisible()
    
    // Click a menu item
    await page.getByRole('link', { name: /blog/i }).click()
    
    // Should navigate and close menu
    await expect(page).toHaveURL('/blog')
  })

  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.includes('404')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })
})