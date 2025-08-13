# 🤖 AI 聊天助手 - 前端应用

基于 Next.js 15 构建的现代化 AI 聊天应用，集成 DeepSeek API，提供流式对话体验和完整的用户认证系统。

## 🌍 国际化支持

- **多语言支持**：中文、英文
- **动态语言切换**：支持运行时切换语言
- **路由国际化**：`/[lng]/` 路径结构

## ✨ 项目特性

- 🚀 **现代化技术栈**：Next.js 15 + React 18 + TypeScript
- 🤖 **AI 对话**：集成 DeepSeek API，支持流式响应
- 🔐 **完整认证系统**：JWT 认证、自动刷新、验证码登录
- 📱 **响应式设计**：适配多种设备尺寸
- 🎨 **优雅 UI**：基于 Semi UI 组件库，Tailwind CSS 样式
- 🔄 **状态管理**：Redux Toolkit 全局状态管理
- 📊 **性能监控**：Sentry 错误监控、Vercel Speed Insights
- 🛡️ **安全保障**：输入验证、XSS 防护、CSRF 保护
- 🌍 **国际化**：完整的多语言支持

## 🛠️ 技术栈

### 核心框架

- **Next.js 15.3.1** - 全栈 React 框架
- **React 18.3.1** - 用户界面库
- **TypeScript** - 类型安全

### 状态管理

- **Redux Toolkit** - 现代化 Redux 状态管理
- **React Redux** - React 绑定

### UI 组件

- **Semi UI** - 企业级组件库
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Normalize.css** - CSS 重置

### 工具库

- **Axios** - HTTP 客户端
- **dayjs** - 日期处理
- **ahooks** - React Hooks 库
- **classnames** - 类名处理
- **next-intl** - 国际化支持

### 开发工具

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子
- **Sentry** - 错误监控

## 🚀 快速开始

### 环境要求

- Node.js 20.0 或更高版本
- pnpm 8.0 或更高版本（推荐）

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 环境配置

1. 复制环境配置文件：

```bash
cp env.example .env.local
```

2. 配置环境变量：

```env
# DeepSeek API 配置
NEXT_PUBLIC_DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_API_KEY=your_deepseek_api_key

# Sentry 配置（可选）
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_org_name
SENTRY_PROJECT=your_project_name
SENTRY_AUTH_TOKEN=your_auth_token_here
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:13165](http://localhost:13165) 查看应用。

## 📖 功能介绍

### 🔐 用户认证系统

- **JWT 双令牌机制**：AccessToken（15分钟）+ RefreshToken（7天）
- **自动刷新**：提前5分钟自动刷新令牌
- **验证码登录**：防止机器人攻击
- **记住我功能**：可选的用户凭据记忆
- **安全登出**：彻底清除本地状态

### 💬 AI 聊天功能

- **流式响应**：实时显示 AI 回复内容
- **模型选择**：支持多种 AI 模型切换
- **消息历史**：完整的对话记录
- **优雅界面**：类似现代聊天应用的 UI 设计
- **错误处理**：网络异常和 API 错误的优雅处理

### 🌍 国际化功能

- **多语言支持**：中文、英文
- **动态切换**：支持运行时切换语言
- **路由国际化**：`/[lng]/chat` 路径结构
- **翻译文件**：`locales/` 目录管理翻译

### 📱 用户界面

- **响应式设计**：适配桌面和移动设备
- **暗色模式**：护眼的深色主题（开发中）
- **无障碍支持**：符合 WCAG 标准
- **加载动画**：优雅的加载状态提示

## 📁 项目结构

```
chat-sse-fe/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [lng]/          # 国际化路由
│   │   │   ├── chat/       # 聊天页面
│   │   │   └── page.tsx    # 首页
│   │   ├── api/            # API 路由
│   │   ├── layout.tsx      # 全局布局
│   │   └── page.tsx        # 默认首页
│   ├── components/         # 可复用组件
│   │   ├── ChatBox/        # 聊天组件
│   │   ├── LoginModal/     # 登录模态框
│   │   ├── ModelBox/       # 模型选择组件
│   │   └── ...
│   ├── store/              # Redux 状态管理
│   │   ├── slices/         # Redux slices
│   │   ├── hooks.ts        # 类型安全的 hooks
│   │   └── index.ts        # Store 配置
│   ├── apis/               # API 接口
│   │   ├── auth.ts         # 认证相关
│   │   └── deepseek.ts     # DeepSeek API
│   ├── utils/              # 工具函数
│   ├── hooks/              # 自定义 hooks
│   └── lib/                # 库文件配置
├── locales/                # 国际化翻译文件
│   ├── en/                 # 英文翻译
│   │   └── translation.json
│   └── zh/                 # 中文翻译
│       └── translation.json
├── public/                 # 静态资源
├── docs/                   # 文档
│   ├── AUTHENTICATION_SUMMARY.md
│   └── LOGIN_FLOW_DESIGN.md
└── ...
```

## 📜 可用脚本

```bash
# 开发
pnpm dev          # 启动开发服务器（端口：13165）

# 构建
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器

# 代码质量
pnpm lint         # 代码检查
pnpm format       # 代码格式化
pnpm check-format # 检查代码格式

# 测试
pnpm test         # 运行测试（开发中）
```

## 🔧 部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 手动部署

```bash
# 构建应用
pnpm build

# 启动生产服务器
pnpm start
```

### Docker 部署

```dockerfile
# 创建 Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## 🛡️ 安全特性

- **输入验证**：前端和后端双重验证
- **XSS 防护**：内容安全策略（CSP）
- **CSRF 保护**：跨站请求伪造防护
- **数据加密**：敏感数据加密存储
- **安全请求头**：完整的安全头配置

## 📊 性能优化

- **代码分割**：自动路由级代码分割
- **图片优化**：Next.js Image 组件优化
- **缓存策略**：合理的缓存机制
- **懒加载**：组件和路由懒加载
- **Bundle 分析**：构建产物分析

## 🔍 监控和日志

- **Sentry 错误监控**：实时错误追踪
- **Vercel Analytics**：性能和用户行为分析
- **Web Vitals**：核心网页性能指标
- **自定义日志**：关键操作日志记录

## 🤝 贡献指南

1. **Fork 项目**
2. **创建特性分支**：`git checkout -b feature/AmazingFeature`
3. **提交更改**：`git commit -m 'Add some AmazingFeature'`
4. **推送分支**：`git push origin feature/AmazingFeature`
5. **创建 Pull Request**

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 编写测试用例
- 添加适当的注释

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系支持

- 💬 提出问题：[GitHub Issues](https://github.com/js0205/chat-sse-fe/issues)
- 📧 邮件联系：your-email@example.com
- 📖 文档：[项目文档](./docs/)

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！</p>
</div>
