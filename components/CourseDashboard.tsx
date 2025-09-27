import React, { useContext } from 'react';
import { courseData } from '../constants/courseData';
import { CourseProgressContext } from '../context/CourseProgressContext';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import CheckCircleIcon from './icons/CheckCircleIcon';
import BookOpenIcon from './icons/BookOpenIcon';

interface CourseDashboardProps {
  onSelectModule: (moduleId: number) => void;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ onSelectModule }) => {
  const progressContext = useContext(CourseProgressContext);

  if (!progressContext) {
    return <div>Cargando...</div>;
  }

  const { isModuleCompleted, getCourseProgress } = progressContext;
  const courseProgress = getCourseProgress();
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-sky-800 mb-2">Bienvenido al Curso SARLAFT</h2>
        <p className="text-lg text-slate-600">Un recorrido completo por el Sistema de Administración del Riesgo de Lavado de Activos y de la Financiación del Terrorismo para el Sector Solidario.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-700">Progreso General del Curso</h3>
            <span className="text-lg font-bold text-orange-500">{Math.round(courseProgress)}%</span>
        </div>
        <ProgressBar progress={courseProgress} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...courseData.modules, {id: 11, title: 'Casos Prácticos', description: 'Aplica tus conocimientos en escenarios reales del sector solidario.'}].map((module) => {
          const completed = isModuleCompleted(module.id);
          const isEven = module.id % 2 === 0;
          return (
            <div
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`bg-white rounded-lg shadow-md p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-t-4 ${isEven ? 'border-sky-500' : 'border-orange-500'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-semibold py-1 px-3 rounded-full ${isEven ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'}`}>
                  Módulo {module.id}
                </span>
                {completed ? (
                  <CheckCircleIcon className="w-7 h-7 text-green-500" />
                ) : (
                  <BookOpenIcon className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2 flex-grow">{module.title}</h4>
              <p className="text-slate-600 text-sm">{module.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseDashboard;