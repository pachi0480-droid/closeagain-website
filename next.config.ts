import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack does not walk up to a parent lockfile.
  turbopack: { root: path.resolve(process.cwd()) },
  // The demo-request page became the buying page; keep old links working.
  async redirects() {
    return [{ source: '/book-a-demo', destination: '/contact', permanent: true }]
  },
}

export default nextConfig
