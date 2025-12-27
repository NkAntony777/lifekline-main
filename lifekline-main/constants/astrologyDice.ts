import { Planet, Zodiac, House } from '../types/astrologyDice';

export const PLANETS: Planet[] = [
  {
    id: 'sun',
    name: '太阳',
    nameEn: 'Sun',
    symbol: '☉',
    keywords: ['自我', '意志力', '创造力', '生命力', '领导力', '身份认同'],
    meaning: '代表核心自我、意志力和生命力，是个人身份和创造力的源泉',
    element: 'fire'
  },
  {
    id: 'moon',
    name: '月亮',
    nameEn: 'Moon',
    symbol: '☽',
    keywords: ['情感', '直觉', '潜意识', '母性', '情绪', '内在需求'],
    meaning: '代表情感、直觉和潜意识，反映内在需求和情绪反应',
    element: 'water'
  },
  {
    id: 'mercury',
    name: '水星',
    nameEn: 'Mercury',
    symbol: '☿',
    keywords: ['沟通', '思维', '学习', '交通', '信息', '逻辑'],
    meaning: '代表沟通、思维和学习能力，掌管信息交流和逻辑思考',
    element: 'air'
  },
  {
    id: 'venus',
    name: '金星',
    nameEn: 'Venus',
    symbol: '♀',
    keywords: ['爱情', '美感', '艺术', '和谐', '价值', '人际关系'],
    meaning: '代表爱情、美感和艺术，掌管人际关系和价值观念',
    element: 'earth'
  },
  {
    id: 'mars',
    name: '火星',
    nameEn: 'Mars',
    symbol: '♂',
    keywords: ['行动', '冲动', '竞争', '勇气', '能量', '冲突'],
    meaning: '代表行动力和冲动，掌管竞争、勇气和能量表达',
    element: 'fire'
  },
  {
    id: 'jupiter',
    name: '木星',
    nameEn: 'Jupiter',
    symbol: '♃',
    keywords: ['扩张', '幸运', '智慧', '成长', '机会', '乐观'],
    meaning: '代表扩张和幸运，掌管智慧、成长和机会',
    element: 'fire'
  },
  {
    id: 'saturn',
    name: '土星',
    nameEn: 'Saturn',
    symbol: '♄',
    keywords: ['责任', '限制', '纪律', '结构', '考验', '成熟'],
    meaning: '代表责任和限制，掌管纪律、结构和人生考验',
    element: 'earth'
  },
  {
    id: 'uranus',
    name: '天王星',
    nameEn: 'Uranus',
    symbol: '♅',
    keywords: ['革新', '自由', '突变', '独立', '科技', '创新'],
    meaning: '代表革新和自由，掌管突变、独立和创新',
    element: 'air'
  },
  {
    id: 'neptune',
    name: '海王星',
    nameEn: 'Neptune',
    symbol: '♆',
    keywords: ['梦想', '灵性', '幻觉', '直觉', '艺术', '牺牲'],
    meaning: '代表梦想和灵性，掌管幻觉、直觉和精神世界',
    element: 'water'
  },
  {
    id: 'pluto',
    name: '冥王星',
    nameEn: 'Pluto',
    symbol: '♇',
    keywords: ['转化', '重生', '权力', '深度', '秘密', '蜕变'],
    meaning: '代表转化和重生，掌管权力、深度和生命蜕变',
    element: 'water'
  }
];

