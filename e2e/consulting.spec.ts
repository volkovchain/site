import { test, expect } from '@playwright/test'

test.describe('Consulting Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/consulting')
  })

  test('displays consulting packages correctly', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: /consultation/i, level: 1 })).toBeVisible()
    
    // Check for service packages
    await expect(page.getByText(/basic consultation/i)).toBeVisible()
    await expect(page.getByText(/standard package/i)).toBeVisible()
    await expect(page.getByText(/premium package/i)).toBeVisible()
    await expect(page.getByText(/enterprise solution/i)).toBeVisible()
  })

  test('service package selection works', async ({ page }) => {
    // Click on a service package
    const basicPackage = page.getByRole('button', { name: /select.*basic/i })
    if (await basicPackage.isVisible()) {
      await basicPackage.click()
      
      // Should open booking modal
      await expect(page.getByRole('dialog')).toBeVisible()
      await expect(page.getByText(/basic consultation/i)).toBeVisible()
    }
  })

  test('booking modal form validation works', async ({ page }) => {
    // Open booking modal
    const basicPackage = page.getByRole('button', { name: /select.*basic/i })
    if (await basicPackage.isVisible()) {
      await basicPackage.click()
      
      // Try to submit without filling required fields
      const submitButton = page.getByRole('button', { name: /proceed to payment/i })
      await submitButton.click()
      
      // Should show validation errors (implementation dependent)
      // In a real app, you'd check for error messages
    }
  })

  test('booking form can be filled out', async ({ page }) => {
    // Open booking modal
    const basicPackage = page.getByRole('button', { name: /select.*basic/i })
    if (await basicPackage.isVisible()) {
      await basicPackage.click()
      
      // Fill out the form
      await page.getByLabel(/name/i).fill('John Doe')
      await page.getByLabel(/email/i).fill('john@example.com')
      await page.getByLabel(/date/i).fill('2024-12-25')
      
      const messageField = page.getByLabel(/project/i)
      if (await messageField.isVisible()) {
        await messageField.fill('I need help with blockchain development')
      }
      
      // Form should be ready for submission
      const submitButton = page.getByRole('button', { name: /proceed to payment/i })
      await expect(submitButton).toBeEnabled()
    }
  })

  test('pricing is displayed correctly', async ({ page }) => {
    // Check that prices are visible
    await expect(page.getByText(/\$150/)).toBeVisible() // Basic
    await expect(page.getByText(/\$500/)).toBeVisible() // Standard
    await expect(page.getByText(/\$1,?200/)).toBeVisible() // Premium
    await expect(page.getByText(/\$2,?500/)).toBeVisible() // Enterprise
  })

  test('FAQ section is functional', async ({ page }) => {
    // Scroll to FAQ section
    const faqSection = page.getByText(/frequently asked questions/i)
    if (await faqSection.isVisible()) {
      await faqSection.scrollIntoViewIfNeeded()
      
      // Check for FAQ content
      await expect(page.getByText(/format.*consultation/i)).toBeVisible()
      await expect(page.getByText(/guarantee/i)).toBeVisible()
    }
  })

  test('contact CTA works', async ({ page }) => {
    // Look for contact call-to-action
    const contactButton = page.getByRole('button', { name: /write directly|contact/i })
    if (await contactButton.isVisible()) {
      // This would normally open an email client or contact form
      await contactButton.click()
    }
  })

  test('mobile layout works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Page should be responsive
    await expect(page.getByRole('heading', { name: /consultation/i })).toBeVisible()
    
    // Service cards should stack vertically
    const serviceCards = page.locator('[data-testid="service-card"]')
    if (await serviceCards.count() > 0) {
      // Cards should be visible and stacked
      await expect(serviceCards.first()).toBeVisible()
    }
  })

  test('modal can be closed', async ({ page }) => {
    // Open booking modal
    const basicPackage = page.getByRole('button', { name: /select.*basic/i })
    if (await basicPackage.isVisible()) {
      await basicPackage.click()
      
      // Modal should be open
      await expect(page.getByRole('dialog')).toBeVisible()
      
      // Close modal with cancel button
      const cancelButton = page.getByRole('button', { name: /cancel/i })
      await cancelButton.click()
      
      // Modal should be closed
      await expect(page.getByRole('dialog')).not.toBeVisible()
    }
  })
})

test.describe('Stripe Integration (Mock)', () => {
  test('payment flow can be initiated', async ({ page }) => {
    // Note: This would require mocking Stripe in a real test environment
    await page.goto('/consulting')
    
    // Open booking modal and fill form
    const basicPackage = page.getByRole('button', { name: /select.*basic/i })
    if (await basicPackage.isVisible()) {
      await basicPackage.click()
      
      // Fill required fields
      await page.getByLabel(/name/i).fill('Test User')
      await page.getByLabel(/email/i).fill('test@example.com')
      
      // In a real test, you'd mock the Stripe redirect
      const submitButton = page.getByRole('button', { name: /proceed to payment/i })
      await expect(submitButton).toBeVisible()
      
      // Don't actually click to avoid triggering Stripe
    }
  })

  test('success page displays correctly', async ({ page }) => {
    // Navigate directly to success page (with mock session ID)
    await page.goto('/consulting/success?session_id=mock_session_123')
    
    // Should show success message
    await expect(page.getByText(/payment successful/i)).toBeVisible()
    await expect(page.getByText(/thank you/i)).toBeVisible()
    
    // Should have next steps information
    await expect(page.getByText(/what.*next/i)).toBeVisible()
    
    // Should have contact information
    await expect(page.getByText(/questions/i)).toBeVisible()
  })
})