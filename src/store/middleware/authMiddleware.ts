import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../index';
import { logoutUser } from '../slices/authSlice';

// ============== 创建监听器中间件 ==============

/**
 * 创建认证中间件
 * @returns 中间件实例
 */
export const createAuthMiddleware = () => {
  // 创建监听器中间件
  const authMiddleware = createListenerMiddleware<RootState, AppDispatch>();

  // ============== 监听器设置 ==============

  // 监听登出，执行清理工作
  authMiddleware.startListening({
    matcher: isAnyOf(logoutUser.fulfilled, logoutUser.rejected),
    effect: () => {
      console.log('用户登出，清理认证相关数据');
      // 在这里可以添加登出后的清理逻辑
    }
  });

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

// TODO: 完整的 token 刷新功能将在后续版本中实现
// 包括：
// - refreshTokenUser 异步操作
// - selectShouldRefreshToken 选择器
// - 自动刷新逻辑
// - 重试机制
