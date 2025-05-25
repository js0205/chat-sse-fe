import { createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../slices/authSlice';

interface LoginCredentials {
  username: string;
  password: string;
  captchaCode?: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
  };
  token: string;
}

// 模拟登录API调用
const mockLoginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模拟登录验证
  if (credentials.username === 'admin' && credentials.password === '123456') {
    return {
      user: {
        id: '1',
        username: credentials.username,
        email: 'admin@example.com',
        avatar: 'https://via.placeholder.com/40'
      },
      token: 'mock-jwt-token-' + Date.now()
    };
  } else {
    throw new Error('用户名或密码错误');
  }
};

// 登录thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(login());
      const response = await mockLoginApi(credentials);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      return rejectWithValue(errorMessage);
    }
  }
);
