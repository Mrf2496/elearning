import React from 'react';
import { libraryAudio, libraryVideo, LibraryMedia } from '../constants/mediaLibrary';

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'audio' | 'video';
  onSelectFile: (file: LibraryMedia) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ isOpen, onClose, mediaType, onSelectFile }) => {
  if (!isOpen) return null;

  const mediaList = mediaType === 'audio' ? libraryAudio : libraryVideo;
  const title = mediaType === 'audio' ? 'Audios' : 'Videos';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-2xl font-bold text-gray-800">Carpeta de Recursos: {title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-bold">&times;</button>
        </div>
        
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {mediaList.map((media) => (
            <div
              key={media.url}
              onClick={() => {
                onSelectFile(media);
                onClose();
              }}
              className="p-3 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-orange-100 cursor-pointer transition-colors border"
            >
              <span className="font-medium text-gray-700">{media.name}</span>
              <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 font-semibold">
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
