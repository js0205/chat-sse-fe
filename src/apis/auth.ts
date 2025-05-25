import authAxios from '@/lib/axios/auth';

const AUTH_API = '/api/v1/auth';

interface LoginResponse {
  code: string;
  data: LoginData;
  msg: string;
}

interface LoginData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** 登录表单数据 */
export interface LoginFormData {
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
interface CaptchaData {
  captchaBase64: string;
  captchaKey: string;
}

interface CaptchaResponse {
  code: string;
  data: CaptchaData;
  msg: string;
}

// 获取验证码
const getCaptcha = async (): Promise<CaptchaData> => {
  const response: CaptchaResponse = await authAxios.get(`${AUTH_API}/captcha`);
  return response.data as CaptchaData;
};

// 用户登录
const login = async (data: LoginFormData): Promise<LoginData> => {
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
    return response.data as LoginData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export { getCaptcha, login };
