# 登录登出交互逻辑设计

## 概述

本文档详细描述了系统的登录、登出交互逻辑，包括JWT认证机制、接口调用流程和状态管理。

## 1. 整体架构

```mermaid
graph TB
    A[用户界面] --> B[Redux Store]
    B --> C[API Layer]
    C --> D[后端服务]
    D --> E[JWT Token]
    E --> F[LocalStorage]
    F --> B

    subgraph "前端组件"
        A1[LoginForm]
        A2[LoginModal]
        A3[LogoutButton]
    end

    subgraph "状态管理"
        B1[authSlice]
        B2[loginUser thunk]
        B3[logout action]
    end

    subgraph "API接口"
        C1[login API]
        C2[logout API]
        C3[refreshToken API]
        C4[getCaptcha API]
    end
```

## 2. 登录流程

### 2.1 登录交互流程图

```mermaid
sequenceDiagram
    participant U as 用户
    participant UI as 登录界面
    participant R as Redux Store
    participant API as API Layer
    participant S as 后端服务
    participant LS as LocalStorage

    U->>UI: 1. 打开登录页面
    UI->>API: 2. 获取验证码
    API->>S: 3. 请求验证码
    S-->>API: 4. 返回验证码图片
    API-->>UI: 5. 显示验证码

    U->>UI: 6. 输入用户名、密码、验证码
    U->>UI: 7. 点击登录按钮
    UI->>R: 8. dispatch(loginUser)

    R->>API: 9. 调用login接口
    API->>S: 10. 发送登录请求

    alt 登录成功
        S-->>API: 11. 返回JWT tokens
        API-->>R: 12. 返回认证数据
        R->>LS: 13. 保存tokens到localStorage
        R-->>UI: 14. 更新登录状态
        UI-->>U: 15. 显示登录成功
        UI->>UI: 16. 跳转到主页面
    else 登录失败
        S-->>API: 11. 返回错误信息
        API-->>R: 12. 返回错误
        R-->>UI: 13. 显示错误信息
        UI->>API: 14. 重新获取验证码
        UI-->>U: 15. 提示重新输入
    end
```

### 2.2 登录状态流转

```mermaid
stateDiagram-v2
    [*] --> 未登录
    未登录 --> 登录中: 开始登录
    登录中 --> 已登录: 登录成功
    登录中 --> 未登录: 登录失败
    已登录 --> 未登录: 登出
    已登录 --> 登录中: Token过期重新登录

    state 未登录 {
        [*] --> 显示登录界面
        显示登录界面 --> 获取验证码
        获取验证码 --> 等待用户输入
    }

    state 登录中 {
        [*] --> 验证表单
        验证表单 --> 发送请求
        发送请求 --> 等待响应
    }

    state 已登录 {
        [*] --> 正常使用
        正常使用 --> 检查Token有效性
        检查Token有效性 --> 正常使用: Token有效
        检查Token有效性 --> [*]: Token无效
    }
```

## 3. 登出流程

### 3.1 登出交互流程图

```mermaid
sequenceDiagram
    participant U as 用户
    participant UI as 用户界面
    participant R as Redux Store
    participant API as API Layer
    participant S as 后端服务
    participant LS as LocalStorage

    U->>UI: 1. 点击登出按钮
    UI->>R: 2. dispatch(logout)

    par 清除本地状态
        R->>LS: 3. 清除localStorage
        R->>R: 4. 重置Redux状态
    and 通知服务器
        R->>API: 5. 调用logout接口
        API->>S: 6. 发送登出请求
        S-->>API: 7. 确认登出
    end

    R-->>UI: 8. 更新登出状态
    UI->>UI: 9. 跳转到登录页面
    UI-->>U: 10. 显示登出成功
```

## 4. JWT Token管理

### 4.1 Token刷新流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant I as 拦截器
    participant API as API接口
    participant S as 服务器
    participant LS as LocalStorage

    C->>API: 1. 发起业务请求
    API->>I: 2. 请求拦截
    I->>I: 3. 检查Token是否过期

    alt Token未过期
        I->>S: 4. 正常发送请求
        S-->>I: 5. 返回业务数据
        I-->>C: 6. 返回结果
    else Token已过期
        I->>S: 4. 使用refreshToken刷新
        alt 刷新成功
            S-->>I: 5. 返回新的tokens
            I->>LS: 6. 更新localStorage
            I->>S: 7. 重新发送原请求
            S-->>I: 8. 返回业务数据
            I-->>C: 9. 返回结果
        else 刷新失败
            I-->>C: 5. 跳转到登录页面
        end
    end
```

### 4.2 Token存储策略

```mermaid
graph TD
    A[获取Token] --> B{选择存储方式}
    B -->|安全性高| C[HttpOnly Cookie]
    B -->|便于操作| D[LocalStorage]
    B -->|会话级别| E[SessionStorage]

    C --> F[防XSS攻击]
    D --> G[持久化存储]
    E --> H[临时存储]

    F --> I[服务器端管理]
    G --> J[客户端管理]
    H --> K[浏览器关闭清除]
```

## 5. 接口设计

### 5.1 登录接口

```typescript
// 登录请求
interface LoginRequest {
  username: string; // 用户名
  password: string; // 密码
  captchaKey: string; // 验证码key
  captchaCode: string; // 验证码
  rememberMe: boolean; // 记住我
}

