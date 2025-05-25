import { login as loginAPI } from '@/apis/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============== 类型定义 ==============

interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

// 使用与auth.ts完全一致的LoginFormData类型
interface LoginFormData {
  username: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
  rememberMe: boolean; // 必需的boolean，与auth.ts保持一致
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null; // token过期时间
}

// ============== 初始状态 ==============

const getInitialState = (): AuthState => {
  // 从 localStorage 恢复登录状态（如果有的话）
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const tokenExpiresAt = typeof window !== 'undefined' ? localStorage.getItem('tokenExpiresAt') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    user,
    isAuthenticated: !!accessToken && !!user,
    isLoading: false,
    error: null,
    accessToken,
    refreshToken,
    tokenExpiresAt
  };
};

const initialState: AuthState = getInitialState();

// ============== 工具函数 ==============

/**
 * 清除所有认证相关的localStorage数据
 */
const clearAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiresAt');
};

/**
 * 保存认证数据到localStorage
 */
const saveAuthToStorage = (user: User, accessToken: string, refreshToken: string, expiresAt?: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
  if (expiresAt) {
    localStorage.setItem('tokenExpiresAt', expiresAt);
  }
};

// ============== 异步登录Action ==============

/**
 * 用户登录
 */
export const loginUser = createAsyncThunk('auth/login', async (loginData: LoginFormData, { rejectWithValue }) => {
  try {
    const response = await loginAPI(loginData);

    // 计算token过期时间（假设accessToken有效期为24小时）
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 存储到 localStorage
    saveAuthToStorage(response.user, response.token, response.token, expiresAt);

    // 如果用户选择了记住我，保存用户名
    if (loginData.rememberMe) {
      localStorage.setItem('rememberedUsername', loginData.username);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberMe');
    }

    return {
      user: response.user,
      accessToken: response.token, // 假设API返回的token就是accessToken
      refreshToken: response.token, // 如果API有单独的refreshToken，请修改这里
      tokenExpiresAt: expiresAt,
      loginTime: new Date().toISOString()
    };
  } catch (error: Error | unknown) {
    // 清除可能存在的无效 token
    clearAuthStorage();
    const errorMessage = (error as Error)?.message || '登录失败';
    return rejectWithValue(errorMessage);
  }
});

/**
 * 刷新Token
 */
export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const currentRefreshToken = state.auth.refreshToken;

    if (!currentRefreshToken) {
      throw new Error('没有可用的refresh token');
    }

    // 这里调用刷新token的API
    // const response = await refreshTokenAPI(currentRefreshToken);

    // 暂时模拟返回新的tokens（实际项目中需要调用真实API）
    const newAccessToken = 'new_access_token_' + Date.now();
    const newRefreshToken = 'new_refresh_token_' + Date.now();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 更新localStorage
    if (state.auth.user) {
      saveAuthToStorage(state.auth.user, newAccessToken, newRefreshToken, expiresAt);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenExpiresAt: expiresAt
    };
  } catch (error: unknown) {
    // 刷新失败，清除所有认证信息
    clearAuthStorage();
    const errorMessage = (error as Error)?.message || 'Token刷新失败';
    return rejectWithValue(errorMessage);
  }
});

// ============== Slice ==============

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },

    // 登出（同步action）
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.isAuthenticated = false;
      state.error = null;

      // 清除 localStorage
      clearAuthStorage();
    },

    // 更新用户信息
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },

    // 手动设置tokens（用于token刷新）
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; expiresAt?: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.expiresAt) {
        state.tokenExpiresAt = action.payload.expiresAt;
      }

      // 更新localStorage
      if (state.user) {
        saveAuthToStorage(
          state.user,
          action.payload.accessToken,
          action.payload.refreshToken,
          action.payload.expiresAt
        );
      }
    },

    // 检查token是否过期
    checkTokenExpiry: (state) => {
      if (state.tokenExpiresAt) {
        const now = new Date();
        const expiryTime = new Date(state.tokenExpiresAt);

        if (now >= expiryTime) {
          // Token已过期，清除认证状态
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.tokenExpiresAt = null;
          state.isAuthenticated = false;
          clearAuthStorage();
        }
      }
    }
  },
  extraReducers: (builder) => {
    // ========== 登录处理 ==========
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiresAt = action.payload.tokenExpiresAt;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // ========== 刷新Token处理 ==========
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiresAt = action.payload.tokenExpiresAt;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        // 刷新失败，清除所有认证信息
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  }
});

// ============== 导出 ==============

export const { clearError, logout, updateUser, setTokens, checkTokenExpiry } = authSlice.actions;

export default authSlice.reducer;

// ============== 选择器 ==============

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectTokenExpiresAt = (state: { auth: AuthState }) => state.auth.tokenExpiresAt;

// 判断token是否即将过期（5分钟内）
export const selectIsTokenNearExpiry = (state: { auth: AuthState }) => {
  const { tokenExpiresAt } = state.auth;
  if (!tokenExpiresAt) return false;

  const now = new Date();
  const expiryTime = new Date(tokenExpiresAt);
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  return expiryTime <= fiveMinutesFromNow;
};
