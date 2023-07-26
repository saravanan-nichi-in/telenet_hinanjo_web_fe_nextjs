const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: { styledComponents: true, },
    reactStrictMode: true,
    trailingSlash: false,
    // output: 'export', // To enable a static export, change the output mode !!
    env: {
        customKey: process.env.NODE_ENV === 'development' ? 'my-value-dev' : 'my-value-prod',
    },
    swcMinify: true,
    i18n,
}

module.exports = nextConfig
