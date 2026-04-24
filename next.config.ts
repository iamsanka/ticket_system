/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config; // enabling webpack mode
  },
  experimental: {
    serverMinification: false
  }
};

module.exports = nextConfig;
