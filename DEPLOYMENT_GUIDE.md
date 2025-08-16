# 部署指南

## 🚀 正确的部署流程

### 自动部署（推荐）

1. **本地开发**

   ```bash
   npm run dev  # 本地测试
   ```

2. **提交代码**

   ```bash
   git add .
   git commit -m "feat: 新功能描述"
   ```

3. **推送到远程**

   ```bash
   git push origin main
   ```

4. **自动部署**
   - Vercel 自动检测到代码推送
   - 自动构建和部署
   - 更新主域名：`https://chat-sse-fe.vercel.app`

### ❌ 不要使用手动部署

```bash
# 不要这样做
npx vercel --prod
```

**原因：**

- 创建临时部署实例
- 不更新主域名
- 难以管理和追踪

## 📋 部署检查清单

### 部署前检查

- [ ] 本地测试通过
- [ ] ESLint 检查通过
- [ ] 代码格式化完成
- [ ] 提交信息清晰

### 部署后验证

- [ ] 访问主域名确认更新
- [ ] 测试关键功能
- [ ] 检查控制台错误

## 🔗 重要链接

- **生产环境**：https://chat-sse-fe.vercel.app
- **Vercel 控制台**：https://vercel.com/js0205s-projects/chat-sse-fe
- **GitHub 仓库**：https://github.com/js0205/chat-sse-fe

## 🚨 注意事项

1. **始终使用 Git 推送触发自动部署**
2. **不要手动部署到生产环境**
3. **部署前确保代码质量**
4. **定期检查部署状态**

## 📊 部署状态监控

```bash
# 查看部署历史
npx vercel ls

# 查看项目信息
npx vercel project ls
```