export const ZODIACS: Zodiac[] = [
  {
    id: 'aries',
    name: '白羊座',
    nameEn: 'Aries',
    symbol: '♈',
    element: 'fire',
    quality: 'cardinal',
    ruler: 'mars',
    keywords: ['冲动', '热情', '勇气', '行动力', '领导', '直接'],
    meaning: '代表新的开始、行动力和勇气，是黄道十二宫的第一个星座'
  },
  {
    id: 'taurus',
    name: '金牛座',
    nameEn: 'Taurus',
    symbol: '♉',
    element: 'earth',
    quality: 'fixed',
    ruler: 'venus',
    keywords: ['稳定', '务实', '固执', '享受', '物质', '耐心'],
    meaning: '代表稳定和务实，重视物质享受和感官体验'
  },
  {
    id: 'gemini',
    name: '双子座',
    nameEn: 'Gemini',
    symbol: '♊',
    element: 'air',
    quality: 'mutable',
    ruler: 'mercury',
    keywords: ['多变', '好奇', '沟通', '适应', '机智', '社交'],
    meaning: '代表沟通和适应能力，思维敏捷，善于社交'
  },
  {
    id: 'cancer',
    name: '巨蟹座',
    nameEn: 'Cancer',
    symbol: '♋',
    element: 'water',
    quality: 'cardinal',
    ruler: 'moon',
    keywords: ['敏感', '保护', '家庭', '情感', '怀旧', '关怀'],
    meaning: '代表家庭和情感，重视情感联系和家庭生活'
  },
  {
    id: 'leo',
    name: '狮子座',
    nameEn: 'Leo',
    symbol: '♌',
    element: 'fire',
    quality: 'fixed',
    ruler: 'sun',
    keywords: ['自信', '慷慨', '戏剧性', '创造力', '骄傲', '领导'],
    meaning: '代表自信和创造力，喜欢成为焦点，具有领导才能'
  },
  {
    id: 'virgo',
    name: '处女座',
    nameEn: 'Virgo',
    symbol: '♍',
    element: 'earth',
    quality: 'mutable',
    ruler: 'mercury',
    keywords: ['分析', '完美主义', '服务', '细节', '谨慎', '实用'],
    meaning: '代表分析和完美主义，注重细节，乐于服务他人'
  },
  {
    id: 'libra',
    name: '天秤座',
    nameEn: 'Libra',
    symbol: '♎',
    element: 'air',
    quality: 'cardinal',
    ruler: 'venus',
    keywords: ['平衡', '和谐', '公正', '合作', '美感', '犹豫'],
    meaning: '代表平衡和和谐，重视人际关系和美感'
  },
  {
    id: 'scorpio',
    name: '天蝎座',
    nameEn: 'Scorpio',
    symbol: '♏',
    element: 'water',
    quality: 'fixed',
    ruler: 'pluto',
    keywords: ['深度', '神秘', '占有', '转化', '直觉', '强烈'],
    meaning: '代表深度和转化，情感强烈，具有敏锐的直觉'
  },
  {
    id: 'sagittarius',
    name: '射手座',
    nameEn: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    quality: 'mutable',
    ruler: 'jupiter',
    keywords: ['乐观', '自由', '冒险', '哲学', '直率', '探索'],
    meaning: '代表自由和探索，乐观向上，热爱冒险和哲学思考'
  },
  {
    id: 'capricorn',
    name: '摩羯座',
    nameEn: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    quality: 'cardinal',
    ruler: 'saturn',
    keywords: ['野心', '责任', '纪律', '务实', '成就', '保守'],
    meaning: '代表野心和责任，重视成就和社会地位'
  },
  {
    id: 'aquarius',
    name: '水瓶座',
    nameEn: 'Aquarius',
    symbol: '♒',
    element: 'air',
    quality: 'fixed',
    ruler: 'uranus',
    keywords: ['独立', '创新', '人道', '叛逆', '理想', '友谊'],
    meaning: '代表独立和创新，重视人性和社会进步'
  },
  {
    id: 'pisces',
    name: '双鱼座',
    nameEn: 'Pisces',
    symbol: '♓',
    element: 'water',
    quality: 'mutable',
    ruler: 'neptune',
    keywords: ['梦幻', '同情', '艺术', '牺牲', '直觉', '敏感'],
    meaning: '代表梦幻和同情，富有艺术天赋和直觉能力'
  }
];

export const HOUSES: House[] = [
  {
    id: 1,
    name: '第一宫',
    nameEn: 'First House',
    symbol: 'Ⅰ',
    keywords: ['自我', '外貌', '性格', '第一印象', '个人形象', '身份'],
    meaning: '代表自我形象、外貌、性格和给人的第一印象',
    naturalRuler: 'aries'
  },
  {
    id: 2,
    name: '第二宫',
    nameEn: 'Second House',
    symbol: 'Ⅱ',
    keywords: ['财富', '物质', '价值观', '收入', '资产', '自我价值'],
    meaning: '代表个人财富、物质资源和价值观',
    naturalRuler: 'taurus'
  },
  {
    id: 3,
    name: '第三宫',
    nameEn: 'Third House',
    symbol: 'Ⅲ',
    keywords: ['沟通', '学习', '兄弟姐妹', '短途旅行', '思维', '信息'],
    meaning: '代表沟通、学习、兄弟姐妹和短途旅行',
    naturalRuler: 'gemini'
  },
  {
    id: 4,
    name: '第四宫',
    nameEn: 'Fourth House',
    symbol: 'Ⅳ',
    keywords: ['家庭', '根基', '父母', '房产', '安全感', '童年'],
    meaning: '代表家庭、根基、父母和房产',
    naturalRuler: 'cancer'
  },
  {
    id: 5,
    name: '第五宫',
    nameEn: 'Fifth House',
    symbol: 'Ⅴ',
    keywords: ['爱情', '创造力', '娱乐', '子女', '浪漫', '自我表达'],
    meaning: '代表爱情、创造力、娱乐和子女',
    naturalRuler: 'leo'
  },
  {
    id: 6,
    name: '第六宫',
    nameEn: 'Sixth House',
    symbol: 'Ⅵ',
    keywords: ['工作', '健康', '服务', '日常事务', '责任', '同事'],
    meaning: '代表工作、健康、服务和日常事务',
    naturalRuler: 'virgo'
  },
  {
    id: 7,
    name: '第七宫',
    nameEn: 'Seventh House',
    symbol: 'Ⅶ',
    keywords: ['伴侣', '婚姻', '合作', '公开敌人', '人际关系', '合伙'],
    meaning: '代表伴侣、婚姻、合作和人际关系',
    naturalRuler: 'libra'
  },
  {
    id: 8,
    name: '第八宫',
    nameEn: 'Eighth House',
    symbol: 'Ⅷ',
    keywords: ['转化', '死亡', '遗产', '投资', '共享资源', '深层情感'],
    meaning: '代表转化、死亡、遗产和共享资源',
    naturalRuler: 'scorpio'
  },
  {
    id: 9,
    name: '第九宫',
    nameEn: 'Ninth House',
    symbol: 'Ⅸ',
    keywords: ['旅行', '高等教育', '哲学', '宗教', '外国', '智慧'],
    meaning: '代表旅行、高等教育、哲学和宗教',
    naturalRuler: 'sagittarius'
  },
  {
    id: 10,
    name: '第十宫',
    nameEn: 'Tenth House',
    symbol: 'Ⅹ',
    keywords: ['事业', '声誉', '成就', '地位', '公众形象', '目标'],
    meaning: '代表事业、声誉、成就和社会地位',
    naturalRuler: 'capricorn'
  },
  {
    id: 11,
    name: '第十一宫',
    nameEn: 'Eleventh House',
    symbol: 'Ⅺ',
    keywords: ['朋友', '团体', '愿望', '社会活动', '人脉', '理想'],
    meaning: '代表朋友、团体、愿望和社会活动',
    naturalRuler: 'aquarius'
  },
  {
    id: 12,
    name: '第十二宫',
    nameEn: 'Twelfth House',
    symbol: 'Ⅻ',
    keywords: ['潜意识', '隐秘', '灵性', '牺牲', '孤独', '业力'],
    meaning: '代表潜意识、隐秘事务、灵性和牺牲',
    naturalRuler: 'pisces'
  }
];

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