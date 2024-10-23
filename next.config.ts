const nextConfig = {
  webpack: (config: import('webpack').Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // Prevent bundling of server-side modules on the client
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@sparticuz/chromium');
        config.externals.push('playwright-core');
      } else {
        config.externals = ['@sparticuz/chromium', 'playwright-core'];
      }
    }
    return config;
  },
};


export default nextConfig;