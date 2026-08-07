import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Increase build time limit
  staticPageGenerationTimeout: 100,
  // Standalone is for Docker self-hosting only. On Vercel + Next 16.3,
  // output:'standalone' with the platform adapter skips next-server.js.nft.json
  // and onBuildComplete fails with ENOENT (vercel/next.js#96646).
  output: process.env.VERCEL ? undefined : 'standalone',
  // Optional: bring your own cache handler
  // cacheHandler: path.resolve('./cache-handler.mjs'),
  // cacheMaxMemorySize: 0, // Disable default in-memory caching
  images: {
    // Optional: use a different optimization service
    // loader: 'custom',
    // loaderFile: './image-loader.ts',
    //
    // We're defaulting to optimizing images with
    // Sharp, which is built-into `next start`
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'scontent.*.fna.fbcdn.net',
        pathname: '/**',
      }
    ],
  },
  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false,
  // Optional: override the default (1 year) `stale-while-revalidate`
  // header time for static pages
  // expireTime: 3600 // seconds
  expireTime: 3600
};

export default nextConfig;