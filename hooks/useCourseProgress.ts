import { useState, useEffect, useCallback } from 'react';
import { courseData } from '../constants/courseData';
import { useAuth } from './useAuth';

const MODULE_COUNT = courseData.modules.length;

export const useCourseProgress = () => {
  const { currentUser } = useAuth();

  const getStorageKey = useCallback((baseKey: string) => {
    return currentUser ? `${currentUser.cedula}_${baseKey}` : null;
  }, [currentUser]);
  
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [completedSubmodules, setCompletedSubmodules] = useState<Set<string>>(new Set());
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Load progress when user changes
  useEffect(() => {
    if (currentUser) {
      try {
        const modulesKey = getStorageKey('completedModules');
        const submodulesKey = getStorageKey('completedSubmodules');
        const quizKey = getStorageKey('quizPassed');
        
        const modulesItem = modulesKey ? window.localStorage.getItem(modulesKey) : null;
        setCompletedModules(modulesItem ? new Set(JSON.parse(modulesItem)) : new Set());

        const submodulesItem = submodulesKey ? window.localStorage.getItem(submodulesKey) : null;
        setCompletedSubmodules(submodulesItem ? new Set(JSON.parse(submodulesItem)) : new Set());

        const quizItem = quizKey ? window.localStorage.getItem(quizKey) : null;
        setQuizPassed(quizItem ? JSON.parse(quizItem) : false);

      } catch (error) {
        console.error("Error loading progress from localStorage", error);
        setCompletedModules(new Set());
        setCompletedSubmodules(new Set());
        setQuizPassed(false);
      }
    } else {
      // Reset progress on logout
      setCompletedModules(new Set());
      setCompletedSubmodules(new Set());
      setQuizPassed(false);
    }
  }, [currentUser, getStorageKey]);

  // Save progress when it changes
  useEffect(() => {
    const key = getStorageKey('completedModules');
    if (key) {
      try {
        window.localStorage.setItem(key, JSON.stringify(Array.from(completedModules)));
      } catch (error) {
        console.error(error);
      }
    }
  }, [completedModules, getStorageKey]);
  
  useEffect(() => {
    const key = getStorageKey('completedSubmodules');
    if (key) {
      try {
        window.localStorage.setItem(key, JSON.stringify(Array.from(completedSubmodules)));
      } catch (error) {
        console.error(error);
      }
    }
  }, [completedSubmodules, getStorageKey]);

  useEffect(() => {
    const key = getStorageKey('quizPassed');
    if (key) {
      try {
        window.localStorage.setItem(key, JSON.stringify(quizPassed));
      } catch (error) {
        console.error(error);
      }
    }
  }, [quizPassed, getStorageKey]);

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

    return totalCompletableItems > 0 ? (completedCount / totalCompletableItems) * 100 : 0;
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
