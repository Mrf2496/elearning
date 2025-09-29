import React, { useState, useContext, useEffect, useMemo } from 'react';
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
  onNavigate: (view: View) => void;
  onNextModule: () => void;
  onPreviousModule: () => void;
  isFirstModule: boolean;
  isLastModule: boolean;
}

const ModuleView: React.FC<ModuleViewProps> = ({ 
  module, 
  onNavigate,
  onNextModule,
  onPreviousModule,
  isFirstModule,
  isLastModule
}) => {
  const progressContext = useContext(CourseProgressContext);

  const navigableItems = useMemo(() => {
    const items: { type: string; id: string; title: string; }[] = module.submodules.map(sm => ({ 
        type: 'submodule', id: sm.id, title: sm.title 
    }));
    
    if (module.slides && module.slides.length > 0) {
        items.push({ type: 'slides', id: `${module.id}-slides`, title: 'Presentacion' });
    }

    const games = module.interactiveGameIdeas || [];
    if (games.length > 0) {
        games.forEach((_game, index) => {
            const title = games.length > 1 ? `Juegos Didacticos ${index + 1}` : 'Juegos Didacticos';
            items.push({ type: 'game', id: `${module.id}-game-${index}`, title });
        });
    }
    
    if (module.oai) {
        items.push({ type: 'oai', id: `${module.id}-oai`, title: 'Objeto de Aprendizaje' });
    }
    
    return items;
  }, [module]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(navigableItems[0]?.id || null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});

  // Reset states on module change
  useEffect(() => {
    setSelectedItemId(navigableItems[0]?.id || null);
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
  }, [module, navigableItems]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  if (!progressContext) return null;

  const { completedSubmodules, completeSubmodule, isModuleCompleted } = progressContext;

  const selectedItem = navigableItems.find(item => item.id === selectedItemId);
  const isEven = module.id % 2 === 0;

  const renderContent = () => {
    if (!selectedItem) return <Card><p>Selecciona un tema para comenzar.</p></Card>;

    const onComplete = () => {
      if (!completedSubmodules.has(selectedItem.id)) {
        completeSubmodule(selectedItem.id);
      }
    };

    switch (selectedItem.type) {
      case 'submodule':
        const submodule = module.submodules.find(sm => sm.id === selectedItem.id);
        return submodule ? (
          <SubmoduleContent 
            submodule={submodule} 
            audioUrl={audioUrls[submodule.id]}
            videoUrl={videoUrls[submodule.id]}
          />
        ) : null;

      case 'slides':
        return <SlideViewer slides={module.slides} onComplete={onComplete} />;

      case 'game':
        const gameIndex = parseInt(selectedItem.id.split('-game-')[1], 10);
        const gameData = module.interactiveGameIdeas?.[gameIndex];
        return gameData ? <InteractiveGame game={gameData} onComplete={onComplete} /> : null;

      case 'oai':
        if (module.oai === 'uiaf_flow') return <UiafFlowOAI onComplete={onComplete} />;
        if (module.oai === 'risk_factor_sorter') return <RiskFactorSorterOAI onComplete={onComplete} />;
        return null;

      default:
        return <Card><p>Contenido no encontrado.</p></Card>;
    }
  };

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
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200 px-4 sm:px-6">
            <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto" aria-label="Temas del módulo">
                {navigableItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id)}
                        className={`
                            ${selectedItemId === item.id
                                ? (isEven ? 'border-sky-500 text-sky-600' : 'border-orange-500 text-orange-600')
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                            group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                        `}
                    >
                        <span className="mr-2">{item.title}</span>
                        {completedSubmodules.has(item.id) && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                    </button>
                ))}
            </nav>
        </div>
        <div className="p-4 sm:p-6">
            <div className="animate-fade-in">
                {renderContent()}
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