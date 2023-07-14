/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler:{styledComponents: true,},
    reactStrictMode: true,
    trailingSlash: false,
    // output: 'export', // To enable a static export, change the output mode !!
    env: {
        customKey: process.env.NODE_ENV === 'development' ? 'my-value-dev' : 'my-value-prod',
    },
}

module.exports = nextConfig
