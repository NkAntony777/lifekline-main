export type PlanetType = 
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

export type ZodiacType = 
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export type HouseType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Planet {
  id: PlanetType;
  name: string;
  nameEn: string;
  symbol: string;
  keywords: string[];
  meaning: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

export interface Zodiac {
  id: ZodiacType;
  name: string;
  nameEn: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruler: PlanetType;
  keywords: string[];
  meaning: string;
}

export interface House {
  id: HouseType;
  name: string;
  nameEn: string;
  symbol: string;
  keywords: string[];
  meaning: string;
  naturalRuler: ZodiacType;
}

export interface DiceResult {
  planet: Planet;
  zodiac: Zodiac;
  house: House;
  timestamp: Date;
}

export interface AstrologyDiceInput {
  question: string;
}

export interface AstrologyDiceReading {
  input: AstrologyDiceInput;
  result: DiceResult;
  interpretation: string;
  advice: string[];
  keywords: string[];
}

export type QuestionType = 
  | 'love'
  | 'career'
  | 'health'
  | 'wealth'
  | 'family'
  | 'study'
  | 'travel'
  | 'general';

export interface ReelState {
  isSpinning: boolean;
  stopped: boolean;
  currentIndex: number;
  targetIndex: number;
}