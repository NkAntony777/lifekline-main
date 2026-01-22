import React, { useState } from 'react';
import { DiceResult, ReelState, AstrologyDiceReading } from '../types/astrologyDice';
import { astrologyDiceService } from '../services/astrologyDiceService';
import { interpretAstrologyDice } from '../services/geminiService';
import { Sparkles, Loader2, ArrowLeft, RefreshCw, Copy, Check, Dice3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AstrologyDiceProps {
  onBack: () => void;
  apiSettings: {
    modelName: string;
    apiBaseUrl: string;
    apiKey: string;
  };
}

const AstrologyDice: React.FC<AstrologyDiceProps> = ({ onBack, apiSettings }) => {
  const [step, setStep] = useState<'input' | 'rolling' | 'result'>('input');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [interpretation, setInterpretation] = useState<AstrologyDiceReading | null>(null);
  const [copied, setCopied] = useState(false);

  const [reelStates, setReelStates] = useState<ReelState[]>([
    { isSpinning: false, stopped: true, currentIndex: 0, targetIndex: 0 },
    { isSpinning: false, stopped: true, currentIndex: 0, targetIndex: 0 },
    { isSpinning: false, stopped: true, currentIndex: 0, targetIndex: 0 }
  ]);

  const planets = astrologyDiceService.getAllPlanets();
  const zodiacs = astrologyDiceService.getAllZodiacs();
  const houses = astrologyDiceService.getAllHouses();

  const handleRollDice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setStep('rolling');

    try {
      const result = astrologyDiceService.rollDice();
      const planetIndex = planets.findIndex(p => p.id === result.planet.id);
      const zodiacIndex = zodiacs.findIndex(z => z.id === result.zodiac.id);
      const houseIndex = houses.findIndex(h => h.id === result.house.id);

      setReelStates([
        { isSpinning: true, stopped: false, currentIndex: 0, targetIndex: planetIndex },
        { isSpinning: true, stopped: false, currentIndex: 0, targetIndex: zodiacIndex },
        { isSpinning: true, stopped: false, currentIndex: 0, targetIndex: houseIndex }
      ]);

      setTimeout(() => {
        setReelStates(prev => [
          { ...prev[0], isSpinning: false, stopped: true, currentIndex: planetIndex },
          ...prev.slice(1)
        ]);
      }, 2000);

      setTimeout(() => {
        setReelStates(prev => [
          prev[0],
          { ...prev[1], isSpinning: false, stopped: true, currentIndex: zodiacIndex },
          prev[2]
        ]);
      }, 3000);

      setTimeout(() => {
        setReelStates(prev => [
          prev[0],
          prev[1],
          { ...prev[2], isSpinning: false, stopped: true, currentIndex: houseIndex }
        ]);
        setDiceResult(result);
      }, 4000);

      setTimeout(async () => {
        const reading = await interpretAstrologyDice(
          question,
          result,
          apiSettings.modelName,
          apiSettings.apiBaseUrl,
          apiSettings.apiKey
        );
        setInterpretation(reading);
        setStep('result');
        setIsLoading(false);
      }, 4500);

    } catch (err: any) {
      setError(err.message || '占卜失败，请重试');
      setStep('input');
      setIsLoading(false);
    }
  };

  const handleNewRoll = () => {
    setQuestion('');
    setDiceResult(null);
    setInterpretation(null);
    setReelStates([
      { isSpinning: false, stopped: true, currentIndex: 0, targetIndex: 0 },
      { isSpinning: false, stopped: true, currentIndex: 0, targetIndex: 0 },
      { isSpinning: false, stopped: true, currentIndex: 0, targetIndex: 0 }
    ]);
    setStep('input');
  };

  const handleCopy = () => {
    if (!interpretation) return;
    const text = `
【占星骰子解读报告】

问题：${interpretation.input.question}

【占星骰子结果】
星星：${interpretation.result.planet.name}（${interpretation.result.planet.symbol}）
星座：${interpretation.result.zodiac.name}（${interpretation.result.zodiac.symbol}）
宫位：${interpretation.result.house.name}（${interpretation.result.house.symbol}）

【AI 解读结果】
${interpretation.interpretation}

【实用建议】
${interpretation.advice.map(a => `• ${a}`).join('\n')}

【关键词】
${interpretation.keywords.join('、')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ReelSlot: React.FC<{
    items: any[];
    currentIndex: number;
    isSpinning: boolean;
    label: string;
    symbolSize: string;
  }> = ({ items, currentIndex, isSpinning, label, symbolSize }) => {
    const displayIndex = isSpinning ? Math.floor(Date.now() / 100) % items.length : currentIndex;
    const currentItem = items[displayIndex];

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-ink-600 text-sm font-medium">{label}</div>
        <div className={`relative w-32 h-40 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-ink-200 flex flex-col items-center justify-center shadow-lg ${isSpinning ? 'animate-pulse' : ''}`}>
          {isSpinning ? (
            <div className="text-6xl animate-spin">
              <Dice3 className="w-16 h-16 text-seal" />
            </div>
          ) : (
            <>
              <div className={`text-${symbolSize} mb-2`}>{currentItem.symbol}</div>
              <div className="text-ink-800 font-bold text-center px-2">{currentItem.name}</div>
              <div className="text-ink-500 text-xs text-center mt-1 px-2">{currentItem.nameEn}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (step === 'input') {
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
                  <Dice3 className="w-6 h-6 text-paper-50" />
                </div>
                <div>
                  <h1 className="text-xl font-serif-sc font-bold text-ink-800">占星骰子</h1>
                  <p className="text-xs text-ink-500">AI 智能解读</p>
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

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-2">占星骰子占卜</h2>
                  <p className="text-ink-500">输入你的问题，让星星、星座和宫位为你指引方向</p>
                </div>

                <form onSubmit={handleRollDice} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-600 mb-2">你的问题</label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="例如：我最近的工作运势如何？"
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

                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-paper-200 rounded-xl p-4">
                    <div className="text-2xl mb-2">☉</div>
                    <div className="text-xs text-ink-500">星星</div>
                  </div>
                  <div className="bg-paper-200 rounded-xl p-4">
                    <div className="text-2xl mb-2">♈</div>
                    <div className="text-xs text-ink-500">星座</div>
                  </div>
                  <div className="bg-paper-200 rounded-xl p-4">
                    <div className="text-2xl mb-2">Ⅰ</div>
                    <div className="text-xs text-ink-500">宫位</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (step === 'rolling') {
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
                  <Dice3 className="w-6 h-6 text-paper-50" />
                </div>
                <div>
                  <h1 className="text-xl font-serif-sc font-bold text-ink-800">占星骰子</h1>
                  <p className="text-xs text-ink-500">AI 智能解读</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif-sc font-bold text-ink-800 mb-2">占星骰子占卜</h2>
                <p className="text-ink-500">正在为你抽取星星、星座和宫位...</p>
              </div>

              <div className="flex justify-center items-center gap-8">
                <ReelSlot
                  items={planets}
                  currentIndex={reelStates[0].currentIndex}
                  isSpinning={reelStates[0].isSpinning}
                  label="星星"
                  symbolSize="5xl"
                />
                <ReelSlot
                  items={zodiacs}
                  currentIndex={reelStates[1].currentIndex}
                  isSpinning={reelStates[1].isSpinning}
                  label="星座"
                  symbolSize="5xl"
                />
                <ReelSlot
                  items={houses}
                  currentIndex={reelStates[2].currentIndex}
                  isSpinning={reelStates[2].isSpinning}
                  label="宫位"
                  symbolSize="4xl"
                />
              </div>

              {reelStates.every(state => state.stopped) && (
                <div className="mt-12 text-center">
                  <div className="flex items-center justify-center gap-3 text-seal">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-lg font-medium">AI 正在分析中，请耐心等待...</span>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                <Dice3 className="w-6 h-6 text-paper-50" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-ink-800">占星骰子</h1>
                <p className="text-xs text-ink-500">AI 智能解读</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewRoll}
                className="flex items-center gap-2 px-4 py-2 bg-paper-200 hover:bg-paper-300 border border-ink-200 rounded-lg text-ink-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                重新占卜
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-paper-200 hover:bg-paper-300 border border-ink-200 rounded-lg text-ink-700 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制'}
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
          <div className="max-w-7xl mx-auto">
            {diceResult && (
              <div className="mb-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-serif-sc font-bold text-ink-800 mb-2">占星骰子结果</h2>
                    <p className="text-ink-500">问题：{interpretation?.input.question}</p>
                  </div>

                  <div className="flex justify-center items-center gap-8 mb-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-6xl">{diceResult.planet.symbol}</div>
                      <div className="text-ink-800 font-bold">{diceResult.planet.name}</div>
                      <div className="text-ink-500 text-sm">{diceResult.planet.nameEn}</div>
                    </div>
                    <div className="text-4xl text-ink-400">+</div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-6xl">{diceResult.zodiac.symbol}</div>
                      <div className="text-ink-800 font-bold">{diceResult.zodiac.name}</div>
                      <div className="text-ink-500 text-sm">{diceResult.zodiac.nameEn}</div>
                    </div>
                    <div className="text-4xl text-ink-400">+</div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-6xl">{diceResult.house.symbol}</div>
                      <div className="text-ink-800 font-bold">{diceResult.house.name}</div>
                      <div className="text-ink-500 text-sm">{diceResult.house.nameEn}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-paper-200 rounded-xl p-4">
                      <div className="text-sm text-ink-600 mb-2">星星关键词</div>
                      <div className="flex flex-wrap gap-1">
                        {diceResult.planet.keywords.map((keyword, index) => (
                          <span key={index} className="text-xs bg-seal/20 text-seal px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-paper-200 rounded-xl p-4">
                      <div className="text-sm text-ink-600 mb-2">星座关键词</div>
                      <div className="flex flex-wrap gap-1">
                        {diceResult.zodiac.keywords.map((keyword, index) => (
                          <span key={index} className="text-xs bg-wood/20 text-wood-dark px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-paper-200 rounded-xl p-4">
                      <div className="text-sm text-ink-600 mb-2">宫位关键词</div>
                      <div className="flex flex-wrap gap-1">
                        {diceResult.house.keywords.map((keyword, index) => (
                          <span key={index} className="text-xs bg-ink/10 text-ink-700 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {interpretation && (
              <div>
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-ink-200 p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-seal p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif-sc font-bold text-ink-800">AI 解读</h2>
                  </div>

                  <div className="prose prose-sm max-w-none prose-headings:text-ink-800 prose-p:text-ink-600 prose-strong:text-ink-800 prose-a:text-seal prose-code:text-seal">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {interpretation.interpretation}
                    </ReactMarkdown>
                  </div>

                  {interpretation.advice.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-serif-sc font-bold text-ink-800 mb-4">实用建议</h3>
                      <div className="space-y-3">
                        {interpretation.advice.map((advice, index) => (
                          <div key={index} className="bg-paper-200 rounded-xl p-4 border border-ink-200">
                            <div className="flex items-start gap-3">
                              <div className="bg-seal text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 prose prose-sm max-w-none prose-headings:text-ink-800 prose-p:text-ink-600 prose-strong:text-ink-800 prose-a:text-seal prose-code:text-seal">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {advice}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {interpretation.keywords.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-serif-sc font-bold text-ink-800 mb-4">关键词</h3>
                      <div className="flex flex-wrap gap-2">
                        {interpretation.keywords.map((keyword, index) => (
                          <span key={index} className="bg-seal/10 text-seal px-4 py-2 rounded-full border border-seal/30">
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

export default AstrologyDice;