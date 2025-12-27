import React, { useState } from 'react';
import HomePage from './components/HomePage';
import LifeKLinePage from './components/LifeKLinePage';
import BaziAnalysis from './components/BaziAnalysis';
import DaYunChatPage from './components/DaYunChatPage';
import TarotReading from './components/TarotReading';
import AstrologyDice from './components/AstrologyDice';
import ShiKeTianJi from './components/ShiKeTianJi';
import { UserInput } from './types';

type PageType = 'home' | 'kline' | 'analysis' | 'chat' | 'tarot' | 'astrologyDice' | 'shiketianji';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [apiSettings, setApiSettings] = useState({
    modelName: 'deepseek-reasoner',
    apiBaseUrl: 'https://api.deepseek.com',
    apiKey: '',
  });
  const [chatUserInput, setChatUserInput] = useState<UserInput | null>(null);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleApiSettingsChange = (settings: { modelName: string; apiBaseUrl: string; apiKey: string }) => {
    setApiSettings(settings);
  };

  const handleStartChat = (userInput: UserInput) => {
    setChatUserInput(userInput);
    setCurrentPage('chat');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage 
          onNavigate={handleNavigate} 
          apiSettings={apiSettings}
          onApiSettingsChange={handleApiSettingsChange}
        />
      )}
      {currentPage === 'kline' && <LifeKLinePage onBack={() => handleNavigate('home')} />}
      {currentPage === 'analysis' && (
        <BaziAnalysis 
          onBack={() => handleNavigate('home')} 
          apiSettings={apiSettings}
          onStartChat={handleStartChat}
        />
      )}
      {currentPage === 'chat' && chatUserInput && (
        <DaYunChatPage 
          userInput={chatUserInput}
          onBack={() => handleNavigate('analysis')}
        />
      )}
      {currentPage === 'tarot' && (
        <TarotReading 
          onBack={() => handleNavigate('home')}
          apiSettings={apiSettings}
        />
      )}
      {currentPage === 'astrologyDice' && (
        <AstrologyDice 
          onBack={() => handleNavigate('home')}
          apiSettings={apiSettings}
        />
      )}
      {currentPage === 'shiketianji' && (
        <ShiKeTianJi 
          onBack={() => handleNavigate('home')}
          apiSettings={apiSettings}
        />
      )}
    </>
  );
};

export default App;
