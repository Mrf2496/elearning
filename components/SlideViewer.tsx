import React, { useState, useEffect } from 'react';
import { Slide } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface SlideViewerProps {
  slides: Slide[];
  onComplete: () => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ slides, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length > 0 && currentSlide === slides.length - 1) {
      onComplete();
    }
  }, [currentSlide, slides.length, onComplete]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const slide = slides[currentSlide];

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Diapositivas Clave</h3>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h4 className="text-lg font-bold text-blue-800">{slide.title}</h4>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
        {slide.points.map((point, index) => (
            <li key={index}>{point}</li>
        ))}
        </ul>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={goToPrev} variant="secondary" disabled={currentSlide === 0}>Anterior</Button>
        <span className="text-sm font-medium text-gray-600">
          {currentSlide + 1} / {slides.length}
        </span>
        <Button onClick={goToNext} variant="secondary" disabled={currentSlide === slides.length - 1}>Siguiente</Button>
      </div>
    </Card>
  );
};

export default SlideViewer;