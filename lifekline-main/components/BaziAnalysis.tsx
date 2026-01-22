import React, { useState } from 'react';
import { UserInput, Gender, AnalysisMode } from '../types';
import { generateLifeAnalysis } from '../services/geminiService';
import { Sparkles, Brain, TrendingUp, Loader2, AlertCircle, ChevronDown, ChevronUp, MessageSquare, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BaziAnalysisProps {
  onBack: () => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
  onStartChat?: (userInput: UserInput) => void;
}

const BaziAnalysis: React.FC<BaziAnalysisProps> = ({ onBack, apiSettings, onStartChat }) => {
  const [analysisMode, setAnalysisMode] = useState<'overall' | 'dayun' | null>(null);
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: Gender.MALE,
    birthYear: '',
    yearPillar: '',
    monthPillar: '',
    dayPillar: '',
    hourPillar: '',
    startAge: '',
    firstDaYun: '',
    modelName: apiSettings.modelName,
    apiBaseUrl: apiSettings.apiBaseUrl,
    apiKey: apiSettings.apiKey,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const isFormValid = () => {
    return !!(formData.birthYear &&
      formData.yearPillar &&
      formData.monthPillar &&
      formData.dayPillar &&
      formData.hourPillar &&
      formData.startAge &&
      formData.firstDaYun);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateLifeAnalysis({
        ...formData,
        modelName: apiSettings.modelName,
        apiBaseUrl: apiSettings.apiBaseUrl,
        apiKey: apiSettings.apiKey,
        analysisMode: analysisMode === 'overall' ? AnalysisMode.OVERALL : AnalysisMode.DAYUN,
      });
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || '分析失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    const text = `
【八字命理分析报告】

姓名：${formData.name || '未提供'}
性别：${formData.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)'}

【八字四柱】
年柱：${formData.yearPillar}
月柱：${formData.monthPillar}
日柱：${formData.dayPillar}
时柱：${formData.hourPillar}

【AI 分析结果】
${analysis}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-paper-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-seal-200 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ink-200 rounded-full filter blur-3xl" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-paper-50/90 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-seal p-2 rounded-lg shadow-sm">
                <Brain className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-800">八字 AI 分析</h1>
                <p className="text-xs text-ink-500">AI 深度批断</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-paper-200 hover:bg-paper-300 text-ink-700 border border-ink-200 rounded-lg transition-all text-sm font-medium"
            >
              ← 返回首页
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {!analysisMode ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-fade-in-up">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-serif-sc font-bold text-ink-800 mb-3">选择分析模式</h2>
                <p className="text-ink-500 text-lg">请选择您需要的八字分析功能</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                <div
                  onClick={() => setAnalysisMode('overall')}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-seal/30 hover:border-seal transition-all duration-500 cursor-pointer hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-seal/20"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-seal rounded-t-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-seal p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-12 h-12 text-paper-50" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif-sc font-bold text-ink-800 text-center mb-3">整体分析</h3>
                    <p className="text-ink-600 text-center text-sm leading-relaxed mb-6">
                      全方位八字命理分析，包含性格、事业、财富、婚姻、健康、六亲、风水等综合运势评估
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>性格分析</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>事业运势</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>财富运势</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>婚姻感情</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>健康运势</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>六亲关系</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>发展风水</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-seal rounded-full"></div>
                        <span>币圈交易</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronDown className="w-6 h-6 text-seal" />
                  </div>
                </div>

                <div
                  onClick={() => setAnalysisMode('dayun')}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-wood/30 hover:border-wood transition-all duration-500 cursor-pointer hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-wood/20"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-wood rounded-t-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-wood p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-12 h-12 text-paper-50" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif-sc font-bold text-ink-800 text-center mb-3">大运流年分析</h3>
                    <p className="text-ink-600 text-center text-sm leading-relaxed mb-6">
                      深入分析大运流年运势，预测未来十年吉凶祸福，把握人生关键转折点
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-wood rounded-full"></div>
                        <span>大运分析</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-wood rounded-full"></div>
                        <span>流年运势</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-wood rounded-full"></div>
                        <span>吉凶预测</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-wood rounded-full"></div>
                        <span>转折点分析</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-wood rounded-full"></div>
                        <span>运势起伏</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-500 text-xs">
                        <div className="w-1.5 h-1.5 bg-wood rounded-full"></div>
                        <span>时机把握</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronDown className="w-6 h-6 text-wood" />
                  </div>
                </div>
              </div>
            </div>
          ) : !analysis ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-ink-200 shadow-xl">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-2">
                    {analysisMode === 'overall' ? '整体分析' : '大运流年分析'}
                  </h2>
                  <p className="text-ink-500 text-sm">请输入八字信息进行 AI 分析</p>
                  <button
                    onClick={() => setAnalysisMode(null)}
                    className="mt-3 text-sm text-seal hover:text-seal-dark flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                    返回选择模式
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">姓名 (可选)</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500"
                        placeholder="姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">性别</label>
                      <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: Gender.MALE })}
                          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${formData.gender === Gender.MALE
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        >
                          乾造 (男)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: Gender.FEMALE })}
                          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${formData.gender === Gender.FEMALE
                            ? 'bg-pink-500 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        >
                          坤造 (女)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-3 text-amber-400 text-sm font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>输入四柱干支</span>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-400 mb-1">出生年份 (阳历)</label>
                      <input
                        type="number"
                        name="birthYear"
                        required
                        min="1900"
                        max="2100"
                        value={formData.birthYear}
                        onChange={handleChange}
                        placeholder="如: 1990"
                        className="w-full px-3 py-2 bg-white/5 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-center font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">年柱</label>
                        <input
                          type="text"
                          name="yearPillar"
                          required
                          value={formData.yearPillar}
                          onChange={handleChange}
                          placeholder="如: 甲子"
                          className="w-full px-3 py-2 bg-white/5 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-center font-serif-sc font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">月柱</label>
                        <input
                          type="text"
                          name="monthPillar"
                          required
                          value={formData.monthPillar}
                          onChange={handleChange}
                          placeholder="如: 丙寅"
                          className="w-full px-3 py-2 bg-white/5 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-center font-serif-sc font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">日柱</label>
                        <input
                          type="text"
                          name="dayPillar"
                          required
                          value={formData.dayPillar}
                          onChange={handleChange}
                          placeholder="如: 戊辰"
                          className="w-full px-3 py-2 bg-white/5 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-center font-serif-sc font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">时柱</label>
                        <input
                          type="text"
                          name="hourPillar"
                          required
                          value={formData.hourPillar}
                          onChange={handleChange}
                          placeholder="如: 壬戌"
                          className="w-full px-3 py-2 bg-white/5 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-center font-serif-sc font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3 text-purple-400 text-sm font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>大运排盘信息</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">起运年龄 (虚岁)</label>
                        <input
                          type="number"
                          name="startAge"
                          required
                          min="1"
                          max="100"
                          value={formData.startAge}
                          onChange={handleChange}
                          placeholder="如: 3"
                          className="w-full px-3 py-2 bg-white/5 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">第一步大运</label>
                        <input
                          type="text"
                          name="firstDaYun"
                          required
                          value={formData.firstDaYun}
                          onChange={handleChange}
                          placeholder="如: 丁卯"
                          className="w-full px-3 py-2 bg-white/5 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white text-center font-serif-sc font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    {analysisMode === 'overall' ? (
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>AI 分析中...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="h-5 w-5" />
                            <span>开始分析</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onStartChat && onStartChat({
                          ...formData,
                          modelName: apiSettings.modelName,
                          apiBaseUrl: apiSettings.apiBaseUrl,
                          apiKey: apiSettings.apiKey,
                        })}
                        disabled={isLoading || !isFormValid()}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>生成中...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-5 w-5" />
                            <span>开始对话</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-serif-sc font-bold text-white mb-2">
                    {formData.name ? `${formData.name}的` : ''}命理分析报告
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {formData.gender === Gender.MALE ? '男 (乾造)' : '女 (坤造)'} · {formData.birthYear}年生
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-medium border border-white/10"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制报告'}
                  </button>
                  <button
                    onClick={() => setAnalysis(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-medium border border-white/10"
                  >
                    ← 重新分析
                  </button>
                </div>
              </div>

              <div className="prose prose-invert prose-purple max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-purple-300 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-purple-300 mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold text-purple-300 mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-100 leading-relaxed mb-3">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-100 mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-100 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-100">{children}</li>,
                    strong: ({ children }) => <strong className="text-yellow-300 font-bold">{children}</strong>,
                    em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
                    code: ({ node, className, children, ...props }: { node?: any; className?: string; inline?: boolean; children?: React.ReactNode }) => {
                      const isInline = !className?.includes('language-') && !className?.includes('lang-');
                      return isInline ? (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-amber-300 font-mono" {...props}>{children}</code>
                      ) : (
                        <code className="block bg-white/10 p-3 rounded-lg text-xs text-green-300 font-mono overflow-x-auto my-3 border border-white/20" {...props}>{children}</code>
                      );
                    },
                    pre: ({ children }) => <pre className="bg-white/10 p-3 rounded-lg overflow-x-auto my-3 border border-white/20">{children}</pre>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-3 bg-purple-500/10 rounded-r-lg">{children}</blockquote>
                    ),
                    table: ({ children }) => <div className="overflow-x-auto my-4"><table className="min-w-full border border-white/20 rounded-lg">{children}</table></div>,
                    thead: ({ children }) => <thead className="bg-white/10">{children}</thead>,
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => <tr className="border-b border-white/10">{children}</tr>,
                    th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 text-sm text-gray-100">{children}</td>,
                    a: ({ href, children }) => <a href={href} className="text-purple-300 hover:text-purple-200 underline">{children}</a>,
                    hr: () => <hr className="my-6 border-white/10" />,
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BaziAnalysis;
