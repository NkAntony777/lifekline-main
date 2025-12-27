# 时刻天机功能 - 技术路线开发文档

## 1. 功能概述

### 1.1 核心功能
时刻天机是一种基于天干地支的占卜工具，通过分析时柱和刻柱的干支组合来解读运势：
- **时柱**：代表时辰的能量和影响力
- **刻柱**：代表更精细的时间刻度
- **十神**：代表五行生克关系
- **纳音**：代表六十甲子的五行属性
- **神煞**：代表吉凶星煞

### 1.2 用户体验流程
1. 用户选择起盘方式（当前时间/随机数/自定义时间/自定义干支）
2. 点击"排盘"按钮
3. 系统计算并显示时柱和刻柱的干支组合
4. 展示十神、纳音、十二长生、旬空、透干等信息
5. 展示天干神煞和地支神煞
6. 调用AI API生成解读
7. 展示完整的占卜结果

### 1.3 视觉效果
- 五行颜色区分（木绿、火红、土黄、金橙、水蓝）
- 表格化展示干支信息
- 深色主题，与现有项目风格一致
- 清晰的数据层次结构

## 2. 技术架构

### 2.1 技术栈
- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS
- **AI集成**：Gemini API（复用现有服务）
- **动画**：CSS动画 + React状态管理

### 2.2 架构设计原则
- **模块化**：与其他功能完全解耦
- **可复用**：AI服务层共享
- **可扩展**：易于添加新的神煞和计算逻辑
- **类型安全**：完整的TypeScript类型定义

### 2.3 解耦设计
时刻天机功能与其他功能完全解耦，仅共享：
- 公共API设置（geminiService中的API配置）
- 主页面入口（HomePage中的导航）
- 通用UI组件和样式

## 3. 文件结构

```
lifekline-main/
├── types/
│   └── shiketianji.ts          # 时刻天机类型定义
├── constants/
│   └── shiketianji.ts          # 时刻天机常量（天干地支、纳音、神煞等）
├── services/
│   └── shiketianjiService.ts   # 时刻天机业务逻辑服务
├── components/
│   └── ShiKeTianJi.tsx         # 时刻天机主组件
├── services/
│   └── geminiService.ts        # 扩展：添加时刻天机解读函数
└── components/
    └── HomePage.tsx             # 扩展：添加时刻天机入口
```

## 4. 开发步骤

### 阶段一：数据模型和类型定义（预计2小时）

#### 4.1 创建类型定义文件
**文件**：`types/shiketianji.ts`

