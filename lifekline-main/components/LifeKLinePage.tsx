import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Compass,
  Copy,
  Download,
  FileDown,
  FileUp,
  Loader2,
  Printer,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import AnalysisResult from './AnalysisResult';
import LifeJourneyVisualizer from './LifeJourneyVisualizer';
import { BAZI_SYSTEM_INSTRUCTION } from '../constants';
import { Gender, KLinePoint, LifeDestinyResult } from '../types';
import { Solar } from 'lunar-javascript';

interface LifeKLinePageProps {
  onBack: () => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
}

interface GeneratorFormData {
  name: string;
  gender: Gender;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  startAge: string;
  firstDaYun: string;
  reverseStartYear: string;
  reverseEndYear: string;
}

interface ReverseBirthCandidate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  display: string;
}

interface VisualizationBirthProfile {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  name?: string;
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const asNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const isValidDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const normalizeScore10 = (value: unknown, fallback: number): number => {
  const parsed = asNumber(value, fallback);
  return parsed > 10 ? clamp(parsed / 10, 0, 10) : clamp(parsed, 0, 10);
};

const parseOptionalInteger = (value: string): number | null => {
  const text = value.trim();
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
};

const inferBirthYearFromChart = (chartData?: KLinePoint[]): number | null => {
  if (!chartData?.length) return null;
  const firstAgePoint = chartData.find((point) => point.age === 1);
  if (firstAgePoint) return Math.trunc(firstAgePoint.year);

  const sorted = [...chartData].sort((a, b) => a.age - b.age);
  const earliest = sorted[0];
  if (!earliest) return null;
  return Math.trunc(earliest.year - (earliest.age - 1));
};

const deriveBirthProfileFromBazi = (
  bazi: string[],
  chartData: KLinePoint[] | undefined,
  preferredYear: number | null,
  rangeStart: number | null,
  rangeEnd: number | null,
  name?: string,
): VisualizationBirthProfile | undefined => {
  const [yearPillar, monthPillar, dayPillar, hourPillar] = (bazi || []).map((item) => (item || '').trim());
  if (!yearPillar || !monthPillar || !dayPillar || !hourPillar) return undefined;

  const chartBirthYear = inferBirthYearFromChart(chartData);
  const startFromRange = Number.isFinite(rangeStart as number) ? (rangeStart as number) : null;
  const endFromRange = Number.isFinite(rangeEnd as number) ? (rangeEnd as number) : null;
  const hasRange = startFromRange !== null && endFromRange !== null;

  const anchorYear = preferredYear ?? chartBirthYear ?? (hasRange ? Math.min(startFromRange!, endFromRange!) : null);
  const minYear = hasRange
    ? Math.min(startFromRange!, endFromRange!)
    : anchorYear !== null
      ? Math.max(1, anchorYear - 5)
      : 1900;
  const maxYear = hasRange
    ? Math.max(startFromRange!, endFromRange!)
    : anchorYear !== null
      ? anchorYear + 5
      : new Date().getFullYear();

  try {
    const rawList = Solar.fromBaZi(yearPillar, monthPillar, dayPillar, hourPillar, 2, minYear) as Array<{
      getYear: () => number;
      getMonth: () => number;
      getDay: () => number;
      getHour: () => number;
      getMinute: () => number;
    }>;

    const candidates = rawList.filter((item) => {
      const y = item.getYear();
      return y >= minYear && y <= maxYear;
    });
    if (!candidates.length) return undefined;

    const best = [...candidates].sort((a, b) => {
      const ay = a.getYear();
      const by = b.getYear();
      const scoreA = Math.abs(ay - (anchorYear ?? ay));
      const scoreB = Math.abs(by - (anchorYear ?? by));
      if (scoreA !== scoreB) return scoreA - scoreB;
      return ay - by;
    })[0];

    return {
      year: best.getYear(),
      month: best.getMonth(),
      day: best.getDay(),
      hour: best.getHour(),
      minute: best.getMinute(),
      name,
    };
  } catch {
    return undefined;
  }
};

const normalizePoint = (item: any, index: number): KLinePoint => {
  const age = asNumber(item?.age, index + 1);
  const score = asNumber(item?.score, asNumber(item?.close, 50));
  const open = asNumber(item?.open, score - 2);
  const close = asNumber(item?.close, score);
  const high = Math.max(asNumber(item?.high, Math.max(open, close) + 3), open, close);
  const low = Math.min(asNumber(item?.low, Math.min(open, close) - 3), open, close);

  return {
    age,
    year: asNumber(item?.year, 1900 + age),
    ganZhi: typeof item?.ganZhi === 'string' && item.ganZhi.trim() ? item.ganZhi.trim() : '-',
    daYun: typeof item?.daYun === 'string' && item.daYun.trim() ? item.daYun.trim() : '未标注',
    open,
    close,
    high,
    low,
    score,
    reason: typeof item?.reason === 'string' && item.reason.trim() ? item.reason.trim() : '阶段趋势平稳。',
  };
};

const normalizeResult = (source: any): LifeDestinyResult => {
  const rawPoints = Array.isArray(source?.chartPoints)
    ? source.chartPoints
    : Array.isArray(source?.chartData)
      ? source.chartData
      : null;

  if (!rawPoints || rawPoints.length < 10) {
    throw new Error('数据格式不完整：至少需要 10 条 chartPoints。');
  }

  return {
    chartData: rawPoints.map((item: any, index: number) => normalizePoint(item, index)),
    analysis: {
      bazi: Array.isArray(source?.bazi) ? source.bazi : [],
      summary: source?.summary || '暂无总评。',
      summaryScore: normalizeScore10(source?.summaryScore, 5),
      personality: source?.personality || '暂无性格分析。',
      personalityScore: normalizeScore10(source?.personalityScore, 5),
      industry: source?.industry || '暂无事业分析。',
      industryScore: normalizeScore10(source?.industryScore, 5),
      fengShui: source?.fengShui || '暂无方位建议。',
      fengShuiScore: normalizeScore10(source?.fengShuiScore, 5),
      wealth: source?.wealth || '暂无财富分析。',
      wealthScore: normalizeScore10(source?.wealthScore, 5),
      marriage: source?.marriage || '暂无恋情分析。',
      marriageScore: normalizeScore10(source?.marriageScore, 5),
      health: source?.health || '暂无健康分析。',
      healthScore: normalizeScore10(source?.healthScore, 5),
      family: source?.family || '暂无家庭分析。',
      familyScore: normalizeScore10(source?.familyScore, 5),
      crypto: source?.crypto || '暂无加密资产分析。',
      cryptoScore: normalizeScore10(source?.cryptoScore, 5),
      cryptoYear: source?.cryptoYear || '待定',
      cryptoStyle: source?.cryptoStyle || '现货定投',
    },
  };
};

const extractJsonObject = (input: string): string => {
  const content = input.trim();
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) return content.slice(start, end + 1);
  return content;
};

