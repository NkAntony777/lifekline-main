import {
  CalculationMethod,
  ShiKeTianJiResult,
  HourPillar,
  KePillar,
  FullBazi,
  TianganShensha,
  DizhiShensha,
  GanType,
  ZhiType
} from '../types/shiketianji';
import { Lunar, LunarInstance } from 'lunar-javascript';
import {
  TIAN_GAN,
  DI_ZHI,
  VALID_GANZHI_PAIRS,
  GAN_TO_ZHI_MAP,
  XUN_KONG_MAP,
  LONGEVITY_MAP,
  NAYIN_MAP,
  TOUGAN_MAP,
  SHISHEN_MAP,
  TIANGAN_SHENSHA,
  DIZHI_SHENSHA,
  SHENSHA_ORDER,
  NAYIN_TO_WUXING
} from '../constants/shiketianji';

class ShiKeTianJiService {
  calculateFromCurrentTime(): ShiKeTianJiResult {
    const now = new Date();
    return this.calculateFromCustomTime(now);
  }

  calculateFromCustomTime(date: Date): ShiKeTianJiResult {
    const fullBazi = this.calculateFullBazi(date);
    const hourPillar = fullBazi.hourPillar;
    const kePillar = this.calculateKePillar(hourPillar.gan, date);

    return this.buildResult({
      method: 'custom-time',
      fullBazi,
      hourPillar,
      kePillar,
      timestamp: date
    });
  }

