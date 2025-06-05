import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';
import { logoutUser, refreshTokenUser, selectIsAuthenticated, selectShouldRefreshToken } from '../slices/authSlice';

// ============== 类型定义 ==============

interface AuthMiddlewareConfig {
  enableAutoRefresh: boolean; // 是否启用自动刷新
  refreshInterval: number; // 检查间隔（毫秒）
  maxRetryAttempts: number; // 最大重试次数
}

// ============== 默认配置 ==============

const defaultConfig: AuthMiddlewareConfig = {
  enableAutoRefresh: true,
  refreshInterval: 60 * 1000, // 1分钟检查一次
  maxRetryAttempts: 3 // 最多重试3次
};

// ============== 创建监听器中间件 ==============

/**
 * 创建认证中间件
 * @param config 配置选项
 * @returns 中间件实例
 */
export const createAuthMiddleware = (config: Partial<AuthMiddlewareConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };

  // 创建监听器中间件
  const authMiddleware = createListenerMiddleware<RootState, AppDispatch>();

  // Token刷新重试计数器
  let refreshRetryCount = 0;

  // 定时器引用
  let refreshTimer: NodeJS.Timeout | null = null;

  // ============== 工具函数 ==============

  /**
   * 启动Token检查定时器
   */
  const startTokenCheckTimer = (dispatch: AppDispatch, getState: () => RootState) => {
    if (!finalConfig.enableAutoRefresh) return;

    // 清除现有定时器
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }

    // 启动新的定时器
    refreshTimer = setInterval(() => {
      const state = getState();
      const isAuthenticated = selectIsAuthenticated(state);
      const shouldRefresh = selectShouldRefreshToken(state);

      // 只有在已认证且需要刷新时才执行
      if (isAuthenticated && shouldRefresh) {
        console.log('Token即将过期，自动刷新...');
        dispatch(refreshTokenUser());
      }
    }, finalConfig.refreshInterval);
  };

  /**
   * 停止Token检查定时器
   */
  const stopTokenCheckTimer = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };

  /**
   * 重置重试计数器
   */
  const resetRetryCount = () => {
    refreshRetryCount = 0;
  };

  // ============== 监听器设置 ==============

  // 监听登录成功，启动Token检查
  authMiddleware.startListening({
    actionCreator: refreshTokenUser.fulfilled,
    effect: (action, listenerApi) => {
      console.log('登录成功，启动Token自动检查');
      resetRetryCount();
      startTokenCheckTimer(listenerApi.dispatch, listenerApi.getState);
    }
  });

  // 监听登出，停止Token检查
  authMiddleware.startListening({
    matcher: isAnyOf(logoutUser.fulfilled, logoutUser.rejected),
    effect: () => {
      console.log('用户登出，停止Token自动检查');
      stopTokenCheckTimer();
      resetRetryCount();
    }
  });

  // 监听Token刷新失败
  authMiddleware.startListening({
    actionCreator: refreshTokenUser.rejected,
    effect: (action, listenerApi) => {
      refreshRetryCount++;
      console.warn(`Token刷新失败，重试次数: ${refreshRetryCount}/${finalConfig.maxRetryAttempts}`);

      if (refreshRetryCount >= finalConfig.maxRetryAttempts) {
        console.error('Token刷新重试次数已达上限，停止自动刷新');
        stopTokenCheckTimer();
        resetRetryCount();

        // 可以在这里触发强制登出或跳转到登录页面
        // listenerApi.dispatch(logoutUser());
      } else {
        // 延迟重试
        setTimeout(() => {
          const state = listenerApi.getState();
          const isAuthenticated = selectIsAuthenticated(state);

          if (isAuthenticated) {
            console.log(`延迟重试Token刷新，第${refreshRetryCount + 1}次`);
            listenerApi.dispatch(refreshTokenUser());
          }
        }, 5000 * refreshRetryCount); // 递增延迟：5秒、10秒、15秒
      }
    }
  });

  // 监听Token刷新成功
  authMiddleware.startListening({
    actionCreator: refreshTokenUser.fulfilled,
    effect: () => {
      console.log('Token刷新成功');
      resetRetryCount();
    }
  });

  // 监听页面可见性变化（当用户切换回页面时检查Token）
  if (typeof window !== 'undefined') {
    authMiddleware.startListening({
      predicate: () => true, // 监听所有action
      effect: (action, listenerApi) => {
        // 只在特定action时检查（避免过于频繁）
        if (action.type === 'auth/checkTokenOnVisibilityChange') {
          const state = listenerApi.getState();
          const isAuthenticated = selectIsAuthenticated(state);
          const shouldRefresh = selectShouldRefreshToken(state);

          if (isAuthenticated && shouldRefresh) {
            console.log('页面重新可见，检查Token状态');
            listenerApi.dispatch(refreshTokenUser());
          }
        }
      }
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // 页面变为可见时，触发检查
        authMiddleware.middleware.dispatch({
          type: 'auth/checkTokenOnVisibilityChange'
        });
      }
    });
  }

  return authMiddleware;
};

// ============== 导出默认中间件实例 ==============

export const authMiddleware = createAuthMiddleware();

// ============== 手动控制函数 ==============

/**
 * 手动触发Token检查
 */
export const manualTokenCheck = () => ({
  type: 'auth/manualTokenCheck' as const
});

/**
 * 配置Token自动刷新
 */
export const configureAutoRefresh = (enabled: boolean) => ({
  type: 'auth/configureAutoRefresh' as const,
  payload: { enabled }
});

// ============== 工具函数导出 ==============

/**
 * 检查Token是否即将过期的工具函数
 * @param tokenExpiry Token过期时间戳
 * @param bufferMinutes 提前多少分钟算作即将过期
 * @returns 是否即将过期
 */
export const isTokenExpiringSoon = (tokenExpiry: number | null, bufferMinutes: number = 5): boolean => {
  if (!tokenExpiry) return false;
  const bufferMs = bufferMinutes * 60 * 1000;
  return Date.now() >= tokenExpiry - bufferMs;
};

/**
 * 获取Token剩余时间（分钟）
 * @param tokenExpiry Token过期时间戳
 * @returns 剩余分钟数
 */
export const getTokenRemainingMinutes = (tokenExpiry: number | null): number => {
  if (!tokenExpiry) return 0;
  const remaining = tokenExpiry - Date.now();
  return Math.max(0, Math.floor(remaining / (1000 * 60)));
};

/**
 * 格式化剩余时间显示
 * @param tokenExpiry Token过期时间戳
 * @returns 格式化的时间字符串
 */
export const formatRemainingTime = (tokenExpiry: number | null): string => {
  const minutes = getTokenRemainingMinutes(tokenExpiry);

  if (minutes === 0) return '已过期';
  if (minutes < 60) return `${minutes}分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours}小时`;
  return `${hours}小时${remainingMinutes}分钟`;
};
