import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack does not walk up to a parent lockfile.
  turbopack: { root: path.resolve(process.cwd()) },
  // Baseline protections that work with statically prerendered pages. A
  // script-restricting CSP would need per-request nonces (dynamic rendering),
  // so this policy limits framing, form targets, <base> and plugins instead.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
        ],
      },
    ]
  },
  // Renamed pages keep their old addresses working.
  async redirects() {
    return [
      { source: '/book-a-demo', destination: '/contact', permanent: true },
      { source: '/getting-started', destination: '/after-you-buy', permanent: true },
    ]
  },
}

export default nextConfig
