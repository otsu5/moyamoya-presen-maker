
export interface Question {
  id: number;
  question: string;
  reason: string;
  answer: string;
}

export interface PresentationData {
  moyamoya: string;
  script: string;
  questions: Question[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppState extends PresentationData {
  isGenerating: boolean;
  error: string | null;
  apiKey: string;
}
