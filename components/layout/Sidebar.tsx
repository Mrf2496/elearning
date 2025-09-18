
import React, { useContext } from 'react';
import { View } from '../../types';
import { CourseProgressContext } from '../../context/CourseProgressContext';
import { courseData } from '../../constants/courseData';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import LockIcon from '../icons/LockIcon';

interface SidebarProps {
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const progressContext = useContext(CourseProgressContext);
  if (!progressContext) return null;

  const { completedModules, getCourseProgress } = progressContext;
  const courseProgress = getCourseProgress();
  const allModulesCompleted = courseProgress >= 100;

  const navItems = [
    { view: View.Dashboard, label: 'Inicio', id: 'dash' },
    ...courseData.modules.map(m => ({ view: View.Module, label: `Módulo ${m.id}`, id: m.id })),
    { view: View.CaseStudies, label: 'Módulo 11: Casos Prácticos', id: 11 },
    { view: View.Quiz, label: 'Evaluación Final', id: 'quiz' },
    { view: View.Certificate, label: 'Certificado', id: 'cert' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex-shrink-0 hidden md:block">
      <nav>
        <ul>
          {navItems.map((item) => {
             const isCompleted = typeof item.id === 'number' && completedModules.has(item.id);
             const isQuiz = item.id === 'quiz';
             const isCert = item.id === 'cert';
             const isLocked = (isQuiz && !allModulesCompleted) || (isCert && !progressContext.quizPassed);

            return (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => onNavigate(item.view)}
                  disabled={isLocked}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between transition-colors duration-150 disabled:cursor-not-allowed disabled:text-gray-400 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>{item.label}</span>
                  {isCompleted && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                  {isLocked && <LockIcon className="w-5 h-5 text-gray-400" />}
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
