# 八字命理K线可视化与AI分析

一个基于React + Vite的八字命理可视化与AI分析工具，支持大运、流年分析和聊天对话功能。

## 功能特性

- **八字命理K线可视化**：直观展示命主的大运、流年走势
- **AI八字分析**：集成大模型API，提供专业的八字命理分析
- **大运/流年分析**：支持单独的大运和流年AI分析
- **聊天对话**：带上下文记忆的对话功能，支持八字分析指引
- **Markdown渲染**：支持分析报告的Markdown格式渲染

## 技术栈

- React 19
- Vite
- TypeScript
- TailwindCSS
- lucide-react（图标库）
- react-markdown（Markdown渲染）
- recharts（图表库）

## 安装与运行

### 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
├── src/
│   ├── components/          # React组件
│   │   ├── BaziAnalysis.tsx    # 八字分析组件
│   │   ├── DaYunChatPage.tsx   # 大运聊天页面
│   │   ├── LifeKLinePage.tsx   # 命理K线页面
│   │   └── ...
│   ├── services/           # 服务层
│   │   └── geminiService.ts    # Gemini API服务
│   ├── types/              # TypeScript类型定义
│   │   └── types.ts
│   ├── constants.ts        # 常量定义
│   ├── main.tsx            # 应用入口
│   └── App.tsx             # 根组件
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json            # Vercel部署配置
```

## 环境变量

项目使用以下环境变量：

- `VITE_GEMINI_API_KEY`：Gemini API密钥

## 部署

### Vercel部署

1. 确保 `vercel.json` 配置正确
2. 将代码推送到GitHub
3. 在Vercel上连接GitHub仓库
4. 配置项目设置：
   - Framework Preset: Vite
   - Root Directory: lifekline-main
   - Build Command: npm run build
   - Output Directory: dist
5. 部署项目

## 使用说明

1. 在八字分析页面输入命主信息
2. 点击分析按钮获取AI分析结果
3. 在大运页面查看大运和流年信息
4. 点击大运或流年卡片获取详细分析
5. 在聊天页面与AI进行八字相关对话

## 开发说明

### 代码规范

- 使用TypeScript进行类型检查
- 使用ESLint进行代码质量检查
- 使用Prettier进行代码格式化

### 提交规范

遵循Conventional Commits规范，提交信息格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## 许可证

MIT
