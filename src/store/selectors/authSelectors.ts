import { RootState } from '../index';

// ============== 基础选择器 ==============
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;

// ============== Token相关选择器 ==============
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

// ============== 复合选择器 ==============
export const selectUserInfo = (state: RootState) => {
  const { user, isAuthenticated } = state.auth;
  return {
    user,
    isAuthenticated,
    isLoggedIn: isAuthenticated && user !== null
  };
};

export const selectAuthStatus = (state: RootState) => {
  const { isLoading, error, isAuthenticated } = state.auth;
  return {
    isLoading,
    error,
    isAuthenticated,
    hasError: error !== null
  };
};

/**
 * 获取完整的认证头信息（用于API请求）
 */
export const selectAuthHeader = (state: RootState): Record<string, string> | null => {
  const accessToken = selectAccessToken(state);
  if (!accessToken) return null;

  return {
    Authorization: `Bearer ${accessToken}`
  };
};

/**
 * 判断token是否即将过期（5分钟内）
 */
export const selectIsTokenNearExpiry = (state: RootState): boolean => {
  const { tokenExpiresAt } = state.auth;
  if (!tokenExpiresAt) return false;

  const now = new Date();
  const expiryTime = new Date(tokenExpiresAt);
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  return expiryTime <= fiveMinutesFromNow;
};
