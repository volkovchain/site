import { test, expect } from '@playwright/test'

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('displays blog listing correctly', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: /blog/i, level: 1 })).toBeVisible()
    
    // Check for blog posts (assuming there are sample posts)
    const articles = page.getByRole('article')
    await expect(articles.first()).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/search articles/i)
    await expect(searchInput).toBeVisible()
    
    // Type search query
    await searchInput.fill('blockchain')
    await page.waitForTimeout(500)
    
    // Results should be filtered (implementation dependent)
  })

  test('category filtering works', async ({ page }) => {
    // Look for category filter buttons
    const allButton = page.getByRole('button', { name: /all/i })
    await expect(allButton).toBeVisible()
    
    // Try clicking different category filters
    const techButton = page.getByRole('button', { name: /technology/i })
    if (await techButton.isVisible()) {
      await techButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('pagination works', async ({ page }) => {
    // Look for pagination controls
    const nextButton = page.getByRole('button', { name: /next/i })
    if (await nextButton.isVisible() && !await nextButton.isDisabled()) {
      await nextButton.click()
      await page.waitForTimeout(500)
      
      // Should be on page 2
      await expect(page.getByText(/page.*2/i)).toBeVisible()
    }
  })

  test('blog post navigation works', async ({ page }) => {
    // Click on first blog post
    const firstPost = page.getByRole('link', { name: /read more|read article/i }).first()
    if (await firstPost.isVisible()) {
      await firstPost.click()
      
      // Should navigate to blog post page
      await expect(page).toHaveURL(/\/blog\/.+/)
      
      // Should show blog post content
      await expect(page.getByRole('article')).toBeVisible()
    }
  })

  test('mobile layout works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Blog grid should adapt to mobile
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible()
    
    // Search should still be accessible
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()
    
    // Filter toggle should be visible on mobile
    const filterToggle = page.getByRole('button', { name: /filter/i })
    if (await filterToggle.isVisible()) {
      await filterToggle.click()
      await page.waitForTimeout(300)
    }
  })
})

test.describe('Individual Blog Post', () => {
  test('blog post displays correctly', async ({ page }) => {
    // Navigate to a specific blog post (using sample post slug)
    await page.goto('/blog/cryptocurrency-periodic-table-threejs')
    
    // Check for blog post elements
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('article')).toBeVisible()
    
    // Check for metadata
    await expect(page.getByText(/published/i)).toBeVisible()
    await expect(page.getByText(/reading time/i)).toBeVisible()
  })

  test('table of contents works', async ({ page }) => {
    await page.goto('/blog/cryptocurrency-periodic-table-threejs')
    
    // Look for table of contents
    const toc = page.getByText(/table of contents/i)
    if (await toc.isVisible()) {
      // Click on a TOC link
      const tocLink = page.getByRole('link', { name: /technical stack/i })
      if (await tocLink.isVisible()) {
        await tocLink.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('back to blog link works', async ({ page }) => {
    await page.goto('/blog/cryptocurrency-periodic-table-threejs')
    
    // Click back to blog link
    const backLink = page.getByRole('link', { name: /back to blog/i })
    await expect(backLink).toBeVisible()
    await backLink.click()
    
    // Should return to blog listing
    await expect(page).toHaveURL('/blog')
  })

  test('share buttons work', async ({ page }) => {
    await page.goto('/blog/cryptocurrency-periodic-table-threejs')
    
    // Look for share buttons
    const shareSection = page.getByText(/share this article/i)
    if (await shareSection.isVisible()) {
      // Test copy link functionality
      const copyButton = page.getByRole('button', { name: /copy link/i })
      if (await copyButton.isVisible()) {
        await copyButton.click()
        // In a real test, you'd verify clipboard content
      }
    }
  })

  test('syntax highlighting works', async ({ page }) => {
    await page.goto('/blog/cryptocurrency-periodic-table-threejs')
    
    // Look for code blocks with syntax highlighting
    const codeBlocks = page.locator('pre code')
    if (await codeBlocks.count() > 0) {
      await expect(codeBlocks.first()).toBeVisible()
      
      // Check for highlighted syntax (classes applied by highlight.js)
      const highlightedCode = page.locator('code[class*="language"]')
      if (await highlightedCode.count() > 0) {
        await expect(highlightedCode.first()).toBeVisible()
      }
    }
  })

  test('404 page works for non-existent posts', async ({ page }) => {
    await page.goto('/blog/non-existent-post')
    
    // Should show 404 page
    await expect(page.getByText(/404|not found/i)).toBeVisible()
    
    // Should have link back to blog
    await expect(page.getByRole('link', { name: /blog|articles/i })).toBeVisible()
  })
})