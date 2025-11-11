import { useState, useEffect, useCallback, useMemo } from 'react';
import { courseData } from '../constants/courseData';
import { useAuth } from './useAuth';
import { getFirebaseServices, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SUBMODULES_WITH_VIDEO = [
    '1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '9-1', '10-1'
];

const getLocalStorageKey = (userId: string) => `courseProgress-${userId}`;

export const useCourseProgress = () => {
  const { currentUser } = useAuth();
  
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [completedSubmodules, setCompletedSubmodules] = useState<Set<string>>(new Set());
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser) {
        // Reset progress on logout
        setCompletedModules(new Set());
        setCompletedSubmodules(new Set());
        setQuizPassed(false);
        setIsInitialLoad(true);
        return;
      }

      if (isFirebaseConfigured()) {
        const services = getFirebaseServices();
        if (!services) {
          setIsInitialLoad(false);
          return;
        }
        const { db } = services;
        try {
          const progressDocRef = doc(db, 'userProgress', currentUser.uid);
          const progressDoc = await getDoc(progressDocRef);
          
          if (progressDoc.exists()) {
            const data = progressDoc.data();
            setCompletedModules(new Set(data.completedModules || []));
            setCompletedSubmodules(new Set(data.completedSubmodules || []));
            setQuizPassed(data.quizPassed || false);
          } else {
            setCompletedModules(new Set());
            setCompletedSubmodules(new Set());
            setQuizPassed(false);
          }
        } catch (error) {
          console.error("Error loading progress from Firestore", error);
        } finally {
            setIsInitialLoad(false);
        }
      } else {
        // Load from localStorage for demo user
        try {
            const key = getLocalStorageKey(currentUser.uid);
            const savedProgress = localStorage.getItem(key);
            if (savedProgress) {
                const data = JSON.parse(savedProgress);
                setCompletedModules(new Set(data.completedModules || []));
                setCompletedSubmodules(new Set(data.completedSubmodules || []));
                setQuizPassed(data.quizPassed || false);
            }
        } catch(error) {
            console.error("Error loading progress from localStorage", error);
        } finally {
            setIsInitialLoad(false);
        }
      }
    };
    loadProgress();
  }, [currentUser]);

  // Save progress
  useEffect(() => {
    const saveProgress = async () => {
        if (!currentUser || isInitialLoad) return;

        if (isFirebaseConfigured()) {
            const services = getFirebaseServices();
            if (!services) return;
            const { db } = services;
            try {
                const progressDocRef = doc(db, 'userProgress', currentUser.uid);
                const progressData = {
                    completedModules: Array.from(completedModules),
                    completedSubmodules: Array.from(completedSubmodules),
                    quizPassed: quizPassed,
                };
                await setDoc(progressDocRef, progressData, { merge: true });
            } catch (error) {
                console.error("Error saving progress to Firestore", error);
            }
        } else {
            // Save to localStorage for demo user
            try {
                const key = getLocalStorageKey(currentUser.uid);
                const progressData = {
                    completedModules: Array.from(completedModules),
                    completedSubmodules: Array.from(completedSubmodules),
                    quizPassed: quizPassed,
                };
                localStorage.setItem(key, JSON.stringify(progressData));
            } catch(error) {
                console.error("Error saving progress to localStorage", error);
            }
        }
    };
    saveProgress();
  }, [completedModules, completedSubmodules, quizPassed, currentUser, isInitialLoad]);

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
