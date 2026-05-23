import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias['@backend'] = path.join(__dirname, '../backend')

    // Ensure backend files resolve node_modules from frontend/
    config.resolve.modules = [
      path.join(__dirname, 'node_modules'),
      'node_modules',
      ...(config.resolve.modules ?? []),
    ]

    return config
  },
}

export default nextConfig
