import { TarotSpread } from '../types/tarot';

export const TAROT_SPREADS: TarotSpread[] = [
  {
    id: 'single',
    name: '单张牌',
    nameEn: 'Single Card',
    description: '最简单的牌阵，适合回答简单问题或获取每日指引',
    cardCount: 1,
    positions: [
      {
        id: 'position1',
        name: '核心指引',
        description: '问题的核心答案或当前状态',
        position: { x: 0, y: 0 }
      }
    ],
    适用场景: ['simple', 'general']
  },
  {
    id: 'three-card',
    name: '圣三角',
    nameEn: 'Three Card Spread',
    description: '经典的三张牌阵，可以解读过去、现在、未来，或者问题、原因、解决',
    cardCount: 3,
    positions: [
      {
        id: 'past',
        name: '过去',
        description: '影响当前情况的因素',
        position: { x: -150, y: 0 }
      },
      {
        id: 'present',
        name: '现在',
        description: '当前的状况和状态',
        position: { x: 0, y: 0 }
      },
      {
        id: 'future',
        name: '未来',
        description: '可能的发展方向和结果',
        position: { x: 150, y: 0 }
      }
    ],
    适用场景: ['past_present_future', 'simple', 'general']
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    nameEn: 'Celtic Cross',
    description: '最经典的深度分析牌阵，适合复杂问题的全面解读',
    cardCount: 10,
    positions: [
      {
        id: 'present',
        name: '现状',
        description: '当前的核心情况',
        position: { x: 0, y: 0 }
      },
      {
        id: 'challenge',
        name: '挑战',
        description: '面对的障碍和困难',
        position: { x: 0, y: 0, rotation: 90 }
      },
      {
        id: 'past',
        name: '过去',
        description: '影响当前的因素',
        position: { x: 0, y: -80 }
      },
      {
        id: 'future',
        name: '未来',
        description: '可能的发展趋势',
        position: { x: 0, y: 80 }
      },
      {
        id: 'above',
        name: '上方',
        description: '显性的目标和期望',
        position: { x: -80, y: -80 }
      },
      {
        id: 'below',
        name: '下方',
        description: '隐性的潜意识和根基',
        position: { x: 80, y: 80 }
      },
      {
        id: 'advice',
        name: '建议',
        description: '最佳的行动建议',
        position: { x: -80, y: 0 }
      },
      {
        id: 'external',
        name: '外部影响',
        description: '周围环境和他人影响',
        position: { x: 80, y: 0 }
      },
      {
        id: 'hopes_fears',
        name: '希望与恐惧',
        description: '内心的期望和担忧',
        position: { x: -80, y: 80 }
      },
      {
        id: 'outcome',
        name: '最终结果',
        description: '如果按照当前趋势发展可能的结果',
        position: { x: 80, y: -80 }
      }
    ],
    适用场景: ['complex', 'general']
  },
  {
    id: 'tree-of-life',
    name: '生命之树',
    nameEn: 'Tree of Life',
    description: '基于卡巴拉生命之树的深度牌阵，适合精神成长和人生路径分析',
    cardCount: 10,
    positions: [
      {
        id: 'kether',
        name: '皇冠',
        description: '灵性目标和最高理想',
        position: { x: 0, y: -120 }
      },
      {
        id: 'chokmah',
        name: '智慧',
        description: '创造力和行动力',
        position: { x: -60, y: -80 }
      },
      {
        id: 'binah',
        name: '理解',
        description: '洞察力和直觉',
        position: { x: 60, y: -80 }
      },
      {
        id: 'chesed',
        name: '仁慈',
        description: '爱与慈悲',
        position: { x: -90, y: -30 }
      },
      {
        id: 'geburah',
        name: '严厉',
        description: '力量与决心',
        position: { x: 90, y: -30 }
      },
      {
        id: 'tiphareth',
        name: '美丽',
        description: '和谐与平衡',
        position: { x: 0, y: -30 }
      },
      {
        id: 'netzach',
        name: '胜利',
        description: '情感与艺术',
        position: { x: -60, y: 30 }
      },
      {
        id: 'hod',
        name: '荣耀',
        description: '理性与逻辑',
        position: { x: 60, y: 30 }
      },
      {
        id: 'yesod',
        name: '基础',
        description: '潜意识与根基',
        position: { x: 0, y: 80 }
      },
      {
        id: 'malkuth',
        name: '王国',
        description: '物质世界和现实',
        position: { x: 0, y: 140 }
      }
    ],
    适用场景: ['spiritual', 'complex']
  },
  {
    id: 'four-elements',
    name: '四元素',
    nameEn: 'Four Elements',
    description: '基于四元素的平衡分析，适合身心灵整体评估',
    cardCount: 4,
    positions: [
      {
        id: 'fire',
        name: '火元素',
        description: '行动力、激情、创造力',
        position: { x: 0, y: -80 }
      },
      {
        id: 'water',
        name: '水元素',
        description: '情感、直觉、关系',
        position: { x: -80, y: 0 }
      },
      {
        id: 'air',
        name: '风元素',
        description: '思维、沟通、理性',
        position: { x: 80, y: 0 }
      },
      {
        id: 'earth',
        name: '土元素',
        description: '物质、健康、现实',
        position: { x: 0, y: 80 }
      }
    ],
    适用场景: ['health', 'spiritual', 'general']
  },
  {
    id: 'timeline',
    name: '时间流',
    nameEn: 'Timeline',
    description: '时间线预测牌阵，适合了解未来发展趋势',
    cardCount: 5,
    positions: [
      {
        id: 'past',
        name: '过去',
        description: '已经发生的影响',
        position: { x: -160, y: 0 }
      },
      {
        id: 'present',
        name: '现在',
        description: '当前的状况',
        position: { x: -80, y: 0 }
      },
      {
        id: 'near_future',
        name: '近期未来',
        description: '未来1-3个月的发展',
        position: { x: 0, y: 0 }
      },
      {
        id: 'mid_future',
        name: '中期未来',
        description: '未来3-6个月的发展',
        position: { x: 80, y: 0 }
      },
      {
        id: 'long_future',
        name: '远期未来',
        description: '未来6-12个月的发展',
        position: { x: 160, y: 0 }
      }
    ],
    适用场景: ['past_present_future', 'general']
  },
  {
    id: 'relationship',
    name: '关系牌阵',
    nameEn: 'Relationship Spread',
    description: '专门用于感情和人际关系分析的牌阵',
    cardCount: 7,
    positions: [
      {
        id: 'you',
        name: '你的状态',
        description: '你在关系中的位置和感受',
        position: { x: -120, y: -60 }
      },
      {
        id: 'partner',
        name: '对方状态',
        description: '对方在关系中的位置和感受',
        position: { x: 120, y: -60 }
      },
      {
        id: 'connection',
        name: '连接',
        description: '你们之间的连接和互动',
        position: { x: 0, y: -60 }
      },
      {
        id: 'strengths',
        name: '优势',
        description: '关系的优势和积极因素',
        position: { x: -60, y: 30 }
      },
      {
        id: 'challenges',
        name: '挑战',
        description: '关系的挑战和问题',
        position: { x: 60, y: 30 }
      },
      {
        id: 'advice',
        name: '建议',
        description: '改善关系的建议',
        position: { x: -60, y: 90 }
      },
      {
        id: 'outcome',
        name: '结果',
        description: '关系可能的发展方向',
        position: { x: 60, y: 90 }
      }
    ],
    适用场景: ['relationship']
  },
  {
    id: 'career',
    name: '事业牌阵',
    nameEn: 'Career Spread',
    description: '专门用于事业和职业发展的牌阵',
    cardCount: 5,
    positions: [
      {
        id: 'current',
        name: '当前状态',
        description: '当前的工作状况',
        position: { x: 0, y: -80 }
      },
      {
        id: 'strengths',
        name: '优势',
        description: '你的职业优势和能力',
        position: { x: -80, y: 0 }
      },
      {
        id: 'challenges',
        name: '挑战',
        description: '面临的职业挑战',
        position: { x: 80, y: 0 }
      },
      {
        id: 'opportunities',
        name: '机会',
        description: '潜在的职业机会',
        position: { x: -40, y: 80 }
      },
      {
        id: 'advice',
        name: '建议',
        description: '职业发展建议',
        position: { x: 40, y: 80 }
      }
    ],
    适用场景: ['career']
  }
];

export const TAROT_SYSTEM_INSTRUCTION = `
你是专业的塔罗解读智能体，具备深厚的塔罗知识和丰富的解读经验。

## 核心能力
1. 分析用户问题，判断问题类型和复杂度
2. 根据问题自动选择最适合的牌阵
3. 对抽出的牌面进行深度解读
4. 生成结构化的解读报告

## 牌阵选择原则
- 简单问题（是/否、单一事件）→ 单张牌
- 三元问题（过去-现在-未来、问题-原因-解决）→ 圣三角
- 深度综合分析 → 凯尔特十字
- 情感关系 → 关系牌阵
- 时间预测 → 时间流牌阵
- 身心灵平衡 → 四元素牌阵
- 事业职业 → 事业牌阵
- 精神成长 → 生命之树

## 解读原则
1. 结合牌面正逆位含义
2. 考虑牌阵中各牌位的关联性
3. 结合用户问题背景
4. 提供具体可行的建议
5. 保持客观中立，不做出绝对化的预测

## 输出格式
使用Markdown格式输出，包含：
- 牌阵说明
- 逐牌解读
- 整体解读
- 具体建议
- 关键词总结
`;
