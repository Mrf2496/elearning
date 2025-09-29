import React, { useContext } from 'react';
import { courseData } from '../constants/courseData';
import { CourseProgressContext } from '../context/CourseProgressContext';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import ModuleCard from './ModuleCard';
import BookOpenIcon from './icons/BookOpenIcon';
import ClockIcon from './icons/ClockIcon';
import AwardIcon from './icons/AwardIcon';


interface CourseDashboardProps {
  onSelectModule: (moduleId: number) => void;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ onSelectModule }) => {
  const progressContext = useContext(CourseProgressContext);

  if (!progressContext) {
    return <div>Cargando...</div>;
  }

  const { isModuleCompleted, getCourseProgress, completedModules, quizPassed } = progressContext;
  const courseProgress = getCourseProgress();
  const completedModulesCount = courseData.modules.filter(m => isModuleCompleted(m.id)).length;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Progreso General del Curso</h3>
          <span className="text-2xl font-bold text-slate-700 mt-2 sm:mt-0">{Math.round(courseProgress)}%</span>
        </div>
        <ProgressBar progress={courseProgress} />
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 -mx-6 px-2">
            <div className="py-4 px-4 flex items-center justify-center sm:justify-start">
                <BookOpenIcon className="w-8 h-8 text-sky-500 mr-4 flex-shrink-0" />
                <div>
                    <p className="text-sm text-slate-500">Módulos</p>
                    <p className="text-xl font-bold text-slate-800">{completedModulesCount}/{courseData.modules.length}</p>
                </div>
            </div>
             <div className="py-4 px-4 flex items-center justify-center sm:justify-start">
                <ClockIcon className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0" />
                <div>
                    <p className="text-sm text-slate-500">Tiempo</p>
                    <p className="text-xl font-bold text-slate-800">~8h</p>
                </div>
            </div>
             <div className="py-4 px-4 flex items-center justify-center sm:justify-start">
                <AwardIcon className="w-8 h-8 text-green-500 mr-4 flex-shrink-0" />
                <div>
                    <p className="text-sm text-slate-500">Certificado</p>
                    <p className={`text-xl font-bold ${quizPassed ? 'text-green-600' : 'text-slate-800'}`}>{quizPassed ? 'Obtenido' : 'Pendiente'}</p>
                </div>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courseData.modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isCompleted={isModuleCompleted(module.id)}
              onClick={() => onSelectModule(module.id)}
            />
        ))}
        <ModuleCard
            module={{
                id: 11, 
                title: 'Casos Prácticos', 
                description: 'Aplica tus conocimientos en escenarios reales del sector solidario.',
                duration: "~60 min"
            }}
            isCompleted={completedModules.has(11)}
            onClick={() => onSelectModule(11)}
        />
      </div>
    </div>
  );
};

export default CourseDashboard;