**内容**：
```typescript
// 天干类型
export type GanType = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

// 地支类型
export type ZhiType = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// 五行类型
export type WuxingType = '木' | '火' | '土' | '金' | '水';

// 十神类型
export type ShishenType = 
  | '比肩' | '劫财' | '食神' | '伤官' 
  | '偏财' | '正财' | '七杀' | '正官' 
  | '偏印' | '正印';

// 十二长生类型
export type LongevityType = 
  | '长生' | '沐浴' | '冠带' | '临官' | '帝旺' 
  | '衰' | '病' | '死' | '墓' | '绝' | '胎' | '养';

// 起盘方式类型
export type CalculationMethod = 
  | 'current-time'    // 当前时间
  | 'random-number'   // 随机数
  | 'custom-time'     // 自定义时间
  | 'custom-ganzhi';  // 自定义干支

// 干支组合
export interface GanZhi {
  gan: GanType;
  zhi: ZhiType;
}

// 时柱信息
export interface HourPillar {
  ganzhi: string;           // 完整干支（如"甲子"）
  gan: GanType;             // 天干
  zhi: ZhiType;             // 地支
  nayin: string;            // 纳音
  longevity: LongevityType;  // 十二长生
  xunkong: string;          // 旬空
  tougan: GanType[];        // 透干
}

// 刻柱信息
export interface KePillar {
  ganzhi: string;           // 完整干支（如"甲子"）
  gan: GanType;             // 天干
  zhi: ZhiType;             // 地支
  nayin: string;            // 纳音
  longevity: LongevityType;  // 十二长生
  xunkong: string;          // 旬空
  tougan: GanType[];        // 透干
}

// 完整八字（可选）
export interface FullBazi {
  year: string;    // 年柱
  month: string;   // 月柱
  day: string;     // 日柱
  hour: string;    // 时柱
}

// 天干神煞
export interface TianganShensha {
  guiren?: string;    // 贵人
  ganlu?: string;     // 干禄
  yangren?: string;   // 羊刃
  feiren?: string;    // 飞刃
  hongyan?: string;   // 红艳
  jinyu?: string;     // 金舆
  xuetang?: string;   // 学堂
}

// 地支神煞
export interface DizhiShensha {
  yima?: string;      // 驿马
  huagai?: string;    // 华盖
  taohua?: string;    // 桃花
  hongluan?: string;  // 红鸾
  tianxi?: string;    // 天喜
  guchen?: string;    // 孤辰
  guasu?: string;     // 寡宿
  wangshen?: string;  // 亡神
  jiesha?: string;    // 劫煞
  sangmen?: string;   // 丧门
  diaoke?: string;    // 吊客
}

// 排盘结果
export interface ShiKeTianJiResult {
  method: CalculationMethod;    // 起盘方式
  fullBazi?: FullBazi;         // 完整八字（可选）
  hourPillar: HourPillar;       // 时柱
  kePillar: KePillar;           // 刻柱
  shishen: ShishenType;         // 十神
  tianganShensha: TianganShensha;  // 天干神煞
  dizhiShensha: DizhiShensha;      // 地支神煞
  timestamp: Date;              // 计算时间
}

// 占卜输入
export interface ShiKeTianJiInput {
  method: CalculationMethod;
  customTime?: Date;           // 自定义时间
  randomNumber?: number;        // 随机数（1-12）
  customGanzhi?: {              // 自定义干支
    shiGan: GanType;
    shiZhi: ZhiType;
    keGan: GanType;
    keZhi: ZhiType;
  };
}

// 占卜结果
export interface ShiKeTianJiReading {
  input: ShiKeTianJiInput;
  result: ShiKeTianJiResult;
  interpretation: string;       // 整体解读
  shishenAnalysis: string;      // 十神分析
  nayinAnalysis: string;        // 纳音分析
  shenshaAnalysis: string;      // 神煞分析
  advice: string[];             // 实用建议
  keywords: string[];            // 关键词
}
```

### 阶段二：数据常量定义（预计2小时）

#### 4.2 创建常量文件
**文件**：`constants/shiketianji.ts`