const repairCommonJsonIssues = (input: string): string => {
  return input
    .replace(/^\uFEFF/, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();
};

const parseJsonWithCandidates = (rawText: string): any => {
  const extracted = extractJsonObject(rawText);
  const candidates = Array.from(new Set([extracted, repairCommonJsonIssues(extracted)]));
  let lastError: unknown = null;

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('JSON parse failed');
};

const getDaYunDirection = (gender: Gender, yearPillar: string): 'Forward' | 'Backward' => {
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const stem = yearPillar.trim().charAt(0);
  const isYangYear = yangStems.includes(stem);
  if (gender === Gender.MALE) return isYangYear ? 'Forward' : 'Backward';
  return isYangYear ? 'Backward' : 'Forward';
};

const buildUserPrompt = (formData: GeneratorFormData): string => {
  const genderText = formData.gender === Gender.MALE ? '男' : '女';
  const direction = getDaYunDirection(formData.gender, formData.yearPillar);
  const startAge = asNumber(formData.startAge, 1);

  return `
请根据以下八字信息，严格返回纯 JSON 数据，不要包含 markdown 或解释文字。
【基本信息】
姓名：${formData.name || '未提供'}
性别：${genderText}
出生年份：${formData.birthYear}
出生日期（公历）：${formData.birthMonth}-${formData.birthDay} ${formData.birthHour}:${formData.birthMinute}
四柱：${formData.yearPillar} ${formData.monthPillar} ${formData.dayPillar} ${formData.hourPillar}
起运年龄：${formData.startAge}
第一步大运：${formData.firstDaYun}
大运方向：${direction}

【必须遵循】
1. 生成 1-100 岁 chartPoints 数组，每个年龄一个点。
2. 每个点必须包含：age, year, ganZhi, daYun, open, close, high, low, score, reason。
3. reason 用简短中文（建议不超过 30 字），并在开头添加一个标签：[婚] / [学] / [业] / [慎] / [平]。
4. score 在 0-100 且有波动，不要平直。
5. daYun 每 10 年切换一次，从 ${formData.firstDaYun} 开始推导。
6. age 1 到 ${Math.max(1, startAge - 1)} 的 daYun 可设为“童限”。
7. 标签含义：婚=感情婚嫁窗口，学=升学进修窗口，业=事业冲刺窗口，慎=需蛰伏防风险，平=常规推进。

【返回 JSON 结构】
{
  "bazi": ["年柱", "月柱", "日柱", "时柱"],
  "summary": "100字内总结",
  "summaryScore": 0-10,
  "personality": "80字内",
  "personalityScore": 0-10,
  "industry": "80字内",
  "industryScore": 0-10,
  "fengShui": "80字内",
  "fengShuiScore": 0-10,
  "wealth": "80字内",
  "wealthScore": 0-10,
  "marriage": "80字内",
  "marriageScore": 0-10,
  "health": "80字内",
  "healthScore": 0-10,
  "family": "80字内",
  "familyScore": 0-10,
  "crypto": "80字内",
  "cryptoScore": 0-10,
  "cryptoYear": "年份+干支",
  "cryptoStyle": "风格",
  "chartPoints": [ ...100条... ]
}
`.trim();
};

const LifeKLinePage: React.FC<LifeKLinePageProps> = ({ onBack, apiSettings }) => {
  const [result, setResult] = useState<LifeDestinyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showDirectGenerateConfirm, setShowDirectGenerateConfirm] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [toolMessage, setToolMessage] = useState<string | null>(null);
  const [reverseCandidates, setReverseCandidates] = useState<ReverseBirthCandidate[]>([]);
  const [formData, setFormData] = useState<GeneratorFormData>({
    name: '',
    gender: Gender.MALE,
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    birthMinute: '',
    yearPillar: '',
    monthPillar: '',
    dayPillar: '',
    hourPillar: '',
    startAge: '',
    firstDaYun: '',
    reverseStartYear: '',
    reverseEndYear: '',
  });

  const peakPoint = useMemo(() => {
    if (!result?.chartData.length) return null;
    return result.chartData.reduce((best, current) => (current.score > best.score ? current : best));
  }, [result]);

  const getSanitizedFormData = (): GeneratorFormData => ({
    name: formData.name.trim(),
    gender: formData.gender,
    birthYear: formData.birthYear.trim() || '1990',
    birthMonth: formData.birthMonth.trim() || '1',
    birthDay: formData.birthDay.trim() || '1',
    birthHour: formData.birthHour.trim() || '0',
    birthMinute: formData.birthMinute.trim() || '0',
    yearPillar: formData.yearPillar.trim() || '甲子',
    monthPillar: formData.monthPillar.trim() || '乙丑',
    dayPillar: formData.dayPillar.trim() || '丙寅',
    hourPillar: formData.hourPillar.trim() || '丁卯',
    startAge: formData.startAge.trim() || '8',
    firstDaYun: formData.firstDaYun.trim() || '戊辰',
    reverseStartYear: formData.reverseStartYear.trim() || '1900',
    reverseEndYear: formData.reverseEndYear.trim() || String(new Date().getFullYear()),
  });

  const visualizationBirthProfile = useMemo<VisualizationBirthProfile | undefined>(() => {
    const name = formData.name.trim() || undefined;
    const birthYear = parseOptionalInteger(formData.birthYear);
    const birthMonth = parseOptionalInteger(formData.birthMonth);
    const birthDay = parseOptionalInteger(formData.birthDay);
    const birthHour = parseOptionalInteger(formData.birthHour);
    const birthMinute = parseOptionalInteger(formData.birthMinute);

    const hasExplicitBirth = birthYear !== null && birthMonth !== null && birthDay !== null;
    if (hasExplicitBirth && isValidDate(birthYear!, birthMonth!, birthDay!)) {
      return {
        year: birthYear!,
        month: clamp(birthMonth!, 1, 12),
        day: clamp(birthDay!, 1, 31),
        hour: clamp(birthHour ?? 0, 0, 23),
        minute: clamp(birthMinute ?? 0, 0, 59),
        name,
      };
    }

    const formBazi = [formData.yearPillar, formData.monthPillar, formData.dayPillar, formData.hourPillar].map((item) => item.trim());
    const resolvedBazi = formBazi.every(Boolean) ? formBazi : (result?.analysis?.bazi ?? []);
    const preferredYear = birthYear ?? inferBirthYearFromChart(result?.chartData);
    const reverseStartYear = parseOptionalInteger(formData.reverseStartYear);
    const reverseEndYear = parseOptionalInteger(formData.reverseEndYear);

    return deriveBirthProfileFromBazi(
      resolvedBazi,
      result?.chartData,
      preferredYear,
      reverseStartYear,
      reverseEndYear,
      name,
    );
  }, [formData, result]);

  const repairJsonViaModel = async (brokenJson: string): Promise<any> => {
    const repairPrompt = [
      '你是 JSON 修复器。',
      '请把以下内容修复为严格合法 JSON（RFC8259）。',
      '仅返回 JSON 本体，不要解释，不要 markdown 代码块。',
      brokenJson,
    ].join('\n\n');

    const response = await fetch(`${apiSettings.apiBaseUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: apiSettings.modelName,
        messages: [{ role: 'user', content: repairPrompt }],
        temperature: 0,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JSON 修复请求失败 (${response.status}) ${errorText || ''}`.trim());
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('JSON 修复请求未返回可解析内容。');
    }

    return parseJsonWithCandidates(content);
  };

  const parseWithFallback = async (rawText: string, enableModelRepair: boolean): Promise<any> => {
    try {
      return parseJsonWithCandidates(rawText);
    } catch (firstError: any) {
      if (!enableModelRepair || !apiSettings.apiKey || !apiSettings.apiBaseUrl || !apiSettings.modelName) {
        throw firstError;
      }
      return repairJsonViaModel(extractJsonObject(rawText));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setToolMessage(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeriveBaziFromBirth = () => {
    setError(null);
    setToolMessage(null);
    setReverseCandidates([]);
    const sanitized = getSanitizedFormData();
    const year = asNumber(sanitized.birthYear, NaN);
    const month = clamp(asNumber(sanitized.birthMonth, NaN), 1, 12);
    const day = clamp(asNumber(sanitized.birthDay, NaN), 1, 31);
    const hour = clamp(asNumber(sanitized.birthHour, NaN), 0, 23);
    const minute = clamp(asNumber(sanitized.birthMinute, NaN), 0, 59);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) || !Number.isFinite(hour) || !Number.isFinite(minute)) {
      setError('请先填写有效的出生年、月、日、时、分。');
      return;
    }
    if (!isValidDate(year, month, day)) {
      setError('出生日期无效，请检查年月日。');
      return;
    }

    try {
      const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
      const eightChar = solar.getLunar().getEightChar();
      setFormData((prev) => ({
        ...prev,
        birthYear: String(year),
        birthMonth: String(month),
        birthDay: String(day),
        birthHour: String(hour),
        birthMinute: String(minute),
        yearPillar: eightChar.getYear(),
        monthPillar: eightChar.getMonth(),
        dayPillar: eightChar.getDay(),
        hourPillar: eightChar.getTime(),
      }));
      setToolMessage(`已按出生时刻排出四柱：${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${eightChar.getTime()}。`);
    } catch (err: any) {
      setError(err?.message || '出生时刻排盘失败，请检查输入。');
    }
  };

  const handleReverseBirthFromBazi = () => {
    setError(null);
    setToolMessage(null);
    const sanitized = getSanitizedFormData();
    const yearPillar = sanitized.yearPillar;
    const monthPillar = sanitized.monthPillar;
    const dayPillar = sanitized.dayPillar;
    const hourPillar = sanitized.hourPillar;
    const startYear = clamp(asNumber(sanitized.reverseStartYear, NaN), 1, 9999);
    const endYear = clamp(asNumber(sanitized.reverseEndYear, NaN), 1, 9999);

    if (!yearPillar || !monthPillar || !dayPillar || !hourPillar) {
      setError('请先完整填写四柱（年柱、月柱、日柱、时柱）。');
      return;
    }
    if (!Number.isFinite(startYear) || !Number.isFinite(endYear)) {
      setError('请填写有效的反推年份区间。');
      return;
    }

    const fromYear = Math.min(startYear, endYear);
    const toYear = Math.max(startYear, endYear);
    try {
      const rawList = Solar.fromBaZi(yearPillar, monthPillar, dayPillar, hourPillar, 2, fromYear) as Array<{
        getYear: () => number;
        getMonth: () => number;
        getDay: () => number;
        getHour: () => number;
        getMinute: () => number;
        getSecond: () => number;
        toYmdHms: () => string;
      }>;
      const candidates = rawList
        .filter((item) => {
          const y = item.getYear();
          return y >= fromYear && y <= toYear;
        })
        .map((item) => ({
          year: item.getYear(),
          month: item.getMonth(),
          day: item.getDay(),
          hour: item.getHour(),
          minute: item.getMinute(),
          second: item.getSecond(),
          display: item.toYmdHms(),
        }))
        .sort((a, b) => a.display.localeCompare(b.display))
        .slice(0, 60);

      setReverseCandidates(candidates);
      if (candidates.length) {
        setToolMessage(`已找到 ${candidates.length} 个候选出生时刻（区间 ${fromYear}-${toYear}）。`);
      } else {
        setToolMessage(`在 ${fromYear}-${toYear} 年区间内未找到匹配四柱的出生时刻。`);
      }
    } catch (err: any) {
      setError(err?.message || '四柱反推失败，请检查四柱格式。');
    }
  };

  const handleUseReverseCandidate = (candidate: ReverseBirthCandidate) => {
    setError(null);
    setToolMessage(`已回填候选出生时刻：${candidate.display}`);
    setFormData((prev) => ({
      ...prev,
      birthYear: String(candidate.year),
      birthMonth: String(candidate.month),
      birthDay: String(candidate.day),
      birthHour: String(candidate.hour),
      birthMinute: String(candidate.minute),
    }));
  };

  const handleGenerate = async () => {
    const sanitized = getSanitizedFormData();
    setToolMessage(null);
    setReverseCandidates([]);
    if (!apiSettings.apiKey || !apiSettings.apiBaseUrl || !apiSettings.modelName) {
      setError('请先在首页 API 设置中填写 model、baseUrl、apiKey。');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(`${apiSettings.apiBaseUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiSettings.apiKey}`,
        },
        body: JSON.stringify({
          model: apiSettings.modelName,
          messages: [
            { role: 'system', content: BAZI_SYSTEM_INSTRUCTION },
            { role: 'user', content: buildUserPrompt(sanitized) },
          ],
          temperature: 0.7,
          max_tokens: 8000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败 (${response.status}) ${errorText || ''}`.trim());
      }

      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string') {
        throw new Error('模型没有返回可解析内容。');
      }

      const raw = await parseWithFallback(content, true);
      setResult(normalizeResult(raw));
    } catch (err: any) {
      setError(err?.message || '生成失败，请重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequestDirectGenerate = () => {
    setShowDirectGenerateConfirm(true);
  };

  const handleConfirmDirectGenerate = async () => {
    setShowDirectGenerateConfirm(false);
    await handleGenerate();
  };

  const handleCopyPrompt = async () => {
    setError(null);
    setToolMessage(null);
    const sanitized = getSanitizedFormData();
    const fullPrompt = `=== System Prompt ===\n\n${BAZI_SYSTEM_INSTRUCTION}\n\n=== User Prompt ===\n\n${buildUserPrompt(sanitized)}`;
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 1800);
    } catch (err: any) {
      setError(err?.message || '复制失败，请检查浏览器剪贴板权限。');
    }
  };

  const handleImportFromTextarea = async () => {
    setError(null);
    setToolMessage(null);
    if (!jsonInput.trim()) {
      setError('请先粘贴 JSON 内容。');
      return;
    }

    try {
      const raw = await parseWithFallback(jsonInput, true);
      setResult(normalizeResult(raw));
      setJsonInput('');
    } catch (err: any) {
      setError(`粘贴内容解析失败：${err?.message || '未知错误'}`);
    }
  };

  const handleImportJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      try {
        const raw = await parseWithFallback(String(loadEvent.target?.result ?? ''), false);
        setResult(normalizeResult(raw));
        setError(null);
        setToolMessage(null);
      } catch (err: any) {
        setError(`文件解析失败：${err?.message || '未知错误'}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportJson = () => {
    if (!result) return;
    const exportData = {
      schemaVersion: 'life-journey-v1',
      exportedAt: new Date().toISOString(),
      ...result.analysis,
      chartPoints: result.chartData,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life_journey_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const handleSaveHtml = () => {
    if (!result) return;
    const now = new Date();
    const rows = result.chartData
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border:1px solid #e5e7eb;">${item.age}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${item.year}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${item.daYun ?? '-'}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${Math.round(item.score)}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${item.reason}</td>
          </tr>
        `,
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>人生阶段地图报告</title></head>
      <body style="font-family:Inter,'PingFang SC','Microsoft YaHei',sans-serif;background:#f8f6f0;padding:24px;color:#1f2937;">
        <h1 style="margin:0 0 12px;">人生阶段地图报告</h1>
        <p style="margin:0 0 24px;color:#6b7280;">导出时间：${now.toLocaleString('zh-CN')}</p>
        <h2>总评</h2><p>${result.analysis.summary}</p>
        <h2>年度明细</h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;">
          <thead><tr style="background:#f3f4f6;"><th style="padding:8px;border:1px solid #e5e7eb;">年龄</th><th style="padding:8px;border:1px solid #e5e7eb;">年份</th><th style="padding:8px;border:1px solid #e5e7eb;">大运</th><th style="padding:8px;border:1px solid #e5e7eb;">评分</th><th style="padding:8px;border:1px solid #e5e7eb;">说明</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life_journey_report_${now.getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-paper-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-wood-300 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ink-200 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-paper-50/90 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-wood p-2 rounded-lg shadow-sm">
                <Compass className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-800">人生阶段地图</h1>
                <p className="text-xs text-ink-500">Life Journey Map & Destiny Timeline</p>
              </div>
            </div>
            <button onClick={onBack} className="px-4 py-2 bg-paper-200 hover:bg-paper-300 text-ink-700 border border-ink-200 rounded-lg transition-all text-sm font-medium">
              返回首页
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {!result ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div className="text-center max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-serif-sc font-bold text-ink-800 mb-6">一键生成人生阶段地图</h2>
                <p className="text-ink-600 text-lg leading-relaxed mb-6">
                  支持两种并列方式：站内一键生成，或复制提示词到外部 AI 后粘贴 JSON 导入。
                </p>
              </div>

              <div className="w-full max-w-5xl bg-white border border-ink-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-sm font-semibold text-indigo-900">推荐流程：先复制提示词并粘贴 JSON 导入</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    先填写下方出生时间与四柱信息，再复制提示词给外部模型。提示词会自动带入你填写的参数。
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-600 mb-1">姓名（可选）</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-600 mb-1">性别</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50">
                      <option value={Gender.MALE}>男</option>
                      <option value={Gender.FEMALE}>女</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">出生年</label><input name="birthYear" value={formData.birthYear} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">出生月</label><input name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">出生日</label><input name="birthDay" value={formData.birthDay} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">出生时（0-23）</label><input name="birthHour" value={formData.birthHour} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">出生分（0-59）</label><input name="birthMinute" value={formData.birthMinute} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" /></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">年柱</label><input name="yearPillar" value={formData.yearPillar} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50 text-center" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">月柱</label><input name="monthPillar" value={formData.monthPillar} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50 text-center" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">日柱</label><input name="dayPillar" value={formData.dayPillar} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50 text-center" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">时柱</label><input name="hourPillar" value={formData.hourPillar} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50 text-center" /></div>
                </div>

                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-amber-900">八字辅助工具（基于 lunar-javascript）</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleDeriveBaziFromBirth}
                      className="px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-900 text-sm font-semibold hover:bg-amber-100"
                    >
                      按出生时刻自动排四柱
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="reverseStartYear"
                        value={formData.reverseStartYear}
                        onChange={handleInputChange}
                        placeholder="反推起年"
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-sm"
                      />
                      <input
                        name="reverseEndYear"
                        value={formData.reverseEndYear}
                        onChange={handleInputChange}
                        placeholder="反推止年"
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg bg-white text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReverseBirthFromBazi}
                    className="px-4 py-2 rounded-lg bg-ink-700 text-white text-sm font-semibold hover:bg-ink-800"
                  >
                    按四柱反推候选出生时刻
                  </button>
                  {reverseCandidates.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-white p-2 max-h-48 overflow-auto space-y-2">
                      {reverseCandidates.map((item, index) => (
                        <button
                          key={`${item.display}-${index}`}
                          type="button"
                          onClick={() => handleUseReverseCandidate(item)}
                          className="w-full text-left px-3 py-2 rounded-md border border-ink-100 hover:border-seal hover:bg-seal/5 transition-colors"
                        >
                          <div className="text-xs text-ink-500">候选 #{index + 1}</div>
                          <div className="text-sm font-semibold text-ink-800">{item.display}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">起运年龄（虚岁）</label><input name="startAge" value={formData.startAge} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50" /></div>
                  <div><label className="block text-xs font-semibold text-ink-600 mb-1">第一步大运</label><input name="firstDaYun" value={formData.firstDaYun} onChange={handleInputChange} className="w-full px-3 py-2 border border-ink-200 rounded-lg bg-paper-50 text-center" /></div>
                </div>

                <div className="grid xl:grid-cols-2 gap-4">
                  <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">复制提示词 + 粘贴 JSON 导入（推荐）</p>
                        <p className="text-xs text-indigo-700 mt-1">ChatGPT、Claude、Gemini、通义千问、文心一言等</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${promptCopied ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                      >
                        {promptCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {promptCopied ? '已复制提示词' : '复制完整提示词'}
                      </button>
                    </div>
                    <ol className="text-xs text-indigo-700 list-decimal list-inside space-y-1 mb-3">
                      <li>点击“复制完整提示词”并发送到外部 AI。</li>
                      <li>等待 AI 返回纯 JSON。</li>
                      <li>把 JSON 粘贴到下方并点击解析。</li>
                    </ol>
                    <label className="block text-xs font-semibold text-ink-600 mb-1">粘贴 AI 返回的 JSON</label>
                    <textarea
                      value={jsonInput}
                      onChange={(event) => setJsonInput(event.target.value)}
                      className="w-full h-48 px-3 py-2 border border-ink-200 rounded-lg bg-paper-50 font-mono text-xs"
                      placeholder="粘贴 JSON 或 ```json ... ``` 内容"
                    />
                    <div className="flex flex-wrap gap-3 mt-3">
                      <button type="button" onClick={handleImportFromTextarea} className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-seal to-wood text-white rounded-xl font-semibold">
                        <Sparkles className="w-5 h-5" />
                        解析粘贴内容
                      </button>
                      <label className="flex items-center gap-2 px-4 py-3 bg-paper-200 border border-ink-200 rounded-xl cursor-pointer">
                        <FileUp className="w-4 h-4 text-ink-700" />
                        <span className="text-sm text-ink-700">导入 JSON 文件</span>
                        <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
                      </label>
                    </div>
                  </section>

                  <section className="rounded-xl border border-ink-200 bg-paper-50 p-4">
                    <p className="text-sm font-semibold text-ink-800">站内一键生成（备用）</p>
                    <p className="text-xs text-ink-600 mt-1 leading-6">
                      如果你希望站内直接请求模型，可使用该按钮。点击后会先弹出提示，再确认执行。
                    </p>
                    <div className="mt-4">
                      <button type="button" onClick={handleRequestDirectGenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-seal to-wood text-white rounded-xl font-semibold disabled:opacity-60">
                        {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" />站内生成中...</> : <><Sparkles className="w-5 h-5" />直接生成（可点击）</>}
                      </button>
                    </div>
                  </section>
                </div>

                {error && (
                  <div role="alert" className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200 mt-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                )}
                {toolMessage && (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-200 mt-4">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-semibold">{toolMessage}</p>
                  </div>
                )}

                {showDirectGenerateConfirm && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-5 shadow-xl">
                      <h4 className="text-lg font-bold text-ink-800 mb-2">站内一键生成提醒</h4>
                      <p className="text-sm text-ink-600 leading-6">
                        建议使用豆包，kimi等模型生成，速度较快。确认后将继续调用站内一键生成功能。
                      </p>
                      <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDirectGenerateConfirm(false)}
                          className="px-4 py-2 rounded-lg border border-ink-200 bg-paper-50 text-ink-700 text-sm hover:bg-paper-100"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmDirectGenerate}
                          className="px-4 py-2 rounded-lg bg-seal text-white text-sm font-semibold hover:bg-seal-dark"
                        >
                          确认并继续
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif-sc text-ink-800">人生阶段地图报告</h2>
                  <p className="text-sm text-ink-500 mt-1">
                    数据区间：{result.chartData[0]?.age ?? 1}-{result.chartData[result.chartData.length - 1]?.age ?? 100} 岁
                  </p>
                  {peakPoint && <p className="text-sm mt-1 text-seal font-semibold">峰值：{peakPoint.age}岁（{peakPoint.year}）评分 {Math.round(peakPoint.score)}</p>}
                </div>
                <div className="flex flex-wrap gap-3 no-print">
                  <button onClick={handleExportJson} className="flex items-center gap-2 px-4 py-2 bg-wood hover:bg-wood-dark text-white rounded-lg text-sm"><FileDown className="w-4 h-4" />导出 JSON</button>
                  <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-seal hover:bg-seal-dark text-white rounded-lg text-sm"><Printer className="w-4 h-4" />保存 PDF</button>
                  <button onClick={handleSaveHtml} className="flex items-center gap-2 px-4 py-2 bg-seal hover:bg-seal-dark text-white rounded-lg text-sm"><Download className="w-4 h-4" />保存网页</button>
                  <button onClick={() => setResult(null)} className="flex items-center gap-2 px-4 py-2 bg-paper-200 hover:bg-paper-300 text-ink-700 rounded-lg text-sm"><RefreshCw className="w-4 h-4" />重新生成</button>
                </div>
              </div>

              <LifeJourneyVisualizer data={result.chartData} analysis={result.analysis} birthProfile={visualizationBirthProfile} />
              <section id="analysis-result-container">
                <AnalysisResult analysis={result.analysis} />
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LifeKLinePage;