  calculateFromRandomNumber(randomNum: number, date?: Date): ShiKeTianJiResult {
    if (randomNum < 1 || randomNum > 12) {
      throw new Error('随机数必须在1-12之间');
    }

    const baseDate = date || new Date();
    const fullBazi = this.calculateFullBazi(baseDate);
    const hourPillar = fullBazi.hourPillar;

    const keIndex = randomNum - 1;
    const keZhi = DI_ZHI[keIndex];
    const keGan = this.calculateKeGan(hourPillar.gan, keIndex);

    const kePillar: KePillar = {
      ganzhi: keGan + keZhi,
      gan: keGan as GanType,
      zhi: keZhi as ZhiType,
      nayin: NAYIN_MAP[keGan + keZhi] || '未知',
      longevity: LONGEVITY_MAP[keGan as GanType]?.[keZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[keGan + keZhi] || '', keZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[keGan + keZhi] || '未知',
      tougan: TOUGAN_MAP[keZhi as ZhiType] || []
    };

    return this.buildResult({
      method: 'random-number',
      fullBazi,
      hourPillar,
      kePillar,
      timestamp: baseDate
    });
  }

  calculateFromCustomGanzhi(hourGan: string, hourZhi: string, keGan: string, keZhi: string): ShiKeTianJiResult {
    if (!this.isValidGanzhiPair(hourGan, hourZhi)) {
      throw new Error(`无效的时柱组合：${hourGan}${hourZhi}`);
    }

    if (!this.isValidGanzhiPair(keGan, keZhi)) {
      throw new Error(`无效的刻柱组合：${keGan}${keZhi}`);
    }

    const hourPillar: HourPillar = {
      ganzhi: hourGan + hourZhi,
      gan: hourGan as GanType,
      zhi: hourZhi as ZhiType,
      nayin: NAYIN_MAP[hourGan + hourZhi] || '未知',
      longevity: LONGEVITY_MAP[hourGan as GanType]?.[hourZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[hourGan + hourZhi] || '', hourZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[hourGan + hourZhi] || '未知',
      tougan: TOUGAN_MAP[hourZhi as ZhiType] || []
    };

    const kePillar: KePillar = {
      ganzhi: keGan + keZhi,
      gan: keGan as GanType,
      zhi: keZhi as ZhiType,
      nayin: NAYIN_MAP[keGan + keZhi] || '未知',
      longevity: LONGEVITY_MAP[keGan as GanType]?.[keZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[keGan + keZhi] || '', keZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[keGan + keZhi] || '未知',
      tougan: TOUGAN_MAP[keZhi as ZhiType] || []
    };

    return this.buildResult({
      method: 'custom-ganzhi',
      hourPillar,
      kePillar,
      timestamp: new Date()
    });
  }

  calculateNextPillar(result: ShiKeTianJiResult): ShiKeTianJiResult {
    const { hourPillar, kePillar, fullBazi } = result;

    let keZhiIndex = DI_ZHI.indexOf(kePillar.zhi);
    let shiZhiIndex = DI_ZHI.indexOf(hourPillar.zhi);

    keZhiIndex = (keZhiIndex + 1) % 12;
    const newKeZhi = DI_ZHI[keZhiIndex];

    let newShiZhi = hourPillar.zhi;
    let newShiGan = hourPillar.gan;

    if (kePillar.zhi === '亥' && newKeZhi === '子') {
      shiZhiIndex = (shiZhiIndex + 1) % 12;
      newShiZhi = DI_ZHI[shiZhiIndex];

      const shiGanIndex = TIAN_GAN.indexOf(hourPillar.gan);
      const newShiGanIndex = (shiGanIndex + 1) % 10;
      newShiGan = TIAN_GAN[newShiGanIndex];

      if (!VALID_GANZHI_PAIRS.includes(newShiGan + newShiZhi)) {
        for (let i = 0; i < TIAN_GAN.length; i++) {
          const testGan = TIAN_GAN[i];
          if (VALID_GANZHI_PAIRS.includes(testGan + newShiZhi)) {
            newShiGan = testGan;
            break;
          }
        }
      }
    }

    const newKeGan = this.calculateKeGan(newShiGan, keZhiIndex);

    const newHourPillar: HourPillar = {
      ganzhi: newShiGan + newShiZhi,
      gan: newShiGan as GanType,
      zhi: newShiZhi as ZhiType,
      nayin: NAYIN_MAP[newShiGan + newShiZhi] || '未知',
      longevity: LONGEVITY_MAP[newShiGan as GanType]?.[newShiZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[newShiGan + newShiZhi] || '', newShiZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[newShiGan + newShiZhi] || '未知',
      tougan: TOUGAN_MAP[newShiZhi as ZhiType] || []
    };

    const newKePillar: KePillar = {
      ganzhi: newKeGan + newKeZhi,
      gan: newKeGan as GanType,
      zhi: newKeZhi as ZhiType,
      nayin: NAYIN_MAP[newKeGan + newKeZhi] || '未知',
      longevity: LONGEVITY_MAP[newKeGan as GanType]?.[newKeZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[newKeGan + newKeZhi] || '', newKeZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[newKeGan + newKeZhi] || '未知',
      tougan: TOUGAN_MAP[newKeZhi as ZhiType] || []
    };

    return this.buildResult({
      method: result.method,
      fullBazi,
      hourPillar: newHourPillar,
      kePillar: newKePillar,
      timestamp: new Date()
    });
  }

  calculatePreviousPillar(result: ShiKeTianJiResult): ShiKeTianJiResult {
    const { hourPillar, kePillar, fullBazi } = result;

    let keZhiIndex = DI_ZHI.indexOf(kePillar.zhi);
    let shiZhiIndex = DI_ZHI.indexOf(hourPillar.zhi);

    keZhiIndex = (keZhiIndex - 1 + 12) % 12;
    const newKeZhi = DI_ZHI[keZhiIndex];

    let newShiZhi = hourPillar.zhi;
    let newShiGan = hourPillar.gan;

    if (kePillar.zhi === '子' && newKeZhi === '亥') {
      shiZhiIndex = (shiZhiIndex - 1 + 12) % 12;
      newShiZhi = DI_ZHI[shiZhiIndex];

      const shiGanIndex = TIAN_GAN.indexOf(hourPillar.gan);
      const newShiGanIndex = (shiGanIndex - 1 + 10) % 10;
      newShiGan = TIAN_GAN[newShiGanIndex];

      if (!VALID_GANZHI_PAIRS.includes(newShiGan + newShiZhi)) {
        for (let i = TIAN_GAN.length - 1; i >= 0; i--) {
          const testGan = TIAN_GAN[i];
          if (VALID_GANZHI_PAIRS.includes(testGan + newShiZhi)) {
            newShiGan = testGan;
            break;
          }
        }
      }
    }

    const newKeGan = this.calculateKeGan(newShiGan, keZhiIndex);

    const newHourPillar: HourPillar = {
      ganzhi: newShiGan + newShiZhi,
      gan: newShiGan as GanType,
      zhi: newShiZhi as ZhiType,
      nayin: NAYIN_MAP[newShiGan + newShiZhi] || '未知',
      longevity: LONGEVITY_MAP[newShiGan as GanType]?.[newShiZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[newShiGan + newShiZhi] || '', newShiZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[newShiGan + newShiZhi] || '未知',
      tougan: TOUGAN_MAP[newShiZhi as ZhiType] || []
    };

    const newKePillar: KePillar = {
      ganzhi: newKeGan + newKeZhi,
      gan: newKeGan as GanType,
      zhi: newKeZhi as ZhiType,
      nayin: NAYIN_MAP[newKeGan + newKeZhi] || '未知',
      longevity: LONGEVITY_MAP[newKeGan as GanType]?.[newKeZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[newKeGan + newKeZhi] || '', newKeZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[newKeGan + newKeZhi] || '未知',
      tougan: TOUGAN_MAP[newKeZhi as ZhiType] || []
    };

    return this.buildResult({
      method: result.method,
      fullBazi,
      hourPillar: newHourPillar,
      kePillar: newKePillar,
      timestamp: new Date()
    });
  }

  private calculateFullBazi(date: Date): FullBazi {
    const lunar = this.getLunarFromDate(date);
    
    return {
      yearPillar: {
        ganzhi: lunar.getYearGan() + lunar.getYearZhi(),
        gan: lunar.getYearGan() as GanType,
        zhi: lunar.getYearZhi() as ZhiType,
        nayin: NAYIN_MAP[lunar.getYearGan() + lunar.getYearZhi()] || '未知',
        longevity: LONGEVITY_MAP[lunar.getYearGan() as GanType]?.[lunar.getYearZhi() as ZhiType] || '未知',
        nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[lunar.getYearGan() + lunar.getYearZhi()] || '', lunar.getYearZhi() as ZhiType) as any,
        xunkong: XUN_KONG_MAP[lunar.getYearGan() + lunar.getYearZhi()] || '未知',
        tougan: TOUGAN_MAP[lunar.getYearZhi() as ZhiType] || []
      },
      monthPillar: {
        ganzhi: lunar.getMonthGan() + lunar.getMonthZhi(),
        gan: lunar.getMonthGan() as GanType,
        zhi: lunar.getMonthZhi() as ZhiType,
        nayin: NAYIN_MAP[lunar.getMonthGan() + lunar.getMonthZhi()] || '未知',
        longevity: LONGEVITY_MAP[lunar.getMonthGan() as GanType]?.[lunar.getMonthZhi() as ZhiType] || '未知',
        nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[lunar.getMonthGan() + lunar.getMonthZhi()] || '', lunar.getMonthZhi() as ZhiType) as any,
        xunkong: XUN_KONG_MAP[lunar.getMonthGan() + lunar.getMonthZhi()] || '未知',
        tougan: TOUGAN_MAP[lunar.getMonthZhi() as ZhiType] || []
      },
      dayPillar: {
        ganzhi: lunar.getDayGan() + lunar.getDayZhi(),
        gan: lunar.getDayGan() as GanType,
        zhi: lunar.getDayZhi() as ZhiType,
        nayin: NAYIN_MAP[lunar.getDayGan() + lunar.getDayZhi()] || '未知',
        longevity: LONGEVITY_MAP[lunar.getDayGan() as GanType]?.[lunar.getDayZhi() as ZhiType] || '未知',
        nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[lunar.getDayGan() + lunar.getDayZhi()] || '', lunar.getDayZhi() as ZhiType) as any,
        xunkong: XUN_KONG_MAP[lunar.getDayGan() + lunar.getDayZhi()] || '未知',
        tougan: TOUGAN_MAP[lunar.getDayZhi() as ZhiType] || []
      },
      hourPillar: {
        ganzhi: lunar.getTimeGan() + lunar.getTimeZhi(),
        gan: lunar.getTimeGan() as GanType,
        zhi: lunar.getTimeZhi() as ZhiType,
        nayin: NAYIN_MAP[lunar.getTimeGan() + lunar.getTimeZhi()] || '未知',
        longevity: LONGEVITY_MAP[lunar.getTimeGan() as GanType]?.[lunar.getTimeZhi() as ZhiType] || '未知',
        nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[lunar.getTimeGan() + lunar.getTimeZhi()] || '', lunar.getTimeZhi() as ZhiType) as any,
        xunkong: XUN_KONG_MAP[lunar.getTimeGan() + lunar.getTimeZhi()] || '未知',
        tougan: TOUGAN_MAP[lunar.getTimeZhi() as ZhiType] || []
      }
    };
  }

  private calculateKePillar(hourGan: string, date: Date): KePillar {
    const lunar = this.getLunarFromDate(date);
    const shiZhi = lunar.getTimeZhi();

    const zhiStartHourMap: Record<string, number> = {
      '子': 23, '丑': 1, '寅': 3, '卯': 5, '辰': 7, '巳': 9,
      '午': 11, '未': 13, '申': 15, '酉': 17, '戌': 19, '亥': 21
    };
    const startHour = zhiStartHourMap[shiZhi];

    const startDate = new Date(date);
    if (date.getHours() >= startHour) {
      startDate.setHours(startHour, 0, 0, 0);
    } else {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(startHour, 0, 0, 0);
    }

    const diffMs = date.getTime() - startDate.getTime();
    const totalMinutes = Math.floor(diffMs / 1000 / 60);
    let keIndex = Math.floor(totalMinutes / 10);
    if (keIndex < 0) keIndex = 0;
    if (keIndex > 11) keIndex = 11;

    const keZhi = DI_ZHI[keIndex];
    const keGan = this.calculateKeGan(hourGan, keIndex);

    return {
      ganzhi: keGan + keZhi,
      gan: keGan as GanType,
      zhi: keZhi as ZhiType,
      nayin: NAYIN_MAP[keGan + keZhi] || '未知',
      longevity: LONGEVITY_MAP[keGan as GanType]?.[keZhi as ZhiType] || '未知',
      nayinLongevity: this.calculateNayinLongevity(NAYIN_MAP[keGan + keZhi] || '', keZhi as ZhiType) as any,
      xunkong: XUN_KONG_MAP[keGan + keZhi] || '未知',
      tougan: TOUGAN_MAP[keZhi as ZhiType] || []
    };
  }

  private calculateKeGan(hourGan: string, keIndex: number): string {
    const starters: Record<string, number> = {
      '甲': 0, '己': 0,
      '乙': 2, '庚': 2,
      '丙': 4, '辛': 4,
      '丁': 6, '壬': 6,
      '戊': 8, '癸': 8
    };
    return TIAN_GAN[(starters[hourGan] + keIndex) % 10];
  }

  private calculateNayinLongevity(nayin: string, zhi: ZhiType): string {
    const wuxing = NAYIN_TO_WUXING[nayin];
    if (!wuxing) {
      return '未知';
    }

    return LONGEVITY_MAP[wuxing]?.[zhi] || '未知';
  }

  private buildResult(params: {
    method: CalculationMethod;
    fullBazi?: FullBazi;
    hourPillar: HourPillar;
    kePillar: KePillar;
    timestamp: Date;
  }): ShiKeTianJiResult {
    const { method, fullBazi, hourPillar, kePillar, timestamp } = params;

    const shishen = SHISHEN_MAP[hourPillar.gan]?.[kePillar.gan] || '未知';

    const tianganShensha: TianganShensha = {};
    SHENSHA_ORDER.tiangan.forEach((type) => {
      tianganShensha[type as keyof TianganShensha] = {
        hour: TIANGAN_SHENSHA[type]?.[hourPillar.gan] || '',
        ke: TIANGAN_SHENSHA[type]?.[kePillar.gan] || ''
      };
    });

    const dizhiShensha: DizhiShensha = {};
    SHENSHA_ORDER.dizhi.forEach((type) => {
      dizhiShensha[type as keyof DizhiShensha] = {
        hour: DIZHI_SHENSHA[type]?.[hourPillar.zhi] || '',
        ke: DIZHI_SHENSHA[type]?.[kePillar.zhi] || ''
      };
    });

    return {
      method,
      fullBazi,
      hourPillar,
      kePillar,
      shishen,
      tianganShensha,
      dizhiShensha,
      timestamp
    };
  }

  private isValidGanzhiPair(gan: string, zhi: string): boolean {
    return VALID_GANZHI_PAIRS.includes(gan + zhi);
  }

  private getLunarFromDate(date: Date): LunarInstance {
    if (!Lunar) {
      throw new Error('Lunar库未加载');
    }
    return Lunar.fromDate(date);
  }

  getValidZhiForGan(gan: string): string[] {
    return GAN_TO_ZHI_MAP[gan as GanType] || [];
  }

  formatResultForPrompt(result: ShiKeTianJiResult): string {
    let output = `时刻天机排盘结果\n`;
    output += `计算方法：${this.getMethodName(result.method)}\n`;
    output += `时间：${result.timestamp.toLocaleString('zh-CN')}\n\n`;

    if (result.fullBazi) {
      output += `完整八字：\n`;
      output += `  年柱：${result.fullBazi.yearPillar.gan}${result.fullBazi.yearPillar.zhi}（${result.fullBazi.yearPillar.nayin}）\n`;
      output += `  月柱：${result.fullBazi.monthPillar.gan}${result.fullBazi.monthPillar.zhi}（${result.fullBazi.monthPillar.nayin}）\n`;
      output += `  日柱：${result.fullBazi.dayPillar.gan}${result.fullBazi.dayPillar.zhi}（${result.fullBazi.dayPillar.nayin}）\n`;
      output += `  时柱：${result.fullBazi.hourPillar.gan}${result.fullBazi.hourPillar.zhi}（${result.fullBazi.hourPillar.nayin}）\n\n`;
    }

    output += `时柱：\n`;
    output += `  天干：${result.hourPillar.gan}\n`;
    output += `  地支：${result.hourPillar.zhi}\n`;
    output += `  纳音：${result.hourPillar.nayin}\n`;
    output += `  十二长生：${result.hourPillar.longevity}\n`;
    output += `  旬空：${result.hourPillar.xunkong}\n`;
    output += `  透干：${result.hourPillar.tougan.join('、') || '无'}\n\n`;

    output += `刻柱：\n`;
    output += `  天干：${result.kePillar.gan}\n`;
    output += `  地支：${result.kePillar.zhi}\n`;
    output += `  纳音：${result.kePillar.nayin}\n`;
    output += `  十二长生：${result.kePillar.longevity}\n`;
    output += `  旬空：${result.kePillar.xunkong}\n`;
    output += `  透干：${result.kePillar.tougan.join('、') || '无'}\n\n`;

    output += `十神：${result.shishen}\n\n`;

    output += `天干神煞：\n`;
    Object.entries(result.tianganShensha).forEach(([name, values]) => {
      if (values.hour || values.ke) {
        output += `  ${name}：时柱[${values.hour || '—'}] 刻柱[${values.ke || '—'}]\n`;
      }
    });

    output += `\n地支神煞：\n`;
    Object.entries(result.dizhiShensha).forEach(([name, values]) => {
      if (values.hour || values.ke) {
        output += `  ${name}：时柱[${values.hour || '—'}] 刻柱[${values.ke || '—'}]\n`;
      }
    });

    return output;
  }

  generateInterpretationPrompt(question: string, result: ShiKeTianJiResult): string {
    const formattedResult = this.formatResultForPrompt(result);

    return `
用户问题：${question}

${formattedResult}

请根据以上时刻天机排盘结果，为用户提供专业的解读。
解读要点：
1. 分析时柱和刻柱的五行属性及其相互作用
2. 解释纳音、十二长生、旬空等概念的含义
3. 分析十神关系及其对问题的启示
4. 解读天干神煞和地支神煞的影响
5. 结合用户问题，给出具体的建议和指导
    `;
  }

  private getMethodName(method: CalculationMethod): string {
    const names: Record<CalculationMethod, string> = {
      'current-time': '当前时间',
      'custom-time': '自定义时间',
      'random-number': '随机数起盘',
      'custom-ganzhi': '自定义干支'
    };
    return names[method];
  }
}

export const shiketianjiService = new ShiKeTianJiService();
