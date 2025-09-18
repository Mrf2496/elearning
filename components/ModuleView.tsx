import React, { useState, useContext, useEffect, useRef } from 'react';
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

interface ModuleViewProps {
  module: Module;
  onModuleComplete: () => void;
  onNavigate: (view: View) => void;
  onNextModule: () => void;
  onPreviousModule: () => void;
  isFirstModule: boolean;
  isLastModule: boolean;
}

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
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const progressContext = useContext(CourseProgressContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    setSelectedSubmoduleId(module.submodules[0]?.id || null);
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

    return () => {};
  }, [module]);

  if (!progressContext) return null;

  const { completedSubmodules, completeSubmodule, isModuleCompleted } = progressContext;

  const handleSelectSubmodule = (submoduleId: string) => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(error => {
          console.error("La reproducción del sonido de clic falló:", error);
      });
    }

    setSelectedSubmoduleId(submoduleId);
    completeSubmodule(submoduleId);
    
    if (audioRef.current) {
        audioRef.current.pause();
    }
  };
  
  const selectedSubmodule = module.submodules.find(sm => sm.id === selectedSubmoduleId);
  const isEven = module.id % 2 === 0;

  return (
    <div className="space-y-6">
      <audio ref={audioRef} />
      <audio ref={clickSoundRef} src="data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAASAAADbWF2Y28uY29tAAAAAAAAAAAAAAAAAAAAAAAA//uRoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADTGF2YzU0LjY5LjEwMAAAAAAAAAAAAAAA//uRoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjYW1lcmEtc2h1dHRlci1jbGljay0wMS0xMDMwOTkubXAz//uR4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExhdmY1AAAAADsA//uR4AAAADSAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV-NAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" preload="auto" />
      
      <Card className={`border-l-4 ${isEven ? 'border-blue-500' : 'border-orange-500'}`}>
        <h2 className="text-3xl font-bold text-gray-800">{module.title}</h2>
        <p className="mt-2 text-lg text-gray-600">{module.description}</p>
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
                        ? (isEven ? 'bg-blue-100 font-semibold text-blue-700' : 'bg-orange-100 font-semibold text-orange-700')
                        : 'text-gray-700 hover:bg-gray-100'
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

        <div className="lg:col-span-2 space-y-6">
          {selectedSubmodule && (
            <SubmoduleContent 
              submodule={selectedSubmodule} 
              audioUrl={audioUrls[selectedSubmodule.id]}
              videoUrl={videoUrls[selectedSubmodule.id]}
            />
          )}
          {module.oai === 'uiaf_flow' && <UiafFlowOAI />}
          {module.oai === 'risk_factor_sorter' && <RiskFactorSorterOAI />}
          <SlideViewer slides={module.slides} />
          {module.interactiveGameIdeas && module.interactiveGameIdeas.map((game, index) => (
            <InteractiveGame key={index} game={game} />
          ))}
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