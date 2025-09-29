import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { Module, View } from '../types';
import { CourseProgressContext } from '../context/CourseProgressContext';
import Card from './common/Card';
import Button from './common/Button';
import SubmoduleContent from './SubmoduleContent';
import SlideViewer from './SlideViewer';
import InteractiveGame from './InteractiveGame';
import CheckCircleIcon from './icons/CheckCircleIcon';
import UiafFlowOAI from './oai/UiafFlowOAI';
import RiskFactorSorterOAI from './oai/RiskFactorSorterOAI';
import { getAudioUrl, getVideoUrl } from '../lib/db';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ModuleViewProps {
  module: Module;
  onModuleComplete: () => void;
  onNavigate: (view: View) => void;
  onNextModule: () => void;
  onPreviousModule: () => void;
  isFirstModule: boolean;
  isLastModule: boolean;
}

const MIN_SUBMODULE_VIEW_TIME_SECONDS = 15;

const ModuleView: React.FC<ModuleViewProps> = ({ 
  module, 
  onModuleComplete,
  onNavigate,
  onNextModule,
  onPreviousModule,
  isFirstModule,
  isLastModule
}) => {
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState<string | null>(module.submodules[0]?.id || null);
  const [activeMainTab, setActiveMainTab] = useState<'content' | 'slides' | 'games' | 'oai'>('content');
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const progressContext = useContext(CourseProgressContext);
  const timerRef = useRef<number | null>(null);

  // Reset states on module change
  useEffect(() => {
    setSelectedSubmoduleId(module.submodules[0]?.id || null);
    setActiveMainTab('content');
    window.scrollTo(0, 0);

    const loadMediaFromDB = async () => {
      const newAudiosState: Record<string, string> = {};
      const newVideosState: Record<string, string> = {};
      for (const sm of module.submodules) {
        try {
          const audioUrl = await getAudioUrl(sm.id);
          if (audioUrl) {
            newAudiosState[sm.id] = audioUrl;
          }
          const videoUrl = await getVideoUrl(sm.id);
          if (videoUrl) {
            newVideosState[sm.id] = videoUrl;
          }
        } catch (error) {
          console.error(`Failed to load media for submodule ${sm.id}`, error);
        }
      }
      setAudioUrls(newAudiosState);
      setVideoUrls(newVideosState);
    };

    loadMediaFromDB();
  }, [module]);

  const { completedSubmodules, completeSubmodule, isModuleCompleted } = progressContext || {};

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (selectedSubmoduleId && !completedSubmodules?.has(selectedSubmoduleId) && completeSubmodule) {
      let timeElapsed = 0;
      timerRef.current = window.setInterval(() => {
        timeElapsed += 1;
        if (timeElapsed >= MIN_SUBMODULE_VIEW_TIME_SECONDS) {
          completeSubmodule(selectedSubmoduleId);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [selectedSubmoduleId, completedSubmodules, completeSubmodule]);

  const submoduleIds = useMemo(() => module.submodules.map(sm => sm.id), [module]);
  const currentSubmoduleIndex = useMemo(() => submoduleIds.indexOf(selectedSubmoduleId || ''), [selectedSubmoduleId, submoduleIds]);

  const handleSelectSubmodule = (submoduleId: string) => {
    setSelectedSubmoduleId(submoduleId);
  };
  
  const handleNextSubmodule = () => {
    if (currentSubmoduleIndex > -1 && currentSubmoduleIndex < submoduleIds.length - 1) {
      const nextSubmoduleId = submoduleIds[currentSubmoduleIndex + 1];
      setSelectedSubmoduleId(nextSubmoduleId);
    }
  };

  const handlePreviousSubmodule = () => {
    if (currentSubmoduleIndex > 0) {
      const prevSubmoduleId = submoduleIds[currentSubmoduleIndex - 1];
      setSelectedSubmoduleId(prevSubmoduleId);
    }
  };

  if (!progressContext) return null;

  const selectedSubmodule = module.submodules.find(sm => sm.id === selectedSubmoduleId);
  const isEven = module.id % 2 === 0;

  const mainTabs = [
    { id: 'content', label: 'Contenido del Tema' },
    { id: 'slides', label: 'Diapositivas Clave' },
  ];
  if (module.interactiveGameIdeas && module.interactiveGameIdeas.length > 0) {
    mainTabs.push({ id: 'games', label: 'Juegos Interactivos' });
  }
  if (module.oai) {
    mainTabs.push({ id: 'oai', label: 'Objeto de Aprendizaje' });
  }

  return (
    <div className="space-y-6">
      <Card className={`border-l-4 ${isEven ? 'border-sky-500' : 'border-orange-500'}`}>
        <h2 className="text-3xl font-bold text-slate-800">{module.title}</h2>
        <p className="mt-2 text-lg text-slate-600">{module.description}</p>
        {isModuleCompleted(module.id) && (
            <div className="mt-4 flex items-center text-green-600 font-semibold">
                <CheckCircleIcon className="w-6 h-6 mr-2" />
                <span>Módulo completado</span>
            </div>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Temas del Módulo</h3>
            <ul className="space-y-2">
              {module.submodules.map((submodule) => (
                <li key={submodule.id}>
                  <button
                    onClick={() => handleSelectSubmodule(submodule.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                      selectedSubmoduleId === submodule.id
                        ? (isEven ? 'bg-sky-100 font-semibold text-sky-700' : 'bg-orange-100 font-semibold text-orange-700')
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{submodule.title}</span>
                    {completedSubmodules.has(submodule.id) && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <nav className="flex space-x-2" aria-label="Main Tabs">
              {mainTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMainTab(tab.id as any)}
                  className={`flex-1 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors rounded-md ${
                    activeMainTab === tab.id
                      ? 'bg-sky-100 border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div>
            {activeMainTab === 'content' && (
              <div className="space-y-4 animate-fade-in">
                {selectedSubmodule ? (
                  <SubmoduleContent 
                    submodule={selectedSubmodule} 
                    audioUrl={audioUrls[selectedSubmodule.id]}
                    videoUrl={videoUrls[selectedSubmodule.id]}
                  />
                ) : (
                  <Card><p>Selecciona un tema para comenzar.</p></Card>
                )}
                <Card>
                    <div className="flex justify-between items-center">
                        <Button onClick={handlePreviousSubmodule} disabled={currentSubmoduleIndex <= 0} variant="secondary" className="flex items-center space-x-2">
                            <ChevronLeftIcon className="w-4 h-4" /> <span>Tema Anterior</span>
                        </Button>
                        <span className="text-sm font-medium text-gray-500">{currentSubmoduleIndex + 1} / {submoduleIds.length}</span>
                        <Button onClick={handleNextSubmodule} disabled={currentSubmoduleIndex >= submoduleIds.length - 1} variant="secondary" className="flex items-center space-x-2">
                            <span>Siguiente Tema</span> <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
              </div>
            )}
            {activeMainTab === 'slides' && (
              <div className="animate-fade-in">
                <SlideViewer slides={module.slides} />
              </div>
            )}
            {activeMainTab === 'games' && (
              <div className="space-y-6 animate-fade-in">
                {module.interactiveGameIdeas && module.interactiveGameIdeas.map((game, index) => (
                  <InteractiveGame key={index} game={game} />
                ))}
              </div>
            )}
            {activeMainTab === 'oai' && (
              <div className="animate-fade-in">
                {module.oai === 'uiaf_flow' && <UiafFlowOAI />}
                {module.oai === 'risk_factor_sorter' && <RiskFactorSorterOAI />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <Button 
          onClick={onPreviousModule} 
          disabled={isFirstModule}
          variant="secondary"
        >
          &larr; Módulo Anterior
        </Button>
        <Button onClick={() => onNavigate(View.Dashboard)} variant="secondary">
          Volver al Inicio
        </Button>
        <Button 
          onClick={onNextModule}
          disabled={isLastModule}
        >
          Módulo Siguiente &rarr;
        </Button>
      </div>
    </div>
  );
};

export default ModuleView;
