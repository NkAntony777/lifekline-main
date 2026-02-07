import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, BriefcaseBusiness, Compass, Flame, HeartHandshake, MapPinned, Mountain, ShieldAlert, Sparkles, Stars, Trees, Waves } from 'lucide-react';
import { Lunar } from 'lunar-javascript';
import LifeKLineChart from './LifeKLineChart';
import { AnalysisData, KLinePoint } from '../types';

type FiveElement = '木' | '火' | '土' | '金' | '水';

interface DerivedPoint extends KLinePoint {
  wealth: number;
  health: number;
  love: number;
  career: number;
  vitality: number;
}

interface StageInsight {
  startAge: number;
  endAge: number;
  label: string;
  avgScore: number;
  peak: number;
  low: number;
  wealth: number;
  health: number;
  love: number;
  career: number;
  vitality: number;
  trend: 'up' | 'down' | 'flat';
  note: string;
}

interface ElementInsight {
  element: FiveElement;
  direction: string;
  confidence: 'high' | 'medium';
  rationale: string;
}

interface CitySuggestion {
  city: string;
  subtitle: string;
  landmark: string;
  direction: string;
  imageUrl: string;
  accentClass: string;
}

interface BirthProfile {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  name?: string;
}

interface LifeNumberInterpretation {
  title: string;
  subtitle: string;
  keywords: string[];
  strengths: string[];
  challenge: string;
  advice: string;
}

interface LifeNumberInsight {
  birthDateText: string;
  componentTraceText: string;
  traceText: string;
  talentNumber: number;
  talentTraceText: string;
  monthBase: number;
  dayBase: number;
  yearBase: number;
  value: number;
  valueLabel: string;
  masterPreserved: boolean;
  interpretation: LifeNumberInterpretation;
}

interface LifeNumberDeepProfile {
  role: string;
  workStyle: string;
  relationshipStyle: string;
  growthTask: string;
  cautionSignals: string[];
  actionTips: string[];
}

interface TalentInterpretation {
  title: string;
  summary: string;
  leverage: string;
}

interface LifeNumberExpandedGuide {
  coreMotif: string;
  growthArc: string;
  careerHints: string[];
  relationshipHints: string[];
  moneyHints: string[];
  practicePlan: string[];
}

interface PersonalYearInsight {
  targetYear: number;
  birthMdReduced: number;
  yearReduced: number;
  value: number;
  traceText: string;
  theme: string;
  focus: string;
  caution: string;
}

interface NarrativeChapter {
  id: string;
  title: string;
  subtitle: string;
  analysisText: string;
  punchline: string;
  scoreLabel: string;
  scoreValue: number;
  focusAge: number;
  backgroundClass: string;
}

interface StarTrait {
  title: string;
  subtitle: string;
  imageKeyword: string;
  gradientClass: string;
  traitA: string;
  traitB: string;
  traitC: string;
}

interface StarProfile {
  index: number;
  zoneIndex: number;
  landIndex: number;
  xiu: string;
  animal: string;
  luck: string;
  zone: string;
  beast: string;
  land: string;
  direction: string;
  sevenStar: string;
  trait: StarTrait;
  imageUrl: string;
}

interface LifeJourneyVisualizerProps {
  data: KLinePoint[];
  analysis: AnalysisData;
  birthProfile?: BirthProfile;
}

const STEM_TO_ELEMENT: Record<string, FiveElement> = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
};

const BRANCH_TO_ELEMENT: Record<string, FiveElement> = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水',
};

const CITY_BANK: Record<FiveElement, CitySuggestion[]> = {
  火: [
    {
      city: '广州',
      subtitle: '火势旺于南方，利表达、曝光与行动推进。',
      landmark: '广州塔',
      direction: '南方',
      imageUrl: 'https://source.unsplash.com/1280x720/?guangzhou,skyline',
      accentClass: 'from-red-500/85 to-orange-500/75',
    },
    {
      city: '深圳',
      subtitle: '节奏快、反馈密，适合冲刺期放大执行力。',
      landmark: '平安金融中心',
      direction: '南方',
      imageUrl: 'https://source.unsplash.com/1280x720/?shenzhen,cityscape',
      accentClass: 'from-orange-500/85 to-amber-500/75',
    },
    {
      city: '海口',
      subtitle: '温热海风偏养能量，适合恢复阶段与重启。',
      landmark: '骑楼老街',
      direction: '南方',
      imageUrl: 'https://source.unsplash.com/1280x720/?haikou,coast',
      accentClass: 'from-amber-500/85 to-yellow-500/75',
    },
  ],
  木: [
    {
      city: '杭州',
      subtitle: '木气充盈，利学习、创作与长期成长。',
      landmark: '西湖',
      direction: '东南',
      imageUrl: 'https://source.unsplash.com/1280x720/?hangzhou,west-lake',
      accentClass: 'from-emerald-500/85 to-lime-500/75',
    },
    {
      city: '苏州',
      subtitle: '园林与秩序并存，利沉浸、打磨与专注。',
      landmark: '拙政园',
      direction: '东部',
      imageUrl: 'https://source.unsplash.com/1280x720/?suzhou,garden',
      accentClass: 'from-lime-500/85 to-green-500/75',
    },
    {
      city: '成都',
      subtitle: '节奏稳定，适合厚积薄发与长期主义路线。',
      landmark: '锦里',
      direction: '西南',
      imageUrl: 'https://source.unsplash.com/1280x720/?chengdu,city',
      accentClass: 'from-green-500/85 to-emerald-500/75',
    },
  ],
  土: [
    {
      city: '重庆',
      subtitle: '土势厚重，利建立结构、稳住基本盘。',
      landmark: '洪崖洞',
      direction: '西南',
      imageUrl: 'https://source.unsplash.com/1280x720/?chongqing,night',
      accentClass: 'from-amber-700/85 to-stone-600/75',
    },
    {
      city: '西安',
      subtitle: '历史与秩序感强，利管理、系统化与复盘。',
      landmark: '大雁塔',
      direction: '西北',
      imageUrl: 'https://source.unsplash.com/1280x720/?xian,city-wall',
      accentClass: 'from-stone-700/85 to-amber-700/75',
    },
    {
      city: '昆明',
      subtitle: '气候平和，适合调整节律和建立可持续节奏。',
      landmark: '滇池',
      direction: '西南',
      imageUrl: 'https://source.unsplash.com/1280x720/?kunming,lake',
      accentClass: 'from-yellow-700/85 to-amber-600/75',
    },
  ],
  金: [
    {
      city: '北京',
      subtitle: '规则密度高，利战略判断与组织能力放大。',
      landmark: '国贸 CBD',
      direction: '北方',
      imageUrl: 'https://source.unsplash.com/1280x720/?beijing,cbd',
      accentClass: 'from-slate-600/85 to-zinc-500/75',
    },
    {
      city: '青岛',
      subtitle: '金水互济，利执行落地与资源整合。',
      landmark: '栈桥',
      direction: '东部',
      imageUrl: 'https://source.unsplash.com/1280x720/?qingdao,coastline',
      accentClass: 'from-zinc-600/85 to-slate-500/75',
    },
    {
      city: '大连',
      subtitle: '风格克制，利理性决策和系统优化。',
      landmark: '星海湾',
      direction: '东北',
      imageUrl: 'https://source.unsplash.com/1280x720/?dalian,sea',
      accentClass: 'from-neutral-600/85 to-zinc-600/75',
    },
  ],
  水: [
    {
      city: '上海',
      subtitle: '水势流动，利资源连接与协同放大。',
      landmark: '陆家嘴',
      direction: '东部',
      imageUrl: 'https://source.unsplash.com/1280x720/?shanghai,skyline',
      accentClass: 'from-blue-600/85 to-cyan-500/75',
    },
    {
      city: '厦门',
      subtitle: '滨海水气柔和，利平衡身心与长期续航。',
      landmark: '鼓浪屿',
      direction: '东南',
      imageUrl: 'https://source.unsplash.com/1280x720/?xiamen,coast',
      accentClass: 'from-cyan-600/85 to-blue-500/75',
    },
    {
      city: '宁波',
      subtitle: '港口型机会密集，利对外协作与增长通道。',
      landmark: '三江口',
      direction: '东部',
      imageUrl: 'https://source.unsplash.com/1280x720/?ningbo,port',
      accentClass: 'from-sky-600/85 to-blue-500/75',
    },
  ],
};

const CITY_ART_KEY_BY_NAME: Record<string, string> = {
  广州: 'guangzhou',
  深圳: 'shenzhen',
  海口: 'haikou',
  杭州: 'hangzhou',
  苏州: 'suzhou',
  成都: 'chengdu',
  重庆: 'chongqing',
  西安: 'xian',
  昆明: 'kunming',
  北京: 'beijing',
  青岛: 'qingdao',
  大连: 'dalian',
  上海: 'shanghai',
  厦门: 'xiamen',
  宁波: 'ningbo',
};

const getLocalCityArtUrl = (city: string): string | null => {
  const key = CITY_ART_KEY_BY_NAME[city];
  return key ? `/city-art/${key}.svg` : null;
};

const CITY_WIKI_TITLES: Record<string, { zh: string; en: string }> = {
  广州: { zh: '广州', en: 'Guangzhou' },
  深圳: { zh: '深圳', en: 'Shenzhen' },
  海口: { zh: '海口', en: 'Haikou' },
  杭州: { zh: '杭州', en: 'Hangzhou' },
  苏州: { zh: '苏州', en: 'Suzhou' },
  成都: { zh: '成都', en: 'Chengdu' },
  重庆: { zh: '重庆', en: 'Chongqing' },
  西安: { zh: '西安', en: "Xi'an" },
  昆明: { zh: '昆明', en: 'Kunming' },
  北京: { zh: '北京', en: 'Beijing' },
  青岛: { zh: '青岛', en: 'Qingdao' },
  大连: { zh: '大连', en: 'Dalian' },
  上海: { zh: '上海', en: 'Shanghai' },
  厦门: { zh: '厦门', en: 'Xiamen' },
  宁波: { zh: '宁波', en: 'Ningbo' },
};

const CITY_NETWORK_IMAGE_CACHE: Record<string, string | null> = {};

const fetchJsonWithTimeout = async (url: string, timeoutMs = 4200): Promise<any> => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
};

const pickImageUrl = (url?: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  if (!url.startsWith('http')) return null;
  return url;
};

const fetchWikiSummaryImage = async (lang: 'zh' | 'en', title: string): Promise<string | null> => {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const data = await fetchJsonWithTimeout(url);
  return pickImageUrl(data?.originalimage?.source) || pickImageUrl(data?.thumbnail?.source);
};

