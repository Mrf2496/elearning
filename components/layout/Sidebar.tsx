import React, { useContext } from 'react';
import { View } from '../../types';
import { CourseProgressContext } from '../../context/CourseProgressContext';
import HomeIcon from '../icons/HomeIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import FileTextIcon from '../icons/FileTextIcon';
import QuestionMarkCircleIcon from '../icons/QuestionMarkCircleIcon';
import AwardIcon from '../icons/AwardIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import LockIcon from '../icons/LockIcon';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const progressContext = useContext(CourseProgressContext);
  if (!progressContext) return null;

  const { quizPassed, getCourseProgress } = progressContext;
  
  const courseProgress = getCourseProgress();
  const isQuizUnlocked = courseProgress >= 90;

  const navItemMap: Record<string, View> = {
    'Panel Principal': View.Dashboard,
    'Módulos': View.Dashboard,
    'Casos Prácticos': View.CaseStudies,
    'Evaluación Final': View.Quiz,
    'Certificado': View.Certificate,
  };

  const navItems = [
    { label: 'Panel Principal', icon: HomeIcon, view: View.Dashboard },
    { label: 'Módulos', icon: BookOpenIcon, view: View.Dashboard },
    { label: 'Casos Prácticos', icon: FileTextIcon, view: View.CaseStudies },
    { label: 'Evaluación Final', icon: QuestionMarkCircleIcon, view: View.Quiz, locked: !isQuizUnlocked },
    { label: 'Certificado', icon: AwardIcon, view: View.Certificate, locked: !quizPassed },
  ];

  return (
    <aside className="w-72 bg-white p-6 flex-shrink-0 hidden md:flex flex-col no-print">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Navegación</h2>
      <nav className="flex-grow">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            let isVisuallyActive = currentView === item.view;
            if (item.label === 'Módulos' && (currentView === View.Module || currentView === View.Dashboard)) {
              isVisuallyActive = true;
            }
             if (item.label === 'Panel Principal' && isVisuallyActive) { // Only Panel Principal has the special active style
                // This is a design choice from the image.
             } else {
                 isVisuallyActive = false;
             }


            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavigate(item.view)}
                  disabled={item.locked}
                  className={`w-full text-left p-3 rounded-md transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between
                    ${
                      isVisuallyActive
                        ? 'bg-sky-500 text-white font-semibold shadow'
                        : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {isVisuallyActive && <ChevronRightIcon className="w-5 h-5" />}
                  {item.locked && <LockIcon className="w-5 h-5 text-slate-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center">
            <p className="text-sm font-semibold text-orange-800">Completa el curso al 100% para acceder al certificado</p>
            <p className="text-sm font-bold text-orange-900 mt-1">Progreso: {Math.round(courseProgress)}%</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;