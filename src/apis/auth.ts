import authAxios from '@/lib/axios/auth';

const AUTH_API = '/api/v1/auth';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
    role?: string;
  };
}
interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

/** 登录表单数据 */
interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码 */
  captchaCode: string;
  /** 记住我 */
  rememberMe: boolean;
}
// 获取验证码
const getCaptcha = async (): Promise<string> => {
  const response: string = await authAxios.get(`${AUTH_API}/captcha`);
  return response;
};

// 用户登录
const login = async (data: LoginFormData): Promise<LoginResponse> => {
  try {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('captchaKey', data.captchaKey);
    formData.append('captchaCode', data.captchaCode);
    const response: LoginResponse = await authAxios.post(`${AUTH_API}/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 用户注册
const register = async (userData: RegisterRequest): Promise<LoginResponse> => {
  try {
    const response: LoginResponse = await authAxios.post(`${AUTH_API}/register`, userData);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// 退出登录
const logout = async (): Promise<void> => {
  try {
    await authAxios.post(`${AUTH_API}/logout`);
    // 清除本地存储的token
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export { getCaptcha, login, logout, register };