const fetchWikiPageImage = async (lang: 'zh' | 'en', title: string): Promise<string | null> => {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail|original&pithumbsize=1400&titles=${encodeURIComponent(title)}&origin=*`;
  const data = await fetchJsonWithTimeout(url);
  const pages = data?.query?.pages;
  if (!pages || typeof pages !== 'object') return null;
  const firstPage = Object.values(pages)[0] as any;
  return pickImageUrl(firstPage?.original?.source) || pickImageUrl(firstPage?.thumbnail?.source);
};

const resolveCityNetworkImage = async (city: string): Promise<string | null> => {
  if (Object.prototype.hasOwnProperty.call(CITY_NETWORK_IMAGE_CACHE, city)) {
    return CITY_NETWORK_IMAGE_CACHE[city];
  }
  const titles = CITY_WIKI_TITLES[city] || { zh: city, en: city };
  const resolvers = [
    () => fetchWikiSummaryImage('zh', titles.zh),
    () => fetchWikiSummaryImage('en', titles.en),
    () => fetchWikiPageImage('zh', titles.zh),
    () => fetchWikiPageImage('en', titles.en),
  ];
  for (const resolver of resolvers) {
    const image = await resolver();
    if (image) {
      CITY_NETWORK_IMAGE_CACHE[city] = image;
      return image;
    }
  }
  CITY_NETWORK_IMAGE_CACHE[city] = null;
  return null;
};

const STAR_TRAITS: Record<string, StarTrait> = {
  龙: {
    title: '龙系统帅型',
    subtitle: '高视角、强统筹，适合带队与资源整合。',
    imageKeyword: 'dragon sculpture chinese art',
    gradientClass: 'from-indigo-600/90 via-blue-600/80 to-cyan-500/75',
    traitA: '天生战略视角',
    traitB: '擅长调度复杂资源',
    traitC: '高压场景下决策力强',
  },
  虎: {
    title: '虎行动突击型',
    subtitle: '敢冲敢打，适合攻坚与高强度执行。',
    imageKeyword: 'tiger statue chinese style',
    gradientClass: 'from-orange-600/90 via-amber-600/80 to-yellow-500/75',
    traitA: '行动速度快',
    traitB: '边打边修正',
    traitC: '关键时刻扛压力',
  },
  狼: {
    title: '狼协同猎手型',
    subtitle: '团队联动能力强，擅长合围与协作推进。',
    imageKeyword: 'wolf sculpture art',
    gradientClass: 'from-slate-700/90 via-zinc-600/80 to-neutral-500/75',
    traitA: '组织默契敏锐',
    traitB: '目标导向明确',
    traitC: '执行纪律稳定',
  },
  狐: {
    title: '狐洞察策略型',
    subtitle: '善观察、重策略，适合策划和破局。',
    imageKeyword: 'fox sculpture minimal',
    gradientClass: 'from-rose-600/90 via-pink-600/80 to-fuchsia-500/75',
    traitA: '细节感知敏锐',
    traitB: '策略切换灵活',
    traitC: '擅长低成本试错',
  },
  鹿: {
    title: '鹿疗愈连接型',
    subtitle: '关系感强，适合连接资源与建立信任。',
    imageKeyword: 'deer sculpture forest',
    gradientClass: 'from-emerald-600/90 via-green-600/80 to-lime-500/75',
    traitA: '共情能力强',
    traitB: '关系经营细腻',
    traitC: '适合长期合作场域',
  },
  马: {
    title: '马远征开拓型',
    subtitle: '持续奔跑，适合扩张与新市场探索。',
    imageKeyword: 'horse statue modern',
    gradientClass: 'from-red-600/90 via-orange-600/80 to-amber-500/75',
    traitA: '行动持续性强',
    traitB: '敢于开新路径',
    traitC: '节奏转换快',
  },
  牛: {
    title: '牛稳盘建设型',
    subtitle: '稳健扎实，适合打底层系统和长期工程。',
    imageKeyword: 'ox sculpture bronze',
    gradientClass: 'from-stone-700/90 via-amber-700/80 to-yellow-700/75',
    traitA: '耐力与韧性强',
    traitB: '可持续推进',
    traitC: '擅长长期复利',
  },
  燕: {
    title: '燕传播轻盈型',
    subtitle: '传播效率高，适合内容与社交扩散。',
    imageKeyword: 'swallow bird illustration art',
    gradientClass: 'from-sky-600/90 via-cyan-600/80 to-blue-500/75',
    traitA: '表达轻快清晰',
    traitB: '连接速度快',
    traitC: '适合品牌传播',
  },
  猴: {
    title: '猴创新实验型',
    subtitle: '好奇心强，擅长快速迭代与创意验证。',
    imageKeyword: 'monkey sculpture creative',
    gradientClass: 'from-violet-600/90 via-purple-600/80 to-indigo-500/75',
    traitA: '创意产出密集',
    traitB: '试错速度快',
    traitC: '跨领域迁移强',
  },
  蛇: {
    title: '蛇深潜专研型',
    subtitle: '耐心专注，适合复杂问题拆解与深度研究。',
    imageKeyword: 'snake sculpture art',
    gradientClass: 'from-emerald-700/90 via-teal-700/80 to-cyan-700/75',
    traitA: '专注度高',
    traitB: '洞察链路深',
    traitC: '擅长慢变量布局',
  },
};

const FALLBACK_STAR_TRAIT: StarTrait = {
  title: '星宿原型',
  subtitle: '你的人格原型偏向“稳中求进 + 周期复利”。',
  imageKeyword: 'chinese guardian sculpture',
  gradientClass: 'from-ink-700/90 via-ink-600/80 to-ink-500/75',
  traitA: '节律感强',
  traitB: '注重长期路径',
  traitC: '能在变化中保持稳定',
};

const TYME_TWENTY_EIGHT_STARS = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '牛', '女', '虚', '危', '室', '壁', '奎', '娄', '胃', '昴', '毕', '觜', '参', '井', '鬼', '柳', '星', '张', '翼', '轸'];
const TYME_TWENTY_EIGHT_ANIMALS = ['蛟', '龙', '貉', '兔', '狐', '虎', '豹', '獬', '牛', '蝠', '鼠', '燕', '猪', '獝', '狼', '狗', '彘', '鸡', '乌', '猴', '猿', '犴', '羊', '獐', '马', '鹿', '蛇', '蚓'];
const TYME_TWENTY_EIGHT_LUCK = [0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0];
const TYME_TWENTY_EIGHT_LAND_INDEX = [4, 4, 4, 2, 2, 2, 7, 7, 7, 0, 0, 0, 0, 5, 5, 5, 6, 6, 6, 1, 1, 1, 8, 8, 8, 3, 3, 3];
const TYME_WEEK_BASE_INDEX = [10, 18, 26, 6, 14, 22, 2];
const TYME_ZONE_NAMES = ['东', '北', '西', '南'];
const TYME_BEAST_NAMES = ['青龙', '玄武', '白虎', '朱雀'];
const TYME_LAND_NAMES = ['玄天', '朱天', '苍天', '阳天', '钧天', '幽天', '颢天', '变天', '炎天'];
const TYME_DIRECTION_NAMES = ['北', '西南', '东', '东南', '中', '西北', '西', '东北', '南'];
const TYME_SEVEN_STAR_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
const TYME_DAY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STAR_ANIMAL_TRAIT_ALIAS: Record<string, string> = {
  蛟: '龙',
  貉: '狼',
  兔: '鹿',
  豹: '虎',
  獬: '牛',
  蝠: '燕',
  鼠: '猴',
  猪: '牛',
  獝: '狼',
  狗: '狼',
  彘: '牛',
  鸡: '燕',
  乌: '燕',
  猿: '猴',
  犴: '虎',
  羊: '鹿',
  獐: '鹿',
  蚓: '蛇',
};

const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, value));

const toNumeric = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const positiveMod = (value: number, base: number): number => ((value % base) + base) % base;

const trendToText = (trend: StageInsight['trend']): string => {
  if (trend === 'up') return '上行';
  if (trend === 'down') return '回撤';
  return '平稳';
};

const heatColor = (value: number): string => {
  const safe = clamp(value);
  const hue = Math.round((safe / 100) * 120);
  const lightness = Math.round(96 - safe * 0.36);
  return `hsl(${hue} 72% ${lightness}%)`;
};

const LIFE_MASTER_NUMBERS = new Set([11, 22, 33]);
const LIFE_NUMBER_MAP: Record<number, LifeNumberInterpretation> = {
  1: {
    title: '开创者',
    subtitle: '主驱动力强，擅长发起与破局。',
    keywords: ['独立', '行动', '领导'],
    strengths: ['目标感清晰，敢于率先尝试', '在不确定环境中具备推进力'],
    challenge: '容易单兵推进过快，忽略协作节奏。',
    advice: '重大决策前加入一轮外部反馈，可显著降低试错成本。',
  },
  2: {
    title: '协调者',
    subtitle: '关系敏感度高，擅长协同与润滑。',
    keywords: ['协作', '平衡', '共情'],
    strengths: ['能听见他人需求，维护长期关系', '适合跨团队连接与沟通'],
    challenge: '容易因顾全他人而延迟关键决断。',
    advice: '为自己设置明确截止时间，避免反复犹豫。',
  },
  3: {
    title: '表达者',
    subtitle: '创意和表达能力突出，适合内容与传播。',
    keywords: ['创意', '表达', '感染力'],
    strengths: ['语言与内容输出效率高', '能够把复杂问题讲清楚'],
    challenge: '兴趣点分散时，容易阶段性跳题。',
    advice: '采用“主题季”方式聚焦一个核心方向，成果更快显现。',
  },
  4: {
    title: '建设者',
    subtitle: '结构化能力强，重秩序与可持续。',
    keywords: ['结构', '纪律', '执行'],
    strengths: ['稳定推进长期工程', '善于搭建规则和流程'],
    challenge: '在变化场景里可能过于保守。',
    advice: '在稳态方案外保留 10%-20% 的试验空间。',
  },
  5: {
    title: '探索者',
    subtitle: '适应变化快，偏好自由与新鲜机会。',
    keywords: ['变化', '探索', '适应'],
    strengths: ['转场能力强，擅长抓新机会', '在高变化环境有表现'],
    challenge: '节奏过快时，容易忽略长期沉淀。',
    advice: '每个阶段保留“可复利资产”（作品、方法、关系）。',
  },
  6: {
    title: '守护者',
    subtitle: '责任心强，重承诺与稳定关系。',
    keywords: ['责任', '照顾', '稳定'],
    strengths: ['能在团队中建立信任与安全感', '适合长期服务型角色'],
    challenge: '容易过度承担，形成情绪或精力透支。',
    advice: '明确责任边界，先稳住自我节律再去支援他人。',
  },
  7: {
    title: '研究者',
    subtitle: '洞察深，偏好独立思考与系统研究。',
    keywords: ['洞察', '分析', '深度'],
    strengths: ['擅长拆解复杂问题', '学习与研究深度领先'],
    challenge: '对外表达不足时，价值难被看见。',
    advice: '把研究结果产品化，形成可复用输出。',
  },
  8: {
    title: '掌舵者',
    subtitle: '资源整合与结果导向明显，商业感强。',
    keywords: ['资源', '管理', '结果'],
    strengths: ['目标执行与资源调度能力强', '适合经营与管理岗位'],
    challenge: '过度追求效率时，可能压缩关系温度。',
    advice: '在结果指标外加入“关系质量指标”，长期更稳。',
  },
  9: {
    title: '理想者',
    subtitle: '格局感强，重价值与影响力。',
    keywords: ['愿景', '利他', '影响'],
    strengths: ['容易在公共议题中形成号召力', '善于整合不同背景人群'],
    challenge: '理想过高时，容易忽略落地细节。',
    advice: '先做最小可行版本，再逐步扩展影响范围。',
  },
  11: {
    title: '灵感放大者（主数11）',
    subtitle: '直觉与启发能力强，适合启蒙与引导。',
    keywords: ['直觉', '启发', '感召'],
    strengths: ['感知力强，能识别趋势', '适合引导型表达和创作'],
    challenge: '情绪波动与压力敏感度通常更高。',
    advice: '建立稳定作息与情绪复位机制，保证灵感可持续。',
  },
  22: {
    title: '宏图建造者（主数22）',
    subtitle: '能把大愿景转化为系统工程。',
    keywords: ['愿景落地', '系统', '规模化'],
    strengths: ['兼具格局与执行，可做大项目', '擅长从0到1再到规模化'],
    challenge: '目标过大时会带来持续高压。',
    advice: '把大目标拆成阶段里程碑，保证每段有可见成果。',
  },
  33: {
    title: '服务引导者（主数33）',
    subtitle: '责任与影响并重，适合教练和赋能角色。',
    keywords: ['服务', '教导', '疗愈'],
    strengths: ['对人有稳定支持力', '能把经验转为方法帮助他人'],
    challenge: '容易把他人问题长期背在自己身上。',
    advice: '建立“可持续帮助”机制，避免长期透支。',
  },
};

const LIFE_FALLBACK: LifeNumberInterpretation = {
  title: '平衡者',
  subtitle: '当前命局需要在增长与稳定之间找节律。',
  keywords: ['节律', '平衡', '复利'],
  strengths: ['具备阶段性适应能力'],
  challenge: '路径不清晰时容易分散投入。',
  advice: '用季度目标管理投入方向，先做关键20%。',
};

const PERSONAL_YEAR_MAP: Record<number, { theme: string; focus: string; caution: string }> = {
  1: { theme: '开局年', focus: '适合启动新项目、重设目标与身份升级。', caution: '避免三线并行，先做最关键的一件事。' },
  2: { theme: '协作年', focus: '适合结盟、打磨关系、积累信任与支持系统。', caution: '避免急推结果，重视节奏与耐心。' },
  3: { theme: '表达年', focus: '适合内容发布、演讲传播、品牌曝光与社交扩展。', caution: '避免分心过多，保持主题一致性。' },
  4: { theme: '筑基年', focus: '适合制度化、流程建设、能力打底与长期架构。', caution: '避免僵化保守，保留试验窗口。' },
  5: { theme: '转折年', focus: '适合转型、迁移、试新路径与市场探索。', caution: '避免冲动跳跃，先设风险边界。' },
  6: { theme: '责任年', focus: '适合家庭、团队与长期关系经营，强化承诺。', caution: '避免过度承担导致精力透支。' },
  7: { theme: '沉淀年', focus: '适合研究学习、复盘升级、战略思考与内功建设。', caution: '避免封闭独行，定期对外反馈。' },
  8: { theme: '收获年', focus: '适合冲刺业绩、资源整合、晋升与商业化放大。', caution: '避免唯结果导向，兼顾关系质量。' },
  9: { theme: '清算年', focus: '适合收尾、断舍离、完成旧周期并准备新起点。', caution: '避免执着旧结构，及时放手升级。' },
};

const LIFE_COMPATIBILITY_MAP: Record<number, string> = {
  1: '偏好高自主与高效率协作，适合目标明确的搭档。',
  2: '重关系与默契，适合长期陪跑型合作与伴侣关系。',
  3: '重沟通与表达，适合创意共创和传播型协作。',
  4: '重规则与稳定，适合流程清晰、长期主义团队。',
  5: '重变化与空间，适合弹性机制和探索型角色。',
  6: '重责任与承诺，适合共担型关系与服务型团队。',
  7: '重认知深度，适合研究型、专业型合作关系。',
  8: '重结果与资源，适合经营管理与商业目标团队。',
  9: '重价值与影响，适合公益导向与使命驱动协作。',
};

const TALENT_NUMBER_MAP: Record<number, TalentInterpretation> = {
  1: { title: '先驱天赋', summary: '天生偏向主动开局，遇到空白场景会先行动。', leverage: '把开局能力用于新课题切入，但给自己设置阶段复盘点。' },
  2: { title: '协调天赋', summary: '擅长感知关系变化，能够润滑冲突与协作摩擦。', leverage: '在关键决策前收敛意见，再给出明确结论与节奏。' },
  3: { title: '表达天赋', summary: '有自然表达欲与内容组织能力，适合传播与创作。', leverage: '围绕固定主题持续输出，避免频繁跳题。' },
  4: { title: '结构天赋', summary: '偏好秩序、流程与可执行方案，稳定性强。', leverage: '在稳定框架中保留少量试验窗口，提高适应变化能力。' },
  5: { title: '变化天赋', summary: '对新机会敏感，转场与适应能力突出。', leverage: '每次转向都沉淀可复用资产，减少重复试错。' },
  6: { title: '照拂天赋', summary: '责任感高，容易在关系与团队中承担关键支持角色。', leverage: '先划清边界再承诺，帮助才能长期可持续。' },
  7: { title: '研究天赋', summary: '擅长拆解复杂问题，独立思考与深度学习优势明显。', leverage: '把洞察转成模板、课程或工具，提升外部可见度。' },
  8: { title: '经营天赋', summary: '资源整合和结果导向突出，适合经营与管理。', leverage: '在结果指标外增加关系质量指标，避免组织摩擦。' },
  9: { title: '愿景天赋', summary: '价值感和使命感强，关注长期影响。', leverage: '先做最小可行行动，再扩大影响半径。' },
};

const LIFE_NUMBER_DEEP_MAP: Record<number, LifeNumberDeepProfile> = {
  1: {
    role: '开路者',
    workStyle: '偏好主导推进，适合从0到1开局。',
    relationshipStyle: '重效率与目标一致性，需要被尊重自主空间。',
    growthTask: '从“我来做”升级为“带着团队做”。',
    cautionSignals: ['急于定论', '不愿求助', '过快切换方向'],
    actionTips: ['重大决策前引入外部反馈', '把目标拆成可验证里程碑'],
  },
  2: {
    role: '调和者',
    workStyle: '擅长协同与支持，能稳定团队氛围。',
    relationshipStyle: '重默契与情感安全，适合长期关系经营。',
    growthTask: '在照顾他人的同时保持自我边界。',
    cautionSignals: ['过度迁就', '回避冲突', '决策拖延'],
    actionTips: ['明确决策截止时间', '先说需求再谈妥协'],
  },
  3: {
    role: '表达者',
    workStyle: '内容组织与传播能力强，适合对外沟通。',
    relationshipStyle: '重交流与共鸣，喜欢高频互动。',
    growthTask: '从灵感驱动走向主题化深耕。',
    cautionSignals: ['兴趣分散', '执行断档', '短期兴奋后降温'],
    actionTips: ['建立固定输出频率', '每季只攻一个主线主题'],
  },
  4: {
    role: '建设者',
    workStyle: '结构化与执行稳定，适合中长期系统搭建。',
    relationshipStyle: '重承诺与可靠性，偏好可预期协作。',
    growthTask: '在稳态之外保留弹性应变能力。',
    cautionSignals: ['路径依赖', '过度保守', '抗拒变化'],
    actionTips: ['保留10%-20%试验配额', '每月复盘一次流程效率'],
  },
  5: {
    role: '探索者',
    workStyle: '适应快，能在变化中找到机会。',
    relationshipStyle: '需要空间与新鲜感，不喜欢高控制关系。',
    growthTask: '把变化转化为长期复利资产。',
    cautionSignals: ['频繁跳轨', '承诺中断', '目标漂移'],
    actionTips: ['每次转向先设退出条件', '用项目复盘锁定有效打法'],
  },
  6: {
    role: '守护者',
    workStyle: '责任心强，适合服务型与长期陪跑场景。',
    relationshipStyle: '重家庭与团队责任，愿意长期投入。',
    growthTask: '避免“过度付出”导致能量透支。',
    cautionSignals: ['替他人背责', '忽视自身需求', '情绪积压'],
    actionTips: ['建立责任边界清单', '先安排自我恢复再扩展支持'],
  },
  7: {
    role: '研究者',
    workStyle: '善分析、善洞察，适合研究和复杂问题攻坚。',
    relationshipStyle: '重精神共鸣与认知质量，不喜表面社交。',
    growthTask: '让深度价值被看见并转化为影响力。',
    cautionSignals: ['闭门思考过久', '输出不足', '完美主义拖延'],
    actionTips: ['固定对外表达窗口', '用产品化方式输出研究成果'],
  },
  8: {
    role: '掌舵者',
    workStyle: '经营视角强，擅长资源整合和结果推进。',
    relationshipStyle: '重责任与兑现，偏好高质量合作伙伴。',
    growthTask: '平衡效率、关系与可持续增长。',
    cautionSignals: ['过度结果导向', '控制欲偏高', '忽略情绪成本'],
    actionTips: ['并行追踪关系健康指标', '把权责和回报机制写清楚'],
  },
  9: {
    role: '理想者',
    workStyle: '格局感强，擅长价值叙事与跨群体整合。',
    relationshipStyle: '重意义与价值一致性，容易情感投入深。',
    growthTask: '在理想与落地之间建立执行桥梁。',
    cautionSignals: ['目标过大', '执行细节缺位', '过度消耗同理心'],
    actionTips: ['从最小可行行动起步', '给每个理想配置明确落地路径'],
  },
  11: {
    role: '灵感放大者（主数11）',
    workStyle: '直觉敏锐，适合启发式表达与方向洞察。',
    relationshipStyle: '共情高、感受深，关系质量对状态影响明显。',
    growthTask: '把灵感转为可复用方法，避免只停留在感觉层。',
    cautionSignals: ['情绪波动', '能量透支', '阶段性迷茫'],
    actionTips: ['维持稳定作息', '将洞察转成明确行动列表'],
  },
  22: {
    role: '宏图建造者（主数22）',
    workStyle: '兼具愿景与执行，擅长系统工程与规模化落地。',
    relationshipStyle: '偏好高目标同盟，重长期共识与执行力。',
    growthTask: '将巨大目标拆解成可持续迭代节奏。',
    cautionSignals: ['目标过重', '长期高压', '忽略阶段庆祝'],
    actionTips: ['建立分段里程碑', '每阶段保留恢复与校准周期'],
  },
  33: {
    role: '服务引导者（主数33）',
    workStyle: '擅长赋能、教导与长期支持体系搭建。',
    relationshipStyle: '有强责任感与照拂倾向，愿意成就他人。',
    growthTask: '在服务他人的同时保护自身边界和节律。',
    cautionSignals: ['过度承担', '情感透支', '忽略自我成长'],
    actionTips: ['建立可持续助人机制', '定期回收精力与关注自我成长'],
  },
};

const LIFE_NUMBER_EXPANDED_MAP: Record<number, LifeNumberExpandedGuide> = {
  1: {
    coreMotif: '以行动定义身份，先发优势是主旋律。',
    growthArc: '从“单兵冲刺”升级到“授权协作+稳定复盘”。',
    careerHints: ['适配开疆、业务拓新、项目0-1', '关键节点以结果牵引团队节奏'],
    relationshipHints: ['表达需求要先于表达判断', '在关系中保留对方参与感'],
    moneyHints: ['收入增长来自主动抢位', '避免情绪化重仓与冲动扩张'],
    practicePlan: ['每周一次决策复盘', '每个项目设置二号位', '重大动作前做风险清单'],
  },
  2: {
    coreMotif: '关系质量决定资源质量，协同能力是核心资产。',
    growthArc: '从“维持和谐”升级为“共识后快速决断”。',
    careerHints: ['适配协调、PM、客户成功、组织连接角色', '用流程固化协同价值'],
    relationshipHints: ['建立“冲突可沟通”机制', '避免长期压抑真实诉求'],
    moneyHints: ['稳健增长优于激进博弈', '合作项目要先写清分工与收益'],
    practicePlan: ['每月一次关系盘点', '关键合作先写预期', '训练边界表达句式'],
  },
  3: {
    coreMotif: '表达即生产力，内容能见度决定机会密度。',
    growthArc: '从“灵感驱动”升级为“主题化持续输出”。',
    careerHints: ['适配内容、品牌、教育、传播', '把表达沉淀成可复用资产'],
    relationshipHints: ['高频沟通要配套稳定兑现', '减少情绪化放大与话题漂移'],
    moneyHints: ['收入来自影响力与转化率', '避免只重曝光不重闭环'],
    practicePlan: ['建立周更输出机制', '固定一个主话题季度深耕', '每次复盘关注转化数据'],
  },
  4: {
    coreMotif: '秩序与结构创造长期复利。',
    growthArc: '从“稳”升级为“稳中可变、可迭代”。',
    careerHints: ['适配工程、运营、财务、流程管理', '擅长搭建标准化系统'],
    relationshipHints: ['承诺是优势，但需减少控制感', '允许关系中有弹性与不完美'],
    moneyHints: ['资产积累能力强，适合长期配置', '防止过度保守错过窗口'],
    practicePlan: ['给计划预留10%试验位', '每季度升级一次流程', '建立风险-收益双指标'],
  },
  5: {
    coreMotif: '变化中寻找窗口，机动性是核心竞争力。',
    growthArc: '从“多线探索”升级为“探索后快速收敛”。',
    careerHints: ['适配增长、销售、跨界、国际化', '机会识别与转场能力突出'],
    relationshipHints: ['需要空间感与新鲜感', '重要关系要补足稳定投入'],
    moneyHints: ['现金流波动较大，需纪律化管理', '避免连续冲动决策'],
    practicePlan: ['每次转向先定退出条件', '建立现金流安全垫', '每月沉淀一份复盘模板'],
  },
  6: {
    coreMotif: '责任与照拂驱动价值，长期信任是底盘。',
    growthArc: '从“过度承担”升级为“有边界的高质量承担”。',
    careerHints: ['适配教育、服务、HR、长期客户经营', '组织中的稳定器角色明显'],
    relationshipHints: ['重承诺与家庭议题', '避免把“付出”当成唯一语言'],
    moneyHints: ['偏向稳健守成，需增强进攻预算', '人情支出要可量化'],
    practicePlan: ['先安排恢复再安排责任', '建立拒绝清单', '每月一次个人能量审计'],
  },
  7: {
    coreMotif: '认知深度决定人生上限，洞察是核心杠杆。',
    growthArc: '从“深度思考”升级为“深度输出与影响扩散”。',
    careerHints: ['适配研究、策略、咨询、专业技术', '复杂问题拆解能力强'],
    relationshipHints: ['重精神共鸣，反感低质量社交', '需主动表达情绪与需求'],
    moneyHints: ['长期高价值专业化可增收', '避免因谨慎错失兑现窗口'],
    practicePlan: ['固定公开输出节奏', '研究结论产品化', '每月建立一个可复用模型'],
  },
  8: {
    coreMotif: '资源配置与结果兑现，经营能力是主线。',
    growthArc: '从“效率优先”升级为“效率与关系并重”。',
    careerHints: ['适配管理、经营、投资、商业拓展', '在资源调度上具优势'],
    relationshipHints: ['重目标一致，需注意情感温度', '沟通中减少指令化表达'],
    moneyHints: ['财富放大潜力高，风险同样放大', '注意杠杆和周期拐点'],
    practicePlan: ['并行追踪业绩与关系指标', '重仓前做压力测试', '每季度做一次战略收缩'],
  },
  9: {
    coreMotif: '价值与意义驱动，影响力大于控制力。',
    growthArc: '从“理想驱动”升级为“理想可执行”。',
    careerHints: ['适配公益、教育、内容、社会价值型事业', '擅长跨群体整合'],
    relationshipHints: ['共情力强但边界易弱', '注意不替他人人生负责'],
    moneyHints: ['收益波动与使命投入相关', '避免理想叙事替代财务纪律'],
    practicePlan: ['把理想拆成季度目标', '每项投入设置衡量指标', '定期做情绪与财务双复盘'],
  },
  11: {
    coreMotif: '高敏锐直觉与启发能力，方向感是天赋。',
    growthArc: '从“灵感涌现”升级为“灵感系统化交付”。',
    careerHints: ['适配创作、启发式教学、趋势判断', '需要稳定节律承载高感知'],
    relationshipHints: ['对关系质量高度敏感', '需要稳定边界保护能量'],
    moneyHints: ['价值兑现依赖长期作品积累', '避免情绪高波动下决策'],
    practicePlan: ['保持固定作息', '灵感当日转行动项', '每周一次低刺激恢复日'],
  },
  22: {
    coreMotif: '宏图愿景与系统落地并存，能做大工程。',
    growthArc: '从“大目标高压”升级为“里程碑式稳定推进”。',
    careerHints: ['适配平台型业务、组织搭建、复杂系统建设', '擅长长期项目统筹'],
    relationshipHints: ['偏好高共识高执行伙伴', '需避免目标压倒关系温度'],
    moneyHints: ['可形成规模化成果', '需防“长期重投入”导致现金流紧张'],
    practicePlan: ['拆分季度里程碑', '阶段性庆祝与修整', '每月做一次资源再平衡'],
  },
  33: {
    coreMotif: '服务与引导并重，以成就他人为价值来源。',
    growthArc: '从“过度奉献”升级为“可持续赋能体系”。',
    careerHints: ['适配教练、咨询、组织发展、长期陪跑', '方法沉淀能力关键'],
    relationshipHints: ['有稳定托举力', '需避免情感透支与责任上瘾'],
    moneyHints: ['长期口碑可形成复利', '要避免只付出不定价'],
    practicePlan: ['建立服务边界和定价', '固定充电窗口', '把经验沉淀成标准方法'],
  },
};

const sumDigits = (value: number): number =>
  Math.abs(value)
    .toString()
    .split('')
    .reduce((sum, char) => sum + Number(char || 0), 0);

const reduceWithMasters = (value: number): number => {
  let current = Math.max(0, Math.trunc(value));
  while (current > 9 && !LIFE_MASTER_NUMBERS.has(current)) {
    current = sumDigits(current);
  }
  return current;
};

const reduceToSingleDigit = (value: number): number => {
  let current = Math.max(0, Math.trunc(value));
  while (current > 9) {
    current = sumDigits(current);
  }
  return current;
};

const buildLifeNumberInsight = (birthProfile?: BirthProfile): LifeNumberInsight | null => {
  if (!birthProfile) return null;
  const year = Number(birthProfile.year);
  const month = Number(birthProfile.month);
  const day = Number(birthProfile.day);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  const monthPart = reduceToSingleDigit(month);
  const dayPart = reduceToSingleDigit(day);
  const yearPart = reduceToSingleDigit(year);
  const combined = monthPart + dayPart + yearPart;
  const talentNumber = reduceToSingleDigit(combined);
  const lifeValue = reduceWithMasters(combined);
  const masterPreserved = LIFE_MASTER_NUMBERS.has(lifeValue);
  const valueLabel = LIFE_MASTER_NUMBERS.has(lifeValue) ? `${lifeValue}（主数）` : `${lifeValue}`;
  const interpretation = LIFE_NUMBER_MAP[lifeValue] || LIFE_FALLBACK;

  return {
    birthDateText: `${year}年${month}月${day}日`,
    componentTraceText: `${month} → ${monthPart}（月），${day} → ${dayPart}（日），${year} → ${yearPart}（年）`,
    traceText: `${monthPart}（月） + ${dayPart}（日） + ${yearPart}（年） = ${combined} → ${valueLabel}`,
    talentNumber,
    talentTraceText: `${monthPart} + ${dayPart} + ${yearPart} = ${combined} → ${talentNumber}`,
    monthBase: monthPart,
    dayBase: dayPart,
    yearBase: yearPart,
    value: lifeValue,
    valueLabel,
    masterPreserved,
    interpretation,
  };
};

const buildPersonalYearInsight = (birthProfile: BirthProfile | undefined, targetYear: number): PersonalYearInsight | null => {
  if (!birthProfile || !Number.isFinite(targetYear)) return null;
  const month = Number(birthProfile.month);
  const day = Number(birthProfile.day);
  if (!Number.isFinite(month) || !Number.isFinite(day)) return null;

  const birthMdReduced = reduceToSingleDigit(month) + reduceToSingleDigit(day);
  const yearReduced = reduceToSingleDigit(targetYear);
  const value = reduceToSingleDigit(birthMdReduced + yearReduced);
  const detail = PERSONAL_YEAR_MAP[value] || PERSONAL_YEAR_MAP[1];

  return {
    targetYear,
    birthMdReduced,
    yearReduced,
    value,
    traceText: `(${reduceToSingleDigit(month)} + ${reduceToSingleDigit(day)}) + ${yearReduced} = ${birthMdReduced + yearReduced} → ${value}`,
    theme: detail.theme,
    focus: detail.focus,
    caution: detail.caution,
  };
};

const inferElement = (analysis: AnalysisData): ElementInsight => {
  const content = [
    analysis.summary,
    analysis.personality,
    analysis.industry,
    analysis.fengShui,
    analysis.wealth,
    analysis.marriage,
    analysis.health,
    analysis.family,
  ].join(' ');

  const directPatterns = [/喜[用神]?([木火土金水])/, /宜([木火土金水])/, /有利于([木火土金水])/, /补([木火土金水])/];
  for (const pattern of directPatterns) {
    const match = content.match(pattern);
    if (match?.[1]) {
      const element = match[1] as FiveElement;
      const direction = element === '火' ? '南方' : element === '水' ? '北方' : element === '木' ? '东南' : element === '金' ? '西方' : '中部';
      return { element, direction, confidence: 'high', rationale: `文本中出现明确偏好：${element}，建议优先关注 ${direction} 城市。` };
    }
  }

  const count: Record<FiveElement, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const pillar of analysis.bazi) {
    const chars = Array.from((pillar || '').trim());
    const stem = chars[0];
    const branch = chars[1];
    if (stem && STEM_TO_ELEMENT[stem]) count[STEM_TO_ELEMENT[stem]] += 1;
    if (branch && BRANCH_TO_ELEMENT[branch]) count[BRANCH_TO_ELEMENT[branch]] += 1;
  }
  const minCount = Math.min(...Object.values(count));
  const element = (Object.keys(count) as FiveElement[]).find((key) => count[key] === minCount) ?? '火';
  const direction = element === '火' ? '南方' : element === '水' ? '北方' : element === '木' ? '东南' : element === '金' ? '西方' : '中部';
  return { element, direction, confidence: 'medium', rationale: `按四柱五行计数推断：${element} 相对偏弱，可优先采用“补弱项”策略。` };
};

const derivePoints = (data: KLinePoint[], analysis: AnalysisData): DerivedPoint[] => {
  const baseWealth = toNumeric(analysis.wealthScore, 5) * 10;
  const baseHealth = toNumeric(analysis.healthScore, 5) * 10;
  const baseLove = toNumeric(analysis.marriageScore, 5) * 10;
  const baseCareer = toNumeric(analysis.industryScore, 5) * 10;
  const baseVitality = toNumeric(analysis.summaryScore, 5) * 10;

  return data.map((point) => {
    const score = toNumeric(point.score, 50);
    const open = toNumeric(point.open, score);
    const close = toNumeric(point.close, score);
    const high = toNumeric(point.high, score);
    const low = toNumeric(point.low, score);
    const drift = score - 50;
    const momentum = close - open;
    const volatility = Math.max(1, high - low);

    return {
      ...point,
      score,
      open,
      close,
      high,
      low,
      wealth: clamp(baseWealth + drift * 0.78 + momentum * 0.9),
      health: clamp(baseHealth + drift * 0.42 - volatility * 0.22 + (low > 55 ? 4 : 0)),
      love: clamp(baseLove + drift * 0.52 + (close >= open ? 3 : -2)),
      career: clamp(baseCareer + drift * 0.74 + (high >= 75 ? 5 : 0)),
      vitality: clamp(baseVitality + drift * 0.6 - Math.max(0, 50 - low) * 0.18),
    };
  });
};

const buildStageInsights = (points: DerivedPoint[]): StageInsight[] => {
  const stages: StageInsight[] = [];
  for (let startAge = 1; startAge <= 100; startAge += 10) {
    const endAge = Math.min(startAge + 9, 100);
    const bucket = points.filter((item) => item.age >= startAge && item.age <= endAge);
    if (!bucket.length) continue;

    const avgScore = Math.round(bucket.reduce((sum, item) => sum + item.score, 0) / bucket.length);
    const wealth = Math.round(bucket.reduce((sum, item) => sum + item.wealth, 0) / bucket.length);
    const health = Math.round(bucket.reduce((sum, item) => sum + item.health, 0) / bucket.length);
    const love = Math.round(bucket.reduce((sum, item) => sum + item.love, 0) / bucket.length);
    const career = Math.round(bucket.reduce((sum, item) => sum + item.career, 0) / bucket.length);
    const vitality = Math.round(bucket.reduce((sum, item) => sum + item.vitality, 0) / bucket.length);
    const first = bucket[0];
    const last = bucket[bucket.length - 1];
    const delta = last.score - first.score;
    const trend: StageInsight['trend'] = delta > 4 ? 'up' : delta < -4 ? 'down' : 'flat';

    stages.push({
      startAge,
      endAge,
      label: `${startAge}-${endAge}岁`,
      avgScore,
      peak: Math.max(...bucket.map((item) => item.score)),
      low: Math.min(...bucket.map((item) => item.score)),
      wealth,
      health,
      love,
      career,
      vitality,
      trend,
      note: `主轴偏${wealth >= career ? '财富' : '事业'}，短板偏${health <= love ? '健康' : '关系'}。`,
    });
  }
  return stages;
};

const buildNarrativeChapters = (
  stages: StageInsight[],
  analysis: AnalysisData,
  elementInsight: ElementInsight,
  citySuggestions: CitySuggestion[],
): NarrativeChapter[] => {
  const peakStage = [...stages].sort((a, b) => b.avgScore - a.avgScore)[0] ?? stages[0];
  const riskStage = [...stages]
    .map((stage) => ({
      ...stage,
      riskScore: Math.round((100 - stage.health) * 0.4 + (100 - stage.love) * 0.35 + (100 - stage.vitality) * 0.25),
    }))
    .sort((a, b) => b.riskScore - a.riskScore)[0] ?? stages[0];
  const earlyStage = stages[0];
  const lateStage = stages[stages.length - 1];
  const mainCity = citySuggestions[0];

  return [
    {
      id: 'chapter-origin',
      title: '序章 · 命局底色',
      subtitle: '命局基础与早期路径',
      analysisText: `命盘呈现“${analysis.personality || '稳定节奏'}”的行为偏好。${earlyStage?.label ?? '前十年'}是底层能力与边界感建立期。`,
      punchline: `底色关键词：${elementInsight.element}势补位 + ${elementInsight.direction}场域加成`,
      scoreLabel: '开局能量',
      scoreValue: earlyStage?.avgScore ?? 50,
      focusAge: Math.round(((earlyStage?.startAge ?? 1) + (earlyStage?.endAge ?? 10)) / 2),
      backgroundClass: 'from-seal/90 via-wood/80 to-amber-600/70',
    },
    {
      id: 'chapter-rise',
      title: '高光 · 增长窗口',
      subtitle: '命运曲线抬升最快的时段',
      analysisText: `${peakStage?.label ?? '中段'}资源聚合度更高，财富与事业呈协同放大，属于“攻坚可见回报”的关键增长窗口。`,
      punchline: `建议策略：主攻 ${peakStage?.wealth >= peakStage?.career ? '财富布局' : '事业升级'}，趋势 ${trendToText(peakStage?.trend ?? 'flat')}`,
      scoreLabel: '峰值评分',
      scoreValue: peakStage?.peak ?? 60,
      focusAge: Math.round(((peakStage?.startAge ?? 1) + (peakStage?.endAge ?? 10)) / 2),
      backgroundClass: 'from-emerald-700/90 via-teal-600/80 to-cyan-600/70',
    },
    {
      id: 'chapter-risk',
      title: '暗流 · 风险窗口',
      subtitle: '把短板补齐，剧本会更顺',
      analysisText: `${riskStage?.label ?? '某段周期'}呈现“高压与内耗并存”特征，应优先修复${riskStage?.health <= riskStage?.love ? '健康节律' : '关系质量'}，避免透支。`,
      punchline: `关键提醒：健康 ${riskStage?.health ?? 0} / 恋情 ${riskStage?.love ?? 0} / 活力 ${riskStage?.vitality ?? 0}`,
      scoreLabel: '风险指数',
      scoreValue: Math.max(0, 100 - (riskStage?.health ?? 50)),
      focusAge: Math.round(((riskStage?.startAge ?? 1) + (riskStage?.endAge ?? 10)) / 2),
      backgroundClass: 'from-rose-700/90 via-red-600/80 to-orange-600/70',
    },
    {
      id: 'chapter-scene',
      title: '远景 · 场域选择',
      subtitle: '环境会决定你增益的上限',
      analysisText: `当活动重心向${elementInsight.direction}迁移时，势能更容易被激活。若以${mainCity?.city ?? '目标城市'}为落点，整体主线更接近“长期稳态增长”。`,
      punchline: `首选城市：${mainCity?.city ?? '待定'} · ${mainCity?.landmark ?? '地标待定'}`,
      scoreLabel: '远期续航',
      scoreValue: lateStage?.vitality ?? 55,
      focusAge: Math.round(((lateStage?.startAge ?? 91) + (lateStage?.endAge ?? 100)) / 2),
      backgroundClass: 'from-indigo-700/90 via-blue-700/80 to-sky-600/70',
    },
  ];
};

const buildStarProfile = (birthProfile?: BirthProfile): StarProfile | null => {
  if (!birthProfile) return null;
  const year = toNumeric(birthProfile.year, NaN);
  const month = toNumeric(birthProfile.month, NaN);
  const day = toNumeric(birthProfile.day, NaN);
  const hour = toNumeric(birthProfile.hour, 12);
  const minute = toNumeric(birthProfile.minute, 0);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;

  try {
    const safeHour = clamp(hour, 0, 23);
    const safeMinute = clamp(minute, 0, 59);
    const date = new Date(year, month - 1, day, safeHour, safeMinute, 0);
    if (Number.isNaN(date.getTime())) return null;

    const lunar = Lunar.fromDate(date) as unknown as {
      getDayZhi?: () => string;
      getDayZhiIndex?: () => number;
    };

    const dayZhiIndexRaw = lunar.getDayZhiIndex?.();
    const dayZhiIndexByName = TYME_DAY_BRANCHES.indexOf(lunar.getDayZhi?.() || '');
    const dayZhiIndex = Number.isFinite(dayZhiIndexRaw as number)
      ? (dayZhiIndexRaw as number)
      : dayZhiIndexByName;
    if (dayZhiIndex < 0) return null;

    const weekIndex = date.getDay();
    const baseIndex = TYME_WEEK_BASE_INDEX[weekIndex];
    if (!Number.isFinite(baseIndex)) return null;

    // tyme 二十八宿公式：seed[weekday] - 7 * 日支序号（循环取模 28）
    const starIndex = positiveMod(baseIndex - 7 * dayZhiIndex, 28);
    const xiu = TYME_TWENTY_EIGHT_STARS[starIndex] || '未知';
    const animal = TYME_TWENTY_EIGHT_ANIMALS[starIndex] || '星';
    const luck = (TYME_TWENTY_EIGHT_LUCK[starIndex] ?? 1) === 0 ? '吉' : '凶';
    const zoneIndex = Math.floor(starIndex / 7);
    const zone = TYME_ZONE_NAMES[zoneIndex] || '未知';
    const beast = TYME_BEAST_NAMES[zoneIndex] || '未知';
    const landIndex = TYME_TWENTY_EIGHT_LAND_INDEX[starIndex] ?? 4;
    const land = TYME_LAND_NAMES[landIndex] || '未知';
    const direction = TYME_DIRECTION_NAMES[landIndex] || '未知';
    const sevenStar = TYME_SEVEN_STAR_NAMES[positiveMod(starIndex + 4, 7)] || '未知';

    const mappedAnimal = STAR_ANIMAL_TRAIT_ALIAS[animal];
    const trait = STAR_TRAITS[animal] || (mappedAnimal ? STAR_TRAITS[mappedAnimal] : undefined) || FALLBACK_STAR_TRAIT;

    return {
      index: starIndex,
      zoneIndex,
      landIndex,
      xiu,
      animal,
      luck,
      zone,
      beast,
      land,
      direction,
      sevenStar,
      trait,
      imageUrl: `https://source.unsplash.com/1280x720/?${encodeURIComponent(`${trait.imageKeyword} ${animal} sculpture`)}`,
    };
  } catch {
    return null;
  }
};