**内容**：
```typescript
import { GanType, ZhiType, WuxingType, ShishenType, LongevityType } from '../types/shiketianji';

// 天干数组
export const TIANGAN: GanType[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支数组
export const DIZHI: ZhiType[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行颜色映射
export const WUXING_COLORS: Record<GanType | ZhiType, string> = {
  '甲': '#317023', '乙': '#317023',  // 木
  '丙': '#ce2d20', '丁': '#ce2d20',  // 火
  '戊': '#98511e', '己': '#98511e',  // 土
  '庚': '#e08433', '辛': '#e08433',  // 金
  '壬': '#0803a8', '癸': '#0803a8',  // 水
  '子': '#0803a8', '丑': '#98511e', '寅': '#317023',
  '卯': '#317023', '辰': '#98511e', '巳': '#ce2d20',
  '午': '#ce2d20', '未': '#98511e', '申': '#e08433',
  '酉': '#e08433', '戌': '#98511e', '亥': '#0803a8'
};

// 有效的六十甲子组合
export const VALID_GANZHI_PAIRS: string[] = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
];

// 天干对应的地支映射（仅用于六十甲子限制）
export const GAN_TO_ZHI_MAP: Record<GanType, ZhiType[]> = {
  '甲': ['子', '寅', '辰', '午', '申', '戌'],
  '乙': ['丑', '卯', '巳', '未', '酉', '亥'],
  '丙': ['寅', '辰', '午', '申', '戌', '子'],
  '丁': ['卯', '巳', '未', '酉', '亥', '丑'],
  '戊': ['辰', '午', '申', '戌', '子', '寅'],
  '己': ['巳', '未', '酉', '亥', '丑', '卯'],
  '庚': ['午', '申', '戌', '子', '寅', '辰'],
  '辛': ['未', '酉', '亥', '丑', '卯', '巳'],
  '壬': ['申', '戌', '子', '寅', '辰', '午'],
  '癸': ['酉', '亥', '丑', '卯', '巳', '未']
};

// 十二长生
export const TWELVE_LONGEVITY: LongevityType[] = [
  '长生', '沐浴', '冠带', '临官', '帝旺', 
  '衰', '病', '死', '墓', '绝', '胎', '养'
];

// 十天干十二长生表
export const TEN_HEAVENLY_STEMS_LONGEVITY_TABLE: Record<GanType, ZhiType[]> = {
  '甲': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
  '乙': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
  '丙': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  '丁': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  '戊': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
  '己': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
  '庚': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
  '辛': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
  '壬': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
  '癸': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未']
};

// 纳音映射
export const NAYIN_MAP: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '洞下水', '丁丑': '洞下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂中金', '乙未': '砂中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

// 透干映射
export const TOUGAN_MAP: Record<ZhiType, GanType[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 十神映射
export const SHISHEN_MAP: Record<GanType, Record<GanType, ShishenType>> = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
};

// 天干神煞
export const TIANGAN_SHENSHA: Record<string, Record<GanType, string>> = {
  '贵人': { '甲': '丑、未', '乙': '子、申', '丙': '亥、酉', '丁': '亥、酉', '戊': '丑、未', '己': '子、申', '庚': '丑、未', '辛': '寅、午', '壬': '卯、巳', '癸': '卯、巳' },
  '干禄': { '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳', '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子' },
  '羊刃': { '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午', '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑' },
  '飞刃': { '甲': '酉', '乙': '戌', '丙': '子', '丁': '丑', '戊': '子', '己': '丑', '庚': '卯', '辛': '辰', '壬': '午', '癸': '未' },
  '红艳': { '甲': '午', '乙': '未', '丙': '申', '丁': '酉', '戊': '辰', '己': '巳', '庚': '子', '辛': '丑', '壬': '寅', '癸': '卯' },
  '金舆': { '甲': '辰', '乙': '未', '丙': '未', '丁': '未', '戊': '辰', '己': '辰', '庚': '未', '辛': '未', '壬': '戌', '癸': '戌' },
  '学堂': { '甲': '亥', '乙': '亥', '丙': '寅', '丁': '寅', '戊': '申', '己': '申', '庚': '巳', '辛': '巳', '壬': '申', '癸': '申' }
};

// 地支神煞
export const DIZHI_SHENSHA: Record<string, Record<ZhiType, string>> = {
  '驿马': { '子': '寅', '丑': '卯', '寅': '申', '卯': '巳', '辰': '寅', '巳': '亥', '午': '申', '未': '巳', '申': '寅', '酉': '亥', '戌': '申', '亥': '巳' },
  '华盖': { '子': '辰', '丑': '丑', '寅': '戌', '卯': '未', '辰': '辰', '巳': '丑', '午': '戌', '未': '未', '申': '辰', '酉': '丑', '戌': '戌', '亥': '未' },
  '桃花': { '申': '酉', '子': '酉', '辰': '酉', '寅': '卯', '午': '卯', '戌': '卯', '巳': '午', '酉': '午', '丑': '午', '亥': '子', '卯': '子', '未': '子' },
  '红鸾': { '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌', '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰' },
  '天喜': { '子': '酉', '丑': '戌', '寅': '亥', '卯': '子', '辰': '丑', '巳': '寅', '午': '卯', '未': '辰', '申': '巳', '酉': '午', '戌': '未', '亥': '申' },
  '孤辰': { '子': '寅', '丑': '寅', '寅': '巳', '卯': '巳', '辰': '巳', '巳': '申', '午': '申', '未': '申', '申': '亥', '酉': '亥', '戌': '亥', '亥': '寅' },
  '寡宿': { '子': '戌', '丑': '戌', '寅': '丑', '卯': '丑', '辰': '丑', '巳': '辰', '午': '辰', '未': '辰', '申': '未', '酉': '未', '戌': '未', '亥': '戌' },
  '亡神': { '子': '亥', '丑': '申', '寅': '巳', '卯': '寅', '辰': '亥', '巳': '申', '午': '巳', '未': '寅', '申': '亥', '酉': '申', '戌': '巳', '亥': '寅' },
  '劫煞': { '子': '巳', '丑': '寅', '寅': '亥', '卯': '申', '辰': '巳', '巳': '寅', '午': '亥', '未': '申', '申': '巳', '酉': '寅', '戌': '亥', '亥': '申' },
  '丧门': { '子': '寅', '丑': '丑', '寅': '子', '卯': '亥', '辰': '戌', '巳': '酉', '午': '申', '未': '未', '申': '午', '酉': '巳', '戌': '辰', '亥': '卯' },
  '吊客': { '子': '戌', '丑': '亥', '寅': '子', '卯': '丑', '辰': '寅', '巳': '卯', '午': '辰', '未': '巳', '申': '午', '酉': '未', '戌': '申', '亥': '酉' }
};

// AI系统提示词
export const SHIKETIANJI_SYSTEM_PROMPT = `
你是一位专业的时刻天机解读师，精通天干地支、十神、纳音、神煞等术数知识。

