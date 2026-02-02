import { ZiweiStar, ZhouyiGua } from '../constants/dailyDivination';

// 紫微星抽取结果
export interface ZiweiDrawResult {
  mainStar: ZiweiStar;      // 主星
  secondaryStar: ZiweiStar; // 副星
  minorStar: ZiweiStar;     // 杂曜
  timestamp: Date;
}

// 六十四卦抽取结果
export interface GuaDrawResult {
  hexagram: ZhouyiGua;      // 周易卦象
  changingLines?: number[]; // 变爻（可选）
  timestamp: Date;
}

// 每日占卜完整结果
export interface DailyDivinationResult {
  ziwei: ZiweiDrawResult;
  hexagram: GuaDrawResult;
  question: string;
  timestamp: Date;
}

// AI解读结果
export interface DailyDivinationReading {
  result: DailyDivinationResult;
  interpretation: string;      // 整体解读
  fortune: string;            // 运势分析
  advice: string[];           // 建议列表
  keywords: string[];         // 关键词
  timestamp: Date;
}

// 组件状态
export type DivinationStep = 'input' | 'shuffling' | 'result';
