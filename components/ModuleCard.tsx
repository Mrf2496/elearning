import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Pick<Module, 'id' | 'title' | 'description' | 'duration'>;
  isCompleted: boolean;
  onClick: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, isCompleted, onClick }) => {
  const isEven = module.id % 2 === 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className={`p-6 border-t-4 rounded-t-lg ${isEven ? 'border-sky-400' : 'border-orange-400'}`}>
        <span className={`text-xs font-bold py-1 px-3 rounded-full mb-3 inline-block ${isEven ? 'bg-sky-100 text-sky-700' : 'bg-orange-100 text-orange-700'}`}>
          Módulo {module.id}
        </span>
        <h4 className="text-lg font-bold text-slate-800 mb-2 flex-grow h-16">{module.title}</h4>
        <p className="text-slate-600 text-sm h-24 overflow-hidden">{module.description}</p>
      </div>
      <div className="mt-auto px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs rounded-b-lg">
        <span className={`font-semibold px-2 py-1 rounded-md ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
          {isCompleted ? 'Completado' : 'Pendiente'}
        </span>
        <span className="text-slate-500 font-semibold">{module.duration}</span>
      </div>
    </div>
  );
};

export default ModuleCard;
