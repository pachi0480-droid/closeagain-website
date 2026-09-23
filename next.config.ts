import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack does not walk up to a parent lockfile.
  turbopack: { root: path.resolve(process.cwd()) },
}

export default nextConfig
