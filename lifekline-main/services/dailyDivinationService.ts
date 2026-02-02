import { MAIN_STARS, SECONDARY_STARS, MINOR_STARS, SIXTY_FOUR_GUA } from '../constants/dailyDivination';
import { ZiweiDrawResult, GuaDrawResult, DailyDivinationResult, ZiweiStar } from '../types/dailyDivination';

class DailyDivinationService {
  // 随机抽取主星
  drawMainStar(): ZiweiStar {
    return MAIN_STARS[Math.floor(Math.random() * MAIN_STARS.length)];
  }

  // 随机抽取副星
  drawSecondaryStar(): ZiweiStar {
    return SECONDARY_STARS[Math.floor(Math.random() * SECONDARY_STARS.length)];
  }

  // 随机抽取杂曜
  drawMinorStar(): ZiweiStar {
    return MINOR_STARS[Math.floor(Math.random() * MINOR_STARS.length)];
  }

  // 抽取完整紫微三星
  drawZiweiStars(): ZiweiDrawResult {
    return {
      mainStar: this.drawMainStar(),
      secondaryStar: this.drawSecondaryStar(),
      minorStar: this.drawMinorStar(),
      timestamp: new Date()
    };
  }

  // 随机抽取六十四卦
  drawHexagram(): GuaDrawResult {
    return {
      hexagram: SIXTY_FOUR_GUA[Math.floor(Math.random() * SIXTY_FOUR_GUA.length)],
      timestamp: new Date()
    };
  }

  // 执行完整占卜
  divinate(question: string): DailyDivinationResult {
    return {
      ziwei: this.drawZiweiStars(),
      hexagram: this.drawHexagram(),
      question,
      timestamp: new Date()
    };
  }
}

export const dailyDivinationService = new DailyDivinationService();
