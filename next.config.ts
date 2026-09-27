import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack does not walk up to a parent lockfile.
  turbopack: { root: path.resolve(process.cwd()) },
  // Renamed pages keep their old addresses working.
  async redirects() {
    return [
      { source: '/book-a-demo', destination: '/contact', permanent: true },
      { source: '/after-you-buy', destination: '/getting-started', permanent: true },
    ]
  },
}

export default nextConfig
