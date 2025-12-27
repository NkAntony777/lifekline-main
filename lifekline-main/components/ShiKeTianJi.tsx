import React, { useState, useRef } from 'react';
import { ShiKeTianJiResult, CalculationMethod, ShiKeTianJiReading, CustomGanzhi } from '../types/shiketianji';
import { shiketianjiService } from '../services/shiketianjiService';
import { interpretShiKeTianJi } from '../services/geminiService';
import { Sparkles, Loader2, ArrowLeft, RefreshCw, Copy, Check, Clock, Dice1, Calendar, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ShiKeTianJiProps {
  onBack: () => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
}

const ShiKeTianJi: React.FC<ShiKeTianJiProps> = ({ onBack, apiSettings }) => {
  const [step, setStep] = useState<'input' | 'calculating' | 'result'>('input');
  const [question, setQuestion] = useState('');
  const [method, setMethod] = useState<CalculationMethod>('current-time');
  const [customTime, setCustomTime] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [customGanzhi, setCustomGanzhi] = useState<CustomGanzhi>({
    shiGan: '甲',
    shiZhi: '子',
    keGan: '甲',
    keZhi: '子'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShiKeTianJiResult | null>(null);
  const [interpretation, setInterpretation] = useState<ShiKeTianJiReading | null>(null);
  const [copied, setCopied] = useState(false);
  const isAnalyzingRef = useRef(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setStep('calculating');

    setTimeout(() => {
      try {
        let calculationResult: ShiKeTianJiResult;

        switch (method) {
          case 'current-time':
            calculationResult = shiketianjiService.calculateFromCurrentTime();
            break;
          case 'custom-time':
            if (!customTime) {
              throw new Error('请选择自定义时间');
            }
            calculationResult = shiketianjiService.calculateFromCustomTime(new Date(customTime));
            break;
          case 'random-number':
            const num = parseInt(randomNumber);
            if (isNaN(num) || num < 1 || num > 12) {
              throw new Error('随机数必须在1-12之间');
            }
            calculationResult = shiketianjiService.calculateFromRandomNumber(num);
            break;
          case 'custom-ganzhi':
            calculationResult = shiketianjiService.calculateFromCustomGanzhi(
              customGanzhi.shiGan,
              customGanzhi.shiZhi,
              customGanzhi.keGan,
              customGanzhi.keZhi
            );
            break;
          default:
            throw new Error('无效的计算方法');
        }

        setResult(calculationResult);
        setInterpretation(null);
        setStep('result');
        setIsLoading(false);

      } catch (err: any) {
        setError(err.message || '计算失败，请重试');
        setStep('input');
        setIsLoading(false);
      }
    }, 100);
  };

  const handleAiAnalysis = async () => {
    if (!result || isAnalyzingRef.current) {
      console.log('handleAiAnalysis: 重复点击或没有result', { hasResult: !!result, isAnalyzing: isAnalyzingRef.current });
      return;
    }
    
    console.log('handleAiAnalysis: 开始AI分析');
    isAnalyzingRef.current = true;
    setIsAiAnalyzing(true);
    setError(null);

    try {
      console.log('handleAiAnalysis: 调用interpretShiKeTianJi');
      const reading = await interpretShiKeTianJi(
        question,
        result,
        apiSettings.modelName,
        apiSettings.apiBaseUrl,
        apiSettings.apiKey
      );
      console.log('handleAiAnalysis: AI分析完成', reading);
      setInterpretation(reading);
    } catch (err: any) {
      console.error('handleAiAnalysis: AI分析失败', err);
      setError(err.message || 'AI分析失败，请重试');
    } finally {
      console.log('handleAiAnalysis: 结束AI分析');
      setIsAiAnalyzing(false);
      isAnalyzingRef.current = false;
    }
  };

  const handleNewCalculation = () => {
    setQuestion('');
    setMethod('current-time');
    setCustomTime('');
    setRandomNumber('');
    setCustomGanzhi({
      shiGan: '甲',
      shiZhi: '子',
      keGan: '甲',
      keZhi: '子'
    });
    setResult(null);
    setInterpretation(null);
    setStep('input');
  };

  const handleCopy = () => {
    if (!interpretation) return;
    const text = `
【时刻天机解读报告】

问题：${interpretation.input.question}

【时刻天机排盘结果】
计算方法：${method === 'current-time' ? '当前时间' : method === 'custom-time' ? '自定义时间' : method === 'random-number' ? '随机数起盘' : '自定义干支'}
时柱：${interpretation.result.hourPillar.gan}${interpretation.result.hourPillar.zhi}
刻柱：${interpretation.result.kePillar.gan}${interpretation.result.kePillar.zhi}
十神：${interpretation.result.shishen}

【AI 解读结果】
${interpretation.interpretation}

【十神分析】
${interpretation.shishenAnalysis}

【纳音分析】
${interpretation.nayinAnalysis}

【神煞分析】
${interpretation.shenshaAnalysis}

【实用建议】
${interpretation.advice.map(a => `• ${a}`).join('\n')}

【关键词】
${interpretation.keywords.join('、')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextPillar = () => {
    if (!result) return;
    const nextResult = shiketianjiService.calculateNextPillar(result);
    setResult(nextResult);
    setInterpretation(null);
  };

  const handlePreviousPillar = () => {
    if (!result) return;
    const prevResult = shiketianjiService.calculatePreviousPillar(result);
    setResult(prevResult);
    setInterpretation(null);
  };

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif-sc font-bold text-white">时刻天机</h1>
                  <p className="text-xs text-gray-400">AI 智能解读</p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif-sc font-bold text-white mb-2">时刻天机占卜</h2>
                  <p className="text-gray-400">输入你的问题，让时柱和刻柱为你指引方向</p>
                </div>

                <form onSubmit={handleCalculate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">你的问题</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="例如：我最近的工作运势如何？"
                      className="w-full h-32 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">计算方法</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMethod('current-time')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          method === 'current-time'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-purple-400'
                        }`}
                      >
                        <Clock className="w-5 h-5 text-purple-400" />
                        <div className="text-left">
                          <div className="text-white font-medium">当前时间</div>
                          <div className="text-xs text-gray-400">使用当前时间起盘</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod('custom-time')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          method === 'custom-time'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-purple-400'
                        }`}
                      >
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <div className="text-left">
                          <div className="text-white font-medium">自定义时间</div>
                          <div className="text-xs text-gray-400">选择特定时间起盘</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod('random-number')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          method === 'random-number'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-purple-400'
                        }`}
                      >
                        <Dice1 className="w-5 h-5 text-purple-400" />
                        <div className="text-left">
                          <div className="text-white font-medium">随机数起盘</div>
                          <div className="text-xs text-gray-400">输入1-12的数字</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMethod('custom-ganzhi')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          method === 'custom-ganzhi'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-purple-400'
                        }`}
                      >
                        <Settings className="w-5 h-5 text-purple-400" />
                        <div className="text-left">
                          <div className="text-white font-medium">自定义干支</div>
                          <div className="text-xs text-gray-400">手动设置时柱刻柱</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {method === 'custom-time' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">选择时间</label>
                      <input
                        type="datetime-local"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                      />
                    </div>
                  )}

                  {method === 'random-number' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">随机数（1-12）</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={randomNumber}
                        onChange={(e) => setRandomNumber(e.target.value)}
                        placeholder="输入1-12之间的数字"
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                      />
                    </div>
                  )}

                  {method === 'custom-ganzhi' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">时柱天干</label>
                          <select
                            value={customGanzhi.shiGan}
                            onChange={(e) => setCustomGanzhi({ ...customGanzhi, shiGan: e.target.value as any })}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                          >
                            {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map(gan => (
                              <option key={gan} value={gan}>{gan}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">时柱地支</label>
                          <select
                            value={customGanzhi.shiZhi}
                            onChange={(e) => setCustomGanzhi({ ...customGanzhi, shiZhi: e.target.value as any })}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                          >
                            {['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map(zhi => (
                              <option key={zhi} value={zhi}>{zhi}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">刻柱天干</label>
                          <select
                            value={customGanzhi.keGan}
                            onChange={(e) => setCustomGanzhi({ ...customGanzhi, keGan: e.target.value as any })}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                          >
                            {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map(gan => (
                              <option key={gan} value={gan}>{gan}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">刻柱地支</label>
                          <select
                            value={customGanzhi.keZhi}
                            onChange={(e) => setCustomGanzhi({ ...customGanzhi, keZhi: e.target.value as any })}
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all"
                          >
                            {['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map(zhi => (
                              <option key={zhi} value={zhi}>{zhi}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        计算中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        开始占卜
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl mb-2">时柱</div>
                    <div className="text-xs text-gray-400">时辰天干地支</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl mb-2">刻柱</div>
                    <div className="text-xs text-gray-400">五分钟刻度</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (step === 'calculating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif-sc font-bold text-white">时刻天机</h1>
                  <p className="text-xs text-gray-400">AI 智能解读</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif-sc font-bold text-white mb-2">时刻天机占卜</h2>
                <p className="text-gray-400">正在为你计算时柱和刻柱...</p>
              </div>

              <div className="flex justify-center items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-40 h-48 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-2xl border-2 border-purple-400/30 flex flex-col items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse">
                    <div className="text-6xl mb-2">⏰</div>
                    <div className="text-white font-bold">时柱</div>
                  </div>
                </div>
                <div className="text-4xl text-gray-600">+</div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-40 h-48 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-2xl border-2 border-purple-400/30 flex flex-col items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="text-6xl mb-2">⏱️</div>
                    <div className="text-white font-bold">刻柱</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="flex items-center justify-center gap-3 text-purple-300">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg font-medium">AI 正在分析中，请耐心等待...</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-white">时刻天机</h1>
                <p className="text-xs text-gray-400">AI 智能解读</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPillar}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                上一柱
              </button>
              <button
                onClick={handleNextPillar}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                下一柱
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={handleNewCalculation}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                重新占卜
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制'}
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                返回
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            {result && (
              <div className="mb-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif-sc font-bold text-white mb-2">时刻天机结果</h2>
                    <p className="text-gray-400">问题：{question}</p>
                  </div>

                  <div className="flex justify-center items-center gap-8 mb-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-32 h-40 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-2xl border-2 border-purple-400/30 flex flex-col items-center justify-center shadow-lg shadow-purple-500/20">
                        <div className="text-5xl mb-2">⏰</div>
                        <div className="text-white font-bold text-2xl">{result.hourPillar.gan}{result.hourPillar.zhi}</div>
                        <div className="text-gray-300 text-sm">时柱</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">纳音</div>
                        <div className="text-white font-medium">{result.hourPillar.nayin}</div>
                      </div>
                    </div>
                    <div className="text-4xl text-gray-600">+</div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-32 h-40 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl rounded-2xl border-2 border-purple-400/30 flex flex-col items-center justify-center shadow-lg shadow-purple-500/20">
                        <div className="text-5xl mb-2">⏱️</div>
                        <div className="text-white font-bold text-2xl">{result.kePillar.gan}{result.kePillar.zhi}</div>
                        <div className="text-gray-300 text-sm">刻柱</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">纳音</div>
                        <div className="text-white font-medium">{result.kePillar.nayin}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">十神</div>
                      <div className="text-white font-bold">{result.shishen}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">时柱长生</div>
                      <div className="text-white font-bold">{result.hourPillar.longevity}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">刻柱长生</div>
                      <div className="text-white font-bold">{result.kePillar.longevity}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">时柱纳音长生</div>
                      <div className="text-white font-bold">{result.hourPillar.nayinLongevity}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">刻柱纳音长生</div>
                      <div className="text-white font-bold">{result.kePillar.nayinLongevity}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">时柱旬空</div>
                      <div className="text-white font-bold">{result.hourPillar.xunkong}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">刻柱旬空</div>
                      <div className="text-white font-bold">{result.kePillar.xunkong}</div>
                    </div>
                  </div>

                  {result.hourPillar.tougan.length > 0 && (
                    <div className="mt-4 bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">时柱透干</div>
                      <div className="flex flex-wrap gap-2">
                        {result.hourPillar.tougan.map((gan, index) => (
                          <span key={index} className="text-white bg-purple-500/20 px-3 py-1 rounded-lg">{gan}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.kePillar.tougan.length > 0 && (
                    <div className="mt-4 bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">刻柱透干</div>
                      <div className="flex flex-wrap gap-2">
                        {result.kePillar.tougan.map((gan, index) => (
                          <span key={index} className="text-white bg-pink-500/20 px-3 py-1 rounded-lg">{gan}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                    <h3 className="text-xl font-serif-sc font-bold text-white mb-4">神煞信息</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-5 border border-purple-500/20">
                        <div className="text-center mb-4">
                          <div className="text-lg font-bold text-purple-300 mb-1">时柱</div>
                          <div className="text-2xl font-bold text-white">
                            {result.hourPillar.gan}{result.hourPillar.zhi}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                              天干神煞 ({result.hourPillar.gan})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.tianganShensha)
                                .filter(([_, values]) => values.hour)
                                .map(([type, values]) => (
                                  <span key={type} className="text-sm text-white bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30">
                                    {type}（{values.hour}）
                                  </span>
                                ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                              地支神煞 ({result.hourPillar.zhi})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.dizhiShensha)
                                .filter(([_, values]) => values.hour)
                                .map(([type, values]) => (
                                  <span key={type} className="text-sm text-white bg-pink-500/20 px-3 py-1 rounded-lg border border-pink-500/30">
                                    {type}（{values.hour}）
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 rounded-xl p-5 border border-pink-500/20">
                        <div className="text-center mb-4">
                          <div className="text-lg font-bold text-pink-300 mb-1">刻柱</div>
                          <div className="text-2xl font-bold text-white">
                            {result.kePillar.gan}{result.kePillar.zhi}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                              天干神煞 ({result.kePillar.gan})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.tianganShensha)
                                .filter(([_, values]) => values.ke)
                                .map(([type, values]) => (
                                  <span key={type} className="text-sm text-white bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30">
                                    {type}（{values.ke}）
                                  </span>
                                ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                              地支神煞 ({result.kePillar.zhi})
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(result.dizhiShensha)
                                .filter(([_, values]) => values.ke)
                                .map(([type, values]) => (
                                  <span key={type} className="text-sm text-white bg-pink-500/20 px-3 py-1 rounded-lg border border-pink-500/30">
                                    {type}（{values.ke}）
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!interpretation && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleAiAnalysis()}
                        disabled={isAiAnalyzing}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        {isAiAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI 分析中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            AI 智能解读
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {interpretation && (
              <div>
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif-sc font-bold text-white">AI 解读</h2>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation.interpretation}</ReactMarkdown>
                  </div>

                  {interpretation.shishenAnalysis && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white mb-3">十神分析</h3>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation.shishenAnalysis}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {interpretation.nayinAnalysis && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white mb-3">纳音分析</h3>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation.nayinAnalysis}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {interpretation.shenshaAnalysis && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white mb-3">神煞分析</h3>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation.shenshaAnalysis}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {interpretation.advice && interpretation.advice.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white mb-3">实用建议</h3>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation.advice.map(a => `• ${a}`).join('\n')}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {interpretation.keywords && interpretation.keywords.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-white mb-3">关键词</h3>
                      <div className="flex flex-wrap gap-2">
                        {interpretation.keywords.map((keyword, index) => (
                          <span key={index} className="text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1 rounded-lg">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShiKeTianJi;
