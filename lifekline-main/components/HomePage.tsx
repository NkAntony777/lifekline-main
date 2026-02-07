import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Dice3,
  Github,
  Loader2,
  Scroll,
  Settings,
  Sparkles,
  TrendingUp,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { testApiConnection } from '../services/geminiService';

interface HomePageProps {
  onNavigate: (page: 'kline' | 'analysis' | 'tarot' | 'astrologyDice' | 'shiketianji' | 'dailyDivination' | 'luzuLingqian') => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
  onApiSettingsChange: (settings: { modelName: string; apiBaseUrl: string; apiKey: string }) => void;
}

interface FeatureCard {
  key: 'kline' | 'analysis' | 'tarot' | 'astrologyDice' | 'shiketianji' | 'dailyDivination' | 'luzuLingqian';
  title: string;
  description: string;
  accent: string;
  icon: LucideIcon;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, apiSettings, onApiSettingsChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const cards = useMemo<FeatureCard[]>(
    () => [
      {
        key: 'kline',
        title: '人生阶段地图',
        description: '阶段地图 + 命运时间轴 + 热力图 + 3D坐标，替代传统K线展示。',
        accent: 'text-wood border-wood/30 bg-wood-50',
        icon: TrendingUp,
      },
      {
        key: 'analysis',
        title: '八字 AI 分析',
        description: '输出多维命理解读，覆盖性格、事业、财富、健康与关系等核心主题。',
        accent: 'text-seal border-seal/30 bg-seal-50',
        icon: Brain,
      },
      {
        key: 'tarot',
        title: '塔罗 AI 解读',
        description: '多牌阵抽取与解读，结合上下文给出结构化建议。',
        accent: 'text-indigo-700 border-indigo-300 bg-indigo-50',
        icon: Sparkles,
      },
      {
        key: 'astrologyDice',
        title: '占星骰子',
        description: '星体、星座、宫位三重骰面，快速得到问题导向解读。',
        accent: 'text-violet-700 border-violet-300 bg-violet-50',
        icon: Dice3,
      },
      {
        key: 'shiketianji',
        title: '时刻天机',
        description: '按当前时刻或自定义时刻起盘，分析十神与时机变化。',
        accent: 'text-teal-700 border-teal-300 bg-teal-50',
        icon: Clock,
      },
      {
        key: 'dailyDivination',
        title: '每日一卦',
        description: '结合紫微与易经信息，生成今日宜忌和行动建议。',
        accent: 'text-amber-700 border-amber-300 bg-amber-50',
        icon: BookOpen,
      },
      {
        key: 'luzuLingqian',
        title: '吕祖灵签',
        description: '完整签文系统，支持抽签、释义与场景化建议。',
        accent: 'text-rose-700 border-rose-300 bg-rose-50',
        icon: Scroll,
      },
    ],
    [],
  );

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
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-ink-300 rounded-full filter blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-20 right-20 w-[30rem] h-[30rem] bg-wood-300 rounded-full filter blur-3xl mix-blend-multiply" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-paper-100/85 backdrop-blur-md border-b border-ink-200/30 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-seal p-2 rounded-lg shadow-sm">
                <Sparkles className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-900 tracking-wider">天机阁</h1>
                <p className="text-xs text-ink-500 font-serif-sc">AI 驱动 · 命理可视化工作台</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/NkAntony777/lifekline-main"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-paper-50 hover:bg-paper-200 text-ink-700 border border-ink-200 rounded-lg transition-all shadow-sm"
                title="查看源码"
              >
                <Github className="w-5 h-5" />
              </a>
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="px-4 py-2 bg-paper-50 hover:bg-paper-200 text-ink-700 border border-ink-200 rounded-lg transition-all text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <Settings className="w-4 h-4" />
                API 设置
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="max-w-7xl mx-auto px-4 mt-4 animate-fade-in">
              <div className="bg-paper-50/95 backdrop-blur-xl p-6 rounded-2xl border border-ink-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-ink-700 text-sm font-bold">
                    <Settings className="w-4 h-4" />
                    API 接口设置
                  </div>
                  <button
                    onClick={handleTestApi}
                    disabled={isTestingApi || !apiSettings.apiKey || !apiSettings.apiBaseUrl}
                    className="px-4 py-2 bg-seal hover:bg-seal-dark disabled:bg-ink-300 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2 shadow-md"
                  >
                    {isTestingApi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        测试中...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        测试连接
                      </>
                    )}
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-500 mb-1">模型名</label>
                    <input
                      type="text"
                      value={apiSettings.modelName}
                      onChange={(event) => handleApiSettingChange('modelName', event.target.value)}
                      placeholder="gemini-3-pro-preview"
                      className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono outline-none text-ink-900 focus:ring-2 focus:ring-seal-light/50 focus:border-seal-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-500 mb-1">API Base URL</label>
                    <input
                      type="text"
                      value={apiSettings.apiBaseUrl}
                      onChange={(event) => handleApiSettingChange('apiBaseUrl', event.target.value)}
                      placeholder="https://api.deepseek.com"
                      className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono outline-none text-ink-900 focus:ring-2 focus:ring-seal-light/50 focus:border-seal-light transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-500 mb-1">API Key</label>
                    <input
                      type="password"
                      value={apiSettings.apiKey}
                      onChange={(event) => handleApiSettingChange('apiKey', event.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 bg-white border border-ink-200 rounded-lg text-xs font-mono outline-none text-ink-900 focus:ring-2 focus:ring-seal-light/50 focus:border-seal-light transition-all"
                    />
                  </div>
                </div>

                {apiTestResult && (
                  <div
                    className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
                      apiTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
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

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <section className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-serif-sc font-bold text-ink-900 tracking-widest mb-4">天机阁</h2>
            <p className="text-lg md:text-xl text-ink-600 font-serif-sc mb-2">探索人生轨迹 · 洞察趋势节点</p>
            <p className="text-sm text-ink-500 tracking-wider">AI 驱动 · 传统命理 · 现代可视化</p>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl w-full">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => onNavigate(card.key)}
                  className="group relative text-left bg-white/65 backdrop-blur-sm rounded-xl p-6 border border-ink-200 hover:border-ink-400 transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 border ${card.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif-sc font-bold text-ink-900 mb-2">{card.title}</h3>
                  <p className="text-ink-500 mb-4 text-xs leading-relaxed h-16 line-clamp-3">{card.description}</p>
                  <div className="flex items-center gap-2 text-ink-600 group-hover:text-ink-900 group-hover:gap-3 transition-all duration-300 text-sm font-medium">
                    <span>进入模块</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </section>

          <footer className="mt-14 text-center">
            <p className="text-ink-400 text-sm tracking-widest">仅供娱乐与文化研究 · 决策请结合现实判断</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
