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
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginView from './components/LoginView';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  
  const progressHook = useCourseProgress();

  const handleSelectModule = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    if (moduleId === 11) {
      setCurrentView(View.CaseStudies);
    } else {
      setCurrentView(View.Module);
    }
    setIsSidebarOpen(false);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setSelectedModuleId(null);
    setIsSidebarOpen(false);
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
            onNavigate={handleNavigate}
            onNextModule={handleNextModule}
            onPreviousModule={handlePreviousModule}
            isFirstModule={currentModuleIndex === 0}
            isLastModule={currentModuleIndex === moduleIds.length - 1}
          />
        ) : <CourseDashboard onSelectModule={handleSelectModule} />;
      case View.CaseStudies:
        return <CaseStudiesView onNavigate={handleNavigate}/>;
      case View.Quiz:
        return <FinalQuiz />;
      case View.Certificate:
        return <Certificate />;
      case View.AdminPanel:
        return <AdminPanel />;
      case View.Dashboard:
      default:
        return <CourseDashboard onSelectModule={handleSelectModule} />;
    }
  }

  return (
    <CourseProgressContext.Provider value={progressHook}>
      <div className="min-h-screen flex flex-col bg-slate-100">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}
          <Sidebar 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onSelectModule={handleSelectModule}
            selectedModuleId={selectedModuleId}
          />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </CourseProgressContext.Provider>
  );
}

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  
  // The useEffect for seeding media has been removed to prevent permission errors.
  // Media URLs are now served directly from a hardcoded list in `lib/db.ts`.

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return currentUser ? <MainApp /> : <LoginView />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}