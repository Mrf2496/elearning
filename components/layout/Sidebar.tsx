import React, { useContext, useState } from 'react';
import { View } from '../../types';
import { courseData } from '../../constants/courseData';
import { CourseProgressContext } from '../../context/CourseProgressContext';
import HomeIcon from '../icons/HomeIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import QuestionMarkCircleIcon from '../icons/QuestionMarkCircleIcon';
import AwardIcon from '../icons/AwardIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import LockIcon from '../icons/LockIcon';
import XIcon from '../icons/XIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import ShieldCheckIcon from '../icons/ShieldCheckIcon';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: number) => void;
  selectedModuleId: number | null;
}

const NavButton: React.FC<{
  onClick: () => void;
  label: string;
  icon: React.FC<{className?: string}>;
  isActive: boolean;
  isDisabled?: boolean;
  isLocked?: boolean;
  children?: React.ReactNode;
}> = ({ onClick, label, icon: Icon, isActive, isDisabled, isLocked, children }) => (
  <button
    onClick={onClick}
    disabled={isDisabled || isLocked}
    className={`w-full text-left p-3 rounded-md transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between
      ${
        isActive
          ? 'bg-sky-500 text-white font-semibold shadow'
          : 'text-slate-600 hover:bg-slate-100'
      }
    `}
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {children}
    {isLocked && <LockIcon className="w-5 h-5 text-slate-400" />}
  </button>
);


const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose, onSelectModule, selectedModuleId }) => {
  const progressContext = useContext(CourseProgressContext);
  const { currentUser } = useAuth();
  const [isModulesExpanded, setIsModulesExpanded] = useState(true);

  if (!progressContext) return null;

  const { quizPassed, getCourseProgress, isModuleCompleted, completedModules } = progressContext;
  
  const courseProgress = getCourseProgress();
  const isQuizUnlocked = courseProgress >= 60;

  const isModuleOrCasesView = currentView === View.Module || currentView === View.CaseStudies;

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white p-6 flex-shrink-0 flex flex-col no-print transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900">Navegación del Curso</h2>
        <button className="md:hidden p-1" onClick={onClose}>
            <XIcon className="w-6 h-6 text-slate-500" />
        </button>
      </div>
      <nav className="flex-grow overflow-y-auto -mr-3 pr-3">
        <ul className="space-y-1.5">
          {/* Panel Principal */}
          <li>
            <NavButton
              onClick={() => onNavigate(View.Dashboard)}
              label="Panel Principal"
              icon={HomeIcon}
              isActive={currentView === View.Dashboard && !isModuleOrCasesView}
            >
              {(currentView === View.Dashboard && !isModuleOrCasesView) && <ChevronRightIcon className="w-5 h-5" />}
            </NavButton>
          </li>
          
          {/* Admin Panel Link */}
          <li>
            <NavButton
              onClick={() => onNavigate(View.AdminPanel)}
              label="Panel de Admin"
              icon={ShieldCheckIcon}
              isActive={currentView === View.AdminPanel}
            >
              {currentView === View.AdminPanel && <ChevronRightIcon className="w-5 h-5" />}
            </NavButton>
          </li>

          {/* Módulos collapsible */}
          <li>
            <NavButton
              onClick={() => setIsModulesExpanded(!isModulesExpanded)}
              label="Módulos"
              icon={BookOpenIcon}
              isActive={isModuleOrCasesView}
            >
              <ChevronRightIcon className={`w-5 h-5 transition-transform ${isModulesExpanded ? 'rotate-90' : ''}`} />
            </NavButton>
            {isModulesExpanded && (
              <ul className="pt-2 pl-4 mt-1 space-y-1 border-l-2 border-slate-200 ml-5 animate-fade-in">
                {courseData.modules.map(module => (
                  <li key={module.id}>
                    <button onClick={() => onSelectModule(module.id)} className={`w-full text-left text-sm p-2.5 rounded-md flex items-center space-x-2.5 transition-colors ${selectedModuleId === module.id ? 'bg-sky-100 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                      {isModuleCompleted(module.id) ? <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" /> : <div className="w-4 h-4 border-2 border-slate-300 rounded-full flex-shrink-0" />}
                      <span className="flex-1">Módulo {module.id}: {module.title.substring(0,25)}{module.title.length > 25 && '...'}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => onSelectModule(11)} className={`w-full text-left text-sm p-2.5 rounded-md flex items-center space-x-2.5 transition-colors ${selectedModuleId === 11 ? 'bg-sky-100 text-sky-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {completedModules.has(11) ? <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" /> : <div className="w-4 h-4 border-2 border-slate-300 rounded-full flex-shrink-0" />}
                    <span className="flex-1">Módulo 11: Casos Prácticos</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="pt-4 border-t border-slate-200">
           <ul className="space-y-1.5">
             {/* Evaluación Final */}
            <li>
              <NavButton
                onClick={() => onNavigate(View.Quiz)}
                label="Evaluación Final"
                icon={QuestionMarkCircleIcon}
                isActive={currentView === View.Quiz}
                isLocked={!isQuizUnlocked}
              >
                {currentView === View.Quiz && <ChevronRightIcon className="w-5 h-5" />}
              </NavButton>
            </li>
            
            {/* Certificado */}
            <li>
              <NavButton
                onClick={() => onNavigate(View.Certificate)}
                label="Certificado"
                icon={AwardIcon}
                isActive={currentView === View.Certificate}
                isLocked={!quizPassed}
              >
                {currentView === View.Certificate && <ChevronRightIcon className="w-5 h-5" />}
              </NavButton>
            </li>
           </ul>
        </div>
        <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center mt-4">
            <p className="text-sm font-semibold text-orange-800">Progreso del curso</p>
            <p className="text-xl font-bold text-orange-900 mt-1">{Math.round(courseProgress)}%</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;