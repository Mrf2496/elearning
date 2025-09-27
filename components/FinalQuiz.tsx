import React, { useState, useContext } from 'react';
import { courseData } from '../constants/courseData';
import Card from './common/Card';
import Button from './common/Button';
import { CourseProgressContext } from '../context/CourseProgressContext';
import ProgressBar from './common/ProgressBar';

const FinalQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(courseData.finalQuiz.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const progressContext = useContext(CourseProgressContext);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < courseData.finalQuiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = calculateScore();
    if(score >= 80) {
        progressContext?.setQuizPassed(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => answer === courseData.finalQuiz[index].correctAnswerIndex).length;
    return (correctAnswers / courseData.finalQuiz.length) * 100;
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 80;
    return (
      <Card className="text-center">
        <h2 className="text-3xl font-bold mb-4">Resultados de la Evaluación</h2>
        <p className="text-lg mb-2">Tu puntaje final es:</p>
        <p className={`text-6xl font-bold mb-4 ${passed ? 'text-green-500' : 'text-red-600'}`}>
          {score.toFixed(0)}%
        </p>
        {passed ? (
          <div>
            <p className="text-xl text-green-700 font-semibold">¡Felicitaciones! Has aprobado la evaluación.</p>
            <p className="mt-2 text-gray-600">Ahora puedes generar tu certificado de finalización.</p>
          </div>
        ) : (
          <div>
            <p className="text-xl text-red-700 font-semibold">Lo sentimos, no has alcanzado el 80% requerido para aprobar.</p>
            <p className="mt-2 text-gray-600">Te recomendamos repasar los módulos y volver a intentarlo.</p>
            <Button onClick={() => window.location.reload()} className="mt-6">Reintentar Evaluación</Button>
          </div>
        )}
      </Card>
    );
  }

  const currentQuestion = courseData.finalQuiz[currentQuestionIndex];

  return (
    <div className="space-y-6">
       <Card className="border-l-4 border-sky-500">
        <h2 className="text-3xl font-bold text-gray-800">Evaluación Final</h2>
        <p className="mt-2 text-lg text-gray-600">Demuestra tus conocimientos sobre SARLAFT. Necesitas un 80% para aprobar.</p>
      </Card>
      <Card>
        <ProgressBar progress={((currentQuestionIndex + 1) / courseData.finalQuiz.length) * 100} className="mb-6"/>
        <p className="text-sm font-semibold text-orange-600 mb-2">Pregunta {currentQuestionIndex + 1} de {courseData.finalQuiz.length}</p>
        <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                answers[currentQuestionIndex] === index
                  ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-300 text-sky-800 font-semibold'
                  : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-8">
            <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="secondary">Anterior</Button>
            {currentQuestionIndex === courseData.finalQuiz.length - 1 ? (
                <Button onClick={handleSubmit} disabled={answers.includes(null)}>Finalizar y Calificar</Button>
            ) : (
                <Button onClick={handleNext} disabled={answers[currentQuestionIndex] === null}>Siguiente</Button>
            )}
        </div>
      </Card>
    </div>
  );
};

export default FinalQuiz;