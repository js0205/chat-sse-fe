import * as Sentry from '@sentry/nextjs';
import { Metric, onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

/**
 * 自定义类型，符合 Next.js 期望的性能指标类型
 */
type NextWebVitalsMetric = {
  id: string;
  name: string;
  startTime: number;
  value: number;
  label: 'web-vital' | 'custom';
};

/**
 * 将 Web Vitals 指标发送到分析服务
 * @param metric 性能指标
 */
const sendToAnalytics = async (metric: NextWebVitalsMetric): Promise<void> => {
  // 将数据记录到控制台
  console.log('Web Vitals 指标:', metric);

  // 发送到 Sentry
  try {
    // 发送指标数据到 Sentry
    Sentry.captureMessage(`Web Vital: ${metric.name}`, {
      level: 'info',
      tags: {
        webVital: 'true',
        metricName: metric.name
      },
      // 添加性能数据作为额外数据
      extra: {
        id: metric.id,
        name: metric.name,
        value: metric.value,
        label: metric.label
      }
    });

    // 如果是超出阈值的关键指标，可以考虑创建一个警告级别的问题
    // 不同指标的阈值参考 Web Vitals 良好分数阈值
    const isPerformanceProblem =
      (metric.name === 'CLS' && metric.value > 0.1) ||
      (metric.name === 'LCP' && metric.value > 2500) ||
      (metric.name === 'FID' && metric.value > 100) ||
      (metric.name === 'TTFB' && metric.value > 600);

    if (isPerformanceProblem) {
      Sentry.captureMessage(`性能问题: ${metric.name} = ${metric.value}`, {
        level: 'warning',
        tags: {
          webVitalIssue: 'true',
          metricName: metric.name,
          severity: 'exceeds-threshold'
        },
        // 添加性能数据作为上下文
        extra: {
          webVital: {
            id: metric.id,
            name: metric.name,
            value: metric.value,
            label: metric.label
          }
        }
      });
    }
  } catch (error) {
    console.error('上报 Web Vitals 指标到 Sentry 失败:', error);
  }
};

/**
 * 收集所有的 Web Vitals 指标
 * @param reportAllChanges 是否报告所有变更
 */
export const collectWebVitals = (reportAllChanges = false): void => {
  const reportCallback = (metric: Metric) => {
    // 转换为 NextWebVitalsMetric 格式
    const nextMetric: NextWebVitalsMetric = {
      id: metric.id,
      name: metric.name,
      startTime: performance.now(),
      value: Math.round(metric.value * 1000) / 1000,
      label: 'web-vital'
    };

    sendToAnalytics(nextMetric);
  };

  // 收集核心 Web Vitals 指标
  onCLS(reportCallback, { reportAllChanges });
  onFCP(reportCallback);
  onLCP(reportCallback);
  onTTFB(reportCallback);
};

/**
 * Next.js App Router 使用的 Web Vitals 上报函数
 */
export const reportWebVitals = (metric: NextWebVitalsMetric): void => {
  sendToAnalytics(metric);
};

export default reportWebVitals;
