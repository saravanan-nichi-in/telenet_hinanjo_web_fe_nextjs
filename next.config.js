/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { styledComponents: true, },
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  output: 'export',
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
}

module.exports = nextConfig