时刻天机包含以下要素：
1. 时柱：代表时辰的能量和影响力
2. 刻柱：代表更精细的时间刻度
3. 十神：代表五行生克关系
4. 纳音：代表六十甲子的五行属性
5. 十二长生：代表生命周期的不同阶段
6. 旬空：代表空亡的地支
7. 透干：代表地支中隐藏的天干
8. 天干神煞：贵人、干禄、羊刃、飞刃、红艳、金舆、学堂
9. 地支神煞：驿马、华盖、桃花、红鸾、天喜、孤辰、寡宿、亡神、劫煞、丧门、吊客

解读原则：
- 综合分析时柱和刻柱的干支组合
- 考虑十神、纳音、神煞的传统含义
- 分析五行生克关系
- 结合起盘方式进行个性化解读
- 提供实用且具有启发性的建议
- 保持客观、积极、建设性的态度

回答格式：
1. 整体解读（200-300字）
2. 十神分析（分析时干与刻干的十神关系）
3. 纳音分析（分析时柱和刻柱的纳音五行）
4. 神煞分析（分析吉凶神煞的影响）
5. 实用建议（3-5条具体建议）
6. 关键词提取（5-8个关键词）

请用中文回答，语言要通俗易懂，避免过于专业的术语。
`;
```

### 阶段三：服务层实现（预计3小时）

#### 4.3 创建时刻天机服务
**文件**：`services/shiketianjiService.ts`

**核心功能**：
```typescript
class ShiKeTianJiService {
  // 根据当前时间计算
  calculateFromCurrentTime(): ShiKeTianJiResult;
  
  // 根据随机数计算
  calculateFromRandomNumber(randomNum: number): ShiKeTianJiResult;
  
  // 根据自定义时间计算
  calculateFromCustomTime(date: Date): ShiKeTianJiResult;
  
  // 根据自定义干支计算
  calculateFromCustomGanzhi(shiGan: GanType, shiZhi: ZhiType, keGan: GanType, keZhi: ZhiType): ShiKeTianJiResult;
  
  // 计算旬空
  calculateXunKong(ganZhi: string): string;
  
  // 计算十二长生
  calculateLongevity(gan: GanType, zhi: ZhiType): LongevityType;
  
  // 计算纳音
  calculateNaYin(ganZhi: string): string;
  
  // 计算透干
  calculateTouGan(zhi: ZhiType): GanType[];
  
  // 计算十神
  calculateShiShen(shiGan: GanType, keGan: GanType): ShishenType;
  
  // 计算天干神煞
  calculateTianganShensha(gan: GanType): TianganShensha;
  
  // 计算地支神煞
  calculateDizhiShensha(zhi: ZhiType): DizhiShensha;
  
  // 导航到下一个盘
  navigateToNext(result: ShiKeTianJiResult): ShiKeTianJiResult;
  
  // 导航到上一个盘
  navigateToPrevious(result: ShiKeTianJiResult): ShiKeTianJiResult;
  
  // 格式化结果用于AI提示
  formatResultForPrompt(result: ShiKeTianJiResult): string;
}
```

