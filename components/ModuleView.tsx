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
  onNavigate: (view: View) => void;
  onNextModule: () => void;
  onPreviousModule: () => void;
  isFirstModule: boolean;
  isLastModule: boolean;
}

const MIN_SUBMODULE_VIEW_TIME_SECONDS = 15;

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
        items.push({ type: 'slides', id: `${module.id}-slides`, title: 'Diapositivas Clave' });
    }

    if (module.interactiveGameIdeas && module.interactiveGameIdeas.length > 0) {
        module.interactiveGameIdeas.forEach((game, index) => {
            items.push({ type: 'game', id: `${module.id}-game-${index}`, title: game.title });
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
  const timerRef = useRef<number | null>(null);

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

  const { completedSubmodules, completeSubmodule, isModuleCompleted } = progressContext || {};

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!selectedItemId || !completeSubmodule || completedSubmodules?.has(selectedItemId)) {
      return;
    }
    
    const selectedItem = navigableItems.find(item => item.id === selectedItemId);

    if (selectedItem?.type === 'submodule') {
      let timeElapsed = 0;
      timerRef.current = window.setInterval(() => {
        timeElapsed += 1;
        if (timeElapsed >= MIN_SUBMODULE_VIEW_TIME_SECONDS) {
          completeSubmodule(selectedItemId);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }, 1000);
    } else if (selectedItem) {
      // For slides, games, OAI, complete immediately on view
      completeSubmodule(selectedItemId);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [selectedItemId, navigableItems, completedSubmodules, completeSubmodule]);

  const currentItemIndex = useMemo(() => navigableItems.findIndex(item => item.id === selectedItemId), [selectedItemId, navigableItems]);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };
  
  const handleNextItem = () => {
    if (currentItemIndex > -1 && currentItemIndex < navigableItems.length - 1) {
      const nextItemId = navigableItems[currentItemIndex + 1].id;
      setSelectedItemId(nextItemId);
    }
  };

  const handlePreviousItem = () => {
    if (currentItemIndex > 0) {
      const prevItemId = navigableItems[currentItemIndex - 1].id;
      setSelectedItemId(prevItemId);
    }
  };

  if (!progressContext) return null;

  const selectedItem = navigableItems.find(item => item.id === selectedItemId);
  const isEven = module.id % 2 === 0;

  const renderRightPanelContent = () => {
    if (!selectedItem) return <Card><p>Selecciona un tema para comenzar.</p></Card>;

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
        return <SlideViewer slides={module.slides} />;

      case 'game':
        const gameIndex = parseInt(selectedItem.id.split('-game-')[1], 10);
        const gameData = module.interactiveGameIdeas?.[gameIndex];
        return gameData ? <InteractiveGame game={gameData} /> : null;

      case 'oai':
        if (module.oai === 'uiaf_flow') return <UiafFlowOAI />;
        if (module.oai === 'risk_factor_sorter') return <RiskFactorSorterOAI />;
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Temas del Módulo</h3>
            <ul className="space-y-2">
              {navigableItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                      selectedItemId === item.id
                        ? (isEven ? 'bg-sky-100 font-semibold text-sky-700' : 'bg-orange-100 font-semibold text-orange-700')
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">{item.title}</span>
                    {completedSubmodules.has(item.id) && <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="animate-fade-in">
            {renderRightPanelContent()}
          </div>
          
          <Card>
              <div className="flex justify-between items-center">
                  <Button onClick={handlePreviousItem} disabled={currentItemIndex <= 0} variant="secondary" className="flex items-center space-x-2">
                      <ChevronLeftIcon className="w-4 h-4" /> <span>Anterior</span>
                  </Button>
                  <span className="text-sm font-medium text-gray-500">{currentItemIndex + 1} / {navigableItems.length}</span>
                  <Button onClick={handleNextItem} disabled={currentItemIndex >= navigableItems.length - 1} variant="secondary" className="flex items-center space-x-2">
                      <span>Siguiente</span> <ChevronRightIcon className="w-4 h-4" />
                  </Button>
              </div>
          </Card>
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