const escapeXml = (value: string): string => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const hashText = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 360;
  }
  return hash;
};

const buildLandmarkShape = (landmark: string): string => {
  if (landmark.includes('广州塔')) {
    return '<path d="M638 140 L618 470 L660 470 Z M624 255 L655 255 M622 330 L657 330" stroke="#f8fafc" stroke-width="4" fill="none" stroke-linecap="round"/>';
  }
  if (landmark.includes('平安')) {
    return '<path d="M636 155 L600 470 L672 470 Z" fill="#f8fafc" opacity="0.65"/><path d="M634 190 L615 470 L653 470 Z" fill="#e2e8f0" opacity="0.9"/>';
  }
  if (landmark.includes('骑楼') || landmark.includes('老街')) {
    return '<rect x="560" y="280" width="160" height="180" fill="#f8fafc" opacity="0.25"/><path d="M580 460 v-70 a20 20 0 0 1 40 0 v70 M640 460 v-70 a20 20 0 0 1 40 0 v70" stroke="#f8fafc" stroke-width="6" fill="none"/>';
  }
  return '<rect x="600" y="220" width="80" height="250" fill="#f8fafc" opacity="0.45"/>';
};

const createCityFallbackImage = (suggestion: CitySuggestion): string => {
  const hue = hashText(`${suggestion.city}${suggestion.landmark}`);
  const hue2 = (hue + 45) % 360;
  const landmarkShape = buildLandmarkShape(suggestion.landmark);
  const city = escapeXml(suggestion.city);
  const landmark = escapeXml(suggestion.landmark);
  const direction = escapeXml(suggestion.direction);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue} 72% 42%)"/>
      <stop offset="100%" stop-color="hsl(${hue2} 74% 36%)"/>
    </linearGradient>
    <linearGradient id="mist" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0.30)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.06)"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <ellipse cx="990" cy="90" rx="200" ry="90" fill="url(#mist)" opacity="0.8"/>
  <rect x="0" y="520" width="1280" height="220" fill="rgba(10,15,28,0.33)"/>
  <rect x="0" y="360" width="1280" height="100" fill="rgba(255,255,255,0.07)"/>
  <rect x="60" y="290" width="64" height="230" fill="rgba(15,23,42,0.22)"/>
  <rect x="130" y="330" width="72" height="190" fill="rgba(15,23,42,0.20)"/>
  <rect x="225" y="280" width="58" height="240" fill="rgba(15,23,42,0.24)"/>
  <rect x="300" y="310" width="76" height="210" fill="rgba(15,23,42,0.20)"/>
  <rect x="390" y="260" width="68" height="260" fill="rgba(15,23,42,0.26)"/>
  <rect x="480" y="300" width="80" height="220" fill="rgba(15,23,42,0.20)"/>
  <rect x="730" y="300" width="82" height="220" fill="rgba(15,23,42,0.20)"/>
  <rect x="830" y="270" width="74" height="250" fill="rgba(15,23,42,0.24)"/>
  <rect x="920" y="320" width="58" height="200" fill="rgba(15,23,42,0.20)"/>
  <rect x="995" y="250" width="80" height="270" fill="rgba(15,23,42,0.26)"/>
  <rect x="1100" y="300" width="64" height="220" fill="rgba(15,23,42,0.21)"/>
  ${landmarkShape}
  <text x="84" y="118" fill="#ffffff" font-size="70" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-weight="700">${city}</text>
  <text x="84" y="174" fill="rgba(255,255,255,0.90)" font-size="30" font-family="PingFang SC,Microsoft YaHei,sans-serif">${landmark} · ${direction}</text>
  <rect x="83" y="200" width="224" height="42" rx="21" fill="rgba(15,23,42,0.25)"/>
  <text x="195" y="228" text-anchor="middle" fill="#ffffff" font-size="22" font-family="PingFang SC,Microsoft YaHei,sans-serif">本地插画模式</text>
</svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

type CityImageCandidate = {
  kind: 'network' | 'local' | 'remote' | 'generated';
  src: string;
};

const CityCard: React.FC<{ suggestion: CitySuggestion; rank: number }> = ({ suggestion, rank }) => {
  const [networkImageUrl, setNetworkImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setNetworkImageUrl(null);
    resolveCityNetworkImage(suggestion.city).then((url) => {
      if (alive) setNetworkImageUrl(url);
    });
    return () => {
      alive = false;
    };
  }, [suggestion.city]);

  const imageCandidates = useMemo<CityImageCandidate[]>(() => {
    const candidates: CityImageCandidate[] = [];
    if (networkImageUrl) candidates.push({ kind: 'network', src: networkImageUrl });
    if (suggestion.imageUrl) candidates.push({ kind: 'remote', src: suggestion.imageUrl });
    const localUrl = getLocalCityArtUrl(suggestion.city);
    if (localUrl) candidates.push({ kind: 'local', src: localUrl });
    candidates.push({ kind: 'generated', src: createCityFallbackImage(suggestion) });
    return candidates;
  }, [networkImageUrl, suggestion.city, suggestion.imageUrl, suggestion.landmark, suggestion.direction]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setImageError(false);
  }, [imageCandidates]);

  const activeCandidate = imageCandidates[Math.min(candidateIndex, imageCandidates.length - 1)];
  const usingFallback = activeCandidate?.kind === 'generated';
  const usingLocal = activeCandidate?.kind === 'local';
  const usingNetwork = activeCandidate?.kind === 'network';

  const handleCityImageError = () => {
    if (candidateIndex < imageCandidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
      return;
    }
    setImageError(true);
  };

  return (
    <article className="rounded-2xl overflow-hidden border border-ink-200 bg-white shadow-sm">
      <div className={`h-36 bg-gradient-to-br ${suggestion.accentClass} relative`}>
        {!imageError && (
          <img
            src={activeCandidate.src}
            alt={`${suggestion.city} 城市插画`}
            className={`absolute inset-0 w-full h-full object-cover ${activeCandidate.kind === 'remote' ? 'mix-blend-soft-light' : ''}`}
            onError={handleCityImageError}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        <div className={`absolute inset-0 ${activeCandidate.kind === 'remote' ? 'bg-black/15' : activeCandidate.kind === 'network' ? 'bg-black/10' : 'bg-black/0'}`} />
        <div className="absolute top-3 left-3 rounded-md bg-black/35 text-white text-xs px-2 py-1">推荐 {rank}</div>
        <div className="absolute right-3 bottom-3 rounded-md bg-white/90 text-ink-800 text-xs px-2 py-1 font-medium">{suggestion.landmark}</div>
        {usingNetwork && <div className="absolute top-3 right-3 rounded-md bg-white/90 text-ink-700 text-[11px] px-2 py-1">网络实景</div>}
        {usingLocal && <div className="absolute top-3 right-3 rounded-md bg-white/90 text-ink-700 text-[11px] px-2 py-1">本地素材</div>}
        {usingFallback && <div className="absolute top-3 right-3 rounded-md bg-white/90 text-ink-700 text-[11px] px-2 py-1">本地插画</div>}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold text-ink-800">{suggestion.city}</h4>
          <span className="text-xs px-2 py-1 bg-paper-200 rounded-full text-ink-600">{suggestion.direction}</span>
        </div>
        <p className="text-sm text-ink-600">{suggestion.subtitle}</p>
      </div>
    </article>
  );
};

type ActionKey = 'marriage' | 'study' | 'career' | 'caution';

interface ActionWindow {
  key: ActionKey;
  age: number;
  year: number;
  score: number;
  confidence: '高' | '中';
  reason: string;
}

interface ActionScoreBundle {
  marriage: number;
  study: number;
  career: number;
  caution: number;
  momentum: number;
  stability: number;
  volatility: number;
  tagHits: Record<ActionKey, boolean>;
}

interface ActionAgeWindow {
  minAge: number;
  maxAge: number;
}

const TymeStarWheel: React.FC<{ starProfile: StarProfile | null }> = ({ starProfile }) => {
  const size = 260;
  const center = size / 2;
  const outerRadius = 108;
  const innerRadius = 84;
  const activeIndex = starProfile?.index ?? -1;
  const selectedZoneIndex = starProfile?.zoneIndex ?? -1;
  const zoneStarts = [0, 7, 14, 21];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] mx-auto">
      <defs>
        <radialGradient id="starWheelBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#f5f5f4" />
        </radialGradient>
      </defs>
      <circle cx={center} cy={center} r={outerRadius + 10} fill="url(#starWheelBg)" />
      <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="#d6d3d1" strokeWidth="1.2" />
      <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="#e7e5e4" strokeWidth="1.2" />

      {zoneStarts.map((start, index) => {
        const angle = (start / TYME_TWENTY_EIGHT_STARS.length) * Math.PI * 2 - Math.PI / 2;
        const x1 = center + Math.cos(angle) * innerRadius;
        const y1 = center + Math.sin(angle) * innerRadius;
        const x2 = center + Math.cos(angle) * (outerRadius + 6);
        const y2 = center + Math.sin(angle) * (outerRadius + 6);
        return <line key={`zone-separator-${start}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={index === selectedZoneIndex ? '#b45309' : '#cbd5e1'} strokeWidth={index === selectedZoneIndex ? 2 : 1} />;
      })}

      {TYME_TWENTY_EIGHT_STARS.map((name, index) => {
        const angle = (index / TYME_TWENTY_EIGHT_STARS.length) * Math.PI * 2 - Math.PI / 2;
        const dotX = center + Math.cos(angle) * 96;
        const dotY = center + Math.sin(angle) * 96;
        const labelX = center + Math.cos(angle) * 118;
        const labelY = center + Math.sin(angle) * 118;
        const highlighted = index === activeIndex;
        return (
          <g key={`wheel-star-${name}-${index}`}>
            <circle cx={dotX} cy={dotY} r={highlighted ? 4 : 2.4} fill={highlighted ? '#dc2626' : '#64748b'} />
            <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize={highlighted ? 11 : 9} fill={highlighted ? '#7c2d12' : '#475569'} fontWeight={highlighted ? 700 : 500}>
              {name}
            </text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r={34} fill={selectedZoneIndex >= 0 ? '#fef3c7' : '#f5f5f4'} stroke="#f59e0b" strokeWidth="1" />
      <text x={center} y={center - 8} textAnchor="middle" fontSize="11" fill="#57534e">
        当前星宿
      </text>
      <text x={center} y={center + 14} textAnchor="middle" fontSize="22" fill="#7c2d12" fontWeight={700}>
        {starProfile?.xiu || '待定'}
      </text>
    </svg>
  );
};

const NineFieldPanel: React.FC<{ starProfile: StarProfile | null }> = ({ starProfile }) => {
  const activeLandIndex = starProfile?.landIndex ?? -1;
  // 按你要求的盘面朝向展示：12点=南，6点=北，3点=西，9点=东
  const layoutOrder = [3, 8, 1, 2, 4, 6, 7, 0, 5];
  return (
    <div className="grid grid-cols-3 gap-2">
      {layoutOrder.map((index) => {
        const direction = TYME_DIRECTION_NAMES[index];
        const active = index === activeLandIndex;
        return (
          <div key={`land-${direction}-${index}`} className={`rounded-lg border px-2 py-2 text-center ${active ? 'border-seal bg-seal/10' : 'border-ink-100 bg-paper-50'}`}>
            <div className={`text-[11px] font-semibold ${active ? 'text-seal' : 'text-ink-600'}`}>{direction}</div>
            <div className={`text-[11px] mt-1 ${active ? 'text-ink-800 font-bold' : 'text-ink-500'}`}>{TYME_LAND_NAMES[index]}</div>
          </div>
        );
      })}
    </div>
  );
};

const ACTION_TAG_PATTERNS: Record<ActionKey, RegExp> = {
  marriage: /(婚|嫁|订婚|恋爱|桃花|伴侣|感情|关系)/,
  study: /(学|考|证|升学|读书|深造|进修|留学)/,
  career: /(事|业|晋升|升职|创业|项目|跳槽|拓展|求职|合作)/,
  caution: /(慎|守|蛰伏|回撤|破财|冲突|病|伤|官非|压力|低谷|避险|收敛)/,
};

const ACTION_AGE_WINDOWS: Record<ActionKey, ActionAgeWindow> = {
  marriage: { minAge: 20, maxAge: 40 },
  study: { minAge: 6, maxAge: 30 },
  career: { minAge: 22, maxAge: 60 },
  caution: { minAge: 1, maxAge: 100 },
};

const isInActionAgeWindow = (age: number, key: ActionKey): boolean => {
  const window = ACTION_AGE_WINDOWS[key];
  return age >= window.minAge && age <= window.maxAge;
};

const hasActionTag = (reason: string, key: ActionKey): boolean => ACTION_TAG_PATTERNS[key].test(reason || '');

const computeActionScores = (point: DerivedPoint, previous: DerivedPoint | undefined): ActionScoreBundle => {
  const momentum = point.score - (previous?.score ?? point.score);
  const volatility = Math.max(0, point.high - point.low);
  const stability = clamp(100 - Math.abs(point.close - point.open) * 7 - volatility * 2.8);
  const tagHits: Record<ActionKey, boolean> = {
    marriage: hasActionTag(point.reason, 'marriage'),
    study: hasActionTag(point.reason, 'study'),
    career: hasActionTag(point.reason, 'career'),
    caution: hasActionTag(point.reason, 'caution'),
  };

  return {
    marriage: clamp(point.love * 0.52 + point.health * 0.2 + point.vitality * 0.13 + stability * 0.15 + (tagHits.marriage ? 8 : 0) + (momentum > -2 ? 3 : -2)),
    study: clamp(point.health * 0.34 + point.vitality * 0.27 + point.career * 0.16 + point.score * 0.15 + (momentum >= 1 ? 6 : 0) + (tagHits.study ? 7 : 0)),
    career: clamp(point.career * 0.44 + point.wealth * 0.3 + point.vitality * 0.12 + point.score * 0.14 + (momentum >= 2 ? 7 : 0) + (tagHits.career ? 7 : 0)),
    caution: clamp((100 - point.health) * 0.34 + (100 - point.vitality) * 0.25 + (100 - point.love) * 0.18 + volatility * 2.4 + Math.max(0, -momentum) * 2 + (tagHits.caution ? 10 : 0)),
    momentum,
    stability,
    volatility,
    tagHits,
  };
};

const confidenceByScore = (score: number): '高' | '中' => (score >= 78 ? '高' : '中');

const pickTopDistinctWindows = (items: ActionWindow[], count = 4, minGap = 2): ActionWindow[] => {
  const selected: ActionWindow[] = [];
  for (const item of items) {
    if (selected.every((chosen) => Math.abs(chosen.age - item.age) > minGap)) {
      selected.push(item);
    }
    if (selected.length >= count) break;
  }
  return selected;
};

const buildActionWindows = (points: DerivedPoint[]): Record<ActionKey, ActionWindow[]> => {
  const candidates: Record<ActionKey, ActionWindow[]> = {
    marriage: [],
    study: [],
    career: [],
    caution: [],
  };

  points.forEach((point, index) => {
    const bundle = computeActionScores(point, points[index - 1]);
    const momentumText = bundle.momentum >= 3 ? '上行动能明显' : bundle.momentum <= -3 ? '动能转弱' : '节律平稳';
    const cautionReason = bundle.tagHits.caution
      ? `流年描述提示“谨慎”；健康${Math.round(point.health)}、活力${Math.round(point.vitality)}，建议以守代攻。`
      : `波动${Math.round(bundle.volatility)}偏高，且${momentumText}，需控节奏与风险暴露。`;

    if (isInActionAgeWindow(point.age, 'marriage')) {
      candidates.marriage.push({
        key: 'marriage',
        age: point.age,
        year: point.year,
        score: Math.round(bundle.marriage),
        confidence: confidenceByScore(bundle.marriage),
        reason: bundle.tagHits.marriage
          ? `流年描述命中感情标签；恋情${Math.round(point.love)}、健康${Math.round(point.health)}，适合推进关系。`
          : `恋情${Math.round(point.love)}与稳定性${Math.round(bundle.stability)}较优，可考虑订婚/结婚等关键决策。`,
      });
    }
    if (isInActionAgeWindow(point.age, 'study')) {
      candidates.study.push({
        key: 'study',
        age: point.age,
        year: point.year,
        score: Math.round(bundle.study),
        confidence: confidenceByScore(bundle.study),
        reason: bundle.tagHits.study
          ? `流年描述命中学业标签；健康${Math.round(point.health)}、活力${Math.round(point.vitality)}，适合升学考试。`
          : `健康${Math.round(point.health)}、活力${Math.round(point.vitality)}与成长协同，利升学、进修与证书冲刺。`,
      });
    }
    if (isInActionAgeWindow(point.age, 'career')) {
      candidates.career.push({
        key: 'career',
        age: point.age,
        year: point.year,
        score: Math.round(bundle.career),
        confidence: confidenceByScore(bundle.career),
        reason: bundle.tagHits.career
          ? `流年描述命中事业标签；事业${Math.round(point.career)}、财富${Math.round(point.wealth)}，适合攻坚扩张。`
          : `事业${Math.round(point.career)}、财富${Math.round(point.wealth)}，且${momentumText}，适合晋升/创业/项目突破。`,
      });
    }
    candidates.caution.push({
      key: 'caution',
      age: point.age,
      year: point.year,
      score: Math.round(bundle.caution),
      confidence: confidenceByScore(bundle.caution),
      reason: cautionReason,
    });
  });

  return {
    marriage: pickTopDistinctWindows([...candidates.marriage].sort((a, b) => b.score - a.score)),
    study: pickTopDistinctWindows([...candidates.study].sort((a, b) => b.score - a.score)),
    career: pickTopDistinctWindows([...candidates.career].sort((a, b) => b.score - a.score)),
    caution: pickTopDistinctWindows([...candidates.caution].sort((a, b) => b.score - a.score)),
  };
};

const LifeJourneyVisualizer: React.FC<LifeJourneyVisualizerProps> = ({ data, analysis, birthProfile }) => {
  const derivedPoints = useMemo(() => derivePoints(data, analysis), [data, analysis]);
  const stages = useMemo(() => buildStageInsights(derivedPoints), [derivedPoints]);
  const elementInsight = useMemo(() => inferElement(analysis), [analysis]);
  const citySuggestions = useMemo(() => CITY_BANK[elementInsight.element], [elementInsight.element]);
  const starProfile = useMemo(() => buildStarProfile(birthProfile), [birthProfile]);
  const lifeNumberInsight = useMemo(() => buildLifeNumberInsight(birthProfile), [birthProfile]);
  const narrativeChapters = useMemo(
    () => buildNarrativeChapters(stages, analysis, elementInsight, citySuggestions),
    [stages, analysis, elementInsight, citySuggestions],
  );

  const [selectedAge, setSelectedAge] = useState<number>(derivedPoints[0]?.age ?? 1);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [starImageError, setStarImageError] = useState(false);
  const [personalYearSelected, setPersonalYearSelected] = useState<number | null>(null);

  useEffect(() => {
    if (derivedPoints.length) {
      setSelectedAge(derivedPoints[Math.floor(derivedPoints.length / 2)].age);
    }
  }, [derivedPoints]);

  useEffect(() => {
    setStarImageError(false);
  }, [starProfile?.imageUrl]);

  const selectedPoint = derivedPoints.find((point) => point.age === selectedAge) ?? derivedPoints[0];
  const personalYearMinYear = derivedPoints[0]?.year ?? selectedPoint.year;
  const personalYearMaxYear = derivedPoints[derivedPoints.length - 1]?.year ?? selectedPoint.year;
  const personalYearYear = useMemo(() => {
    const fallback = selectedPoint.year;
    const raw = personalYearSelected ?? fallback;
    return clamp(raw, personalYearMinYear, personalYearMaxYear);
  }, [personalYearSelected, selectedPoint.year, personalYearMinYear, personalYearMaxYear]);
  const personalYearInsight = useMemo(() => buildPersonalYearInsight(birthProfile, personalYearYear), [birthProfile, personalYearYear]);
  const personalYearTimeline = useMemo(() => {
    const years: number[] = [];
    for (let year = personalYearYear - 4; year <= personalYearYear + 4; year += 1) {
      if (year >= personalYearMinYear && year <= personalYearMaxYear) years.push(year);
    }
    return years;
  }, [personalYearYear, personalYearMinYear, personalYearMaxYear]);

  useEffect(() => {
    if (personalYearSelected === null) {
      setPersonalYearSelected(selectedPoint.year);
      return;
    }
    if (personalYearSelected < personalYearMinYear || personalYearSelected > personalYearMaxYear) {
      setPersonalYearSelected(clamp(personalYearSelected, personalYearMinYear, personalYearMaxYear));
    }
  }, [personalYearSelected, selectedPoint.year, personalYearMinYear, personalYearMaxYear]);
  const compatibilityBaseNumber = useMemo(
    () => (lifeNumberInsight ? reduceToSingleDigit(lifeNumberInsight.value) : null),
    [lifeNumberInsight],
  );
  const compatibilityHint = compatibilityBaseNumber ? LIFE_COMPATIBILITY_MAP[compatibilityBaseNumber] : null;
  const talentInterpretation = useMemo(
    () => (lifeNumberInsight ? TALENT_NUMBER_MAP[lifeNumberInsight.talentNumber] ?? null : null),
    [lifeNumberInsight],
  );
  const lifeDeepProfile = useMemo(() => {
    if (!lifeNumberInsight) return null;
    if (LIFE_NUMBER_DEEP_MAP[lifeNumberInsight.value]) return LIFE_NUMBER_DEEP_MAP[lifeNumberInsight.value];
    if (compatibilityBaseNumber && LIFE_NUMBER_DEEP_MAP[compatibilityBaseNumber]) return LIFE_NUMBER_DEEP_MAP[compatibilityBaseNumber];
    return null;
  }, [lifeNumberInsight, compatibilityBaseNumber]);
  const lifeExpandedGuide = useMemo(() => {
    if (!lifeNumberInsight) return null;
    if (LIFE_NUMBER_EXPANDED_MAP[lifeNumberInsight.value]) return LIFE_NUMBER_EXPANDED_MAP[lifeNumberInsight.value];
    if (compatibilityBaseNumber && LIFE_NUMBER_EXPANDED_MAP[compatibilityBaseNumber]) return LIFE_NUMBER_EXPANDED_MAP[compatibilityBaseNumber];
    return null;
  }, [lifeNumberInsight, compatibilityBaseNumber]);
  const activeChapter = narrativeChapters[chapterIndex] ?? narrativeChapters[0];

  const topOpportunityStages = useMemo(() => [...stages].sort((a, b) => b.avgScore - a.avgScore).slice(0, 3), [stages]);
  const topRiskStages = useMemo(
    () =>
      [...stages]
        .map((stage) => ({
          ...stage,
          riskScore: Math.round((100 - stage.health) * 0.4 + (100 - stage.love) * 0.35 + (100 - stage.vitality) * 0.25),
        }))
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 3),
    [stages],
  );
  const actionWindows = useMemo(() => buildActionWindows(derivedPoints), [derivedPoints]);
  const selectedActionBundle = useMemo(() => {
    const selectedIndex = derivedPoints.findIndex((point) => point.age === selectedPoint.age);
    return computeActionScores(selectedPoint, selectedIndex > 0 ? derivedPoints[selectedIndex - 1] : undefined);
  }, [derivedPoints, selectedPoint]);
  const selectedActionText = useMemo(() => {
    if (selectedActionBundle.caution >= 70) {
      return `该流年优先“蛰伏与风控”。建议降低杠杆、减少高风险决策，先修复健康与关系节律。`;
    }
    if (selectedActionBundle.career >= selectedActionBundle.study && selectedActionBundle.career >= selectedActionBundle.marriage) {
      return `该流年适合“事业推进”。建议主动争取晋升、核心项目或资源位，放大执行与曝光。`;
    }
    if (selectedActionBundle.study >= selectedActionBundle.marriage) {
      return `该流年适合“升学进修”。建议集中投入考试、证书或长期学习，优先构建能力壁垒。`;
    }
    return `该流年适合“关系推进”。建议稳步推进亲密关系议题，避免情绪化决策，重视长期承诺。`;
  }, [selectedActionBundle]);

  if (!derivedPoints.length) {
    return <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center text-ink-500">暂无可视化数据。</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-bold text-ink-800">命局剪影</h3>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-100 text-ink-700 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            结构化解读
          </span>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <article className="rounded-2xl border border-ink-100 overflow-hidden bg-paper-50">
              <div className={`p-6 text-white bg-gradient-to-br ${activeChapter.backgroundClass} animate-fade-in`} key={activeChapter.id}>
                <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-2">{activeChapter.subtitle}</p>
                <h4 className="text-2xl font-bold mb-4">{activeChapter.title}</h4>
                <p className="text-sm leading-7 text-white/90">{activeChapter.analysisText}</p>
                <p className="text-sm mt-4 font-semibold text-white">{activeChapter.punchline}</p>
              </div>

              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between text-xs text-ink-500 mb-3">
                  <span>{activeChapter.scoreLabel}</span>
                  <span>{Math.round(activeChapter.scoreValue)}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-seal to-wood transition-all duration-500" style={{ width: `${clamp(activeChapter.scoreValue)}%` }} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {narrativeChapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => {
                        setChapterIndex(index);
                        setSelectedAge(chapter.focusAge);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs border transition-all ${
                        chapterIndex === index ? 'bg-seal text-white border-seal' : 'bg-white border-ink-200 text-ink-600 hover:border-ink-300'
                      }`}
                    >
                      {index + 1}. {chapter.title.replace(' · ', '·')}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChapterIndex((prev) => (prev - 1 + narrativeChapters.length) % narrativeChapters.length)}
                    className="px-3 py-2 text-xs rounded-lg bg-paper-200 text-ink-700 hover:bg-paper-300"
                  >
                    上一幕
                  </button>
                  <button
                    type="button"
                    onClick={() => setChapterIndex((prev) => (prev + 1) % narrativeChapters.length)}
                    className="px-3 py-2 text-xs rounded-lg bg-ink-700 text-white hover:bg-ink-800"
                  >
                    下一幕
                  </button>
                </div>
              </div>
              {lifeNumberInsight && (
                <div className="mt-4 space-y-3">
                  <details className="group rounded-xl border border-ink-100 bg-white p-3" open>
                    <summary className="cursor-pointer text-sm font-semibold text-ink-800 list-none flex items-center justify-between">
                      <span>命运数深度解读（点击收起）</span>
                      <span className="text-xs text-ink-500 group-open:hidden">展开</span>
                      <span className="text-xs text-ink-500 hidden group-open:inline">收起</span>
                    </summary>
                    <div className="mt-3 space-y-3 text-xs text-ink-700">
                      <div className="rounded-lg bg-paper-100 p-3">
                        <p className="font-semibold text-ink-800">
                          命运数 {lifeNumberInsight.valueLabel} · {lifeDeepProfile?.role || lifeNumberInsight.interpretation.title}
                        </p>
                        <p className="mt-1">工作风格：{lifeDeepProfile?.workStyle || lifeNumberInsight.interpretation.subtitle}</p>
                        <p className="mt-1">关系模式：{lifeDeepProfile?.relationshipStyle || compatibilityHint}</p>
                        <p className="mt-1">成长课题：{lifeDeepProfile?.growthTask || lifeNumberInsight.interpretation.challenge}</p>
                      </div>
                      {talentInterpretation && (
                        <div className="rounded-lg border border-ink-100 p-3 bg-paper-50">
                          <p className="font-semibold text-ink-800">天赋数 {lifeNumberInsight.talentNumber} · {talentInterpretation.title}</p>
                          <p className="mt-1">{talentInterpretation.summary}</p>
                          <p className="mt-1 text-ink-600">放大建议：{talentInterpretation.leverage}</p>
                        </div>
                      )}
                      {lifeDeepProfile && (
                        <div className="grid sm:grid-cols-2 gap-2">
                          <div className="rounded-lg border border-ink-100 p-3">
                            <p className="font-semibold text-ink-800">盲点信号</p>
                            <ul className="mt-1 space-y-1 text-ink-600">
                              {lifeDeepProfile.cautionSignals.map((item) => (
                                <li key={`life-caution-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg border border-ink-100 p-3">
                            <p className="font-semibold text-ink-800">行动建议</p>
                            <ul className="mt-1 space-y-1 text-ink-600">
                              {lifeDeepProfile.actionTips.map((item) => (
                                <li key={`life-action-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      {lifeExpandedGuide && (
                        <>
                          <div className="grid md:grid-cols-2 gap-2">
                            <div className="rounded-lg border border-ink-100 p-3 bg-paper-50">
                              <p className="font-semibold text-ink-800">核心母题</p>
                              <p className="mt-1 text-ink-700">{lifeExpandedGuide.coreMotif}</p>
                            </div>
                            <div className="rounded-lg border border-ink-100 p-3 bg-paper-50">
                              <p className="font-semibold text-ink-800">成长路径</p>
                              <p className="mt-1 text-ink-700">{lifeExpandedGuide.growthArc}</p>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-3 gap-2">
                            <div className="rounded-lg border border-ink-100 p-3">
                              <p className="font-semibold text-ink-800">事业策略</p>
                              <ul className="mt-1 space-y-1 text-ink-600">
                                {lifeExpandedGuide.careerHints.map((item) => (
                                  <li key={`life-career-${item}`}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-lg border border-ink-100 p-3">
                              <p className="font-semibold text-ink-800">关系策略</p>
                              <ul className="mt-1 space-y-1 text-ink-600">
                                {lifeExpandedGuide.relationshipHints.map((item) => (
                                  <li key={`life-relation-${item}`}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-lg border border-ink-100 p-3">
                              <p className="font-semibold text-ink-800">财富策略</p>
                              <ul className="mt-1 space-y-1 text-ink-600">
                                {lifeExpandedGuide.moneyHints.map((item) => (
                                  <li key={`life-money-${item}`}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="rounded-lg border border-ink-100 p-3 bg-gradient-to-r from-amber-50 to-paper-50">
                            <p className="font-semibold text-ink-800">30天实践清单</p>
                            <ul className="mt-1 grid md:grid-cols-3 gap-1 text-ink-700">
                              {lifeExpandedGuide.practicePlan.map((item) => (
                                <li key={`life-plan-${item}`}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-ink-100 bg-gradient-to-br from-paper-50 to-white p-4 md:p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-800 mb-3">
                <Stars className="w-4 h-4 text-seal" />
                生命灵数引擎（生日数理）
              </div>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-ink-100 bg-white p-4">
                  {lifeNumberInsight ? (
                    <>
                      <p className="text-xs text-ink-500 mb-2">生命灵数（Life Path Number）</p>
                      <div className="h-44 rounded-xl bg-gradient-to-br from-seal/10 via-wood/10 to-amber-100 border border-amber-200 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-seal">{lifeNumberInsight.valueLabel}</div>
                        <div className="text-xs text-ink-600 mt-1">{lifeNumberInsight.interpretation.title}</div>
                      </div>
                      <div className="mt-3 space-y-2 text-xs">
                        <p className="text-ink-500">
                          出生日期：<span className="text-ink-800 font-semibold">{lifeNumberInsight.birthDateText}</span>
                        </p>
                        <p className="text-ink-500 leading-6">拆分过程：{lifeNumberInsight.componentTraceText}</p>
                        <p className="text-ink-600 leading-6">{lifeNumberInsight.traceText}</p>
                        <p className="text-ink-600 leading-6">天赋数：{lifeNumberInsight.talentTraceText}</p>
                        <div className="rounded-lg bg-paper-100 px-3 py-2 text-ink-700 space-y-1">
                          <p>优势：{lifeNumberInsight.interpretation.strengths[0]}</p>
                          <p>课题：{lifeNumberInsight.interpretation.challenge}</p>
                          <p>策略：{lifeNumberInsight.interpretation.advice}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed border-ink-200 bg-paper-50 p-4 text-xs text-ink-500">
                      未获取到可用生日。请填写出生日期，或先用四柱反推候选出生时刻。
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl border border-ink-100 bg-white p-3">
                    <p className="text-xs text-ink-500 mb-2">灵数关键词</p>
                    <div className="flex flex-wrap gap-2">
                      {(lifeNumberInsight?.interpretation.keywords ?? ['待补全生日']).map((item) => (
                        <span key={`life-key-${item}`} className="text-xs px-2 py-1 rounded-full bg-paper-100 text-ink-700 border border-ink-100">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-ink-600 leading-6 mt-3">
                      {lifeNumberInsight?.interpretation.subtitle || '请先输入生日信息后查看生命灵数解析。'}
                    </p>
                    {lifeNumberInsight && (
                      <p className="text-[11px] text-ink-500 mt-2">
                        计算规则：月/日/年先拆分到个位，再合并计算；仅当最终结果为 11/22/33 时保留主数。
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl border border-ink-100 bg-white p-3">
                    <p className="text-xs text-ink-500 mb-2">关系协作基数</p>
                    {lifeNumberInsight ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-ink-800">#{compatibilityBaseNumber}</span>
                          {lifeNumberInsight.value > 9 && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-paper-100 text-ink-600">
                              主数折算：{lifeNumberInsight.valueLabel} → {compatibilityBaseNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-600 leading-6">{compatibilityHint}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-ink-500">待补全生日后计算。</p>
                    )}
                  </div>
                  <div className="rounded-xl border border-ink-100 bg-white p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <p className="text-xs text-ink-500">个人年周期（{personalYearYear}）</p>
                      <button
                        type="button"
                        onClick={() => setPersonalYearSelected(selectedPoint.year)}
                        className="text-[11px] px-2 py-1 rounded border border-ink-200 bg-paper-50 text-ink-600 hover:bg-paper-100"
                      >
                        同步当前流年
                      </button>
                    </div>
                    {personalYearInsight ? (
                      <div className="space-y-2">
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-seal">{personalYearInsight.value}</span>
                          <span className="text-sm text-ink-700 font-semibold">{personalYearInsight.theme}</span>
                        </div>
                        <p className="text-xs text-ink-600">{personalYearInsight.traceText}</p>
                        <p className="text-xs text-ink-700">重点：{personalYearInsight.focus}</p>
                        <p className="text-xs text-ink-600">提醒：{personalYearInsight.caution}</p>

                        <div className="pt-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={personalYearMinYear}
                              max={personalYearMaxYear}
                              value={personalYearYear}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPersonalYearSelected(Number(event.target.value))}
                              className="flex-1 accent-seal"
                            />
                            <input
                              type="number"
                              min={personalYearMinYear}
                              max={personalYearMaxYear}
                              value={personalYearYear}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const value = Number(event.target.value);
                                if (Number.isFinite(value)) setPersonalYearSelected(clamp(Math.round(value), personalYearMinYear, personalYearMaxYear));
                              }}
                              className="w-20 px-2 py-1 border border-ink-200 rounded text-xs text-ink-700 bg-paper-50"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {personalYearTimeline.map((year) => {
                              const marker = buildPersonalYearInsight(birthProfile, year);
                              const active = year === personalYearYear;
                              return (
                                <button
                                  key={`py-${year}`}
                                  type="button"
                                  onClick={() => setPersonalYearSelected(year)}
                                  className={`px-2 py-1 rounded border text-[11px] transition-colors ${
                                    active ? 'border-seal bg-seal text-white' : 'border-ink-200 bg-paper-50 text-ink-600 hover:bg-paper-100'
                                  }`}
                                >
                                  {year} · {marker?.value ?? '-'}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-ink-500">待补全生日后计算。</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-4">
            <article className="rounded-2xl border border-ink-100 overflow-hidden bg-white">
              <div className={`relative p-4 bg-gradient-to-br ${starProfile?.trait.gradientClass || FALLBACK_STAR_TRAIT.gradientClass}`}>
                {!starImageError && starProfile && (
                  <img
                    src={starProfile.imageUrl}
                    alt={`${starProfile.animal} 视觉意象`}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-soft-light opacity-80"
                    loading="lazy"
                    onError={() => setStarImageError(true)}
                  />
                )}
                <div className="relative z-10 h-44 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white/90 border border-white/60 shadow-xl flex items-center justify-center animate-pulse">
                    <span className="text-5xl font-serif-sc text-ink-900">{starProfile?.animal || '星'}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                  <Stars className="w-4 h-4 text-seal" />
                  星宿人格动物塑像
                </div>
                <p className="text-sm font-bold text-ink-900">{starProfile?.trait.title || FALLBACK_STAR_TRAIT.title}</p>
                <p className="text-xs text-ink-600">{starProfile?.trait.subtitle || FALLBACK_STAR_TRAIT.subtitle}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">星宿：{starProfile?.xiu || '待输入生日'}</div>
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">吉凶：{starProfile?.luck || '未知'}</div>
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">宫区：{starProfile?.zone || '未知'}</div>
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">神兽：{starProfile?.beast || '未知'}</div>
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">九野：{starProfile?.land || '未知'}</div>
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">方位：{starProfile?.direction || '未知'}</div>
                  <div className="rounded-lg bg-paper-100 px-2 py-2 text-ink-700">七曜：{starProfile?.sevenStar || '未知'}</div>
                </div>
                <ul className="text-xs text-ink-600 space-y-1">
                  <li>• {(starProfile?.trait || FALLBACK_STAR_TRAIT).traitA}</li>
                  <li>• {(starProfile?.trait || FALLBACK_STAR_TRAIT).traitB}</li>
                  <li>• {(starProfile?.trait || FALLBACK_STAR_TRAIT).traitC}</li>
                </ul>
              </div>
            </article>

            <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="text-sm font-bold text-emerald-800 mb-3">机会窗口 TOP 3</h4>
              <div className="space-y-2">
                {topOpportunityStages.map((stage, index) => (
                  <button
                    key={`opp-${stage.label}`}
                    type="button"
                    onClick={() => setSelectedAge(Math.round((stage.startAge + stage.endAge) / 2))}
                    className="w-full text-left rounded-lg bg-white/90 border border-emerald-100 p-2 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-900">
                        #{index + 1} {stage.label}
                      </span>
                      <span className="text-emerald-700">总势 {stage.avgScore}</span>
                    </div>
                    <div className="text-xs text-emerald-700 mt-1">主攻：{stage.wealth >= stage.career ? '财富' : '事业'}，活力 {stage.vitality}</div>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <h4 className="text-sm font-bold text-rose-800 mb-3">风险窗口 TOP 3</h4>
              <div className="space-y-2">
                {topRiskStages.map((stage, index) => (
                  <button
                    key={`risk-${stage.label}`}
                    type="button"
                    onClick={() => setSelectedAge(Math.round((stage.startAge + stage.endAge) / 2))}
                    className="w-full text-left rounded-lg bg-white/90 border border-rose-100 p-2 hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-900">
                        #{index + 1} {stage.label}
                      </span>
                      <span className="text-rose-700">风险 {stage.riskScore}</span>
                    </div>
                    <div className="text-xs text-rose-700 mt-1">关注：健康 {stage.health} / 恋情 {stage.love} / 活力 {stage.vitality}</div>
                  </button>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
        <h3 className="text-xl font-bold text-ink-800 mb-4">城市迁移推荐（结合五行倾向）</h3>
        <div className="flex items-center gap-3 text-sm text-ink-600 mb-4">
          <MapPinned className="w-4 h-4 text-seal" />
          <span>
            推荐维度：{elementInsight.element} 元素强化 · {elementInsight.direction} 方位优先
          </span>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {citySuggestions.map((suggestion, index) => (
            <CityCard key={`${suggestion.city}-${suggestion.landmark}`} suggestion={suggestion} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <article className="rounded-2xl border border-ink-200 bg-white p-6">
          <h3 className="text-xl font-bold text-ink-800 mb-4">阶段热力图（多维） + 命理K线图</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="text-xs text-ink-500">
                  <th className="text-left py-2 px-2">阶段</th>
                  <th className="text-center py-2 px-2">总势</th>
                  <th className="text-center py-2 px-2">财富</th>
                  <th className="text-center py-2 px-2">健康</th>
                  <th className="text-center py-2 px-2">恋情</th>
                  <th className="text-center py-2 px-2">事业</th>
                  <th className="text-center py-2 px-2">趋势</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr key={`heat-${stage.label}`} className="border-t border-ink-100">
                    <td className="py-2 px-2 text-sm text-ink-700">{stage.label}</td>
                    {[stage.avgScore, stage.wealth, stage.health, stage.love, stage.career].map((value, index) => (
                      <td key={`${stage.label}-${index}`} className="py-2 px-2 text-center">
                        <div className="rounded-md py-1 text-xs font-semibold" style={{ backgroundColor: heatColor(value), color: value >= 60 ? '#0f172a' : '#475569' }}>
                          {Math.round(value)}
                        </div>
                      </td>
                    ))}
                    <td className="py-2 px-2 text-center text-xs text-ink-500">{trendToText(stage.trend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-ink-700">命理 K 线（点击蜡烛可同步当前年龄）</p>
              <span className="text-xs text-ink-500">当前：{selectedAge}岁（{selectedPoint.year}）</span>
            </div>
            <LifeKLineChart data={data} selectedAge={selectedAge} onSelectAge={setSelectedAge} height={430} showHeader={false} className="bg-paper-50" />
          </div>
        </article>

        <article className="rounded-2xl border border-ink-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-xl font-bold text-ink-800">流年行动窗口（实用版）</h3>
            <span className="text-xs rounded-full bg-ink-100 px-3 py-1 text-ink-600">结婚 · 升学 · 事业 · 蛰伏</span>
          </div>

          <div className="space-y-3 mb-4">
            <label htmlFor="age-slider" className="text-sm text-ink-600">
              时间滑轴：{selectedAge}岁（{selectedPoint.year}）
            </label>
            <input
              id="age-slider"
              type="range"
              min={derivedPoints[0].age}
              max={derivedPoints[derivedPoints.length - 1].age}
              value={selectedAge}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSelectedAge(Number(event.target.value))}
              className="w-full accent-seal"
            />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="rounded-lg bg-paper-100 p-2">
                <span className="text-ink-500">财富</span>
                <p className="font-bold text-ink-800">{Math.round(selectedPoint.wealth)}</p>
              </div>
              <div className="rounded-lg bg-paper-100 p-2">
                <span className="text-ink-500">健康</span>
                <p className="font-bold text-ink-800">{Math.round(selectedPoint.health)}</p>
              </div>
              <div className="rounded-lg bg-paper-100 p-2">
                <span className="text-ink-500">恋情</span>
                <p className="font-bold text-ink-800">{Math.round(selectedPoint.love)}</p>
              </div>
              <div className="rounded-lg bg-paper-100 p-2">
                <span className="text-ink-500">事业</span>
                <p className="font-bold text-ink-800">{Math.round(selectedPoint.career)}</p>
              </div>
              <div className="rounded-lg bg-paper-100 p-2">
                <span className="text-ink-500">活力</span>
                <p className="font-bold text-ink-800">{Math.round(selectedPoint.vitality)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-ink-100 bg-paper-50 p-3 mb-4">
            <div className="text-xs text-ink-500">当前流年策略</div>
            <p className="text-sm text-ink-700 mt-1">{selectedActionText}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-rose-100 text-rose-700 px-2 py-1">婚恋 {Math.round(selectedActionBundle.marriage)}</span>
              <span className="rounded-md bg-emerald-100 text-emerald-700 px-2 py-1">升学 {Math.round(selectedActionBundle.study)}</span>
              <span className="rounded-md bg-sky-100 text-sky-700 px-2 py-1">事业 {Math.round(selectedActionBundle.career)}</span>
              <span className="rounded-md bg-amber-100 text-amber-700 px-2 py-1">谨慎 {Math.round(selectedActionBundle.caution)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              {
                key: 'marriage' as ActionKey,
                title: '适合结婚（20-40岁）',
                panelClass: 'border-rose-200 bg-rose-50',
                itemClass: 'border-rose-100 hover:border-rose-300',
                scoreClass: 'text-rose-700',
                icon: HeartHandshake,
              },
              {
                key: 'study' as ActionKey,
                title: '适合升学（6-30岁）',
                panelClass: 'border-emerald-200 bg-emerald-50',
                itemClass: 'border-emerald-100 hover:border-emerald-300',
                scoreClass: 'text-emerald-700',
                icon: BookOpen,
              },
              {
                key: 'career' as ActionKey,
                title: '适合干事业（22-60岁）',
                panelClass: 'border-sky-200 bg-sky-50',
                itemClass: 'border-sky-100 hover:border-sky-300',
                scoreClass: 'text-sky-700',
                icon: BriefcaseBusiness,
              },
              {
                key: 'caution' as ActionKey,
                title: '宜蛰伏/小心',
                panelClass: 'border-amber-200 bg-amber-50',
                itemClass: 'border-amber-100 hover:border-amber-300',
                scoreClass: 'text-amber-700',
                icon: ShieldAlert,
              },
            ].map((panel) => {
              const Icon = panel.icon;
              return (
                <article key={panel.key} className={`rounded-xl border p-3 ${panel.panelClass}`}>
                  <div className="flex items-center gap-2 text-sm font-bold text-ink-800 mb-2">
                    <Icon className="w-4 h-4" />
                    {panel.title}
                  </div>
                  <div className="space-y-2">
                    {actionWindows[panel.key].map((item, index) => (
                      <button
                        key={`${panel.key}-${item.age}-${item.year}`}
                        type="button"
                        onClick={() => setSelectedAge(item.age)}
                        className={`w-full text-left rounded-lg border bg-white/90 px-2 py-2 transition-colors ${panel.itemClass}`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ink-800">
                            #{index + 1} {item.age}岁（{item.year}）
                          </span>
                          <span className={panel.scoreClass}>
                            {item.score} · {item.confidence}置信
                          </span>
                        </div>
                        <p className="text-xs text-ink-600 mt-1">{item.reason}</p>
                      </button>
                    ))}
                    {actionWindows[panel.key].length === 0 && (
                      <div className="rounded-lg border border-dashed border-ink-200 bg-white/70 px-2 py-3 text-xs text-ink-500">
                        当前命盘在该年龄窗内暂无高置信窗口。
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
        <h3 className="text-xl font-bold text-ink-800 mb-4">五行导向说明</h3>
        <div className="grid md:grid-cols-5 gap-3 text-xs">
          <div className="rounded-lg border border-ink-100 p-3 bg-emerald-50 text-emerald-700">
            <Trees className="w-4 h-4 mb-2" />木：成长、学习、长期建设
          </div>
          <div className="rounded-lg border border-ink-100 p-3 bg-orange-50 text-orange-700">
            <Flame className="w-4 h-4 mb-2" />火：表达、行动、声量与机会
          </div>
          <div className="rounded-lg border border-ink-100 p-3 bg-amber-50 text-amber-700">
            <Mountain className="w-4 h-4 mb-2" />土：稳定、积累、结构与承载
          </div>
          <div className="rounded-lg border border-ink-100 p-3 bg-slate-50 text-slate-700">
            <Compass className="w-4 h-4 mb-2" />金：规则、决策、组织与执行
          </div>
          <div className="rounded-lg border border-ink-100 p-3 bg-cyan-50 text-cyan-700">
            <Waves className="w-4 h-4 mb-2" />水：流动、连接、资源整合
          </div>
        </div>
      </section>
    </div>
  );
};

export default LifeJourneyVisualizer;