### 阶段四：UI组件开发（预计4小时）

#### 4.4 创建主组件
**文件**：`components/ShiKeTianJi.tsx`

**组件结构**：
```tsx
function ShiKeTianJi() {
  // 状态管理
  const [method, setMethod] = useState<CalculationMethod>('current-time');
  const [customTime, setCustomTime] = useState<Date | null>(null);
  const [randomNumber, setRandomNumber] = useState<number>(1);
  const [customGanzhi, setCustomGanzhi] = useState<CustomGanzhi | null>(null);
  const [result, setResult] = useState<ShiKeTianJiResult | null>(null);
  const [interpretation, setInterpretation] = useState<ShiKeTianJiReading | null>(null);
  
  // 子组件
  - MethodSelector: 起盘方式选择器
  - CustomTimeInput: 自定义时间输入
  - RandomNumberInput: 随机数输入
  - CustomGanzhiInput: 自定义干支输入
  - ResultDisplay: 结果展示组件
  - InterpretationDisplay: 解读展示组件
}
```

**表格设计**：
```
┌─────────────────────────────────────────────────────────┐
│                    时刻天机                              │
├─────────────────────────────────────────────────────────┤
│  ○ 当前时间  ○ 随机数起盘  ○ 自定义时间  ○ 自定义干支   │
├─────────────────────────────────────────────────────────┤
│  [自定义时间输入 / 随机数输入 / 自定义干支输入]           │
├─────────────────────────────────────────────────────────┤
│  [排盘按钮]                                             │
├─────────────────────────────────────────────────────────┤
│  [上一个盘]              [下一个盘]                      │
├─────────────────────────────────────────────────────────┤
│  年柱    月柱    日柱    时柱                           │
│  甲子    乙丑    丙寅    丁卯                           │
├─────────────────────────────────────────────────────────┤
│          时柱    刻柱                                   │
│  十神    我      比肩                                   │
│  天干    丁      甲                                     │
│  地支    卯      子                                     │
│  透干    —      癸                                     │
│  纳音    炉中火  海中金                                 │
│  十二长生  帝旺  长生                                   │
│  旬空    —      —                                      │
├─────────────────────────────────────────────────────────┤
│  天干神煞                                              │
│  时干    刻干                                           │
│  贵人    亥、酉  丑、未                                 │
│  干禄    午      寅                                     │
│  ...                                                    │
├─────────────────────────────────────────────────────────┤
│  地支神煞                                              │
│  时支    刻支                                           │
│  驿马    巳      寅                                     │
│  华盖    丑      辰                                     │
│  ...                                                    │
└─────────────────────────────────────────────────────────┘
```

### 阶段五：AI服务集成（预计2小时）

#### 4.5 扩展Gemini服务
**文件**：`services/geminiService.ts`

**新增功能**：
```typescript
// 时刻天机解读函数
async function interpretShiKeTianJi(
  result: ShiKeTianJiResult,
  modelName: string,
  apiBaseUrl: string,
  apiKey: string
): Promise<ShiKeTianJiReading>;
```

### 阶段六：主页集成（预计1小时）

#### 4.6 扩展主页组件
**文件**：`components/HomePage.tsx`

**修改内容**：
- 添加时刻天机功能入口
- 保持与塔罗、占星骰子功能并列的布局
- 使用一致的UI风格

## 5. 数据模型设计

