import React, { useState, useEffect, useRef } from 'react';
import { UserInput, Gender, DaYunBlock, ChatMessage as TypesChatMessage } from '../types';
import { generateDayunAnalysis, generateLiunianAnalysis, generateChatResponse } from '../services/geminiService';
import { ArrowLeft, MessageSquare, Send, Calendar, TrendingUp, Loader2, Check, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DaYunChatPageProps {
  userInput: UserInput;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  analysisType?: 'dayun' | 'liunian';
  target?: string;
  targetAge?: number;
  fromCard?: boolean;
}

const DaYunChatPage: React.FC<DaYunChatPageProps> = ({ userInput, onBack }) => {
  const [daYunBlocks, setDaYunBlocks] = useState<DaYunBlock[]>([]);
  const [selectedDaYun, setSelectedDaYun] = useState<DaYunBlock | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'initial' | 'analysis' | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState<{ type: 'dayun' | 'liunian'; target: string; targetAge?: number } | null>(null);
  const [userInputText, setUserInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateDaYunBlocks();
  }, [userInput]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateDaYunBlocks = () => {
    setIsLoading(true);
    setLoadingType('initial');

    try {
      const blocks = calculateDaYunBlocks(userInput);
      setDaYunBlocks(blocks);

      setMessages([
        {
          id: '1',
          type: 'system',
          content: '已为您生成大运数据。请点击上方的大运方块进行AI分析，或在下方输入框中提问。',
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      setMessages([
        {
          id: '1',
          type: 'system',
          content: `生成大运数据失败：${error.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const calculateDaYunBlocks = (input: UserInput): DaYunBlock[] => {
    const blocks: DaYunBlock[] = [];
    const startAge = parseInt(input.startAge) || 1;
    const firstDaYun = input.firstDaYun || '';
    const birthYear = parseInt(input.birthYear) || 1990;

    if (!firstDaYun) {
      throw new Error('请输入第一步大运');
    }

    const gan = firstDaYun.substring(0, 1);
    const zhi = firstDaYun.substring(1);

    const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const ganIndex = ganList.indexOf(gan);
    const zhiIndex = zhiList.indexOf(zhi);

    if (ganIndex === -1 || zhiIndex === -1) {
      throw new Error('大运格式不正确');
    }

    const yearStemPolarity = getStemPolarity(input.yearPillar);
    let isForward = false;

    if (input.gender === Gender.MALE) {
      isForward = yearStemPolarity === 'YANG';
    } else {
      isForward = yearStemPolarity === 'YIN';
    }

    for (let i = 0; i < 8; i++) {
      const currentGanIndex = isForward ? (ganIndex + i) % 10 : (ganIndex - i + 10) % 10;
      const currentZhiIndex = isForward ? (zhiIndex + i) % 12 : (zhiIndex - i + 12) % 12;

      const blockName = `${ganList[currentGanIndex]}${zhiList[currentZhiIndex]}`;
      const blockStartAge = startAge + i * 10;
      const blockEndAge = blockStartAge + 9;

      const liunians = calculateLiuNians(birthYear, blockStartAge, blockEndAge);

      blocks.push({
        name: blockName,
        startAge: blockStartAge,
        endAge: blockEndAge,
        liunians,
      });
    }

    return blocks;
  };

  const calculateLiuNians = (birthYear: number, startAge: number, endAge: number) => {
    const liunians = [];
    const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    for (let age = startAge; age <= endAge; age++) {
      const year = birthYear + age;
      const yearIndex = year - 4;
      const ganIndex = yearIndex % 10;
      const zhiIndex = yearIndex % 12;

      const liunianName = `${ganList[ganIndex]}${zhiList[zhiIndex]}`;

      liunians.push({
        name: liunianName,
        age,
        year,
      });
    }

    return liunians;
  };

  const getStemPolarity = (yearPillar: string): 'YANG' | 'YIN' => {
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    const stem = yearPillar.substring(0, 1);
    return yangStems.includes(stem) ? 'YANG' : 'YIN';
  };

  const handleDaYunClick = (block: DaYunBlock) => {
    setSelectedDaYun(block);
  };

  const handleAnalyzeClick = (target: string, type: 'dayun' | 'liunian', targetAge?: number) => {
    setPendingAnalysis({ type, target, targetAge });
    setShowConfirmDialog(true);
  };

  const handleConfirmAnalysis = async () => {
    if (!pendingAnalysis) return;

    setShowConfirmDialog(false);
    setIsLoading(true);
    setLoadingType('analysis');

    let userMessage: ChatMessage;
    let result: string;

    if (pendingAnalysis.type === 'dayun') {
      const block = daYunBlocks.find(b => b.name === pendingAnalysis.target);
      userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: `请分析大运：${pendingAnalysis.target} (${block?.startAge}-${block?.endAge}岁)`,
        timestamp: new Date(),
        analysisType: 'dayun',
        target: pendingAnalysis.target,
        fromCard: true,
      };
      result = await generateDayunAnalysis(userInput, pendingAnalysis.target, block?.startAge || 0, block?.endAge || 0);
    } else {
      const block = daYunBlocks.find(b => b.liunians.some(l => l.name === pendingAnalysis.target));
      const liunian = block?.liunians.find(l => l.name === pendingAnalysis.target);
      userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: `请分析流年：${pendingAnalysis.target} (${pendingAnalysis.targetAge}岁，${liunian?.year}年)`,
        timestamp: new Date(),
        analysisType: 'liunian',
        target: pendingAnalysis.target,
        targetAge: pendingAnalysis.targetAge,
        fromCard: true,
      };
      result = await generateLiunianAnalysis(userInput, block?.name || '', pendingAnalysis.target, pendingAnalysis.targetAge || 0);
    }

    setMessages(prev => [...prev, userMessage]);

    try {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result,
        timestamp: new Date(),
        fromCard: true,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `分析失败：${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
      setPendingAnalysis(null);
    }
  };

  const handleSendMessage = async () => {
    if (!userInputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = userInputText;
    setUserInputText('');
    setIsLoading(true);
    setLoadingType('analysis');

    try {
      const chatHistory: TypesChatMessage[] = messages
        .filter(msg => (msg.type === 'user' || msg.type === 'assistant') && !msg.fromCard)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp.getTime(),
        }));

      const result = await generateChatResponse(userInput, chatHistory, messageToSend);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `分析失败：${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-serif-sc font-bold text-white">大运流年对话分析</h1>
                <p className="text-xs text-gray-400">AI 智能分析</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 py-6 w-full gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              大运时间轴
            </h2>
            <div className="flex flex-wrap gap-3">
              {daYunBlocks.map((block, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <button
                    onClick={() => handleDaYunClick(block)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedDaYun?.name === block.name
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm font-bold font-serif-sc">{block.name}</div>
                    <div className="text-xs opacity-80">{block.startAge}-{block.endAge}岁</div>
                  </button>
                  {selectedDaYun?.name === block.name && (
                    <button
                      onClick={() => handleAnalyzeClick(block.name, 'dayun')}
                      className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-lg transform transition-all hover:scale-110"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {selectedDaYun && (
              <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  {selectedDaYun.name}大运流年 ({selectedDaYun.startAge}-{selectedDaYun.endAge}岁)
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {selectedDaYun.liunians.map((liunian, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <button
                        onClick={() => handleAnalyzeClick(liunian.name, 'liunian', liunian.age)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="text-xs font-bold font-serif-sc text-gray-300">{liunian.name}</div>
                        <div className="text-xs text-gray-500">{liunian.age}岁</div>
                      </button>
                      <button
                        onClick={() => handleAnalyzeClick(liunian.name, 'liunian', liunian.age)}
                        className="absolute -top-1 -right-1 p-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full shadow-lg transform transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <Sparkles className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                对话记录
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : message.type === 'assistant'
                        ? 'bg-white/10 text-gray-200'
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    }`}
                  >
                    {message.type === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mb-1" {...props} />,
                            p: ({ node, ...props }) => <p className="text-sm text-gray-200 mb-2" {...props} />,
                            ul: ({ node, ...props }) => <ul className="text-sm text-gray-200 list-disc list-inside mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="text-sm text-gray-200 list-decimal list-inside mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                            code: ({ node, className, ...props }: { node?: any; className?: string; inline?: boolean; [key: string]: any }) => {
                              const isInline = !className?.includes('language-') && !className?.includes('lang-');
                              return isInline 
                                ? <code className="bg-white/10 px-1 py-0.5 rounded text-xs text-amber-300" {...props} />
                                : <code className="block bg-black/30 p-2 rounded text-xs text-green-300 overflow-x-auto" {...props} />;
                            },
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-purple-400 pl-3 my-2" {...props} />,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    )}
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {loadingType === 'initial' ? '正在生成流年大运卡片，请耐心等待' : 'AI正在思考中'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInputText}
                  onChange={(e) => setUserInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="输入您的问题..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInputText.trim() || isLoading}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  发送
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">确认分析</h3>
            </div>
            <p className="text-gray-300 mb-6">
              确定要对 <span className="text-purple-400 font-bold">{pendingAnalysis?.target}</span> 进行AI分析吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAnalysis}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                确认分析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaYunChatPage;
