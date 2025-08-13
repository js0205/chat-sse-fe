import { useEffect } from 'react';
import { collectWebVitals } from '../utils/webVitals';

/**
 * 自定义 hook，用于在组件挂载时收集 Web Vitals 指标
 * @param reportAllChanges 是否报告所有变更
 */
export function useWebVitals(reportAllChanges = false): void {
  useEffect(() => {
    // 在客户端环境下收集 Web Vitals
    if (typeof window !== 'undefined') {
      collectWebVitals(reportAllChanges);
    }
  }, [reportAllChanges]);
}
