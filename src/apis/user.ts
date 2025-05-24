import authAxios from '@/lib/axios/auth';

const USER_API = '/api/v1/users';

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId?: string;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /** 角色 */
  roles?: string[];

  /** 权限 */
  perms?: string[];
}
// 获取用户信息
const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response: UserInfo = await authAxios.get(`${USER_API}/me`);
    return response;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};

export { getUserInfo };
