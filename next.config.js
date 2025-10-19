/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clean configuration for Next.js 14
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure bcryptjs is properly handled on the server side
      config.externals = config.externals || []
      config.externals.push('bcryptjs')
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-src 'self' https:",
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
