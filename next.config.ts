// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Prevent `playwright` from being included in the client bundle
      if (config.resolve && config.resolve.alias) {
        (config.resolve.alias as { [key: string]: string | false })['playwright'] = false;
      }
    }
    return config;
  },
};

module.exports = nextConfig;