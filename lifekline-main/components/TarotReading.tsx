import React, { useState } from 'react';
import { UserInput, Gender } from '../types';
import { TarotReadingResult, DrawnCard, TarotSpread } from '../types/tarot';
import { generateTarotReading, generateTarotChatResponse } from '../services/geminiService';
import { tarotService } from '../services/tarotService';
import { Sparkles, Star, Moon, Sun, Loader2, ArrowLeft, RefreshCw, MessageSquare, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TarotReadingProps {
  onBack: () => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const TarotReading: React.FC<TarotReadingProps> = ({ onBack, apiSettings }) => {
  const [step, setStep] = useState<'input' | 'spreading' | 'reading' | 'chat'>('input');
  const [question, setQuestion] = useState('');
  const [selectedSpreadId, setSelectedSpreadId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readingResult, setReadingResult] = useState<TarotReadingResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  const spreads = tarotService.getAllSpreads();

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const userInput: UserInput = {
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
      };

      let spread: TarotSpread;
      let drawnCards: DrawnCard[];

      if (selectedSpreadId) {
        spread = tarotService.getSpreadById(selectedSpreadId)!;
        const result = tarotService.generateSpread({
          question,
          spreadId: selectedSpreadId,
          autoSelectSpread: false,
        });
        spread = result.spread;
        drawnCards = result.drawnCards;
      } else {
        const recommendation = tarotService.recommendSpread(question);
        spread = recommendation.spread;
        const result = tarotService.generateSpread({
          question,
          spreadId: spread.id,
          autoSelectSpread: true,
        });
        drawnCards = result.drawnCards;
      }

      setStep('spreading');
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await generateTarotReading(userInput, question, spread, drawnCards);
      setReadingResult(result);
      setStep('reading');
    } catch (err: any) {
      setError(err.message || '解读失败，请重试');
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReading = () => {
    setQuestion('');
    setSelectedSpreadId('');
    setReadingResult(null);
    setChatHistory([]);
    setStep('input');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsChatLoading(true);

    try {
      const userInput: UserInput = {
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
      };

      const newHistory = [
        ...chatHistory,
        { role: 'user' as const, content: userMessage, timestamp: Date.now() },
      ];
      setChatHistory(newHistory);

      const response = await generateTarotChatResponse(
        userInput,
        newHistory.map(m => ({ role: m.role, content: m.content })),
        userMessage,
        readingResult!
      );

      setChatHistory([
        ...newHistory,
        { role: 'assistant', content: response, timestamp: Date.now() },
      ]);
    } catch (err: any) {
      setError(err.message || '对话失败，请重试');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopy = () => {
    if (!readingResult) return;
    const text = `
【塔罗解读报告】

问题：${readingResult.question}
牌阵：${readingResult.spread.name}

【抽出的牌】
${readingResult.cards.map(dc => `${dc.position.name} - ${dc.card.name}${dc.isReversed ? '（逆位）' : '（正位）'}`).join('\n')}

【AI 解读结果】
${readingResult.overallInterpretation}

【关键词】
${readingResult.keywords.join('、')}
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
                <Sparkles className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-800">塔罗解读</h1>
                <p className="text-xs text-ink-500">AI 智能解读</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {readingResult && (
                <button
                  onClick={handleNewReading}
                  className="px-4 py-2 bg-seal/20 hover:bg-seal/30 text-seal rounded-lg transition-all text-sm font-medium flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  新解读
                </button>
              )}
              <button
                onClick={onBack}
                className="px-4 py-2 bg-paper-200 hover:bg-paper-300 text-ink-700 border border-ink-200 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回首页
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {step === 'input' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Moon className="w-12 h-12 text-seal" />
                  <Star className="w-16 h-16 text-wood" />
                  <Sun className="w-12 h-12 text-seal-light" />
                </div>
                <h2 className="text-4xl font-serif-sc font-bold text-ink-800 mb-3">塔罗解读</h2>
                <p className="text-ink-500 text-lg">提出你的问题，让塔罗牌为你指引方向</p>
              </div>

              <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm p-8 rounded-3xl border border-ink-200 shadow-xl">
                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-600 mb-2">你的问题</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="请描述你想咨询的问题..."
                      className="w-full h-32 bg-paper-100 border border-ink-200 rounded-xl px-4 py-3 text-ink placeholder-ink-400 focus:outline-none focus:border-seal focus:ring-2 focus:ring-seal/20 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-600 mb-2">选择牌阵（可选）</label>
                    <select
                      value={selectedSpreadId}
                      onChange={(e) => setSelectedSpreadId(e.target.value)}
                      className="w-full bg-paper-100 border border-ink-200 rounded-xl px-4 py-3 text-ink font-serif-sc focus:outline-none focus:border-seal focus:ring-2 focus:ring-seal/20 transition-all appearance-none cursor-pointer hover:border-seal/50 shadow-sm"
                    >
                      <option value="">自动推荐牌阵</option>
                      {spreads.map((spread) => (
                        <option key={spread.id} value={spread.id}>
                          {spread.name} - {spread.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-seal text-sm bg-seal/10 px-4 py-3 rounded-xl border border-seal/20">
                      <Loader2 className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="w-full bg-seal hover:bg-seal-dark text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-seal/20 hover:shadow-seal/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        正在抽牌...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        开始解读
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'spreading' && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
              <div className="text-center">
                <div className="relative w-32 h-48 mx-auto mb-8">
                  <div className="absolute inset-0 bg-seal rounded-xl animate-pulse"></div>
                  <div className="absolute inset-2 bg-seal-dark rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute inset-4 bg-wood rounded-xl animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-3">正在抽牌...</h2>
                <p className="text-ink-500">请静心等待，塔罗牌正在为你指引方向</p>
              </div>
            </div>
          )}

          {step === 'reading' && readingResult && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-2">解读结果</h2>
                <p className="text-ink-500">牌阵：{readingResult.spread.name}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-ink-200 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif-sc font-bold text-ink-800">抽出的牌</h3>
                    <button
                      onClick={() => setShowAllCards(!showAllCards)}
                      className="text-seal hover:text-seal-dark transition-colors text-sm flex items-center gap-1"
                    >
                      {showAllCards ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          收起
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          展开全部
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {readingResult.cards.slice(0, showAllCards ? undefined : 3).map((dc, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${dc.isReversed ? 'bg-seal/10 border border-seal/30' : 'bg-wood/10 border border-wood/30'
                          }`}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-seal rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-ink-800 font-semibold">{dc.card.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${dc.isReversed ? 'bg-seal/20 text-seal' : 'bg-green-600/20 text-green-700'}`}>
                              {dc.isReversed ? '逆位' : '正位'}
                            </span>
                          </div>
                          <p className="text-ink-500 text-sm mb-2">{dc.position.name} - {dc.position.description}</p>
                          <p className="text-ink-600 text-sm">{dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {readingResult.cards.length > 3 && !showAllCards && (
                    <div className="text-center pt-4">
                      <p className="text-ink-500 text-sm">还有 {readingResult.cards.length - 3} 张牌...</p>
                    </div>
                  )}
                </div>

                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-ink-200 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif-sc font-bold text-ink-800">AI 解读</h3>
                    <button
                      onClick={handleCopy}
                      className="text-seal hover:text-seal-dark transition-colors text-sm flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          复制
                        </>
                      )}
                    </button>
                  </div>

                  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-purple-300 prose-code:text-pink-300 prose-pre:bg-white/10 prose-li:text-gray-200 prose-ul:text-gray-200 prose-ol:text-gray-200 prose-blockquote:text-gray-200 prose-hr:border-gray-600">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {readingResult.overallInterpretation}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">关键词</h4>
                    <div className="flex flex-wrap gap-2">
                      {readingResult.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-serif-sc font-bold text-white">继续对话</h3>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                            ? 'bg-purple-500/20 text-white'
                            : 'bg-white/10 text-gray-200'
                          }`}
                      >
                        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-purple-300 prose-code:text-pink-300 prose-li:text-gray-200 prose-ul:text-gray-200 prose-ol:text-gray-200 prose-blockquote:text-gray-200 prose-hr:border-gray-600">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 rounded-2xl px-4 py-3">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="继续提问..."
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TarotReading;
