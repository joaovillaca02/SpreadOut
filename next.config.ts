import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static01.nyt.com',
      },
      {
        protocol: 'https',
        hostname: 'news.bbcimg.co.uk',
      },
      {
        protocol: 'http',
        hostname: 'i2.cdn.turner.com',
      },
      {
        protocol: 'http',
        hostname: 'www.bbc.co.uk',
      },
    ],
  },
};

export default nextConfig;
