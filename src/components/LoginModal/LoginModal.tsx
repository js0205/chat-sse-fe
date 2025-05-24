'use client';
import { Button, Form, Modal, Toast } from '@douyinfe/semi-ui';
import { useRef, useState } from 'react';

interface LoginFormData {
  username: string;
  password: string;
  captchaCode?: string;
  rememberMe?: boolean;
}

interface FormApi {
  reset: () => void;
  validate: () => Promise<Record<string, unknown>>;
  getValues: () => Record<string, unknown>;
  setValues: (values: Record<string, unknown>) => void;
}

export const LoginModal = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaBase64, setCaptchaBase64] = useState('');
  const formRef = useRef<FormApi | null>(null);

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
    setLoading(true);
    try {
      console.log('登录数据:', values);

      // 这里添加实际的登录逻辑
      // const result = await loginApi(values);

      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Toast.success('登录成功');
      setVisible(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('登录失败:', error);
      Toast.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  // 获取验证码
  const changeCaptcha = () => {
    // 这里添加获取验证码的逻辑
    console.log('刷新验证码');
    // 模拟生成验证码图片
    setCaptchaBase64(
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA4MCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjQwIiB5PSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyI+MTIzNDwvdGV4dD4KPHN2Zz4K'
    );
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

  return (
    <>
      <Button onClick={showDialog}>登录</Button>
      <Modal
        title='用户登录'
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
          >
            <div className='mb-4'>
              <Form.Input
                field='username'
                label='用户名'
                placeholder='请输入用户名'
                prefix={<span className='text-gray-400'>👤</span>}
                rules={rules.username}
              />
            </div>

            <div className='mb-4'>
              <Form.Input
                field='password'
                label='密码'
                placeholder='请输入密码'
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
              <Button theme='solid' type='primary' htmlType='submit' loading={loading} block className='h-10'>
                {loading ? '登录中...' : '登录'}
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
