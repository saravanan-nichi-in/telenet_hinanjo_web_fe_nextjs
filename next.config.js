/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler:{styledComponents: true,},
    reactStrictMode: true,
    trailingSlash: false,
    // output: 'export', // To enable a static export, change the output mode !!
    env: {
        customKey: process.env.NODE_ENV === 'development' ? 'my-value-dev' : 'my-value-prod',
    },
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
