/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: { externals: string[] | { [key: string]: string }; }, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Prevent bundling of server-side modules on the client
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@sparticuz/chromium', 'playwright-core');
      } else if (typeof config.externals === 'object') {
        config.externals['@sparticuz/chromium'] = '@sparticuz/chromium';
        config.externals['playwright-core'] = 'playwright-core';
      } else {
        config.externals = ['@sparticuz/chromium', 'playwright-core'];
      }
    }
    return config;
  },
};

module.exports = nextConfig;
