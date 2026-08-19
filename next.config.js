/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': require('path').resolve(__dirname, './src'),
      '@/components': require('path').resolve(__dirname, './src/components'),
      '@/lib': require('path').resolve(__dirname, './src/lib'),
      '@/types': require('path').resolve(__dirname, './src/types'),
      '@/app': require('path').resolve(__dirname, './src/app'),
    };
    return config;
  },
};

module.exports = withPWA(nextConfig);