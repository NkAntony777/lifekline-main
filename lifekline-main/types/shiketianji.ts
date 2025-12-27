export type GanType = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

export type ZhiType = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type WuxingType = '木' | '火' | '土' | '金' | '水';

export type ShishenType = 
  | '比肩' | '劫财' | '食神' | '伤官' 
  | '偏财' | '正财' | '七杀' | '正官' 
  | '偏印' | '正印';

export type LongevityType = 
  | '长生' | '沐浴' | '冠带' | '临官' | '帝旺' 
  | '衰' | '病' | '死' | '墓' | '绝' | '胎' | '养';

export type CalculationMethod = 
  | 'current-time'    
  | 'random-number'   
  | 'custom-time'     
  | 'custom-ganzhi';  

export interface GanZhi {
  gan: GanType;
  zhi: ZhiType;
}

export interface HourPillar {
  ganzhi: string;           
  gan: GanType;             
  zhi: ZhiType;             
  nayin: string;            
  longevity: LongevityType;  
  nayinLongevity: LongevityType;
  xunkong: string;          
  tougan: GanType[];        
}

export interface KePillar {
  ganzhi: string;           
  gan: GanType;             
  zhi: ZhiType;             
  nayin: string;            
  longevity: LongevityType;  
  nayinLongevity: LongevityType;
  xunkong: string;          
  tougan: GanType[];        
}

export interface FullBazi {
  yearPillar: HourPillar;
  monthPillar: HourPillar;
  dayPillar: HourPillar;
  hourPillar: HourPillar;
}

export interface TianganShensha {
  guiren?: { hour: string; ke: string };
  ganlu?: { hour: string; ke: string };
  yangren?: { hour: string; ke: string };
  feiren?: { hour: string; ke: string };
  hongyan?: { hour: string; ke: string };
  jinyu?: { hour: string; ke: string };
  xuetang?: { hour: string; ke: string };
}

export interface DizhiShensha {
  yima?: { hour: string; ke: string };
  huagai?: { hour: string; ke: string };
  taohua?: { hour: string; ke: string };
  hongluan?: { hour: string; ke: string };
  tianxi?: { hour: string; ke: string };
  guchen?: { hour: string; ke: string };
  guasu?: { hour: string; ke: string };
  wangshen?: { hour: string; ke: string };
  jiesha?: { hour: string; ke: string };
  sangmen?: { hour: string; ke: string };
  diaoke?: { hour: string; ke: string };
}

export interface ShiKeTianJiResult {
  method: CalculationMethod;    
  fullBazi?: FullBazi;         
  hourPillar: HourPillar;       
  kePillar: KePillar;           
  shishen: ShishenType;         
  tianganShensha: TianganShensha;  
  dizhiShensha: DizhiShensha;      
  timestamp: Date;              
}

export interface CustomGanzhi {
  shiGan: GanType;
  shiZhi: ZhiType;
  keGan: GanType;
  keZhi: ZhiType;
}

export interface ShiKeTianJiInput {
  question: string;
  method: CalculationMethod;
  customTime?: Date;           
  randomNumber?: number;        
  customGanzhi?: CustomGanzhi;              
}

export interface ShiKeTianJiReading {
  input: ShiKeTianJiInput;
  result: ShiKeTianJiResult;
  interpretation: string;       
  shishenAnalysis: string;      
  nayinAnalysis: string;        
  shenshaAnalysis: string;      
  advice: string[];             
  keywords: string[];            
}
