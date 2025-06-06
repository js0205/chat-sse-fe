'use client';

import { useWebVitals } from '@/hooks';
import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';

/**
 * Web Vitals 指标收集和上报组件
 * 这是一个客户端组件，用于在应用加载时自动收集和上报 Web Vitals 指标
 */
export function WebVitalsReporter() {
  const [, setIsLoaded] = useState(false);

  // 使用自定义 hook 收集 Web Vitals 指标
  useWebVitals();

  // 模拟一个加载过程，用于测试 Web Vitals 指标收集
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoaded(true);

      // 发送一个自定义事件到 Sentry
      try {
        Sentry.captureMessage('WebVitalsReporter loaded', {
          level: 'info',
          tags: {
            component: 'WebVitalsReporter',
            event: 'loaded'
          }
        });
      } catch (error) {
        console.error('无法发送自定义事件到 Sentry:', error);
      }
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  // 这个组件不渲染可见内容
  return null;
}
