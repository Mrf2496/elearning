import React from 'react';
import { Submodule } from '../types';
import Card from './common/Card';

interface SubmoduleContentProps {
  submodule: Submodule;
  audioUrl?: string;
  videoUrl?: string;
}

const MediaViewer: React.FC<{
  type: 'audio' | 'video';
  currentUrl?: string;
}> = ({ type, currentUrl }) => {
  if (!currentUrl) {
    return (
       <div className="mt-3 p-3 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-500">Contenido multimedia no disponible.</p>
      </div>
    );
  }

  const isEmbeddable = currentUrl.includes('youtube.com/embed') || currentUrl.includes('drive.google.com/file');
  const isDirectMediaVideo = type === 'video' && !isEmbeddable;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      {isEmbeddable ? (
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
      ) : type === 'audio' ? (
        <audio controls src={currentUrl} className="w-full mt-2 h-8">
          Tu navegador no soporta el elemento de audio.
        </audio>
      ) : isDirectMediaVideo ? (
           <video controls src={currentUrl} className="w-full mt-2 rounded-lg max-h-64">
              Tu navegador no soporta el elemento de video.
          </video>
      ) : null}
    </div>
  );
};


const SubmoduleContent: React.FC<SubmoduleContentProps> = ({ submodule, audioUrl, videoUrl }) => {
  return (
    <Card>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{submodule.title}</h3>
      <p className="text-gray-700 leading-relaxed mb-6">{submodule.content}</p>
      
      <div className="space-y-4 divide-y divide-gray-200">
        <div className="pt-4 first:pt-0">
          <h4 className="font-semibold text-blue-600">Guion de Audio (Resumen)</h4>
          <p className="text-sm text-gray-600 italic">"{submodule.multimedia.audioScript}"</p>
          <MediaViewer type="audio" currentUrl={audioUrl} />
        </div>
        <div className="pt-4 first:pt-0">
          <h4 className="font-semibold text-orange-600">Concepto de Video/Animación: "{submodule.multimedia.videoConcept.title}"</h4>
          <p className="text-sm text-gray-600">{submodule.multimedia.videoConcept.script}</p>
          <MediaViewer type="video" currentUrl={videoUrl} />
        </div>
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