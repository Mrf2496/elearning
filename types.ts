
export interface Slide {
  title: string;
  points: string[];
  imageConcept: string;
}

export interface MultimediaContent {
  audioScript: string;
  videoConcept: {
    title: string;
    script: string;
  };
}

export interface Submodule {
  id: string;
  title: string;
  content: string;
  multimedia: MultimediaContent;
}

export interface EscapeRoomPuzzle {
  id: number;
  title: string;
  prompt: string;
  options: { id: number; text: string }[];
  correctOptionId: number;
  solutionHint: string;
}

export interface InteractiveGame {
  type: 'match' | 'drag_drop' | 'quiz' | 'memory' | 'word_search' | 'escape_room' | 'crossword';
  title: string;
  instruction: string;
  pairs?: { term: string; definition: string }[];
  items?: string[];
  memorySets?: {
      title: string;
      pairs: { term: string; definition: string }[];
  }[];
  words?: string[];
  escapeRoomPuzzles?: EscapeRoomPuzzle[];
  escapeRoomSolution?: string;
  crosswordPuzzles?: {
      id: number;
      clue: string;
      answer: string;
      position: { x: number, y: number };
      direction: 'across' | 'down';
  }[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  submodules: Submodule[];
  slides: Slide[];
  interactiveGameIdeas?: InteractiveGame[];
  oai?: 'uiaf_flow' | 'risk_factor_sorter';
}

export interface CaseStudy {
  id: number;
  scenario: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface CourseData {
  modules: Module[];
  caseStudies: CaseStudy[];
  finalQuiz: QuizQuestion[];
}

export enum View {
  Dashboard,
  Module,
  CaseStudies,
  Quiz,
  Certificate,
}