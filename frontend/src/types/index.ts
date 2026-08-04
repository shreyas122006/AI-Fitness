export type SearchType = 'equipment' | 'muscle' | 'bodyPart';

export interface AISummary {
  exercise: string;
  frequency: string;
  pros: string[];
  cons: string[];
  technique: string[];
  mistakes: string[];
  medical: string[];
  difficulty: string;
  calories: string;
  suitable: string;
}

export interface Exercise {
  id?: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions?: string[];
  gifUrl: string;
  summary: AISummary;
}

export interface SearchHistoryItem {
  id: string;
  searchType: SearchType;
  keyword: string;
  timestamp: string;
}

export interface UserSession {
  name: string;
  email: string;
  avatar: string;
}
