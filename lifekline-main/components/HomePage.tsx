import React, { useState } from 'react';
import { Sparkles, TrendingUp, Brain, ArrowRight, Settings, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2, Dice3, Clock } from 'lucide-react';
import { testApiConnection } from '../services/geminiService';

interface HomePageProps {
  onNavigate: (page: 'kline' | 'analysis' | 'tarot' | 'astrologyDice' | 'shiketianji') => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
  onApiSettingsChange: (settings: { modelName: string; apiBaseUrl: string; apiKey: string }) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, apiSettings, onApiSettingsChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleApiSettingChange = (field: 'modelName' | 'apiBaseUrl' | 'apiKey', value: string) => {
    onApiSettingsChange({ ...apiSettings, [field]: value });
    setApiTestResult(null);
  };

  const handleTestApi = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);

    try {
      const result = await testApiConnection(apiSettings.apiKey, apiSettings.apiBaseUrl, apiSettings.modelName);
      setApiTestResult(result);
    } catch (error: any) {
      setApiTestResult({ success: false, message: `测试失败: ${error.message}` });
    } finally {
      setIsTestingApi(false);
    }
  };
  return (
    <div className="min-h-screen bg-paper-100 relative overflow-hidden bg-paper-pattern">
      {/* Ink Wash Decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-ink-300 rounded-full filter blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-wood-300 rounded-full filter blur-3xl mix-blend-multiply" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-paper-300 rounded-full filter blur-3xl mix-blend-multiply" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-paper-100/80 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-seal p-2 rounded-lg shadow-sm">
                <Sparkles className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-900 tracking-wider">天机阁</h1>
                <p className="text-xs text-ink-500 font-serif-sc">AI 驱动 · 传统命理</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-paper-50 hover:bg-paper-200 text-ink-700 border border-ink-200 rounded-lg transition-all text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span>API 设置</span>
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showSettings && (
            <div className="max-w-7xl mx-auto px-4 mt-4 animate-fade-in">
              <div className="bg-paper-50/95 backdrop-blur-xl p-6 rounded-2xl border border-ink-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-ink-700 text-sm font-bold">
                    <Settings className="w-4 h-4" />
                    <span>API 接口设置</span>
                  </div>
                  <button
                    onClick={handleTestApi}
                    disabled={isTestingApi || !apiSettings.apiKey || !apiSettings.apiBaseUrl}
                    className="px-4 py-2 bg-seal hover:bg-seal-dark disabled:bg-ink-300 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2 shadow-md"
                  >
                    {isTestingApi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>测试中...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>测试连接</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-500 mb-1">使用模型</label>
                    <input
                      type="text"
                      value={apiSettings.modelName}
                      onChange={(e) => handleApiSettingChange('modelName', e.target.value)}
                      placeholder="gemini-3-pro-preview"
                      className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono outline-none text-ink-900 focus:ring-2 focus:ring-seal-light/50 focus:border-seal-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-500 mb-1">API Base URL</label>
                    <input
                      type="text"
                      value={apiSettings.apiBaseUrl}
                      onChange={(e) => handleApiSettingChange('apiBaseUrl', e.target.value)}
                      placeholder="https://max.openai365.top/v1"
                      className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono outline-none text-ink-900 focus:ring-2 focus:ring-seal-light/50 focus:border-seal-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-500 mb-1">API Key</label>
                    <input
                      type="password"
                      value={apiSettings.apiKey}
                      onChange={(e) => handleApiSettingChange('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono outline-none text-ink-900 focus:ring-2 focus:ring-seal-light/50 focus:border-seal-light transition-all"
                    />
                  </div>
                </div>
                {apiTestResult && (
                  <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${apiTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    {apiTestResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${apiTestResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {apiTestResult.message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-red-800 rounded-xl shadow-lg border-2 border-red-900 transform rotate-45">
                <div className="transform -rotate-45">
                  <Sparkles className="w-8 h-8 text-paper-50" />
                </div>
              </div>
              {/* Elegant Serif Title with Gradient Text (Ink to Seal) */}
              <h1 className="text-5xl md:text-7xl font-serif-sc font-bold text-transparent bg-clip-text bg-gradient-to-r from-ink-900 to-ink-700 tracking-[0.2em] ml-4">
                天机阁
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-ink-600 font-serif-sc font-light tracking-wide mb-4">
              探索人生轨迹 · 洞悉命运奥秘
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-ink-500">
              <span className="w-2 h-2 bg-seal rounded-full animate-pulse"></span>
              <span className="tracking-widest">AI 驱动 · 传统命理 · 现代可视化</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full">
            {/* Card 1: Life K-Line */}
            <div
              onClick={() => onNavigate('kline')}
              className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-ink-200 hover:border-wood transition-all duration-500 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-wood/10"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-wood-100 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-wood group-hover:text-white transition-colors duration-300">
                  <TrendingUp className="w-6 h-6 text-wood group-hover:text-white transition-colors" />
                </div>

                <h2 className="text-xl font-serif-sc font-bold text-ink-900 mb-2 group-hover:text-wood transition-colors">
                  人生 K 线
                </h2>
                <p className="text-ink-500 mb-4 text-xs leading-relaxed h-16 line-clamp-3">
                  将人生运势以股票 K 线图形式可视化展现，直观呈现人生"牛市"与"熊市"，洞悉命运起伏。
                </p>

                <div className="flex items-center gap-2 text-wood/70 group-hover:text-wood group-hover:gap-3 transition-all duration-300 text-sm font-medium">
                  <span>开始探索</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 2: Bazi Analysis */}
            <div
              onClick={() => onNavigate('analysis')}
              className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-ink-200 hover:border-seal transition-all duration-500 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-seal/10"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-seal-light/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-seal group-hover:text-white transition-colors duration-300">
                  <Brain className="w-6 h-6 text-seal group-hover:text-white transition-colors" />
                </div>

                <h2 className="text-xl font-serif-sc font-bold text-ink-900 mb-2 group-hover:text-seal transition-colors">
                  八字 AI 分析
                </h2>
                <p className="text-ink-500 mb-4 text-xs leading-relaxed h-16 line-clamp-3">
                  基于大模型深度批断，生成性格、事业、财富、婚姻、健康等多维度命理分析报告。
                </p>

                <div className="flex items-center gap-2 text-seal/70 group-hover:text-seal group-hover:gap-3 transition-all duration-300 text-sm font-medium">
                  <span>开始分析</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 3: Tarot */}
            <div
              onClick={() => onNavigate('tarot')}
              className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-ink-200 hover:border-indigo-800 transition-all duration-500 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/10"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-800 group-hover:text-white transition-colors duration-300">
                  <Sparkles className="w-6 h-6 text-indigo-800 group-hover:text-white transition-colors" />
                </div>

                <h2 className="text-xl font-serif-sc font-bold text-ink-900 mb-2 group-hover:text-indigo-800 transition-colors">
                  塔罗 AI 解读
                </h2>
                <p className="text-ink-500 mb-4 text-xs leading-relaxed h-16 line-clamp-3">
                  智能推荐牌阵，AI 深度解读每张牌的含义，揭示命运指引，解答人生困惑。
                </p>

                <div className="flex items-center gap-2 text-indigo-800/70 group-hover:text-indigo-800 group-hover:gap-3 transition-all duration-300 text-sm font-medium">
                  <span>开始解读</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 4: Astrology Dice */}
            <div
              onClick={() => onNavigate('astrologyDice')}
              className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-ink-200 hover:border-violet-800 transition-all duration-500 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-violet-800 group-hover:text-white transition-colors duration-300">
                  <Dice3 className="w-6 h-6 text-violet-800 group-hover:text-white transition-colors" />
                </div>

                <h2 className="text-xl font-serif-sc font-bold text-ink-900 mb-2 group-hover:text-violet-800 transition-colors">
                  占星骰子
                </h2>
                <p className="text-ink-500 mb-4 text-xs leading-relaxed h-16 line-clamp-3">
                  投掷三颗骰子获得星星、星座、宫位，AI 深度解读组合含义，解答人生疑问。
                </p>

                <div className="flex items-center gap-2 text-violet-800/70 group-hover:text-violet-800 group-hover:gap-3 transition-all duration-300 text-sm font-medium">
                  <span>开始占卜</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Card 5: ShiKeTianJi */}
            <div
              onClick={() => onNavigate('shiketianji')}
              className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-ink-200 hover:border-teal-800 transition-all duration-500 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/10"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-800 group-hover:text-white transition-colors duration-300">
                  <Clock className="w-6 h-6 text-teal-800 group-hover:text-white transition-colors" />
                </div>

                <h2 className="text-xl font-serif-sc font-bold text-ink-900 mb-2 group-hover:text-teal-800 transition-colors">
                  时刻天机
                </h2>
                <p className="text-ink-500 mb-4 text-xs leading-relaxed h-16 line-clamp-3">
                  根据当前时刻或随机数计算时柱与客柱，AI 解读十神、纳音、神煞，洞察时机与运势。
                </p>

                <div className="flex items-center gap-2 text-teal-800/70 group-hover:text-teal-800 group-hover:gap-3 transition-all duration-300 text-sm font-medium">
                  <span>开始测算</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-ink-400 text-sm font-serif-sc tracking-widest opacity-80">
              仅供娱乐与文化研究 · 命运掌握在自己手中
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
