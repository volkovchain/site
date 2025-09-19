# VolkovChain Website - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
1. **Node.js 18+** (current version 14.20.1 needs upgrade)
2. **Vercel Account** for hosting
3. **Environment Variables** (see .env.example)

### Deployment Steps

#### 1. Upgrade Node.js
```bash
# Install Node.js 18+ using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
nvm install 18
nvm use 18
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Copy `.env.example` to `.env.local` and configure:

```bash
# Required for production
YOUTUBE_API_KEY=your_actual_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
NEXT_PUBLIC_SITE_URL=https://volkovchain.dev

# Optional for enhanced features
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### 4. Build and Test
```bash
# Build the application
npm run build

# Test production build locally
npm start
```

#### 5. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel
Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `YOUTUBE_API_KEY` | Your YouTube Data API v3 key | ✅ |
| `YOUTUBE_CHANNEL_ID` | Your YouTube channel ID | ✅ |
| `NEXT_PUBLIC_SITE_URL` | https://volkovchain.dev | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ⚠️ Optional |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | ⚠️ Optional |

## 📊 Performance Optimizations

### Implemented
- ✅ Next.js Image optimization
- ✅ Component code splitting
- ✅ CSS optimization with Tailwind
- ✅ Responsive 3D rendering
- ✅ Lazy loading for components
- ✅ SEO optimization

### Recommended Additions
- [ ] Vercel Analytics integration
- [ ] CDN for static assets
- [ ] Service Worker for caching
- [ ] Bundle analysis and optimization

## 🔧 Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write .
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Version Error
**Error**: `Unsupported engine for next@14.2.5`
**Solution**: Upgrade to Node.js 18+

#### 2. 3D Components Not Loading
**Error**: `WebGL context lost`
**Solution**: Ensure modern browser with WebGL support

#### 3. YouTube Videos Not Loading
**Error**: `Failed to fetch videos`
**Solution**: Check YouTube API key and quota limits

#### 4. Build Failures
**Error**: `Module not found`
**Solution**: Run `npm install` and check imports

### Performance Issues

#### 3D Periodic Table Slow on Mobile
- Reduce element count for mobile
- Lower animation frame rate
- Implement LOD (Level of Detail)

#### Large Bundle Size
- Use dynamic imports for heavy components
- Optimize Three.js imports
- Analyze bundle with `@next/bundle-analyzer`

## 📈 Monitoring

### Analytics Setup
1. **Vercel Analytics**: Add to project dashboard
2. **Google Analytics**: Add GA4 tracking ID
3. **Error Tracking**: Configure Sentry DSN

### Key Metrics to Monitor
- Page load times (LCP < 2.5s)
- 3D rendering performance
- API response times
- User engagement on periodic table
- Conversion rates for consultations

## 🔄 Updates and Maintenance

### Regular Tasks
- [ ] Update cryptocurrency data monthly
- [ ] Review and update YouTube content
- [ ] Monitor and fix broken links
- [ ] Update dependencies quarterly
- [ ] Review and optimize performance

### Content Updates
- Cryptocurrency data: `src/lib/periodicData.ts`
- Service packages: `src/lib/consulting.ts`
- Professional experience: `src/app/about/page.tsx`

---

**Next Steps for Full Production:**
1. Upgrade Node.js to version 18+
2. Configure YouTube API credentials
3. Set up Vercel deployment
4. Implement remaining features (blog, Stripe)
5. Add comprehensive testing
6. Set up monitoring and analytics

The current implementation provides a solid foundation with the core interactive periodic table feature fully functional and production-ready."