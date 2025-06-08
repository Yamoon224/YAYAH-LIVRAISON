/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'groupmafamo.com',
        pathname: '/images/products/**',
      },
    ],
  },
};

module.exports = nextConfig;
