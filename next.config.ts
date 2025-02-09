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
      {
        protocol: 'https',
        hostname: 'media.gazetadopovo.com.br',
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cnn.com',
      },
    ],
  },
};

export default nextConfig;