### 5.1 时柱数据结构
```typescript
interface HourPillar {
  ganzhi: string;           // 完整干支（如"甲子"）
  gan: GanType;             // 天干
  zhi: ZhiType;             // 地支
  nayin: string;            // 纳音
  longevity: LongevityType;  // 十二长生
  xunkong: string;          // 旬空
  tougan: GanType[];        // 透干
}
```

### 5.2 刻柱数据结构
```typescript
interface KePillar {
  ganzhi: string;           // 完整干支（如"甲子"）
  gan: GanType;             // 天干
  zhi: ZhiType;             // 地支
  nayin: string;            // 纳音
  longevity: LongevityType;  // 十二长生
  xunkong: string;          // 旬空
  tougan: GanType[];        // 透干
}
```

### 5.3 神煞数据结构
```typescript
interface TianganShensha {
  guiren?: string;    // 贵人
  ganlu?: string;     // 干禄
  yangren?: string;   // 羊刃
  feiren?: string;    // 飞刃
  hongyan?: string;   // 红艳
  jinyu?: string;     // 金舆
  xuetang?: string;   // 学堂
}

interface DizhiShensha {
  yima?: string;      // 驿马
  huagai?: string;    // 华盖
  taohua?: string;    // 桃花
  hongluan?: string;  // 红鸾
  tianxi?: string;    // 天喜
  guchen?: string;    // 孤辰
  guasu?: string;     // 寡宿
  wangshen?: string;  // 亡神
  jiesha?: string;    // 劫煞
  sangmen?: string;   // 丧门
  diaoke?: string;    // 吊客
}
```

## 6. UI/UX设计

### 6.1 视觉风格
- **配色**：五行颜色区分（木绿#317023、火红#ce2d20、土黄#98511e、金橙#e08433、水蓝#0803a8）
- **字体**：使用项目现有的字体系统
- **表格**：清晰的表格布局，五行颜色着色
- **深色主题**：与现有项目风格一致

### 6.2 响应式设计
- **桌面端**：完整表格展示
- **平板端**：适当缩小字体和间距
- **移动端**：使用滚动容器或分页展示

### 6.3 交互设计
- 起盘方式切换时显示对应的输入控件
- 排盘按钮点击后显示计算结果
- 上一个盘/下一个盘按钮用于导航
- AI解读加载时显示加载动画

## 7. API集成

### 7.1 Gemini API调用
```typescript
async function interpretShiKeTianJi(
  result: ShiKeTianJiResult
): Promise<ShiKeTianJiReading> {
  const prompt = formatResultForPrompt(result);
  
  const response = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: SHIKETIANJI_SYSTEM_PROMPT,
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
function formatResultForPrompt(result: ShiKeTianJiResult): string {
  return `
起盘方式：${result.method}

时柱信息：
干支：${result.hourPillar.ganzhi}
天干：${result.hourPillar.gan}
地支：${result.hourPillar.zhi}
纳音：${result.hourPillar.nayin}
十二长生：${result.hourPillar.longevity}
旬空：${result.hourPillar.xunkong}
透干：${result.hourPillar.tougan.join('、')}

刻柱信息：
干支：${result.kePillar.ganzhi}
天干：${result.kePillar.gan}
地支：${result.kePillar.zhi}
纳音：${result.kePillar.nayin}
十二长生：${result.kePillar.longevity}
旬空：${result.kePillar.xunkong}
透干：${result.kePillar.tougan.join('、')}

十神：${result.shishen}

天干神煞：
贵人：${result.tianganShensha.guiren || '无'}
干禄：${result.tianganShensha.ganlu || '无'}
羊刃：${result.tianganShensha.yangren || '无'}
飞刃：${result.tianganShensha.feiren || '无'}
红艳：${result.tianganShensha.hongyan || '无'}
金舆：${result.tianganShensha.jinyu || '无'}
学堂：${result.tianganShensha.xuetang || '无'}

