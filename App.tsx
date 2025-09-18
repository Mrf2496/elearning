
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

  // Seed the database with media on first load
  useEffect(() => {
    const seedSubmoduleMedia = async () => {
      // --- Submodule 1-1 ---
      const submoduleId_1_1 = '1-1';
      
      // Seed Video for 1-1
      const videoSeedFlag_1_1 = `seeded_video_preview_v2_${submoduleId_1_1}`;
      if (!localStorage.getItem(videoSeedFlag_1_1)) {
        try {
          const rawUrl = 'https://drive.google.com/file/d/120P310UTf6CBqfjjuyUbhxl4l8M2pAwA/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveVideoUrl(submoduleId_1_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed video database for ${submoduleId_1_1}:`, error);
        } finally {
          localStorage.setItem(videoSeedFlag_1_1, 'true');
        }
      }

      // Seed Audio for 1-1
      const audioSeedFlag_1_1 = `seeded_audio_preview_v2_${submoduleId_1_1}`;
      if (!localStorage.getItem(audioSeedFlag_1_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_1_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_1_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_1_1, 'true');
        }
      }
      
      // --- Submodule 1-2 --- (User's request)
      const submoduleId_1_2 = '1-2';

      // Seed Audio for 1-2
      const audioSeedFlag_1_2 = `seeded_audio_preview_v2_${submoduleId_1_2}`;
      if (!localStorage.getItem(audioSeedFlag_1_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1ATYc37TjZB_F9ZVOOcV_l40JhBP6w22d/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_1_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_1_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_1_2, 'true');
        }
      }

      // --- Submodule 1-3 --- (User's request)
      const submoduleId_1_3 = '1-3';

      // Seed Audio for 1-3
      const audioSeedFlag_1_3 = `seeded_audio_preview_v2_${submoduleId_1_3}`;
      if (!localStorage.getItem(audioSeedFlag_1_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1A_mEIhQLEcbiGqNq7Bn-0AJmxAzwgh3h/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_1_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_1_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_1_3, 'true');
        }
      }

      // --- Submodule 2-1 ---
      const submoduleId_2_1 = '2-1';
      const audioSeedFlag_2_1 = `seeded_audio_preview_v2_${submoduleId_2_1}`;
      if (!localStorage.getItem(audioSeedFlag_2_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1SKXmmMwUeFblQCODQPtvuV8_UFgABMEc/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_2_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_2_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_2_1, 'true');
        }
      }

      // --- Submodule 2-2 ---
      const submoduleId_2_2 = '2-2';
      const audioSeedFlag_2_2 = `seeded_audio_preview_v2_${submoduleId_2_2}`;
      if (!localStorage.getItem(audioSeedFlag_2_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1XlHvsAVzeJTcjbFdDQcrlpLOWWLmgKkS/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_2_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_2_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_2_2, 'true');
        }
      }

      // --- Submodule 2-3 ---
      const submoduleId_2_3 = '2-3';
      const audioSeedFlag_2_3 = `seeded_audio_preview_v2_${submoduleId_2_3}`;
      if (!localStorage.getItem(audioSeedFlag_2_3)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1-daYLdD0iKoBVfYS3o8BcAxXE5br7J05/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_2_3, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_2_3}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_2_3, 'true');
        }
      }

      // --- Submodule 3-1 ---
      const submoduleId_3_1 = '3-1';
      const audioSeedFlag_3_1 = `seeded_audio_preview_v2_${submoduleId_3_1}`;
      if (!localStorage.getItem(audioSeedFlag_3_1)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1ffmhAPnh-eI2vxVD68jfnj8Ji14WZ0eE/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_3_1, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_3_1}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_3_1, 'true');
        }
      }

      // --- Submodule 3-2 ---
      const submoduleId_3_2 = '3-2';
      const audioSeedFlag_3_2 = `seeded_audio_preview_v2_${submoduleId_3_2}`;
      if (!localStorage.getItem(audioSeedFlag_3_2)) {
         try {
          const rawUrl = 'https://drive.google.com/file/d/1NqWChl3g4YBFLxi7wFLIYyubezolfdBE/view?usp=drive_link';
          const embedUrl = getEmbedUrl(rawUrl);
          if (embedUrl) {
            await saveAudioUrl(submoduleId_3_2, embedUrl);
          }
        } catch (error) {
          console.error(`Failed to seed audio database for ${submoduleId_3_2}:`, error);
        } finally {
          localStorage.setItem(audioSeedFlag_3_2, 'true');
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
