# E2E Testing Guide

This guide covers the end-to-end testing setup for the VolkovChain website using Playwright.

## Test Structure

```
e2e/
  ├── homepage.spec.ts              # Homepage functionality tests
  ├── periodic-table.spec.ts        # 3D periodic table interaction tests
  ├── blog.spec.ts                  # Blog listing and individual posts
  ├── consulting.spec.ts             # Consultation booking flow
  └── accessibility-performance.spec.ts # Cross-page quality checks
```

## Running Tests

### Local Development
```bash
# Install Playwright browsers
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (visual debugging)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test homepage.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
```

### CI/CD Integration
```bash
# Run tests in CI mode (parallel, with retries)
npx playwright test --project=chromium --workers=1 --retries=2
```

## Test Coverage

### 🏠 Homepage Tests (`homepage.spec.ts`)
- ✅ Page title and meta description
- ✅ Navigation links visibility and functionality  
- ✅ Hero section content display
- ✅ Quick links navigation
- ✅ Theme toggle functionality
- ✅ Language switcher
- ✅ Mobile navigation (hamburger menu)
- ✅ Page load performance
- ✅ Console error monitoring

### 🔬 Periodic Table Tests (`periodic-table.spec.ts`)
- ✅ 3D canvas loading and visibility
- ✅ Search functionality
- ✅ Category filtering
- ✅ Element interaction (clicks)
- ✅ Mobile responsive design
- ✅ View mode toggle (2D/3D)
- ✅ Performance benchmarks
- ✅ Accessibility features
- ✅ Navigation flow

### 📝 Blog Tests (`blog.spec.ts`)
- ✅ Blog listing page display
- ✅ Search functionality
- ✅ Category filtering
- ✅ Pagination controls
- ✅ Individual blog post navigation
- ✅ Table of contents functionality
- ✅ Back to blog navigation
- ✅ Share buttons
- ✅ Syntax highlighting
- ✅ 404 handling for non-existent posts
- ✅ Mobile layout adaptation

### 💼 Consulting Tests (`consulting.spec.ts`)
- ✅ Service package display
- ✅ Package selection and modal opening
- ✅ Booking form validation
- ✅ Form field completion
- ✅ Pricing display accuracy
- ✅ FAQ section functionality
- ✅ Contact CTA interaction
- ✅ Modal close functionality
- ✅ Payment flow initiation (mocked)
- ✅ Success page display

### 🔍 Accessibility & Performance (`accessibility-performance.spec.ts`)
- ✅ Heading hierarchy validation
- ✅ Focus management
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Color contrast checks
- ✅ Page load time benchmarks
- ✅ Core Web Vitals (LCP, CLS)
- ✅ JavaScript error monitoring
- ✅ Bundle size validation
- ✅ SEO meta tag presence
- ✅ Responsive design across viewports

## Browser Support

Tests run across multiple browsers and devices:

### Desktop Browsers
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

### Mobile Devices
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## Performance Benchmarks

### Load Time Expectations
- **Homepage**: < 3 seconds
- **Blog**: < 4 seconds  
- **Consulting**: < 3 seconds
- **About**: < 3 seconds
- **Periodic Table**: < 8 seconds (3D content)

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Bundle Size**: < 2MB total JS/CSS

## Accessibility Standards

Tests validate compliance with:
- ✅ WCAG 2.1 AA guidelines
- ✅ Proper heading hierarchy
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Focus management
- ✅ ARIA labels and roles

## Test Configuration

### Playwright Config Highlights
```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Mock Strategy

### External Services
- **Stripe**: Payment flows use mock data to avoid real transactions
- **YouTube API**: Falls back to mock video data when API unavailable
- **3D Libraries**: Canvas interactions use test selectors

### Test Data
- Sample blog posts for content testing
- Mock consultation packages
- Predefined periodic table elements

## Debugging Tests

### Visual Debugging
```bash
# Open Playwright UI for interactive debugging
npm run test:e2e:ui
```

### Screenshots and Videos
- Screenshots captured on test failure
- Videos recorded for failed tests
- Traces available for debugging

### Common Issues
1. **Flaky 3D Tests**: Add longer waits for 3D scene initialization
2. **Mobile Layout**: Ensure viewport is set before testing
3. **Performance Tests**: Account for CI environment slower execution

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright tests
  run: |
    npx playwright install --with-deps
    npm run test:e2e
    
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Best Practices

### Test Writing
1. ✅ Use semantic locators (role, label, text)
2. ✅ Wait for elements to be stable before interaction
3. ✅ Use page.waitForLoadState('networkidle') for dynamic content
4. ✅ Mock external dependencies
5. ✅ Keep tests independent and idempotent

### Performance Testing
1. ✅ Test realistic user scenarios
2. ✅ Monitor both initial load and interaction performance
3. ✅ Set appropriate timeout expectations
4. ✅ Account for different network conditions

### Accessibility Testing
1. ✅ Test keyboard navigation flows
2. ✅ Verify ARIA labels and roles
3. ✅ Check focus management
4. ✅ Validate semantic HTML structure

## Maintenance

### Regular Updates
- Update Playwright version monthly
- Review performance benchmarks quarterly
- Audit accessibility standards annually
- Update browser versions automatically

### Test Health
- Monitor test flakiness rates
- Review and update selectors for UI changes
- Maintain mock data relevance
- Update performance expectations as features are added