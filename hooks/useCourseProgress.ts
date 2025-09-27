
import { useState, useEffect, useCallback } from 'react';
import { courseData } from '../constants/courseData';

const MODULE_COUNT = courseData.modules.length;

export const useCourseProgress = () => {
  const [completedModules, setCompletedModules] = useState<Set<number>>(() => {
    try {
      const item = window.localStorage.getItem('completedModules');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error(error);
      return new Set();
    }
  });

  const [completedSubmodules, setCompletedSubmodules] = useState<Set<string>>(() => {
    try {
      const item = window.localStorage.getItem('completedSubmodules');
      return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
      console.error(error);
      return new Set();
    }
  });
  
  const [quizPassed, setQuizPassed] = useState<boolean>(() => {
    try {
      const item = window.localStorage.getItem('quizPassed');
      return item ? JSON.parse(item) : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('completedModules', JSON.stringify(Array.from(completedModules)));
    } catch (error) {
      console.error(error);
    }
  }, [completedModules]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem('completedSubmodules', JSON.stringify(Array.from(completedSubmodules)));
    } catch (error) {
      console.error(error);
    }
  }, [completedSubmodules]);

  useEffect(() => {
    try {
      window.localStorage.setItem('quizPassed', JSON.stringify(quizPassed));
    } catch (error) {
      console.error(error);
    }
  }, [quizPassed]);


  const completeModule = useCallback((moduleId: number) => {
    setCompletedModules(prev => new Set(prev).add(moduleId));
  }, []);
  
  const completeSubmodule = useCallback((submoduleId: string) => {
    setCompletedSubmodules(prev => new Set(prev).add(submoduleId));
  }, []);

  const isModuleCompleted = useCallback((moduleId: number): boolean => {
    const isAlreadyMarkedComplete = completedModules.has(moduleId);
    if(isAlreadyMarkedComplete) return true;

    const module = courseData.modules.find(m => m.id === moduleId);
    if(moduleId === 11) return isAlreadyMarkedComplete; // Case studies are handled differently
    if (!module || module.submodules.length === 0) return isAlreadyMarkedComplete;
    
    const allSubmodulesCompleted = module.submodules.every(sm => completedSubmodules.has(sm.id));
    if (allSubmodulesCompleted && !isAlreadyMarkedComplete) {
      completeModule(moduleId);
    }
    return allSubmodulesCompleted;
  }, [completedSubmodules, completedModules, completeModule]);

  const getCourseProgress = useCallback((): number => {
    let completedCount = 0;
    
    courseData.modules.forEach(m => {
        if(isModuleCompleted(m.id)) completedCount++;
    });

    if (completedModules.has(11)) { // Special ID for case studies
        completedCount++;
    }
    const totalCompletableItems = courseData.modules.length + 1; // Modules + Case Studies

    return (completedCount / totalCompletableItems) * 100;
  }, [isModuleCompleted, completedModules]);

  const getModuleProgress = useCallback((moduleId: number): number => {
    if (moduleId === 11) { // Special case for Case Studies
        return completedModules.has(11) ? 100 : 0;
    }
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module || module.submodules.length === 0) {
        return completedModules.has(moduleId) ? 100 : 0;
    }
    
    const completedInModule = module.submodules.filter(sm => completedSubmodules.has(sm.id)).length;
    const totalInModule = module.submodules.length;
    
    return totalInModule > 0 ? (completedInModule / totalInModule) * 100 : 0;
  }, [completedSubmodules, completedModules]);


  return { 
      completedModules, 
      completeModule,
      completedSubmodules,
      completeSubmodule,
      quizPassed,
      setQuizPassed,
      isModuleCompleted,
      getCourseProgress,
      getModuleProgress,
    };
};