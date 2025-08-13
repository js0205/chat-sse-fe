import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons', '@douyinfe/semi-illustrations'],
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false
  }
  // instrumentationHook is no longer needed in Next.js 15+
  // Note: i18n configuration is not supported in App Router
  // Use next-intl or similar library for internationalization
};

export default nextConfig;

// TODO: 重新启用 Sentry 配置
// import { withSentryConfig } from '@sentry/nextjs';
//
// const sentryConfig = {
//   silent: true,
//   org: process.env.SENTRY_ORG,
//   project: process.env.SENTRY_PROJECT,
//   authToken: process.env.SENTRY_AUTH_TOKEN,
//   widenClientFileUpload: true,
//   hideSourceMaps: true,
//   disableLogger: true
// };
//
// export default withSentryConfig(withSentryConfig(nextConfig, sentryConfig), {
//   org: 'js0205',
//   project: 'javascript-nextjs',
//   silent: !process.env.CI,
//   widenClientFileUpload: true,
//   tunnelRoute: '/monitoring',
//   disableLogger: true,
//   automaticVercelMonitors: true
// });
