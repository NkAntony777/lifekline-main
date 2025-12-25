import React, { useState } from 'react';
import { Sparkles, TrendingUp, Brain, ArrowRight, Settings, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { testApiConnection } from '../services/geminiService';

interface HomePageProps {
  onNavigate: (page: 'kline' | 'analysis') => void;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-white">命理智慧</h1>
                <p className="text-xs text-gray-400">AI 驱动 · 传统命理</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>API 设置</span>
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showSettings && (
            <div className="max-w-7xl mx-auto px-4 mt-4 animate-fade-in">
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm font-bold">
                    <Settings className="w-4 h-4" />
                    <span>API 接口设置</span>
                  </div>
                  <button
                    onClick={handleTestApi}
                    disabled={isTestingApi || !apiSettings.apiKey || !apiSettings.apiBaseUrl}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2"
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
                    <label className="block text-xs font-bold text-gray-400 mb-1">使用模型</label>
                    <input
                      type="text"
                      value={apiSettings.modelName}
                      onChange={(e) => handleApiSettingChange('modelName', e.target.value)}
                      placeholder="gemini-3-pro-preview"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono outline-none text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">API Base URL</label>
                    <input
                      type="text"
                      value={apiSettings.apiBaseUrl}
                      onChange={(e) => handleApiSettingChange('apiBaseUrl', e.target.value)}
                      placeholder="https://max.openai365.top/v1"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono outline-none text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">API Key</label>
                    <input
                      type="password"
                      value={apiSettings.apiKey}
                      onChange={(e) => handleApiSettingChange('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono outline-none text-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                {apiTestResult && (
                  <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${apiTestResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    {apiTestResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${apiTestResult.success ? 'text-green-300' : 'text-red-300'}`}>
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
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-2xl shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif-sc font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200">
              命理智慧
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide mb-4">
            探索人生轨迹 · 洞悉命运奥秘
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>AI 驱动 · 传统命理 · 现代可视化</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div
            onClick={() => onNavigate('kline')}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-amber-400/50 transition-all duration-500 cursor-pointer hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-serif-sc font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                人生 K 线
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                将人生运势以股票 K 线图形式可视化展现，直观呈现人生"牛市"与"熊市"，洞悉命运起伏。
              </p>
              
              <div className="flex items-center gap-2 text-amber-400 group-hover:gap-4 transition-all duration-300">
                <span className="font-medium">开始探索</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigate('analysis')}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 cursor-pointer hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-serif-sc font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                八字 AI 分析
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                基于大模型深度批断，生成性格、事业、财富、婚姻、健康等多维度命理分析报告。
              </p>
              
              <div className="flex items-center gap-2 text-purple-400 group-hover:gap-4 transition-all duration-300">
                <span className="font-medium">开始分析</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            仅供娱乐与文化研究，命运掌握在自己手中
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
