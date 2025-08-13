import { login as loginAPI, logout as logoutAPI } from '@/apis/auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============== 类型定义 ==============
// 定义登录表单数据接口，与API保持一致
interface LoginFormData {
  username: string; // 用户名
  password: string; // 密码
  captchaKey: string; // 验证码key
  captchaCode: string; // 验证码
  rememberMe: boolean; // 是否记住我
}

// 定义认证状态接口
interface AuthState {
  isAuthenticated: boolean; // 是否已认证
  isLoading: boolean; // 是否正在加载
  error: string | null; // 错误信息，null表示无错误
  accessToken: string | null; // 访问令牌
  refreshToken: string | null; // 刷新令牌
}

// ============== 初始状态 ==============

// 获取初始状态的函数，从localStorage恢复登录状态
const getInitialState = (): AuthState => {
  // 检查是否在浏览器环境中，避免SSR错误
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

  // 返回初始状态
  return {
    isAuthenticated: !!accessToken, // 有accessToken就算已认证
    isLoading: false, // 初始不在加载状态
    error: null, // 初始无错误
    accessToken, // 访问令牌
    refreshToken // 刷新令牌
  };
};

// 创建初始状态实例
const initialState: AuthState = getInitialState();

// ============== 工具函数 ==============

/**
 * 清除所有认证相关的localStorage数据
 */
const clearAuthStorage = () => {
  localStorage.removeItem('accessToken'); // 清除访问令牌
  localStorage.removeItem('refreshToken'); // 清除刷新令牌
};

/**
 * 保存认证数据到localStorage
 * @param accessToken 访问令牌
 * @param refreshToken 刷新令牌
 */
const saveAuthToStorage = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken); // 保存访问令牌
  localStorage.setItem('refreshToken', refreshToken); // 保存刷新令牌
};

// ============== 异步操作 ==============

/**
 * 用户登录异步操作
 */
export const loginUser = createAsyncThunk(
  '/api/v1/auth/login', // action类型字符串
  async (loginData: LoginFormData, { rejectWithValue }) => {
    try {
      // 调用登录API，获取tokens
      const response = await loginAPI(loginData);

      // 保存认证数据到localStorage
      saveAuthToStorage(response.accessToken, response.refreshToken);

      // 如果用户选择了记住我，保存用户名
      if (loginData.rememberMe) {
        localStorage.setItem('rememberedUsername', loginData.username); // 保存用户名
        localStorage.setItem('rememberedPassword', loginData.password); // 保存密码
        localStorage.setItem('rememberMe', 'true'); // 保存记住我状态
      } else {
        localStorage.removeItem('rememberedUsername'); // 清除保存的用户名
        localStorage.removeItem('rememberedPassword'); // 清除保存的密码
        localStorage.removeItem('rememberMe'); // 清除记住我状态
      }

      // 返回登录成功的数据
      return {
        accessToken: response.accessToken, // 访问令牌
        refreshToken: response.refreshToken // 刷新令牌
      };
    } catch (error: Error | unknown) {
      // 登录失败时清除可能存在的无效token
      clearAuthStorage();
      // 提取错误信息
      const errorMessage = (error as Error)?.message || '登录失败';
      // 返回错误信息
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk('/api/v1/auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutAPI();
    clearAuthStorage();
  } catch (error: Error | unknown) {
    const errorMessage = (error as Error)?.message || '登出失败';
    return rejectWithValue(errorMessage);
  }
});

// ============== Slice ==============

// 创建认证slice
const authSlice = createSlice({
  name: 'auth', // slice名称
  initialState, // 初始状态
  // 同步reducers
  reducers: {
    // 清除错误信息的reducer
    clearError: (state) => {
      state.error = null; // 将错误状态重置为null
    },

    // 登出的reducer
    logout: (state) => {
      state.accessToken = null; // 清除访问令牌
      state.refreshToken = null; // 清除刷新令牌
      state.isAuthenticated = false; // 设置为未认证状态
      state.error = null; // 清除错误信息

      // 清除localStorage中的认证数据
      clearAuthStorage();
    },

    // 手动设置tokens的reducer（用于token刷新等场景）
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken; // 更新访问令牌
      state.refreshToken = action.payload.refreshToken; // 更新刷新令牌
      state.isAuthenticated = true; // 设置为已认证状态

      // 同步更新localStorage
      saveAuthToStorage(action.payload.accessToken, action.payload.refreshToken);
    }
  },
  // 处理异步操作的extraReducers
  extraReducers: (builder) => {
    // 处理登录异步操作
    builder
      // 处理登录pending状态（请求开始）
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true; // 设置加载状态
        state.error = null; // 清除之前的错误
      })
      // 处理登录fulfilled状态（请求成功）
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false; // 取消加载状态
        state.accessToken = action.payload.accessToken; // 设置访问令牌
        state.refreshToken = action.payload.refreshToken; // 设置刷新令牌
        state.isAuthenticated = true; // 设置为已认证状态
        state.error = null; // 清除错误信息
      })
      // 处理登录rejected状态（请求失败）
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false; // 取消加载状态
        state.accessToken = null; // 清除访问令牌
        state.refreshToken = null; // 清除刷新令牌
        state.isAuthenticated = false; // 设置为未认证状态
        state.error = action.payload as string; // 设置错误信息
      });
  }
});

// ============== 导出Actions ==============

// 导出所有action creators
export const {
  clearError, // 清除错误
  logout, // 登出
  setTokens // 设置tokens
} = authSlice.actions;

// 导出reducer作为默认导出
export default authSlice.reducer;

// ============== 选择器 ==============

// 导入RootState类型（避免循环依赖）
type RootState = {
  auth: AuthState;
};

// 基础选择器函数

// 选择整个auth状态
export const selectAuth = (state: RootState) => state.auth;
// 选择是否已认证
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
// 选择加载状态
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
// 选择错误信息
export const selectAuthError = (state: RootState) => state.auth.error;
// 选择访问令牌
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
// 选择刷新令牌
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
