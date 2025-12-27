# 占星骰子解读功能 - 技术路线开发文档

## 1. 功能概述

### 1.1 核心功能
占星骰子是一种占卜工具，通过随机抽取三个基本要素的组合来解读问题：
- **星星（Planet）**：代表能量和影响力
- **星座（Zodiac）**：代表性质和特质
- **宫位（House）**：代表生活领域

### 1.2 用户体验流程
1. 用户在输入框中填写问题
2. 点击"开始占卜"按钮
3. 三个滚轮格子（老虎机效果）开始旋转
4. 滚轮依次停下，显示随机抽取的星星、星座、宫位
5. 调用AI API生成解读
6. 展示完整的占卜结果

### 1.3 视觉效果
- 老虎机风格的三个滚轮格子
- 旋转动画效果
- 每个元素配有对应的占星符号
- 深色主题，与现有项目风格一致

## 2. 技术架构

### 2.1 技术栈
- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **AI集成**：Gemini API（复用现有服务）
- **动画**：CSS动画 + React状态管理

### 2.2 架构设计原则
- **模块化**：与塔罗功能完全解耦
- **可复用**：AI服务层共享
- **可扩展**：易于添加新的占星要素
- **类型安全**：完整的TypeScript类型定义

## 3. 文件结构

```
lifekline-main/
├── types/
│   └── astrologyDice.ts          # 占星骰子类型定义
├── constants/
│   └── astrologyDice.ts          # 占星骰子常量（星星、星座、宫位数据）
├── services/
│   └── astrologyDiceService.ts   # 占星骰子业务逻辑服务
├── components/
│   └── AstrologyDice.tsx         # 占星骰子主组件
├── data/
│   └── astrologyDiceData.json    # 占星骰子详细数据（可选，如需大量数据）
├── services/
│   └── geminiService.ts          # 扩展：添加占星骰子解读函数
└── components/
    └── HomePage.tsx              # 扩展：添加占星骰子入口
```

## 4. 开发步骤

### 阶段一：数据模型和类型定义（预计2小时）

#### 4.1 创建类型定义文件
**文件**：`types/astrologyDice.ts`

**内容**：
```typescript
// 星星类型
export type PlanetType = 
  | 'sun'      // 太阳 ♈
  | 'moon'     // 月亮 ☽
  | 'mercury'  // 水星 ☿
  | 'venus'    // 金星 ♀
  | 'mars'     // 火星 ♂
  | 'jupiter'  // 木星 ♃
  | 'saturn'   // 土星 ♄
  | 'uranus'   // 天王星 ♅
  | 'neptune'  // 海王星 ♆
  | 'pluto';   // 冥王星 ♇

// 星座类型
export type ZodiacType = 
  | 'aries'      // 白羊座 ♈
  | 'taurus'     // 金牛座 ♉
  | 'gemini'     // 双子座 ♊
  | 'cancer'     // 巨蟹座 ♋
  | 'leo'        // 狮子座 ♌
  | 'virgo'      // 处女座 ♍
  | 'libra'      // 天秤座 ♎
  | 'scorpio'    // 天蝎座 ♏
  | 'sagittarius'// 射手座 ♐
  | 'capricorn'  // 摩羯座 ♑
  | 'aquarius'   // 水瓶座 ♒
  | 'pisces';    // 双鱼座 ♓

// 宫位类型
export type HouseType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// 星星接口
export interface Planet {
  id: PlanetType;
  name: string;
  nameEn: string;
  symbol: string;
  keywords: string[];
  meaning: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

// 星座接口
export interface Zodiac {
  id: ZodiacType;
  name: string;
  nameEn: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruler: PlanetType;
  keywords: string[];
  meaning: string;
}

// 宫位接口
export interface House {
  id: HouseType;
  name: string;
  nameEn: string;
  symbol: string;
  keywords: string[];
  meaning: string;
  naturalRuler: ZodiacType;
}

// 抽取结果
export interface DiceResult {
  planet: Planet;
  zodiac: Zodiac;
  house: House;
  timestamp: Date;
}

// 占卜输入
export interface AstrologyDiceInput {
  question: string;
}

// 占卜结果
export interface AstrologyDiceReading {
  input: AstrologyDiceInput;
  result: DiceResult;
  interpretation: string;
  advice: string[];
  keywords: string[];
}

// 问题类型
export type QuestionType = 
  | 'love'
  | 'career'
  | 'health'
  | 'wealth'
  | 'family'
  | 'study'
  | 'travel'
  | 'general';

// 滚轮状态
export interface ReelState {
  isSpinning: boolean;
  stopped: boolean;
  currentIndex: number;
  targetIndex: number;
}
```

