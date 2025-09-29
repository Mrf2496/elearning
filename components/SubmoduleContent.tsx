import React, { useState, useEffect, useContext } from 'react';
import { Submodule } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { CourseProgressContext } from '../context/CourseProgressContext';

interface SubmoduleContentProps {
  submodule: Submodule;
  audioUrl?: string;
  videoUrl?: string;
}

const MediaViewer: React.FC<{
  type: 'audio' | 'video';
  currentUrl?: string;
  onComplete: () => void;
  isCompleted: boolean;
}> = ({ type, currentUrl, onComplete, isCompleted }) => {
  if (!currentUrl) {
    return (
       <div className="mt-3 p-3 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-500">Contenido multimedia no disponible.</p>
      </div>
    );
  }

  const isEmbeddable = currentUrl.includes('youtube.com/embed') || currentUrl.includes('drive.google.com/file');
  const isDirectMediaVideo = type === 'video' && !isEmbeddable;

  const handleEnded = () => {
    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      {isEmbeddable ? (
        <>
          <div className={type === 'video' ? "aspect-w-16 aspect-h-9" : ""}>
            <iframe
              src={currentUrl}
              className={`w-full rounded-lg ${type === 'video' ? 'h-full' : 'h-24'}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={type === 'video'}
              title={`Embedded ${type}`}
            ></iframe>
          </div>
          {!isCompleted && (
            <div className="mt-4 text-center">
              <Button onClick={onComplete} variant="secondary">
                He terminado de ver este contenido
              </Button>
            </div>
          )}
        </>
      ) : type === 'audio' ? (
        <audio controls src={currentUrl} onEnded={handleEnded} className="w-full mt-2 h-8">
          Tu navegador no soporta el elemento de audio.
        </audio>
      ) : isDirectMediaVideo ? (
           <video controls src={currentUrl} onEnded={handleEnded} className="w-full mt-2 rounded-lg max-h-64">
              Tu navegador no soporta el elemento de video.
          </video>
      ) : null}
    </div>
  );
};


const SubmoduleContent: React.FC<SubmoduleContentProps> = ({ submodule, audioUrl, videoUrl }) => {
  const [activeTab, setActiveTab] = useState<'definition' | 'audio' | 'video'>('definition');
  const progressContext = useContext(CourseProgressContext);

  // Mark submodule as viewed when its content is shown
  useEffect(() => {
    if (progressContext) {
      progressContext.completeSubmodule(submodule.id);
    }
  }, [submodule.id, progressContext]);

  // Reset to definition tab when submodule changes
  useEffect(() => {
    setActiveTab('definition');
  }, [submodule]);

  const tabs = [
    { id: 'definition', label: 'Definición' },
    { id: 'audio', label: 'Guion de Audio' },
  ];
  if (videoUrl) {
    tabs.push({ id: 'video', label: 'Tema de Video' });
  }

  const handleTabClick = (tabId: 'definition' | 'audio' | 'video') => {
    setActiveTab(tabId);
  }
  
  if (!progressContext) return null;
  const { completeSubmodule, completedSubmodules } = progressContext;

  return (
    <Card>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{submodule.title}</h3>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-6 min-h-[250px]">
        {activeTab === 'definition' && (
          <p className="text-gray-700 leading-relaxed animate-fade-in">{submodule.content}</p>
        )}
        {activeTab === 'audio' && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-sky-700">Resumen del Concepto</h4>
            <p className="text-sm text-gray-600 italic mt-1">"{submodule.multimedia.audioScript}"</p>
            <MediaViewer 
              type="audio" 
              currentUrl={audioUrl} 
              onComplete={() => completeSubmodule(`${submodule.id}-audio`)}
              isCompleted={completedSubmodules.has(`${submodule.id}-audio`)}
            />
          </div>
        )}
        {activeTab === 'video' && videoUrl && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-orange-700">{submodule.multimedia.videoConcept.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{submodule.multimedia.videoConcept.script}</p>
            <MediaViewer 
              type="video" 
              currentUrl={videoUrl} 
              onComplete={() => completeSubmodule(`${submodule.id}-video`)}
              isCompleted={completedSubmodules.has(`${submodule.id}-video`)}
            />
          </div>
        )}
      </div>

      <style>{`
        .aspect-w-16 { position: relative; padding-bottom: 56.25%; }
        .aspect-h-9 { height: 0; }
        .aspect-w-16 > iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
      `}</style>
    </Card>
  );
};

export default SubmoduleContent;