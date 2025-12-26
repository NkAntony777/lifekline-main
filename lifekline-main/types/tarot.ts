export type TarotCardType = 'major' | 'minor';

export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  type: TarotCardType;
  suit?: TarotSuit;
  number?: number;
  image: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  description: string;
}

export interface TarotPosition {
  id: string;
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
    rotation?: number;
  };
}

export interface TarotSpread {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: TarotPosition[];
  适用场景: string[];
}

export interface DrawnCard {
  card: TarotCard;
  position: TarotPosition;
  isReversed: boolean;
}

export interface TarotReadingResult {
  spread: TarotSpread;
  question: string;
  cards: DrawnCard[];
  overallInterpretation: string;
  advice: string[];
  keywords: string[];
}

export interface TarotReadingInput {
  question: string;
  spreadId?: string;
  autoSelectSpread?: boolean;
  specificCards?: string[];
}

export type QuestionType = 
  | 'simple'
  | 'past_present_future'
  | 'complex'
  | 'relationship'
  | 'career'
  | 'health'
  | 'spiritual'
  | 'general';

export interface SpreadRecommendation {
  spread: TarotSpread;
  reason: string;
  confidence: number;
}