### 阶段二：数据常量定义（预计2小时）

#### 4.2 创建常量文件
**文件**：`constants/astrologyDice.ts`

**内容**：
```typescript
import { Planet, Zodiac, House } from '../types/astrologyDice';

// 星星数据
export const PLANETS: Planet[] = [
  {
    id: 'sun',
    name: '太阳',
    nameEn: 'Sun',
    symbol: '☉',
    keywords: ['自我', '意志力', '创造力', '生命力', '领导力'],
    meaning: '代表核心自我、意志力和生命力，是个人身份和创造力的源泉',
    element: 'fire'
  },
  // ... 其他星星
];

// 星座数据
export const ZODIACS: Zodiac[] = [
  {
    id: 'aries',
    name: '白羊座',
    nameEn: 'Aries',
    symbol: '♈',
    element: 'fire',
    quality: 'cardinal',
    ruler: 'mars',
    keywords: ['冲动', '热情', '勇气', '行动力', '领导'],
    meaning: '代表新的开始、行动力和勇气，是黄道十二宫的第一个星座'
  },
  // ... 其他星座
];

// 宫位数据
export const HOUSES: House[] = [
  {
    id: 1,
    name: '第一宫',
    nameEn: 'First House',
    symbol: 'Ⅰ',
    keywords: ['自我', '外貌', '性格', '第一印象', '个人形象'],
    meaning: '代表自我形象、外貌、性格和给人的第一印象',
    naturalRuler: 'aries'
  },
  // ... 其他宫位
];

// AI系统提示词
export const ASTROLOGY_DICE_SYSTEM_PROMPT = `
你是一位专业的占星骰子解读师，精通西方占星学和占星骰子占卜技术。

占星骰子包含三个要素：
1. 星星（Planet）：代表能量和影响力
2. 星座（Zodiac）：代表性质和特质
3. 宫位（House）：代表生活领域

解读原则：
- 综合分析三个要素之间的关联性
- 考虑星星、星座、宫位的传统含义
- 结合用户的具体问题进行个性化解读
- 提供实用且具有启发性的建议
- 保持客观、积极、建设性的态度

回答格式：
1. 整体解读（200-300字）
2. 详细分析（分别解读星星、星座、宫位的含义）
3. 实用建议（3-5条具体建议）
4. 关键词提取（5-8个关键词）

请用中文回答，语言要通俗易懂，避免过于专业的术语。
`;
```

### 阶段三：服务层实现（预计3小时）

#### 4.3 创建占星骰子服务
**文件**：`services/astrologyDiceService.ts`

**核心功能**：
```typescript
class AstrologyDiceService {
  // 随机抽取星星
  drawRandomPlanet(): Planet;
  
  // 随机抽取星座
  drawRandomZodiac(): Zodiac;
  
  // 随机抽取宫位
  drawRandomHouse(): House;
  
  // 生成完整的抽取结果
  rollDice(): DiceResult;
  
  // 分析问题类型
  analyzeQuestionType(question: string): QuestionType;
  
  // 格式化抽取结果用于AI提示
  formatDiceResultForPrompt(result: DiceResult): string;
  
  // 生成AI提示词
  generateInterpretationPrompt(question: string, result: DiceResult): string;
}
```

### 阶段四：UI组件开发（预计4小时）

#### 4.4 创建主组件
**文件**：`components/AstrologyDice.tsx`

