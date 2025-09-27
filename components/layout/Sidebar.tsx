
import React, { useContext } from 'react';
import { View } from '../../types';
import { CourseProgressContext } from '../../context/CourseProgressContext';
import { courseData } from '../../constants/courseData';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import LockIcon from '../icons/LockIcon';

interface SidebarProps {
  onNavigate: (view: View) => void;
  onSelectModule: (moduleId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, onSelectModule }) => {
  const progressContext = useContext(CourseProgressContext);
  if (!progressContext) return null;

  const { quizPassed, getCourseProgress, getModuleProgress, isModuleCompleted } = progressContext;
  
  const allModulesAndCasesCompleted = getCourseProgress() >= 100;

  const navItems = [
    { view: View.Dashboard, label: 'Inicio', id: 'dash' },
    ...courseData.modules.map(m => ({ view: View.Module, label: `Módulo ${m.id}`, id: m.id })),
    { view: View.CaseStudies, label: 'Módulo 11: Casos Prácticos', id: 11 },
    { view: View.Quiz, label: 'Evaluación Final', id: 'quiz' },
    { view: View.Certificate, label: 'Certificado', id: 'cert' },
  ];
  
  const handleSelect = (item: typeof navItems[0]) => {
      if(item.view === View.Module || item.view === View.CaseStudies) {
          if (typeof item.id === 'number') {
              onSelectModule(item.id);
          }
      } else {
          onNavigate(item.view);
      }
  }

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex-shrink-0 hidden md:block border-r border-slate-200">
      <nav>
        <ul>
          {navItems.map((item) => {
            const isModuleOrCases = typeof item.id === 'number';
            const isQuiz = item.id === 'quiz';
            const isCert = item.id === 'cert';
            
            const progress = isModuleOrCases ? getModuleProgress(item.id) : 0;
            const isCompleted = isModuleOrCases ? isModuleCompleted(item.id) : false;

            const isLocked = (isQuiz && !allModulesAndCasesCompleted) || (isCert && !quizPassed);

            return (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => handleSelect(item)}
                  disabled={isLocked}
                  className="w-full text-left p-3 rounded-md transition-colors duration-150 group disabled:cursor-not-allowed disabled:opacity-60 text-slate-600 hover:bg-sky-100"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold group-hover:text-sky-800">{item.label}</span>
                    {(isCompleted || (isCert && quizPassed)) && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                    {isLocked && <LockIcon className="w-5 h-5 text-slate-400" />}
                  </div>
                  
                  {isModuleOrCases && (
                    <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-sky-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;