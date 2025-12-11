export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  BOOLEAN = 'BOOLEAN',
  FILL_BLANK = 'FILL_BLANK'
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  category: string;
  type: QuestionType;
  text: string;
  options: Option[];
  correctOptionIds: string[];
  explanation?: string;
  createdAt: number;
}


export enum QuizMode {
  SEQUENTIAL = 'SEQUENTIAL',
  RANDOM = 'RANDOM'
}

export interface QuizSettings {
  topic: string;
  mode: QuizMode;
  questionCount: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string[]>;
  score: number;
  isFinished: boolean;
  isLoading: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: number;
}

export const CATEGORIES: Category[] = [];