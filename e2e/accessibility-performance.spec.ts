import { test, expect } from '@playwright/test'

test.describe('Accessibility & Performance', () => {
  const pages = ['/', '/periodic-table', '/blog', '/consulting', '/about']

  pages.forEach(path => {
    test.describe(`Accessibility tests for ${path}`, () => {
      test(`${path} has proper heading hierarchy`, async ({ page }) => {
        await page.goto(path)
        
        // Check for h1 element
        const h1 = page.getByRole('heading', { level: 1 })
        await expect(h1).toBeVisible()
        
        // Ensure only one h1 per page
        const h1Count = await page.getByRole('heading', { level: 1 }).count()
        expect(h1Count).toBeLessThanOrEqual(1)
      })

      test(`${path} has proper focus management`, async ({ page }) => {
        await page.goto(path)
        
        // Skip to main content should be first focusable element
        await page.keyboard.press('Tab')
        
        // Check that focus is visible
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
      })

      test(`${path} has proper ARIA labels`, async ({ page }) => {
        await page.goto(path)
        
        // Navigation should have proper labels
        const nav = page.getByRole('navigation')
        if (await nav.count() > 0) {
          await expect(nav.first()).toBeVisible()
        }
        
        // Buttons should have accessible names
        const buttons = page.getByRole('button')
        for (let i = 0; i < await buttons.count(); i++) {
          const button = buttons.nth(i)
          const accessibleName = await button.getAttribute('aria-label') || 
                                await button.textContent()
          expect(accessibleName).toBeTruthy()
        }
      })

      test(`${path} works with keyboard navigation`, async ({ page }) => {
        await page.goto(path)
        
        // Tab through interactive elements
        const interactiveElements = []
        let iterations = 0
        const maxIterations = 20
        
        while (iterations < maxIterations) {
          await page.keyboard.press('Tab')
          const focusedElement = page.locator(':focus')
          
          if (await focusedElement.count() > 0) {
            const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
            if (['a', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
              interactiveElements.push(tagName)
            }
          }
          
          iterations++
        }
        
        // Should have found some interactive elements
        expect(interactiveElements.length).toBeGreaterThan(0)
      })

      test(`${path} has sufficient color contrast`, async ({ page }) => {
        await page.goto(path)
        
        // This is a basic check - in a real test you'd use axe-core
        const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a')
        
        for (let i = 0; i < Math.min(5, await textElements.count()); i++) {
          const element = textElements.nth(i)
          if (await element.isVisible()) {
            // Check that text is not invisible (basic check)
            const opacity = await element.evaluate(el => 
              window.getComputedStyle(el).opacity
            )
            expect(parseFloat(opacity)).toBeGreaterThan(0)
          }
        }
      })
    })

    test.describe(`Performance tests for ${path}`, () => {
      test(`${path} loads within acceptable time`, async ({ page }) => {
        const startTime = Date.now()
        
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        
        const loadTime = Date.now() - startTime
        
        // Different pages have different performance expectations
        const timeouts = {
          '/': 3000,
          '/periodic-table': 8000, // 3D content takes longer
          '/blog': 4000,
          '/consulting': 3000,
          '/about': 3000
        }
        
        const expectedTimeout = timeouts[path as keyof typeof timeouts] || 5000
        expect(loadTime).toBeLessThan(expectedTimeout)
      })

      test(`${path} has good Core Web Vitals`, async ({ page }) => {
        await page.goto(path)
        
        // Measure Largest Contentful Paint (LCP)
        const lcp = await page.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const lastEntry = entries[entries.length - 1]
              resolve(lastEntry.startTime)
            }).observe({ entryTypes: ['largest-contentful-paint'] })
            
            // Fallback timeout
            setTimeout(() => resolve(0), 10000)
          })
        })
        
        // LCP should be under 2.5 seconds for good performance
        if (typeof lcp === 'number' && lcp > 0) {
          expect(lcp).toBeLessThan(2500)
        }
      })

      test(`${path} has minimal layout shift`, async ({ page }) => {
        await page.goto(path)
        
        // Measure Cumulative Layout Shift (CLS)
        const cls = await page.evaluate(() => {
          return new Promise((resolve) => {
            let clsValue = 0
            
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value
                }
              }
            }).observe({ entryTypes: ['layout-shift'] })
            
            // Resolve after a delay to capture shifts
            setTimeout(() => resolve(clsValue), 5000)
          })
        })
        
        // CLS should be under 0.1 for good performance
        if (typeof cls === 'number') {
          expect(cls).toBeLessThan(0.1)
        }
      })

      test(`${path} has no JavaScript errors`, async ({ page }) => {
        const errors: string[] = []
        
        page.on('pageerror', (error) => {
          errors.push(error.message)
        })
        
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            errors.push(msg.text())
          }
        })
        
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        
        // Filter out known non-critical errors
        const criticalErrors = errors.filter(error => 
          !error.includes('favicon') &&
          !error.includes('manifest') &&
          !error.includes('404') &&
          !error.includes('net::ERR_FAILED') &&
          !error.toLowerCase().includes('non-passive')
        )
        
        expect(criticalErrors).toHaveLength(0)
      })

      test(`${path} has reasonable bundle size`, async ({ page }) => {
        const responses: any[] = []
        
        page.on('response', (response) => {
          if (response.url().includes('.js') || response.url().includes('.css')) {
            responses.push({
              url: response.url(),
              size: response.headers()['content-length']
            })
          }
        })
        
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        
        // Check that we're not loading excessively large bundles
        const totalSize = responses.reduce((sum, response) => {
          const size = parseInt(response.size || '0')
          return sum + size
        }, 0)
        
        // Total JS/CSS should be reasonable (under 2MB)
        expect(totalSize).toBeLessThan(2 * 1024 * 1024)
      })
    })
  })

  test('SEO meta tags are present on all pages', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path)
      
      // Check for essential meta tags
      await expect(page.locator('meta[name="description"]')).toHaveCount(1)
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
      await expect(page.locator('meta[property="og:description"]')).toHaveCount(1)
      
      // Check title
      const title = await page.title()
      expect(title.length).toBeGreaterThan(10)
      expect(title.length).toBeLessThan(60)
    }
  })

  test('responsive design works across viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1024, height: 768 },  // Desktop small
      { width: 1920, height: 1080 }  // Desktop large
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      
      for (const path of pages.slice(0, 3)) { // Test first 3 pages for time
        await page.goto(path)
        
        // Check that main content is visible
        const main = page.locator('main')
        if (await main.count() > 0) {
          await expect(main).toBeVisible()
        }
        
        // Check that navigation is accessible
        const nav = page.getByRole('navigation')
        await expect(nav.first()).toBeVisible()
      }
    }
  })
})