// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Prevent bundling of server-side modules on the client
      if (config.resolve && config.resolve.alias) {
        (config.resolve.alias as { [key: string]: string | false })['playwright-core'] = false;
        (config.resolve.alias as { [key: string]: string | false })['@sparticuz/chromium'] = false;
      }
    }
    return config;
  },
};

module.exports = nextConfig;
