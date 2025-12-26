import { 
  TarotCard, 
  TarotSpread, 
  DrawnCard, 
  TarotReadingInput, 
  QuestionType,
  SpreadRecommendation 
} from '../types/tarot';
import { TAROT_SPREADS } from '../constants/tarot';
import tarotCardsData from '../data/tarotCards.json';

class TarotService {
  private allCards: TarotCard[] = [];

  constructor() {
    this.loadCards();
  }

  private loadCards(): void {
    const majorArcana = tarotCardsData.majorArcana as TarotCard[];
    const minorArcana = tarotCardsData.minorArcana;
    
    this.allCards = [
      ...majorArcana,
      ...(minorArcana.wands as TarotCard[]),
      ...(minorArcana.cups as TarotCard[]),
      ...(minorArcana.swords as TarotCard[]),
      ...(minorArcana.pentacles as TarotCard[])
    ];
  }

  getAllCards(): TarotCard[] {
    return [...this.allCards];
  }

  getCardById(id: string): TarotCard | undefined {
    return this.allCards.find(card => card.id === id);
  }

  getSpreadById(id: string): TarotSpread | undefined {
    return TAROT_SPREADS.find(spread => spread.id === id);
  }

  getAllSpreads(): TarotSpread[] {
    return [...TAROT_SPREADS];
  }

  shuffleCards(cards: TarotCard[]): TarotCard[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  drawRandomCards(count: number, excludeIds?: string[]): TarotCard[] {
    let availableCards = this.shuffleCards(this.allCards);
    
    if (excludeIds && excludeIds.length > 0) {
      availableCards = availableCards.filter(card => !excludeIds.includes(card.id));
    }
    
    return availableCards.slice(0, count);
  }

  drawSpecificCards(cardIds: string[]): TarotCard[] {
    const cards: TarotCard[] = [];
    for (const id of cardIds) {
      const card = this.getCardById(id);
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }

  isReversed(): boolean {
    return Math.random() < 0.3;
  }

  analyzeQuestionType(question: string): QuestionType {
    const lowerQuestion = question.toLowerCase();
    
    const relationshipKeywords = ['爱', '感情', '关系', '婚姻', '恋爱', '伴侣', '男朋友', '女朋友', '分手', '复合', '婚姻', '关系'];
    const careerKeywords = ['工作', '事业', '职业', '升职', '跳槽', '工作', '公司', '老板', '同事', '面试', '求职'];
    const healthKeywords = ['健康', '身体', '病', '健康', '医疗', '治疗', '康复'];
    const spiritualKeywords = ['灵性', '精神', '成长', '觉醒', '修行', '冥想', '灵魂'];
    const timelineKeywords = ['未来', '以后', '明年', '下个月', '接下来', '将来', '预测', '趋势'];
    const complexKeywords = ['如何', '怎样', '为什么', '分析', '评估', '综合', '全面', '详细'];
    const simpleKeywords = ['是否', '会', '能', '可以', '什么时候', '哪里', '谁'];

    if (relationshipKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'relationship';
    }
    
    if (careerKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'career';
    }
    
    if (healthKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'health';
    }
    
    if (spiritualKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'spiritual';
    }
    
    if (timelineKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'past_present_future';
    }
    
    if (complexKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'complex';
    }
    
    if (simpleKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'simple';
    }
    
    return 'general';
  }

  recommendSpread(question: string): SpreadRecommendation {
    const questionType = this.analyzeQuestionType(question);
    
    const matchingSpreads = TAROT_SPREADS.filter(spread => 
      spread.适用场景.includes(questionType)
    );

    if (matchingSpreads.length === 0) {
      return {
        spread: TAROT_SPREADS[0],
        reason: '使用默认牌阵进行解读',
        confidence: 0.5
      };
    }

    const bestMatch = matchingSpreads[0];
    const confidence = matchingSpreads.length === 1 ? 0.9 : 0.7;

    const reasonMap: Record<QuestionType, string> = {
      simple: '这是一个简单问题，适合使用单张牌获得直接答案',
      past_present_future: '这是一个关于时间线的问题，适合使用时间流或圣三角牌阵',
      complex: '这是一个复杂问题，适合使用凯尔特十字进行深度分析',
      relationship: '这是一个关于感情关系的问题，适合使用关系牌阵',
      career: '这是一个关于事业的问题，适合使用事业牌阵',
      health: '这是一个关于健康的问题，适合使用四元素牌阵进行身心灵分析',
      spiritual: '这是一个关于精神成长的问题，适合使用生命之树牌阵',
      general: '这是一个综合性问题，适合使用经典牌阵进行解读'
    };

    return {
      spread: bestMatch,
      reason: reasonMap[questionType],
      confidence
    };
  }

  generateSpread(input: TarotReadingInput): { spread: TarotSpread; drawnCards: DrawnCard[] } {
    let spread: TarotSpread;

    if (input.spreadId) {
      const selectedSpread = this.getSpreadById(input.spreadId);
      if (!selectedSpread) {
        throw new Error(`未找到牌阵: ${input.spreadId}`);
      }
      spread = selectedSpread;
    } else if (input.autoSelectSpread) {
      const recommendation = this.recommendSpread(input.question);
      spread = recommendation.spread;
    } else {
      spread = TAROT_SPREADS[0];
    }

    let cards: TarotCard[];
    if (input.specificCards && input.specificCards.length > 0) {
      cards = this.drawSpecificCards(input.specificCards);
    } else {
      cards = this.drawRandomCards(spread.cardCount);
    }

    const drawnCards: DrawnCard[] = spread.positions.map((position, index) => ({
      card: cards[index],
      position,
      isReversed: this.isReversed()
    }));

    return { spread, drawnCards };
  }

  getCardMeaning(card: TarotCard, isReversed: boolean): string {
    return isReversed ? card.meaningReversed : card.meaningUpright;
  }

  formatDrawnCardsForPrompt(drawnCards: DrawnCard[]): string {
    return drawnCards.map((drawn, index) => {
      const positionName = drawn.position.name;
      const cardName = drawn.card.name;
      const position = drawn.isReversed ? '逆位' : '正位';
      const meaning = this.getCardMeaning(drawn.card, drawn.isReversed);
      const keywords = drawn.card.keywords.join('、');
      
      return `${index + 1}. ${positionName}位：${cardName}（${position}）
   - 关键词：${keywords}
   - 含义：${meaning}`;
    }).join('\n\n');
  }
}

export const tarotService = new TarotService();
