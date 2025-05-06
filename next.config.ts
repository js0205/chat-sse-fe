import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons', '@douyinfe/semi-illustrations'],
  i18n: {
    locales: ['en','zh'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
