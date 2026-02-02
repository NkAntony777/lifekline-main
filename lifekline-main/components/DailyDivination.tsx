import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, ArrowLeft, RefreshCw, BookOpen, Star, Sparkle, MessageSquare } from 'lucide-react';
import { dailyDivinationService } from '../services/dailyDivinationService';
import { interpretDailyDivination } from '../services/geminiService';
import { DailyDivinationResult, DailyDivinationReading, DivinationStep } from '../types/dailyDivination';
import { MAIN_STARS, SECONDARY_STARS, MINOR_STARS, SIXTY_FOUR_GUA, ZiweiStar, ZhouyiGua } from '../constants/dailyDivination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DailyDivinationProps {
  onBack: () => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
}

const DailyDivination: React.FC<DailyDivinationProps> = ({ onBack, apiSettings }) => {
  const [step, setStep] = useState<DivinationStep>('input');
  const [question, setQuestion] = useState('今日运势如何？会发生什么重要的事？');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DailyDivinationResult | null>(null);
  const [interpretation, setInterpretation] = useState<DailyDivinationReading | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);

  // 洗牌动画状态
  const [shufflingStars, setShufflingStars] = useState<{
    main: ZiweiStar | null;
    secondary: ZiweiStar | null;
    minor: ZiweiStar | null;
    hexagram: ZhouyiGua | null;
  }>({
    main: null,
    secondary: null,
    minor: null,
    hexagram: null
  });
  
  const shuffleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 清理洗牌动画
  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
    };
  }, []);

  // 开始洗牌动画
  const startShuffling = () => {
    setStep('shuffling');
    
    shuffleIntervalRef.current = setInterval(() => {
      setShufflingStars({
        main: MAIN_STARS[Math.floor(Math.random() * MAIN_STARS.length)],
        secondary: SECONDARY_STARS[Math.floor(Math.random() * SECONDARY_STARS.length)],
        minor: MINOR_STARS[Math.floor(Math.random() * MINOR_STARS.length)],
        hexagram: SIXTY_FOUR_GUA[Math.floor(Math.random() * SIXTY_FOUR_GUA.length)]
      });
    }, 100);

    // 3.5秒后停止洗牌并显示结果
    setTimeout(() => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
      
      const divinationResult = dailyDivinationService.divinate(question);
      setResult(divinationResult);
      setShufflingStars({
        main: divinationResult.ziwei.mainStar,
        secondary: divinationResult.ziwei.secondaryStar,
        minor: divinationResult.ziwei.minorStar,
        hexagram: divinationResult.hexagram.hexagram
      });
      setStep('result');
      setIsLoading(false);
    }, 3500);
  };

  const handleStartDivination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setInterpretation(null);
    setShowInterpretation(false);
    
    startShuffling();
  };

  const handleGetInterpretation = async () => {
    if (!result) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const reading = await interpretDailyDivination(
        result,
        apiSettings.modelName,
        apiSettings.apiBaseUrl,
        apiSettings.apiKey
      );
      setInterpretation(reading);
      setShowInterpretation(true);
    } catch (err: any) {
      setError(err.message || '解读失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDivination = () => {
    setQuestion('今日运势如何？会发生什么重要的事？');
    setResult(null);
    setInterpretation(null);
    setShowInterpretation(false);
    setError(null);
    setShufflingStars({
      main: null,
      secondary: null,
      minor: null,
      hexagram: null
    });
    setStep('input');
  };

  // 获取星曜类型颜色
  const getStarTypeColor = (type: string) => {
    switch (type) {
      case 'main':
        return 'bg-seal/20 text-seal border-seal/30';
      case 'secondary':
        return 'bg-wood/20 text-wood-dark border-wood/30';
      case 'minor':
        return 'bg-ink/10 text-ink-700 border-ink/20';
      default:
        return 'bg-paper-200 text-ink-600 border-ink/20';
    }
  };

  // 获取星曜类型标签
  const getStarTypeLabel = (type: string) => {
    switch (type) {
      case 'main':
        return '主星';
      case 'secondary':
        return '副星';
      case 'minor':
        return '杂曜';
      default:
        return '星曜';
    }
  };

  // 渲染输入阶段
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-paper-100 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-seal-200 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-ink-200 rounded-full filter blur-3xl" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="w-full bg-paper-50/90 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-seal p-2 rounded-lg shadow-sm">
                  <Sparkles className="w-6 h-6 text-paper-50" />
                </div>
                <div>
                  <h1 className="text-xl font-serif-sc font-bold text-ink-800">每日占卜</h1>
                  <p className="text-xs text-ink-500">紫微斗数 · 六十四卦</p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-paper-200 hover:bg-paper-300 border border-ink-200 rounded-lg text-ink-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
            </div>
          </header>

          {/* 主内容 */}
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-8 shadow-xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Star className="w-10 h-10 text-seal animate-pulse" />
                    <BookOpen className="w-12 h-12 text-wood" />
                    <Sparkle className="w-10 h-10 text-seal-light animate-bounce" />
                  </div>
                  <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-2">每日运势占卜</h2>
                  <p className="text-ink-500">紫微星曜配周易卦象，洞察今日运势</p>
                </div>

                <form onSubmit={handleStartDivination} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-600 mb-2">你的问题</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="请输入你想问的问题..."
                      className="w-full h-32 bg-paper-100 border border-ink-200 rounded-xl px-4 py-3 text-ink placeholder-ink-400 focus:outline-none focus:border-seal focus:ring-2 focus:ring-seal/20 transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-seal/10 border border-seal/30 rounded-xl p-4 text-seal text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="w-full bg-seal hover:bg-seal-dark disabled:bg-ink-300 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-seal/30 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        占卜中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        开始占卜
                      </>
                    )}
                  </button>
                </form>

                {/* 说明区域 */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-paper-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-seal" />
                      <span className="font-medium text-ink-700">紫微斗数</span>
                    </div>
                    <p className="text-xs text-ink-500">抽取主星、副星、杂曜，洞察今日运势走向</p>
                  </div>
                  <div className="bg-paper-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-wood" />
                      <span className="font-medium text-ink-700">周易六十四卦</span>
                    </div>
                    <p className="text-xs text-ink-500">随机抽取卦象，解读今日吉凶宜忌</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 渲染洗牌动画阶段
  if (step === 'shuffling') {
    return (
      <div className="min-h-screen bg-paper-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-seal-200 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-ink-200 rounded-full filter blur-3xl" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="w-full bg-paper-50/90 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-seal p-2 rounded-lg shadow-sm">
                  <Sparkles className="w-6 h-6 text-paper-50" />
                </div>
                <div>
                  <h1 className="text-xl font-serif-sc font-bold text-ink-800">每日占卜</h1>
                  <p className="text-xs text-ink-500">正在洗牌...</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-2">正在抽取...</h2>
                <p className="text-ink-500">静心等待，星曜与卦象正在为你显现</p>
              </div>

              {/* 紫微三星 - 洗牌动画 */}
              <div className="mb-8">
                <h3 className="text-center text-lg font-serif-sc font-medium text-ink-700 mb-4">紫微斗数 · 三星汇聚</h3>
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {['main', 'secondary', 'minor'].map((type, index) => {
                    const star = type === 'main' ? shufflingStars.main : 
                                type === 'secondary' ? shufflingStars.secondary : shufflingStars.minor;
                    return (
                      <div
                        key={type}
                        className={`bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-ink-200 p-6 shadow-lg animate-pulse ${
                          index === 0 ? 'delay-0' : index === 1 ? 'delay-75' : 'delay-150'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
                            getStarTypeColor(type)
                          }`}>
                            {getStarTypeLabel(type)}
                          </span>
                          <div className="text-2xl font-bold text-ink-800 mb-1">
                            {star?.name || '?'}
                          </div>
                          <div className="text-xs text-ink-500 h-4">
                            {star?.element ? `${star.element}·${star.yinYang}` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 六十四卦 - 洗牌动画 */}
              <div className="max-w-md mx-auto">
                <h3 className="text-center text-lg font-serif-sc font-medium text-ink-700 mb-4">周易 · 六十四卦</h3>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-ink-200 p-8 shadow-lg animate-pulse">
                  <div className="text-center">
                    {/* 上下卦垂直排列 */}
                    <div className="flex flex-col items-center mb-3">
                      <div className="text-5xl leading-none">{shufflingStars.hexagram?.upperTrigram || '☯'}</div>
                      <div className="text-5xl leading-none">{shufflingStars.hexagram?.lowerTrigram || '☯'}</div>
                    </div>
                    <div className="text-2xl font-bold text-ink-800 mb-1">
                      {shufflingStars.hexagram?.name || '??'}卦
                    </div>
                    <div className="text-sm text-ink-500">
                      第{shufflingStars.hexagram?.number || '?'}卦 · {shufflingStars.hexagram?.upperName}上{shufflingStars.hexagram?.lowerName}下
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 渲染结果阶段
  return (
    <div className="min-h-screen bg-paper-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-seal-200 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ink-200 rounded-full filter blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full bg-paper-50/90 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-seal p-2 rounded-lg shadow-sm">
                <Sparkles className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-800">每日占卜</h1>
                <p className="text-xs text-ink-500">占卜结果</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewDivination}
                className="flex items-center gap-2 px-4 py-2 bg-paper-200 hover:bg-paper-300 border border-ink-200 rounded-lg text-ink-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                重新占卜
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-paper-200 hover:bg-paper-300 border border-ink-200 rounded-lg text-ink-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* 问题 */}
            <div className="text-center">
              <p className="text-ink-500 text-sm mb-1">你的问题</p>
              <h2 className="text-xl font-serif-sc font-medium text-ink-800">{result?.question}</h2>
            </div>

            {/* 紫微三星结果 */}
            {result && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-seal p-2 rounded-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-serif-sc font-bold text-ink-800">紫微斗数 · 三星汇聚</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 主星 */}
                  <div className="bg-gradient-to-br from-seal/10 to-seal/5 rounded-2xl p-5 border border-seal/20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-seal/20 text-seal rounded text-xs font-medium">主星</span>
                    </div>
                    <div className="text-3xl font-bold text-ink-800 mb-2">{result.ziwei.mainStar.name}</div>
                    <div className="text-sm text-ink-500 mb-2">
                      {result.ziwei.mainStar.element}·{result.ziwei.mainStar.yinYang}
                    </div>
                    <p className="text-sm text-ink-600">{result.ziwei.mainStar.description}</p>
                    <div className="mt-3 pt-3 border-t border-seal/10">
                      <p className="text-xs text-ink-500">{result.ziwei.mainStar.effect}</p>
                    </div>
                  </div>

                  {/* 副星 */}
                  <div className="bg-gradient-to-br from-wood/10 to-wood/5 rounded-2xl p-5 border border-wood/20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-wood/20 text-wood-dark rounded text-xs font-medium">副星</span>
                    </div>
                    <div className="text-3xl font-bold text-ink-800 mb-2">{result.ziwei.secondaryStar.name}</div>
                    <div className="text-sm text-ink-500 mb-2">
                      {result.ziwei.secondaryStar.element}·{result.ziwei.secondaryStar.yinYang}
                    </div>
                    <p className="text-sm text-ink-600">{result.ziwei.secondaryStar.description}</p>
                    <div className="mt-3 pt-3 border-t border-wood/10">
                      <p className="text-xs text-ink-500">{result.ziwei.secondaryStar.effect}</p>
                    </div>
                  </div>

                  {/* 杂曜 */}
                  <div className="bg-gradient-to-br from-ink/5 to-ink/10 rounded-2xl p-5 border border-ink/10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-ink/10 text-ink-700 rounded text-xs font-medium">杂曜</span>
                    </div>
                    <div className="text-3xl font-bold text-ink-800 mb-2">{result.ziwei.minorStar.name}</div>
                    <div className="text-sm text-ink-500 mb-2">
                      {result.ziwei.minorStar.element}·{result.ziwei.minorStar.yinYang}
                    </div>
                    <p className="text-sm text-ink-600">{result.ziwei.minorStar.description}</p>
                    <div className="mt-3 pt-3 border-t border-ink/10">
                      <p className="text-xs text-ink-500">{result.ziwei.minorStar.effect}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 六十四卦结果 */}
            {result && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-wood p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-serif-sc font-bold text-ink-800">周易六十四卦</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0 text-center">
                    {/* 上下卦垂直排列 - 传统易经显示方式 */}
                    <div className="flex flex-col items-center mb-2">
                      <div className="text-6xl leading-none" title={`上卦：${result.hexagram.hexagram.upperName}`}>{result.hexagram.hexagram.upperTrigram}</div>
                      <div className="text-6xl leading-none" title={`下卦：${result.hexagram.hexagram.lowerName}`}>{result.hexagram.hexagram.lowerTrigram}</div>
                    </div>
                    <div className="text-sm text-ink-500">{result.hexagram.hexagram.hexagram}</div>
                    <div className="text-xs text-ink-400 mt-1">{result.hexagram.hexagram.upperName}上{result.hexagram.hexagram.lowerName}下</div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-2xl font-bold text-ink-800 mb-1">
                      {result.hexagram.hexagram.name}卦
                      <span className="text-sm font-normal text-ink-500 ml-2">第{result.hexagram.hexagram.number}卦 · {result.hexagram.hexagram.element}</span>
                    </div>
                    <div className="text-lg text-seal font-medium mb-3">{result.hexagram.hexagram.description}</div>
                    <p className="text-ink-600 mb-3">{result.hexagram.hexagram.meaning}</p>
                    <div className="bg-paper-200 rounded-xl p-4">
                      <span className="text-sm font-medium text-ink-600">建议：</span>
                      <span className="text-sm text-ink-600">{result.hexagram.hexagram.advice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI解读按钮 */}
            {!interpretation && (
              <div className="text-center">
                <button
                  onClick={handleGetInterpretation}
                  disabled={isLoading}
                  className="bg-seal hover:bg-seal-dark disabled:bg-ink-300 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-seal/30 disabled:shadow-none flex items-center justify-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI 正在解读...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      获取 AI 解读
                    </>
                  )}
                </button>
                {error && (
                  <div className="mt-4 bg-seal/10 border border-seal/30 rounded-xl p-4 text-seal text-sm max-w-md mx-auto">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* AI解读结果 */}
            {interpretation && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-6 shadow-xl">
                <button
                  onClick={() => setShowInterpretation(!showInterpretation)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-seal to-seal-dark p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-serif-sc font-bold text-ink-800">AI 智能解读</h3>
                  </div>
                  <span className="text-seal text-sm">
                    {showInterpretation ? '收起' : '展开'}
                  </span>
                </button>

                {showInterpretation && (
                  <div className="mt-6 space-y-6 animate-fade-in">
                    <div className="prose prose-sm max-w-none prose-headings:text-ink-800 prose-p:text-ink-600 prose-strong:text-ink-800 prose-a:text-seal prose-code:text-seal">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {interpretation.interpretation}
                      </ReactMarkdown>
                    </div>

                    {/* 关键词 */}
                    {interpretation.keywords.length > 0 && (
                      <div className="pt-6 border-t border-ink-200">
                        <h4 className="text-sm font-medium text-ink-600 mb-3">关键词</h4>
                        <div className="flex flex-wrap gap-2">
                          {interpretation.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-seal/10 text-seal rounded-full text-sm border border-seal/30"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 建议 */}
                    {interpretation.advice.length > 0 && (
                      <div className="pt-6 border-t border-ink-200">
                        <h4 className="text-sm font-medium text-ink-600 mb-3">建议</h4>
                        <div className="space-y-2">
                          {interpretation.advice.map((advice, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="bg-seal text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <p className="text-sm text-ink-600">{advice}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DailyDivination;