地支神煞：
驿马：${result.dizhiShensha.yima || '无'}
华盖：${result.dizhiShensha.huagai || '无'}
桃花：${result.dizhiShensha.taohua || '无'}
红鸾：${result.dizhiShensha.hongluan || '无'}
天喜：${result.dizhiShensha.tianxi || '无'}
孤辰：${result.dizhiShensha.guchen || '无'}
寡宿：${result.dizhiShensha.guasu || '无'}
亡神：${result.dizhiShensha.wangshen || '无'}
劫煞：${result.dizhiShensha.jiesha || '无'}
丧门：${result.dizhiShensha.sangmen || '无'}
吊客：${result.dizhiShensha.diaoke || '无'}

请根据以上信息，为用户提供专业的时刻天机解读。
  `;
}
```

## 8. 测试计划

### 8.1 单元测试
- **服务层测试**
  - 旬空计算测试
  - 十二长生计算测试
  - 纳音计算测试
  - 透干计算测试
  - 十神计算测试
  - 神煞计算测试
  - 导航功能测试

### 8.2 集成测试
- **AI服务集成测试**
  - API调用测试
  - 响应解析测试
  - 错误处理测试

### 8.3 UI测试
- **组件渲染测试**
  - 表格渲染测试
  - 五行颜色测试
  - 响应式布局测试
  - 交互测试

### 8.4 端到端测试
- **完整流程测试**
  - 当前时间起盘 → 结果展示 → AI解读
  - 随机数起盘 → 结果展示 → AI解读
  - 自定义时间起盘 → 结果展示 → AI解读
  - 自定义干支起盘 → 结果展示 → AI解读
  - 导航功能测试
  - 边界情况测试
  - 错误处理测试

## 9. 性能优化

### 9.1 前端优化
- 使用React.memo优化组件渲染
- 使用useCallback和useMemo优化性能
- 懒加载时刻天机组件
- 优化表格渲染性能

### 9.2 API优化
- 缓存常见组合的解读结果
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
- **计算复杂性**：干支计算逻辑较为复杂
  - 缓解措施：充分测试，参考现有实现
  
- **API限制**：Gemini API可能有调用限制
  - 缓解措施：实现缓存机制，优化提示词

### 12.2 业务风险
- **解读准确性**：AI解读可能不够准确
  - 缓解措施：优化系统提示词，提供用户反馈机制

### 12.3 用户体验风险
- **数据展示**：大量数据可能影响用户体验
  - 缓解措施：优化表格布局，提供清晰的视觉层次

## 13. 后续扩展

### 13.1 功能扩展
- 添加历史记录功能
- 支持保存和分享占卜结果
- 添加更多神煞和计算逻辑
- 支持自定义神煞规则

### 13.2 数据扩展
- 添加更详细的纳音解释
- 添加案例库
- 添加学习资料

### 13.3 AI优化
- 优化提示词，提高解读准确性
- 添加多语言支持
- 实现个性化解读风格

## 14. 解耦设计说明

### 14.1 解耦原则
时刻天机功能与其他功能完全解耦，仅共享：
- 公共API设置（geminiService中的API配置）
- 主页面入口（HomePage中的导航）
- 通用UI组件和样式

### 14.2 独立模块
- 类型定义：types/shiketianji.ts
- 常量数据：constants/shiketianji.ts
- 服务层：services/shiketianjiService.ts
- UI组件：components/ShiKeTianJi.tsx

### 14.3 共享资源
- AI服务：services/geminiService（仅扩展，不修改现有功能）
- 主页面：components/HomePage（仅添加入口，不修改现有功能）

## 15. 总结

本技术路线文档详细规划了时刻天机功能的开发流程，包括：

1. **完整的架构设计**：模块化、解耦、可扩展
2. **清晰的数据模型**：天干地支、十神、纳音、神煞的完整定义
3. **详细的开发步骤**：从类型定义到部署的完整流程
4. **优秀的用户体验**：五行颜色区分、清晰的表格布局
5. **强大的AI集成**：复用现有服务，提供专业解读
6. **完全解耦设计**：与其他功能独立，仅共享必要资源

按照此文档进行开发，预计17小时可以完成整个功能的开发、测试和部署。
