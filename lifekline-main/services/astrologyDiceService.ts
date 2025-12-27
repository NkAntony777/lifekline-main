import { 
  Planet, 
  Zodiac, 
  House, 
  DiceResult, 
  QuestionType 
} from '../types/astrologyDice';
import { PLANETS, ZODIACS, HOUSES } from '../constants/astrologyDice';

class AstrologyDiceService {
  private planets: Planet[] = PLANETS;
  private zodiacs: Zodiac[] = ZODIACS;
  private houses: House[] = HOUSES;

  getAllPlanets(): Planet[] {
    return [...this.planets];
  }

  getAllZodiacs(): Zodiac[] {
    return [...this.zodiacs];
  }

  getAllHouses(): House[] {
    return [...this.houses];
  }

  getPlanetById(id: string): Planet | undefined {
    return this.planets.find(planet => planet.id === id);
  }

  getZodiacById(id: string): Zodiac | undefined {
    return this.zodiacs.find(zodiac => zodiac.id === id);
  }

  getHouseById(id: number): House | undefined {
    return this.houses.find(house => house.id === id);
  }

  drawRandomPlanet(): Planet {
    const randomIndex = Math.floor(Math.random() * this.planets.length);
    return this.planets[randomIndex];
  }

  drawRandomZodiac(): Zodiac {
    const randomIndex = Math.floor(Math.random() * this.zodiacs.length);
    return this.zodiacs[randomIndex];
  }

  drawRandomHouse(): House {
    const randomIndex = Math.floor(Math.random() * this.houses.length);
    return this.houses[randomIndex];
  }

  rollDice(): DiceResult {
    const planet = this.drawRandomPlanet();
    const zodiac = this.drawRandomZodiac();
    const house = this.drawRandomHouse();

    return {
      planet,
      zodiac,
      house,
      timestamp: new Date()
    };
  }

  analyzeQuestionType(question: string): QuestionType {
    const lowerQuestion = question.toLowerCase();

    const loveKeywords = ['爱', '感情', '关系', '婚姻', '恋爱', '伴侣', '男朋友', '女朋友', '分手', '复合', '情感', '心动'];
    const careerKeywords = ['工作', '事业', '职业', '升职', '跳槽', '公司', '老板', '同事', '面试', '求职', '发展', '职业'];
    const healthKeywords = ['健康', '身体', '病', '医疗', '治疗', '康复', '身体', '养生', '锻炼'];
    const wealthKeywords = ['钱', '财富', '投资', '理财', '收入', '财务', '赚钱', '经济', '资产', '金钱'];
    const familyKeywords = ['家庭', '父母', '孩子', '兄弟姐妹', '家人', '亲情', '家庭关系', '育儿'];
    const studyKeywords = ['学习', '考试', '教育', '学校', '成绩', '升学', '知识', '技能', '培训'];
    const travelKeywords = ['旅行', '旅游', '出行', '交通', '移动', '搬家', '异地', '出差'];

    if (loveKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'love';
    }

    if (careerKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'career';
    }

    if (healthKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'health';
    }

    if (wealthKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'wealth';
    }

    if (familyKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'family';
    }

    if (studyKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'study';
    }

    if (travelKeywords.some(kw => lowerQuestion.includes(kw))) {
      return 'travel';
    }

    return 'general';
  }

  formatDiceResultForPrompt(result: DiceResult): string {
    return `
星星：${result.planet.name}（${result.planet.symbol}）
  - 元素：${result.planet.element}
  - 关键词：${result.planet.keywords.join('、')}
  - 含义：${result.planet.meaning}

星座：${result.zodiac.name}（${result.zodiac.symbol}）
  - 元素：${result.zodiac.element}
  - 性质：${result.zodiac.quality}
  - 守护星：${this.getPlanetById(result.zodiac.ruler)?.nameEn || 'Unknown'}
  - 关键词：${result.zodiac.keywords.join('、')}
  - 含义：${result.zodiac.meaning}

宫位：${result.house.name}（${result.house.symbol}）
  - 自然守护：${this.getZodiacById(result.house.naturalRuler)?.name || 'Unknown'}
  - 关键词：${result.house.keywords.join('、')}
  - 含义：${result.house.meaning}
    `;
  }

  generateInterpretationPrompt(question: string, result: DiceResult): string {
    const diceResult = this.formatDiceResultForPrompt(result);
    const questionType = this.analyzeQuestionType(question);

    const typeContext: Record<QuestionType, string> = {
      love: '这是一个关于感情和爱情的问题',
      career: '这是一个关于工作和事业的问题',
      health: '这是一个关于健康和身体的问题',
      wealth: '这是一个关于财富和财务的问题',
      family: '这是一个关于家庭和亲情的问题',
      study: '这是一个关于学习和教育的问题',
      travel: '这是一个关于旅行和出行的问题',
      general: '这是一个综合性的问题'
    };

    return `
${typeContext[questionType]}

用户问题：${question}

占星骰子结果：
${diceResult}

请根据以上信息，为用户提供专业的占星骰子解读。
    `;
  }
}

export const astrologyDiceService = new AstrologyDiceService();