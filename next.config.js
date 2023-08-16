/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: { styledComponents: true, },
    reactStrictMode: true,
    trailingSlash: false,
    output: 'export', // To enable a static export, change the output mode !!
    env: {
        customKey: process.env.NODE_ENV === 'development' ? 'my-value-dev' : 'my-value-prod',
    },
    swcMinify: true,
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? '' // development api
            : '' // production api
    },
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
