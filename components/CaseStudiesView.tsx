import React, { useState, useContext } from 'react';
import { courseData } from '../constants/courseData';
import Card from './common/Card';
import Button from './common/Button';
import { CourseProgressContext } from '../context/CourseProgressContext';

const CaseStudiesView: React.FC = () => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const progressContext = useContext(CourseProgressContext);

  const currentCase = courseData.caseStudies[currentCaseIndex];
  const isCorrect = selectedOption === currentCase.correctAnswerIndex;

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
  };
  
  const handleNext = () => {
    progressContext?.completeSubmodule(`case-${currentCase.id}`);
    if (currentCaseIndex < courseData.caseStudies.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      alert("¡Has completado todos los casos prácticos!");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-red-500">
        <h2 className="text-3xl font-bold text-gray-800">Módulo 11: Casos Prácticos</h2>
        <p className="mt-2 text-lg text-gray-600">Analiza escenarios reales para fortalecer tu capacidad de detección.</p>
      </Card>
      
      <Card>
        <div className="mb-4">
          <span className="font-semibold text-orange-600">Caso {currentCase.id} de {courseData.caseStudies.length}</span>
          <p className="mt-2 text-lg text-gray-800 leading-relaxed">{currentCase.scenario}</p>
        </div>
        
        <h3 className="font-bold text-xl mt-6 mb-4">{currentCase.question}</h3>
        
        <div className="space-y-3">
          {currentCase.options.map((option, index) => {
            const isSelected = selectedOption === index;
            let buttonClass = 'bg-white hover:bg-gray-100 text-gray-800';
            if (showExplanation) {
              if (index === currentCase.correctAnswerIndex) {
                buttonClass = 'bg-green-100 border-green-500 ring-2 ring-green-300 text-green-800 font-semibold';
              } else if (isSelected) {
                buttonClass = 'bg-red-100 border-red-500 ring-2 ring-red-300 text-red-800 font-semibold';
              }
            } else if (isSelected) {
                buttonClass = 'bg-blue-100 border-blue-500 text-blue-800 font-semibold';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {showExplanation && (
          <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <h4 className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'}
            </h4>
            <p className="mt-2 text-gray-700">{currentCase.explanation}</p>
          </div>
        )}
        
        <div className="mt-6 text-right">
          <Button onClick={handleNext} disabled={!showExplanation}>
            {currentCaseIndex === courseData.caseStudies.length - 1 ? 'Finalizar Casos' : 'Siguiente Caso'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CaseStudiesView;