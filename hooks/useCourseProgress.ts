import { useState, useEffect, useCallback, useMemo } from 'react';
import { courseData } from '../constants/courseData';
import { useAuth } from './useAuth';

const SUBMODULES_WITH_VIDEO = [
    '1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '9-1', '10-1'
];

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

    if (moduleId === 11) { // Case studies module
        const allCasesCompleted = courseData.caseStudies.every(cs => completedSubmodules.has(`case-${cs.id}`));
        if (allCasesCompleted) {
            completeModule(11);
        }
        return allCasesCompleted;
    }

    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module) return isAlreadyMarkedComplete;
    
    const completableItems: string[] = [];
    module.submodules.forEach(sm => {
        completableItems.push(sm.id);
        completableItems.push(`${sm.id}-audio`);
        if (SUBMODULES_WITH_VIDEO.includes(sm.id)) {
            completableItems.push(`${sm.id}-video`);
        }
    });

    if (module.slides && module.slides.length > 0) {
        completableItems.push(`${module.id}-slides`);
    }

    if (module.interactiveGameIdeas && module.interactiveGameIdeas.length > 0) {
        module.interactiveGameIdeas.forEach((_game, index) => {
            completableItems.push(`${module.id}-game-${index}`);
        });
    }
    
    if (module.oai) {
        completableItems.push(`${module.id}-oai`);
    }
    
    if (completableItems.length === 0) {
        return isAlreadyMarkedComplete;
    }

    const allItemsCompleted = completableItems.every(id => completedSubmodules.has(id));

    if (allItemsCompleted && !isAlreadyMarkedComplete) {
      completeModule(moduleId);
    }
    return allItemsCompleted;
  }, [completedSubmodules, completedModules, completeModule]);

  const allCourseItems = useMemo(() => {
    const items: string[] = [];
    courseData.modules.forEach(module => {
        module.submodules.forEach(sm => {
            items.push(sm.id);
            items.push(`${sm.id}-audio`);
            if (SUBMODULES_WITH_VIDEO.includes(sm.id)) {
                items.push(`${sm.id}-video`);
            }
        });
        if (module.slides?.length) {
            items.push(`${module.id}-slides`);
        }
        if (module.interactiveGameIdeas?.length) {
            module.interactiveGameIdeas.forEach((_, index) => {
                items.push(`${module.id}-game-${index}`);
            });
        }
        if (module.oai) {
            items.push(`${module.id}-oai`);
        }
    });

    courseData.caseStudies.forEach(cs => {
        items.push(`case-${cs.id}`);
    });
    return items;
  }, []);

  const getCourseProgress = useCallback((): number => {
      if (allCourseItems.length === 0) return 0;
      
      const completedCount = allCourseItems.filter(id => completedSubmodules.has(id)).length;
      
      return (completedCount / allCourseItems.length) * 100;
  }, [completedSubmodules, allCourseItems]);

  const getModuleProgress = useCallback((moduleId: number): number => {
    if (moduleId === 11) { // Special case for Case Studies
        const completedCases = courseData.caseStudies.filter(cs => completedSubmodules.has(`case-${cs.id}`)).length;
        return courseData.caseStudies.length > 0 ? (completedCases / courseData.caseStudies.length) * 100 : 0;
    }
    const module = courseData.modules.find(m => m.id === moduleId);
    if (!module) {
        return completedModules.has(moduleId) ? 100 : 0;
    }
    
    const moduleItems: string[] = [];
    module.submodules.forEach(sm => {
        moduleItems.push(sm.id);
        moduleItems.push(`${sm.id}-audio`);
        if (SUBMODULES_WITH_VIDEO.includes(sm.id)) {
            moduleItems.push(`${sm.id}-video`);
        }
    });
    if (module.slides?.length) {
        moduleItems.push(`${module.id}-slides`);
    }
    if (module.interactiveGameIdeas?.length) {
        module.interactiveGameIdeas.forEach((_, index) => {
            moduleItems.push(`${module.id}-game-${index}`);
        });
    }
    if (module.oai) {
        moduleItems.push(`${module.id}-oai`);
    }

    if (moduleItems.length === 0) {
      return completedModules.has(moduleId) ? 100 : 0;
    }

    const completedInModule = moduleItems.filter(id => completedSubmodules.has(id)).length;
    return (completedInModule / moduleItems.length) * 100;
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