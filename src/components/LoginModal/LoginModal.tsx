'use client';
import { getCaptcha, LoginFormData } from '@/apis';
import { Button, Form, Modal, Toast } from '@douyinfe/semi-ui';
import { useEffect, useRef, useState } from 'react';

interface FormApi {
  reset: () => void;
  validate: () => Promise<Record<string, unknown>>;
  getValues: () => Record<string, unknown>;
  setValues: (values: Record<string, unknown>) => void;
}
export const LoginModal = () => {
  const [visible, setVisible] = useState(false);
  const [captchaBase64, setCaptchaBase64] = useState<string>('');
  const formRef = useRef<FormApi | null>(null);
  // 安全的从localStorage加载初始值 - 避免SSR错误
  const getInitialValues = () => {
    // 确保在客户端环境才访问localStorage
    if (typeof window === 'undefined') {
      // 服务器端渲染时返回默认值
      return {
        username: '',
        password: '',
        captchaCode: '',
        captchaKey: '',
        rememberMe: false
      };
    }

    // 客户端才访问localStorage
    const rememberedUsername = localStorage.getItem('rememberedUsername') || '';
    const isRemembered = localStorage.getItem('rememberMe') === 'true';

    return {
      username: rememberedUsername,
      password: '',
      captchaCode: '',
      captchaKey: '',
      rememberMe: isRemembered
    };
  };

  const [initialValues, setInitialValues] = useState(getInitialValues());

  const showDialog = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleAfterClose = () => {
    console.log('After Close callback executed');
  };
  // 处理登录提交
  const handleLogin = async (values: LoginFormData) => {
    try {
      // const { accessToken, refreshToken } = await login(values);
      //TODO:将tokens保存到Redux store中
      //TODO:获取用户信息
      // 如果用户选择了记住我，保存用户名
      if (values.rememberMe) {
        localStorage.setItem('rememberedUsername', values.username);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberMe');
      }
      Toast.success('登录成功');
      setVisible(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('登录失败:', error);
      Toast.error(typeof error === 'string' ? error : '登录失败，请检查用户名和密码');
      // 登录失败后重新获取验证码
      changeCaptcha();
    }
  };
  /**
   * 更新单个字段值
   * @param field 字段名
   * @param value 字段值
   */
  const updateSingleField = (field: keyof LoginFormData, value: unknown) => {
    if (formRef.current) {
      const currentValues = formRef.current.getValues();
      formRef.current.setValues({
        ...currentValues,
        [field]: value
      });
    }
  };

  // 获取验证码
  const changeCaptcha = async () => {
    const res = await getCaptcha();
    setCaptchaBase64(res.captchaBase64);
    updateSingleField('captchaKey' as keyof LoginFormData, res.captchaKey);
    setInitialValues((prev) => ({ ...prev, captchaKey: res.captchaKey }));
  };

  // 表单验证规则
  const rules = {
    username: [
      { required: true, message: '请输入用户名' },
      { min: 3, message: '用户名至少3个字符' }
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码至少6个字符' }
    ]
  };

  useEffect(() => {
    changeCaptcha();

    // 客户端挂载后更新初始值
    if (typeof window !== 'undefined') {
      const rememberedUsername = localStorage.getItem('rememberedUsername') || '';
      const isRemembered = localStorage.getItem('rememberMe') === 'true';

      setInitialValues((prev) => ({
        ...prev,
        username: rememberedUsername,
        rememberMe: isRemembered
      }));
    }
  }, []);
  return (
    <>
      <Button onClick={showDialog}>登录</Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        afterClose={handleAfterClose}
        closeOnEsc={true}
        footer={null}
        width={400}
      >
        <div className='py-5'>
          <Form
            getFormApi={(formApi) => {
              formRef.current = formApi as FormApi;
              return formApi;
            }}
            onSubmit={handleLogin}
            initValues={initialValues} // 绑定初始值
          >
            <div className='mb-4'>
              <Form.Input
                field='username'
                label='用户名'
                placeholder='请输入用户名（测试：admin）'
                prefix={<span className='text-gray-400'>👤</span>}
                rules={rules.username}
              />
            </div>

            <div className='mb-4'>
              <Form.Input
                field='password'
                label='密码'
                placeholder='请输入密码（测试：123456）'
                prefix={<span className='text-gray-400'>🔒</span>}
                type='password'
                rules={rules.password}
              />
            </div>

            <div className='mb-4'>
              <Form.Input
                field='captchaCode'
                label='验证码'
                placeholder='请输入验证码'
                suffix={
                  <div
                    className='w-20 h-8 border border-gray-300 rounded flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'
                    onClick={changeCaptcha}
                  >
                    {captchaBase64 ? (
                      <div
                        className='h-7 w-full bg-center bg-no-repeat bg-contain'
                        style={{ backgroundImage: `url(${captchaBase64})` }}
                        aria-label='验证码图片'
                      />
                    ) : (
                      <span className='text-xs text-gray-400'>点击获取</span>
                    )}
                  </div>
                }
              />
            </div>
            <div className='flex justify-between items-center mb-6'>
              <Form.Checkbox field='rememberMe'>记住我</Form.Checkbox>
              <a
                href='#'
                className='text-blue-500 hover:text-blue-700 no-underline text-sm transition-colors'
                onClick={(e) => {
                  e.preventDefault();
                  console.log('忘记密码');
                }}
              >
                忘记密码？
              </a>
            </div>

            <div className='space-y-4 w-full'>
              <Button theme='solid' type='primary' htmlType='submit' block className='h-10'>
                登录
              </Button>

              <div className='text-center mt-4'>
                <span className='text-gray-500'>还没有账号？</span>
                <a
                  href='#'
                  className='text-blue-500 hover:text-blue-700 no-underline ml-2 transition-colors'
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('注册');
                  }}
                >
                  立即注册
                </a>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};