**组件结构**：
```tsx
function AstrologyDice() {
  // 状态管理
  const [question, setQuestion] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [reelStates, setReelStates] = useState<ReelState[]>([]);
  const [result, setResult] = useState<DiceResult | null>(null);
  const [interpretation, setInterpretation] = useState('');
  
  // 子组件
  - QuestionInput: 问题输入框
  - ReelSlot: 滚轮格子组件
  - DiceResultDisplay: 结果展示组件
  - InterpretationDisplay: 解读展示组件
}
```

**滚轮组件设计**：
```tsx
function ReelSlot({ 
  items, 
  isSpinning, 
  currentIndex, 
  symbol 
}: ReelSlotProps) {
  // CSS动画实现旋转效果
  // 显示当前元素和符号
}
```

**动画效果**：
- 使用CSS keyframes实现旋转动画
- 三个滚轮依次启动和停止
- 停止时有减速效果
- 显示高亮的选中元素

### 阶段五：AI服务集成（预计2小时）

#### 4.5 扩展Gemini服务
**文件**：`services/geminiService.ts`

**新增功能**：
```typescript
// 占星骰子解读函数
async function interpretAstrologyDice(
  question: string,
  diceResult: DiceResult
): Promise<AstrologyDiceReading>;
```

### 阶段六：主页集成（预计1小时）

#### 4.6 扩展主页组件
**文件**：`components/HomePage.tsx`

**修改内容**：
- 添加占星骰子功能入口
- 保持与塔罗功能并列的布局
- 使用一致的UI风格

## 5. 数据模型设计

### 5.1 星星数据结构
```typescript
interface Planet {
  id: PlanetType;           // 唯一标识
  name: string;             // 中文名称
  nameEn: string;           // 英文名称
  symbol: string;           // 占星符号
  keywords: string[];       // 关键词
  meaning: string;          // 含义描述
  element: Element;         // 元素属性
}
```

### 5.2 星座数据结构
```typescript
interface Zodiac {
  id: ZodiacType;           // 唯一标识
  name: string;             // 中文名称
  nameEn: string;           // 英文名称
  symbol: string;           // 占星符号
  element: Element;         // 元素属性
  quality: Quality;         // 性质（本位、固定、变动）
  ruler: PlanetType;       // 守护星
  keywords: string[];       // 关键词
  meaning: string;          // 含义描述
}
```

### 5.3 宫位数据结构
```typescript
interface House {
  id: HouseType;           // 唯一标识（1-12）
  name: string;            // 中文名称
  nameEn: string;          // 英文名称
  symbol: string;          // 罗马数字符号
  keywords: string[];      // 关键词
  meaning: string;         // 含义描述
  naturalRuler: ZodiacType;// 自然守护星座
}
```

## 6. UI/UX设计

### 6.1 视觉风格
- **配色**：深紫色/深蓝色背景，金色/紫色高亮
- **字体**：使用项目现有的字体系统
- **符号**：使用Unicode占星符号
- **动画**：流畅的CSS动画，60fps

### 6.2 滚轮设计
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │  │                 │
│      ☉         │  │      ♈         │  │      Ⅰ         │
│     太阳        │  │    白羊座       │  │    第一宫       │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
     星星               星座                宫位
