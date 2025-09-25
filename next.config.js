/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**'
      }
    ]
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] }
  }
};

// If your request.ts config is at src/i18n/request.ts (recommended/default)
const withNextIntl = createNextIntlPlugin();

// If you want to specify a custom config path, for example:
// const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

module.exports = withNextIntl(nextConfig);
