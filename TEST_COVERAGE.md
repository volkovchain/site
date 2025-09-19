# Test Coverage Report Generator

This script generates comprehensive test coverage reports for the VolkovChain website.

## Running Tests

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
src/
  components/
    ui/__tests__/
      Button.test.tsx
      Card.test.tsx
    blog/__tests__/
      BlogCard.test.tsx
  lib/__tests__/
    utils.test.ts
    blog.test.ts
  stores/__tests__/
    useAppStore.test.ts
  app/api/__tests__/
    analytics.test.ts
  test/
    setup.ts
    utils.tsx
```

### Coverage Goals

- **UI Components**: 90%+ coverage
- **Utility Functions**: 95%+ coverage  
- **API Routes**: 80%+ coverage
- **Store Logic**: 90%+ coverage

### Test Categories

1. **Unit Tests**: Individual component/function testing
2. **Integration Tests**: API route and store interactions
3. **Accessibility Tests**: Component accessibility compliance
4. **Performance Tests**: Component render performance

### Current Coverage

The test suite covers:

✅ **UI Components**
- Button component (all variants, states, interactions)
- Card component (variants, hover states, click handling)
- Form components (validation, submission)

✅ **Blog System**
- BlogCard rendering and data display
- Blog utility functions (pagination, search, filtering)
- MDX content processing

✅ **State Management**
- Zustand store actions and state updates
- Theme and language switching
- Navigation state management
- Periodic table state handling

✅ **Utility Functions**
- Class name utilities (cn function)
- Date and price formatting
- Text processing (slugify, truncate)
- URL and string manipulation

✅ **API Routes**
- Analytics data collection
- Error handling and validation
- Request/response processing

### Mock Strategy

The test suite includes comprehensive mocking for:

- Next.js router and navigation
- Framer Motion animations
- Three.js 3D components
- External APIs (YouTube, Stripe)
- Browser APIs (IntersectionObserver, ResizeObserver)
- File system operations

### Performance Testing

Performance tests validate:
- Component render times
- Bundle size optimization
- Memory usage tracking
- 3D scene performance metrics

### Accessibility Testing

Accessibility tests ensure:
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Color contrast compliance

## Test Execution Examples

### Component Testing
```typescript
describe('Button Component', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant="primary">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
  })
})
```

### API Testing
```typescript
describe('Analytics API', () => {
  it('processes web vitals correctly', async () => {
    const response = await POST(mockRequest)
    expect(response.status).toBe(200)
  })
})
```

### Store Testing
```typescript
describe('App Store', () => {
  it('updates theme correctly', () => {
    act(() => store.toggleTheme())
    expect(store.theme).toBe('light')
  })
})
```

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests (GitHub Actions)
- Production deployments (build verification)

Coverage reports are generated and stored for tracking test quality over time.