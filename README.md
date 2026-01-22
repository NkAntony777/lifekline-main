# 天机阁 (Tianji Pavilion) - AI 命理助手

![天机阁预览](assets/showcase.png)

一个基于React + Vite的八字命理可视化与AI分析工具，融合传统易学智慧与现代AI技术，支持八字K线、大运流年分析、塔罗牌占卜、占星骰子和时刻天机等多种功能。全新设计的"纸墨印泥"新中式UI，为您带来沉浸式的东方美学体验。

## 功能特性

### 八字命理分析
- **八字命理K线可视化**：直观展示命主的大运、流年走势
- **AI八字分析**：集成大模型API，提供专业的八字命理分析
- **大运/流年分析**：支持单独的大运和流年AI分析
- **盲派命理**：采用盲派"宾主体用、做功效率"分析方法
- **聊天对话**：带上下文记忆的对话功能，支持八字分析指引

### 时刻天机
- **多种起盘方式**：支持当前时间、自定义时间、随机数起盘、自定义干支
- **完整八字排盘**：自动计算年、月、日、时四柱
- **十神分析**：自动计算时柱和刻柱的十神关系
- **纳音五行**：显示纳音及其五行属性
- **长生状态**：显示天干长生和纳音长生状态
- **神煞系统**：完整的天干神煞和地支神煞分析
- **AI解读**：基于排盘结果提供专业的时刻天机解读

### 塔罗牌占卜
- **多种牌阵**：支持单张牌、三张牌、凯尔特十字等牌阵
- **78张塔罗牌**：包含大阿卡纳和小阿卡纳完整牌组
- **正逆位**：支持正位和逆位解读
- **AI解读**：基于抽牌结果提供专业的塔罗牌解读

### 占星骰子
- **三骰子系统**：星星、星座、宫位三骰子占卜
- **完整数据**：包含所有星星、星座和宫位的详细信息
- **AI解读**：基于骰子结果提供专业的占星骰子解读

## 技术栈

- React 19
- Vite
- TypeScript
- TailwindCSS
- lucide-react（图标库）
- react-markdown（Markdown渲染）
- recharts（图表库）
- lunar-javascript（农历和八字计算）

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
│   │   ├── BaziAnalysis.tsx       # 八字分析组件
│   │   ├── DaYunChatPage.tsx      # 大运聊天页面
│   │   ├── LifeKLinePage.tsx      # 命理K线页面
│   │   ├── ShiKeTianJi.tsx        # 时刻天机组件
│   │   ├── TarotReading.tsx        # 塔罗牌占卜组件
│   │   └── AstrologyDice.tsx       # 占星骰子组件
│   ├── services/           # 服务层
│   │   ├── geminiService.ts        # Gemini API服务
│   │   ├── shiketianjiService.ts   # 时刻天机计算服务
│   │   ├── tarotService.ts         # 塔罗牌服务
│   │   └── astrologyDiceService.ts # 占星骰子服务
│   ├── types/              # TypeScript类型定义
│   │   ├── shiketianji.ts         # 时刻天机类型
│   │   ├── tarot.ts               # 塔罗牌类型
│   │   └── astrologyDice.ts        # 占星骰子类型
│   ├── constants/          # 常量定义
│   │   ├── shiketianji.ts         # 时刻天机常量
│   │   ├── tarot.ts               # 塔罗牌常量
│   │   └── astrologyDice.ts        # 占星骰子常量
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 应用入口
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json            # Vercel部署配置
```

## 环境变量

项目使用以下环境变量：

- `VITE_GEMINI_API_KEY`：Gemini API密钥（可选，也可在界面中输入）

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

### Netlify部署

1. 确保 `netlify.toml` 配置正确
2. 将代码推送到GitHub
3. 在Netlify上连接GitHub仓库
4. 配置项目设置：
   - Build Command: npm run build
   - Publish Directory: lifekline-main/dist
5. 部署项目

## 使用说明

### 八字分析
1. 在八字分析页面输入命主信息（出生时间、性别等）
2. 点击分析按钮获取AI分析结果
3. 在大运页面查看大运和流年信息
4. 点击大运或流年卡片获取详细分析
5. 在聊天页面与AI进行八字相关对话

### 时刻天机
1. 选择起盘方式（当前时间、自定义时间、随机数、自定义干支）
2. 输入相应参数
3. 点击计算按钮获取排盘结果
4. 点击AI解读按钮获取专业解读

### 塔罗牌占卜
1. 选择牌阵类型
2. 点击抽牌按钮
3. 查看抽牌结果
4. 点击解读按钮获取AI解读

### 占星骰子
1. 点击投掷骰子按钮
2. 查看骰子结果
3. 点击解读按钮获取AI解读

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

## 更新日志

### 最新更新
- 修复纳音长生计算逻辑，现在基于纳音五行计算
- 修复天干神煞和地支神煞的传输问题
- 添加完整的时刻天机功能
- 添加塔罗牌占卜功能
- 添加占星骰子功能

## 许可证

MIT
