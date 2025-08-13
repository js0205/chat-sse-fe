// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://c420999120730a94892b2db5ab4123b8@o4509446769344512.ingest.us.sentry.io/4509446770851840',

  // 性能采样率 - 1.0 表示捕获 100% 的事务
  // 在生产环境中，您可能希望将此值降低到 0.1-0.3 之间
  tracesSampleRate: 1.0,

  // 设置为 true 可在控制台输出有用的调试信息
  debug: false
});
