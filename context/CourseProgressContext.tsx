
import { createContext } from 'react';

interface CourseProgressContextType {
  completedModules: Set<number>;
  completedSubmodules: Set<string>;
  completeModule: (moduleId: number) => void;
  completeSubmodule: (submoduleId: string) => void;
  quizPassed: boolean;
  setQuizPassed: (passed: boolean) => void;
  isModuleCompleted: (moduleId: number) => boolean;
  getCourseProgress: () => number;
  getModuleProgress: (moduleId: number) => number;
}

export const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);