// 登录响应
interface LoginResponse {
  code: string;
  data: {
    accessToken: string; // 访问令牌 (15分钟)
    refreshToken: string; // 刷新令牌 (7天)
    expiresIn: number; // 过期时间(秒)
  };
  msg: string;
}
```

### 5.2 登出接口

```typescript
// 登出请求
interface LogoutRequest {
  refreshToken: string; // 刷新令牌
}

// 登出响应
interface LogoutResponse {
  code: string;
  msg: string;
}
```

### 5.3 Token刷新接口

```typescript
// 刷新Token请求
interface RefreshTokenRequest {
  refreshToken: string; // 刷新令牌
}

// 刷新Token响应
interface RefreshTokenResponse {
  code: string;
  data: {
    accessToken: string; // 新的访问令牌
    refreshToken: string; // 新的刷新令牌
    expiresIn: number; // 过期时间
  };
  msg: string;
}
```

## 6. Redux状态管理

### 6.1 AuthSlice状态结构

```typescript
interface AuthState {
  isAuthenticated: boolean; // 是否已认证
  isLoading: boolean; // 是否正在加载
  error: string | null; // 错误信息
  accessToken: string | null; // 访问令牌
  refreshToken: string | null; // 刷新令牌
  tokenExpiry: number | null; // Token过期时间戳
}
```

### 6.2 状态流转图

```mermaid
stateDiagram-v2
    [*] --> IDLE: 初始状态
    IDLE --> LOADING: 开始登录
    LOADING --> AUTHENTICATED: 登录成功
    LOADING --> ERROR: 登录失败
    ERROR --> IDLE: 清除错误
    AUTHENTICATED --> IDLE: 登出
    AUTHENTICATED --> LOADING: 刷新Token
```

## 7. 错误处理

### 7.1 错误类型分类

```mermaid
graph TD
    A[登录错误] --> B[网络错误]
    A --> C[认证错误]
    A --> D[验证错误]

    B --> B1[请求超时]
    B --> B2[网络中断]
    B --> B3[服务器错误]

    C --> C1[用户名密码错误]
    C --> C2[账户被锁定]
    C --> C3[Token过期]

    D --> D1[验证码错误]
    D --> D2[表单验证失败]
    D --> D3[参数格式错误]
```

### 7.2 错误处理流程

```mermaid
sequenceDiagram
    participant U as 用户操作
    participant E as 错误处理
    participant UI as 界面更新
    participant L as 日志记录

    U->>E: 1. 触发错误
    E->>E: 2. 错误分类

    alt 网络错误
        E->>UI: 3. 显示重试按钮
        E->>L: 4. 记录网络日志
    else 认证错误
        E->>UI: 3. 显示错误信息
        E->>UI: 4. 刷新验证码
        E->>L: 5. 记录认证日志
    else 系统错误
        E->>UI: 3. 显示通用错误
        E->>L: 4. 记录系统日志
    end
```

## 8. 安全考虑

### 8.1 安全措施

```mermaid
mindmap
  root((安全措施))
    Token安全
      短期AccessToken
      长期RefreshToken
      Token轮换
      安全存储
    传输安全
      HTTPS加密
      请求签名
      防重放攻击
    客户端安全
      XSS防护
      CSRF防护
      输入验证
    服务端安全
      密码加密
      登录限制
      会话管理
```

### 8.2 安全检查清单

- [ ] 使用HTTPS传输
- [ ] Token有效期设置合理
- [ ] 实现Token自动刷新
- [ ] 防止XSS攻击
- [ ] 防止CSRF攻击
- [ ] 输入数据验证
- [ ] 密码强度检查
- [ ] 登录失败次数限制
- [ ] 验证码防机器人
- [ ] 敏感操作二次验证

## 9. 性能优化

### 9.1 优化策略

```mermaid
graph LR
    A[性能优化] --> B[缓存策略]
    A --> C[请求优化]
    A --> D[状态优化]

    B --> B1[Token缓存]
    B --> B2[用户信息缓存]
    B --> B3[验证码缓存]

    C --> C1[请求去重]
    C --> C2[请求合并]
    C --> C3[超时设置]

    D --> D1[状态持久化]
    D --> D2[懒加载]
    D --> D3[内存管理]
```

## 10. 测试策略

### 10.1 测试用例

```mermaid
graph TD
    A[测试用例] --> B[单元测试]
    A --> C[集成测试]
    A --> D[端到端测试]

    B --> B1[Redux Actions]
    B --> B2[API调用]
    B --> B3[工具函数]

    C --> C1[登录流程]
    C --> C2[Token刷新]
    C --> C3[错误处理]

    D --> D1[用户登录]
    D --> D2[用户登出]
    D --> D3[会话管理]
```

## 11. 监控和日志

### 11.1 监控指标

- 登录成功率
- 登录响应时间
- Token刷新频率
- 错误发生率
- 用户会话时长

### 11.2 日志记录

```typescript
// 日志记录示例
interface LoginLog {
  timestamp: string;
  userId?: string;
  action: 'LOGIN' | 'LOGOUT' | 'REFRESH_TOKEN';
  status: 'SUCCESS' | 'FAILURE';
  errorCode?: string;
  userAgent: string;
  ip: string;
}
```

## 12. 部署和配置

### 12.1 环境配置

```typescript
// 环境配置
interface AuthConfig {
  apiBaseUrl: string;
  tokenExpiry: number;
  refreshTokenExpiry: number;
  maxRetryAttempts: number;
  enableRememberMe: boolean;
  enableAutoRefresh: boolean;
}
```

这个设计文档涵盖了完整的登录登出交互逻辑，包括JWT认证、状态管理、错误处理、安全考虑等各个方面。你可以根据实际需求调整和完善这些流程。
