import React, { useState, useMemo } from 'react';
import LifeKLineChart from './LifeKLineChart';
import AnalysisResult from './AnalysisResult';
import ImportDataMode from './ImportDataMode';
import { LifeDestinyResult } from '../types';
import { AlertCircle, Download, Printer, Trophy, FileDown, FileUp, TrendingUp } from 'lucide-react';

interface LifeKLinePageProps {
  onBack: () => void;
}

const LifeKLinePage: React.FC<LifeKLinePageProps> = ({ onBack }) => {
  const [result, setResult] = useState<LifeDestinyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleDataImport = (data: LifeDestinyResult) => {
    setResult(data);
    setUserName('');
    setError(null);
  };

  const handleExportJson = () => {
    if (!result) return;

    const exportData = {
      bazi: result.analysis.bazi,
      summary: result.analysis.summary,
      summaryScore: result.analysis.summaryScore,
      personality: result.analysis.personality,
      personalityScore: result.analysis.personalityScore,
      industry: result.analysis.industry,
      industryScore: result.analysis.industryScore,
      fengShui: result.analysis.fengShui,
      fengShuiScore: result.analysis.fengShuiScore,
      wealth: result.analysis.wealth,
      wealthScore: result.analysis.wealthScore,
      marriage: result.analysis.marriage,
      marriageScore: result.analysis.marriageScore,
      health: result.analysis.health,
      healthScore: result.analysis.healthScore,
      family: result.analysis.family,
      familyScore: result.analysis.familyScore,
      crypto: result.analysis.crypto,
      cryptoScore: result.analysis.cryptoScore,
      cryptoYear: result.analysis.cryptoYear,
      cryptoStyle: result.analysis.cryptoStyle,
      chartPoints: result.chartData,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `命理分析_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.chartPoints || !Array.isArray(data.chartPoints)) {
          throw new Error('无效的数据格式：缺少 chartPoints');
        }

        const importedResult: LifeDestinyResult = {
          chartData: data.chartPoints,
          analysis: {
            bazi: data.bazi || [],
            summary: data.summary || "无摘要",
            summaryScore: data.summaryScore || 5,
            personality: data.personality || "无性格分析",
            personalityScore: data.personalityScore || 5,
            industry: data.industry || "无",
            industryScore: data.industryScore || 5,
            fengShui: data.fengShui || "建议多亲近自然，保持心境平和。",
            fengShuiScore: data.fengShuiScore || 5,
            wealth: data.wealth || "无",
            wealthScore: data.wealthScore || 5,
            marriage: data.marriage || "无",
            marriageScore: data.marriageScore || 5,
            health: data.health || "无",
            healthScore: data.healthScore || 5,
            family: data.family || "无",
            familyScore: data.familyScore || 5,
            crypto: data.crypto || "暂无交易分析",
            cryptoScore: data.cryptoScore || 5,
            cryptoYear: data.cryptoYear || "待定",
            cryptoStyle: data.cryptoStyle || "现货定投",
          },
        };

        setResult(importedResult);
        setError(null);
      } catch (err: any) {
        setError(`文件解析失败：${err.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveHtml = () => {
    if (!result) return;

    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const chartContainer = document.querySelector('.recharts-surface');
    const chartSvg = chartContainer ? chartContainer.outerHTML : '<div style="padding:20px;text-align:center;">图表导出失败，请截图保存</div>';

    const analysisContainer = document.getElementById('analysis-result-container');
    const analysisHtml = analysisContainer ? analysisContainer.innerHTML : '';

    const tableRows = result.chartData.map(item => {
      const scoreColor = item.close >= item.open ? 'text-green-600' : 'text-red-600';
      const trendIcon = item.close >= item.open ? '▲' : '▼';
      return `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="p-3 border-r border-gray-100 text-center font-mono">${item.age}岁</td>
          <td class="p-3 border-r border-gray-100 text-center font-bold">${item.year} ${item.ganZhi}</td>
          <td class="p-3 border-r border-gray-100 text-center text-sm">${item.daYun || '-'}</td>
          <td class="p-3 border-r border-gray-100 text-center font-bold ${scoreColor}">
            ${item.score} <span class="text-xs">${trendIcon}</span>
          </td>
          <td class="p-3 text-sm text-gray-700 text-justify leading-relaxed">${item.reason}</td>
        </tr>
      `;
    }).join('');

    const detailedTableHtml = `
      <div class="mt-12 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
           <div class="w-1 h-5 bg-indigo-600 rounded-full"></div>
           <h3 class="text-xl font-bold text-gray-800 font-serif-sc">流年详批全表</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-100 text-gray-600 text-sm font-bold uppercase tracking-wider">
                <th class="p-3 border-r border-gray-200 text-center w-20">年龄</th>
                <th class="p-3 border-r border-gray-200 text-center w-28">流年</th>
                <th class="p-3 border-r border-gray-200 text-center w-28">大运</th>
                <th class="p-3 border-r border-gray-200 text-center w-20">评分</th>
                <th class="p-3">运势批断与建议</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const fullHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userName || '用户'} - 人生K线命理报告</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Inter:wght@400;600&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
    .font-serif-sc { font-family: 'Noto Serif SC', serif; }
    svg { width: 100% !important; height: auto !important; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen p-4 md:p-12">
  <div class="max-w-6xl mx-auto space-y-10">
    <div class="text-center border-b border-gray-200 pb-8">
      <h1 class="text-4xl font-bold font-serif-sc text-gray-900 mb-2">${userName ? userName + '的' : ''}人生K线命理报告</h1>
      <p class="text-gray-500 text-sm">生成时间：${timeString}</p>
    </div>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center gap-2 mb-6">
        <div class="w-1 h-6 bg-indigo-600 rounded-full"></div>
        <h3 class="text-xl font-bold text-gray-800 font-serif-sc">流年大运走势图</h3>
      </div>
      <div class="w-full overflow-hidden flex justify-center py-4">
        ${chartSvg}
      </div>
    </div>
    <div class="space-y-8">
       ${analysisHtml}
    </div>
    ${detailedTableHtml}
    <div class="text-center text-gray-400 text-sm py-12 border-t border-gray-200 mt-12">
      <p>&copy; ${now.getFullYear()} 人生K线项目 | 仅供娱乐与文化研究，请勿迷信</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName || 'User'}_Life_Kline_Report_${now.getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const peakYearItem = useMemo(() => {
    if (!result || !result.chartData.length) return null;
    return result.chartData.reduce((prev, current) => (prev.high > current.high) ? prev : current);
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full bg-white/5 backdrop-blur-xl border-b border-white/10 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif-sc font-bold text-white">人生 K 线</h1>
                <p className="text-xs text-gray-400">Life Destiny K-Line</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm font-medium"
            >
              ← 返回首页
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {!result ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div className="text-center max-w-2xl flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-serif-sc font-bold text-white mb-6">
                  洞悉命运起伏 <br />
                  <span className="text-amber-400">预见人生轨迹</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  结合<strong>传统八字命理</strong>与<strong>金融可视化技术</strong>，
                  将您的一生运势绘制成类似股票行情的K线图。
                </p>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 rounded-xl border border-amber-500/20 mb-6 text-left w-full max-w-lg">
                  <h3 className="font-bold text-amber-400 mb-2">📝 使用方法</h3>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>填写八字信息，生成专属提示词</li>
                    <li>复制提示词到任意 AI（ChatGPT、Claude、Gemini 等）</li>
                    <li>将 AI 返回的 JSON 数据粘贴回来</li>
                  </ol>
                </div>

                <label className="flex items-center gap-3 px-6 py-3 bg-white/5 border-2 border-dashed border-emerald-500/30 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/10 transition-all group mb-4">
                  <FileUp className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300" />
                  <span className="text-base font-medium text-gray-300 group-hover:text-emerald-300">已有 JSON 文件？点击直接导入</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                </label>
              </div>

              <ImportDataMode onDataImport={handleDataImport} />

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20 max-w-md w-full">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <h2 className="text-2xl font-bold font-serif-sc text-white">
                  {userName ? `${userName}的` : ''}命盘分析报告
                </h2>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white border border-emerald-500/30 rounded-lg transition-all font-medium text-sm backdrop-blur-sm"
                  >
                    <FileDown className="w-4 h-4" />
                    导出JSON
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-500/30 rounded-lg transition-all font-medium text-sm backdrop-blur-sm"
                  >
                    <Printer className="w-4 h-4" />
                    保存PDF
                  </button>
                  <button
                    onClick={handleSaveHtml}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-500/30 rounded-lg transition-all font-medium text-sm backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                    保存网页
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg transition-all font-medium text-sm"
                  >
                    ← 重新排盘
                  </button>
                </div>
              </div>

              <section className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    流年大运走势图 (100年)
                  </h3>
                  {peakYearItem && (
                    <p className="text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 inline-flex items-center gap-2 self-start mt-1">
                      <Trophy className="w-3 h-3 text-amber-300" />
                      人生巅峰年份：{peakYearItem.year}年 ({peakYearItem.ganZhi}) - {peakYearItem.age}岁，评分 <span className="text-amber-300 text-lg">{peakYearItem.high}</span>
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-2">
                  <span className="text-green-400 font-bold">绿色K线</span> 代表运势上涨（吉），
                  <span className="text-red-400 font-bold">红色K线</span> 代表运势下跌（凶）。
                </p>
                <LifeKLineChart data={result.chartData} />
              </section>

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
