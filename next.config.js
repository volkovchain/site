/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker and production optimization
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Next.js 15 optimizations
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  
  // Turbopack configuration for Next.js 15
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Updated image configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['youtube.com', 'contentful.com', 'images.unsplash.com', 'via.placeholder.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  compress: true,
  poweredByHeader: false,
  
  // Performance optimizations - swcMinify is default in Next.js 15
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enhanced webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Three.js optimization for Next.js 15
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        three: {
          test: /[\/]node_modules[\/](three|@react-three)[\/]/,
          name: 'three',
          chunks: 'all',
          priority: 10,
        }
      }
    }
    
    return config
  },
}

module.exports = nextConfig