```

### 6.3 动画时序
1. 点击"开始占卜"
2. 三个滚轮同时开始旋转（0ms）
3. 第一个滚轮停止（2000ms）
4. 第二个滚轮停止（3000ms）
5. 第三个滚轮停止（4000ms）
6. 显示结果和开始AI解读（4500ms）

### 6.4 响应式设计
- **桌面端**：三个滚轮横向排列
- **平板端**：三个滚轮横向排列，适当缩小
- **移动端**：三个滚轮纵向排列或使用滚动容器

## 7. API集成

### 7.1 Gemini API调用
```typescript
async function interpretAstrologyDice(
  question: string,
  diceResult: DiceResult
): Promise<AstrologyDiceReading> {
  const prompt = generateInterpretationPrompt(question, diceResult);
  
  const response = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: ASTROLOGY_DICE_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048
    }
  });
  
  return parseInterpretation(response);
}
```

### 7.2 提示词生成
```typescript
function generateInterpretationPrompt(
  question: string,
  result: DiceResult
): string {
  return `
用户问题：${question}

占星骰子结果：
星星：${result.planet.name}（${result.planet.symbol}）
  - 关键词：${result.planet.keywords.join('、')}
  - 含义：${result.planet.meaning}

星座：${result.zodiac.name}（${result.zodiac.symbol}）
  - 元素：${result.zodiac.element}
  - 性质：${result.zodiac.quality}
  - 关键词：${result.zodiac.keywords.join('、')}
  - 含义：${result.zodiac.meaning}

宫位：${result.house.name}（${result.house.symbol}）
  - 关键词：${result.house.keywords.join('、')}
  - 含义：${result.house.meaning}

请根据以上信息，为用户提供专业的占星骰子解读。
  `;
}
```

## 8. 测试计划

### 8.1 单元测试
- **服务层测试**
  - 随机抽取算法测试
  - 问题类型分析测试
  - 提示词生成测试

### 8.2 集成测试
- **AI服务集成测试**
  - API调用测试
  - 响应解析测试
  - 错误处理测试

### 8.3 UI测试
- **组件渲染测试**
  - 滚轮组件渲染
  - 动画效果测试
  - 响应式布局测试

### 8.4 端到端测试
- **完整流程测试**
  - 问题输入 → 滚轮旋转 → 结果展示 → AI解读
  - 边界情况测试
  - 错误处理测试

## 9. 性能优化

### 9.1 前端优化
- 使用React.memo优化组件渲染
- 使用useCallback和useMemo优化性能
- 懒加载占星骰子组件
- 优化CSS动画性能

### 9.2 API优化
- 缓存常见问题的解读结果
- 限制API调用频率
- 优化提示词长度

## 10. 部署计划

### 10.1 构建配置
- 使用现有的Vite配置
- 确保TypeScript类型检查通过
- 运行lint检查

### 10.2 部署步骤
1. 提交代码到Git仓库
2. 推送到两个仓库（原仓库和副本仓库）
3. Netlify和Vercel自动部署
4. 验证部署结果

## 11. 时间估算

| 阶段 | 任务 | 预计时间 |
|------|------|----------|
| 阶段一 | 数据模型和类型定义 | 2小时 |
| 阶段二 | 数据常量定义 | 2小时 |
| 阶段三 | 服务层实现 | 3小时 |
| 阶段四 | UI组件开发 | 4小时 |
| 阶段五 | AI服务集成 | 2小时 |
| 阶段六 | 主页集成 | 1小时 |
| 阶段七 | 测试和调试 | 2小时 |
| 阶段八 | 部署和验证 | 1小时 |
| **总计** | | **17小时** |

## 12. 风险和挑战

### 12.1 技术风险
- **动画性能**：滚轮动画可能影响性能
  - 缓解措施：使用CSS3硬件加速，优化动画帧率
  
- **API限制**：Gemini API可能有调用限制
  - 缓解措施：实现缓存机制，优化提示词

### 12.2 业务风险
- **解读准确性**：AI解读可能不够准确
  - 缓解措施：优化系统提示词，提供用户反馈机制

### 12.3 用户体验风险
- **加载时间**：AI解读可能需要较长时间
  - 缓解措施：添加加载动画，提供进度提示

## 13. 后续扩展

### 13.1 功能扩展
- 添加历史记录功能
- 支持保存和分享占卜结果
- 添加更多占星要素（如相位、小行星等）
- 支持自定义抽取规则

### 13.2 数据扩展
- 添加更详细的星星、星座、宫位解释
- 添加案例库
- 添加学习资料

### 13.3 AI优化
- 优化提示词，提高解读准确性
- 添加多语言支持
- 实现个性化解读风格

## 14. 总结

本技术路线文档详细规划了占星骰子解读功能的开发流程，包括：

1. **完整的架构设计**：模块化、解耦、可扩展
2. **清晰的数据模型**：星星、星座、宫位的完整定义
3. **详细的开发步骤**：从类型定义到部署的完整流程
4. **优秀的用户体验**：老虎机视觉效果、流畅动画
5. **强大的AI集成**：复用现有服务，提供专业解读

按照此文档进行开发，预计17小时可以完成整个功能的开发、测试和部署。