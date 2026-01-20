export interface Slide {
  title: string;
  content: string;
  notes?: string;
}

export interface GeneratedPresentation {
  title: string;
  slides: Slide[];
}

export interface AppState {
  userInput: string;
  isLoading: boolean;
  presentation: GeneratedPresentation | null;
  error: string | null;
}
