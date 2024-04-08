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
}

module.exports = nextConfig
