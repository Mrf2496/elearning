import React, { useState, useMemo, useEffect } from 'react';
import { View } from './types';
import { courseData } from './constants/courseData';
import { CourseProgressContext } from './context/CourseProgressContext';
import { useCourseProgress } from './hooks/useCourseProgress';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CourseDashboard from './components/CourseDashboard';
import ModuleView from './components/ModuleView';
import CaseStudiesView from './components/CaseStudiesView';
import FinalQuiz from './components/FinalQuiz';
import Certificate from './components/Certificate';
import { saveVideoUrl, getVideoUrl, saveAudioUrl, getAudioUrl } from './lib/db';
import { getEmbedUrl } from './lib/utils';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  
  const progressHook = useCourseProgress();

  // Seed the database with media for submodule 1-1 on first load
  useEffect(() => {
    const seedSubmoduleMedia = async () => {
      const submoduleId = '1-1';
      
      // Seed Video
      const videoSeedFlag = `seeded_video_preview_v2_${submoduleId}`;
      if (!localStorage.getItem(videoSeedFlag)) {
        try {
          const rawUrl = 'https://drive.google.com/file/d/120P310UTf6CBqfjjuyUbhxl4l8M2pAwA/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId, embedUrl);
          }
        } catch (error) {
          console.error('Failed to seed video database:', error);
        } finally {
          localStorage.setItem(videoSeedFlag, 'true');
        }
      }

      // Seed Audio
      const audioSeedFlag = `seeded_audio_preview_v2_${submoduleId}`;
      if (!localStorage.getItem(audioSeedFlag)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId, embedUrl);
          }
        } catch (error) {
          console.error('Failed to seed audio database:', error);
        } finally {
          localStorage.setItem(audioSeedFlag, 'true');
        }
      }
    };

    seedSubmoduleMedia();
  }, []);


  const handleSelectModule = (moduleId: number) => {
    if (moduleId === 11) {
      setCurrentView(View.CaseStudies);
    } else {
      setSelectedModuleId(moduleId);
      setCurrentView(View.Module);
    }
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const selectedModule = useMemo(() => 
    courseData.modules.find(m => m.id === selectedModuleId),
    [selectedModuleId]
  );

  const moduleIds = useMemo(() => courseData.modules.map(m => m.id), []);
  const currentModuleIndex = selectedModuleId !== null ? moduleIds.indexOf(selectedModuleId) : -1;

  const handleNextModule = () => {
    if (currentModuleIndex > -1 && currentModuleIndex < moduleIds.length - 1) {
      const nextModuleId = moduleIds[currentModuleIndex + 1];
      handleSelectModule(nextModuleId);
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      const prevModuleId = moduleIds[currentModuleIndex - 1];
      handleSelectModule(prevModuleId);
    }
  };
  
  const renderContent = () => {
    switch(currentView) {
      case View.Module:
        return selectedModule ? (
          <ModuleView 
            module={selectedModule} 
            onModuleComplete={() => progressHook.completeModule(selectedModule.id)}
            onNavigate={handleNavigate}
            onNextModule={handleNextModule}
            onPreviousModule={handlePreviousModule}
            isFirstModule={currentModuleIndex === 0}
            isLastModule={currentModuleIndex === moduleIds.length - 1}
          />
        ) : <CourseDashboard onSelectModule={handleSelectModule} />;
      case View.CaseStudies:
        return <CaseStudiesView onComplete={() => progressHook.completeModule(11)} />;
      case View.Quiz:
        return <FinalQuiz />;
      case View.Certificate:
        return <Certificate />;
      case View.Dashboard:
      default:
        return <CourseDashboard onSelectModule={handleSelectModule} />;
    }
  }

  return (
    <CourseProgressContext.Provider value={progressHook}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onNavigate={handleNavigate} />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </CourseProgressContext.Provider>
  );
}